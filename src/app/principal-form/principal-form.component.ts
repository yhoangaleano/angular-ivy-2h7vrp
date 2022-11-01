import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomFormGroupComponent } from '../custom-form-group/custom-form-group.component';

@Component({
  selector: 'app-principal-form',
  templateUrl: './principal-form.component.html',
})
export class PrincipalFormComponent implements OnInit {
  @ViewChild(CustomFormGroupComponent, { static: true })
  public customFormGroupComponent!: CustomFormGroupComponent;

  public form: FormGroup;

  constructor() {}

  ngOnInit() {
    this.form = this.createForm();
  }

  public createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      lastName: new FormControl(null, [Validators.required]),
      age: new FormControl(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(100),
      ]),
      attendant: this.customFormGroupComponent.createForm(),
    });
  }

  submit() {
    console.log(this.form.value);
  }
}
