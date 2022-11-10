import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-native-form',
  templateUrl: './native-form.component.html',
})
export class NativeFormComponent implements OnInit {
  @ViewChild('formRef')
  public formRef!: NgForm;

  public form!: FormGroup;


  get hobbiesFormArray() {
    return this.form.get('hobbies') as FormArray;
  }

  get hobbiesFormControls() {
    return (this.form.controls["hobbies"] as FormArray).controls as Array<FormControl>;
  }

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = this.createForm();
  }

  public createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      age: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      address: new FormControl(
        { street: 'Calle 10', neighborhood: 'Robledo', city: 'Medellin' },
        { nonNullable: false, validators: [Validators.required] }
      ),
      attendant: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      hobbies: new FormArray<FormControl>(
        [],
        [Validators.required]
      ),
    });
  }

    // FormArray methods
    public addHobbies(): void {
      this.hobbiesFormArray.push(new FormControl(null));
    }

    public deleteHobbies(hobbiesIndex: number): void {
      this.hobbiesFormArray.removeAt(hobbiesIndex);
    }

  resetForm() {
    this.hobbiesFormArray.clear();
    this.formRef.resetForm();
    console.log(this.form.value);
  }

  submit() {
    console.log(this.form.value);
  }
}
