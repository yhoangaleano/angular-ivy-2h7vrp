import {
  AfterViewInit,
  Component,
  forwardRef,
  Injector,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  Validators,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: `
    <p>
      custom input:
      <input
        #i
        (input)="onInputChange(i.value)"
        (blur)="onInputBlur($event)"
        type="text"
        [formControl]="input"
      />
    </p>

    <p>inner input value: {{ input.value }}</p>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  @Input() public disabled: boolean;
  @Input() public required: boolean;

  input!: FormControl;

  public onModelChange!: Function;
  public onModelTouched!: Function;

  constructor(
    private fb: FormBuilder,
    private injector: Injector,
    private readonly cd: ChangeDetectorRef
  ) {
    this.disabled = false;
    this.required = false;
  }

  ngOnInit() {
    this.input = this.fb.control('');
  }

  public ngAfterViewInit(): void {
    const ngControl = this.injector.get(NgControl);
    const control = ngControl.control!;
    let myValidators = [Validators.maxLength(12)];
    let validators = control.validator
      ? [control.validator, ...myValidators]
      : myValidators;

    control.setValidators(validators);

    if (control.value) {
      control.markAsTouched();
      control.updateValueAndValidity();
      this.cd.detectChanges();
    }
  }

  public onInputBlur(event: Event): void {
    this.onModelTouched();
  }

  public onInputChange(value: unknown): void {
    this.onModelTouched();
    this.onModelChange(value);
  }

  public registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.input.disable();
    } else {
      this.input.enable();
    }
  }

  writeValue(v: unknown) {
    this.input.setValue(v);
    this.cd.detectChanges();
  }
}
