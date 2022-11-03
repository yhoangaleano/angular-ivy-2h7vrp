import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-form-group',
  templateUrl: './custom-form-group.component.html',
})
export class CustomFormGroupComponent implements OnInit {
  public form!: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  public createForm(): FormGroup {
    this.form = new FormGroup({
      attendantName: new FormControl('', Validators.required),
      attendantLastName: new FormControl(null),
      attendantAge: new FormControl(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(100),
      ]),
    });
    return this.form;
  }
}
