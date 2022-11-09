import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input-2',
  template: `
    <p>
      {{ controlName }}:
      <input type="text" [formControlName]="controlName" />
    </p>

    <show-errors
      [control]="parent.form | getControlFrom: controlName"
    ></show-errors>
  `,
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class CustomInput2Component implements OnInit {
  @Input() public label: string = '';
  @Input() public controlName: string = '';
  @Input() style: { [key: string]: string } = {};
  @Input() required: boolean = false;

  constructor(
    public parent: FormGroupDirective,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.parent.form.removeControl(this.controlName);
    this.parent.form.addControl(
      this.controlName,
      new FormControl(this.label, [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^3[0-9]*$'),
      ])
    );
    if (this.required) {
      this.parent.form
        .get(this.controlName)
        ?.addValidators(Validators.required);
    }
    if (this.label) {
      this.parent.form.get(this.controlName)?.markAsTouched();
      this.parent.form.get(this.controlName)?.updateValueAndValidity();
    }
  }
}
