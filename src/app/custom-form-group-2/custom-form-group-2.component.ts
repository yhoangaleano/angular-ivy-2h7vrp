import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-custom-form-group-2',
  templateUrl: './custom-form-group-2.component.html',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class CustomFormGroup2Component implements OnInit {
  @Input()
  public groupName!: string;

  public form!: FormGroup;

  constructor(public formGroupDirective: FormGroupDirective) {
    this.groupName = 'attendant';
  }

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.form = this.formGroupDirective.form;
    this.form.addControl(
      this.groupName,
      new FormGroup({
        attendantName: new FormControl('', Validators.required),
        attendantLastName: new FormControl(null),
        attendantAge: new FormControl(null, [
          Validators.required,
          Validators.min(18),
          Validators.max(100),
        ]),
      })
    );
  }
}
