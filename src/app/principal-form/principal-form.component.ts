import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CustomAddressFormGroupComponent } from '../custom-address-form-group/custom-address-form-group.component';

@Component({
  selector: 'app-principal-form',
  templateUrl: './principal-form.component.html',
})
export class PrincipalFormComponent implements OnInit {

  @ViewChild('formRef')
  public formRef!: NgForm;

  public form!: FormGroup;
  public form2!: FormGroup;

  @ViewChild('address3')
  public addressForm!: CustomAddressFormGroupComponent;

  ngOnInit() {
    this.form = this.createForm();
    this.form2 = this.createForm2();
  }

  public createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      test: new FormControl(''),
    });
  }

  public createForm2(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, { nonNullable: true }),
      address2: new FormGroup({}),
    });
  }

  resetForm() {
    this.formRef.resetForm();
  }


  submit() {
    console.log(this.form.value);
  }

  submit2() {
    console.log(this.form2.value);
  }

  submit3() {
    this.addressForm.formRef.onSubmit(new SubmitEvent('submit'));
  }

  resetForm3() {
    this.addressForm.formRef.resetForm();
  }
}
