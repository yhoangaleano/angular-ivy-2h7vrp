import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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

  public formControl!: FormControl;

  public value: string;

  get lessons() {
    return this.form2.controls["lessons"] as FormArray;
  }

  get lessonsControls() {
    return (this.form2.controls["lessons"] as FormArray).controls as FormGroup[];
  }

  @ViewChild('address3')
  public addressForm!: CustomAddressFormGroupComponent;

  constructor( private readonly cd: ChangeDetectorRef) {
    this.value = 'juanjo';
  }

  ngOnInit() {
    this.form = this.createForm();
    this.form2 = this.createForm2();
    this.formControl =  new FormControl('ju', [Validators.required, Validators.minLength(3)]);
    this.formControl.markAsTouched();
    this.formControl.updateValueAndValidity();
  }

  public createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      test: new FormControl(''),
    });
  }

  public createForm2(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
      address2: new FormGroup({}),
      lessons: new FormArray([], [Validators.required])
    });
  }

  addLesson() {
    const lessonForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      level: new FormControl('begginer', [Validators.required]),
    });
    this.lessons.push(lessonForm);
    // this.cd.detectChanges();
  }

  deleteLesson(lessonIndex: number) {
    this.lessons.removeAt(lessonIndex);
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
