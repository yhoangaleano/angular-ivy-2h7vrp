import {
  forwardRef,
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

// Rxjs
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'custom-native-input',
  template: `
    <div>
      <label>{{ label ?? 'Custom input' }}:</label>
      <input (blur)="onInputBlur($event)" type="text" [formControl]="input" />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomNativeInputComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => CustomNativeInputComponent),
    },
  ],
})
export class CustomNativeInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() public touchedChangingInput: boolean;
  @Input() public label?: string;

  @Output() public onBlur: EventEmitter<Event>;
  @Output() public onInput: EventEmitter<string | null>;

  private readonly unSubscribe$: Subject<void>;

  public input!: FormControl;
  public onTouched!: Function;

  constructor(private fb: FormBuilder) {
    this.touchedChangingInput = false;
    this.onBlur = new EventEmitter<Event>();
    this.onInput = new EventEmitter<string | null>();
    this.unSubscribe$ = new Subject();
  }

  ngOnInit() {
    this.input = this.fb.control(null, [Validators.maxLength(12)]);
  }

  public ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  public onInputBlur(event: Event): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  public onInputChange(value: string | null): void {
    if (this.touchedChangingInput) {
      this.onTouched();
    }
    this.onInput.emit(value);
  }

  public registerOnChange(fn: (_: unknown) => void) {
    this.input.valueChanges
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((value) => {
        this.onInputChange(value);
        fn(value);
      });
  }

  public registerOnTouched(onTouched: Function) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.input.disable();
    } else {
      this.input.enable();
    }
  }

  writeValue(value: any) {
    this.input.setValue(value, { emitEvent: false });
  }

  validate(control: AbstractControl) {
    if (control.valid && this.input.valid) {
      return null;
    }

    return this.input.errors;
  }
}
