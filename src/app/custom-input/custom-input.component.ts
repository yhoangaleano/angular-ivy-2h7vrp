import { Component, forwardRef, Input, OnInit } from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  Validators,
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
      >
    </p>

    <show-errors [control]="input"></show-errors>

    <p>
    inner input value: {{ i.value }}
    </p>


  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {
  @Input() public disabled: boolean;
  @Input() public required: boolean;

  input!: FormControl;

  public onModelChange!: Function;
  public onModelTouched!: Function;

  constructor(private fb: FormBuilder) {
    this.disabled = false;
    this.required = false;
  }

  ngOnInit() {
    this.input = this.fb.control('', {
      validators: [Validators.maxLength(12)],
    });

    if (this.required) {
      this.input.addValidators(Validators.required);
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

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(v: unknown) {
    this.input.setValue(v);
  }
}
