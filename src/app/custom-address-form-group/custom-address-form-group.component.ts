import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-custom-address-form-group',
  templateUrl: './custom-address-form-group.component.html',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class CustomAddressFormGroupComponent implements OnInit {
  @Input()
  public groupName!: string;

  public form!: FormGroup;

  get childForm(): FormGroup {
    return this.form.get(this.groupName) as FormGroup;
  }

  constructor(public formGroupDirective: FormGroupDirective) {
    this.groupName = 'address';
  }

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.form = this.formGroupDirective.form;
    this.form.addControl(
      this.groupName,
      new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl(null),
        neighborhood: new FormControl(null, [
          Validators.required,
          Validators.min(18),
          Validators.max(100),
        ]),
        test: new FormControl(null),
      })
    );
  }
}
