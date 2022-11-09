import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-native-form',
  templateUrl: './native-form.component.html',
})
export class NativeFormComponent implements OnInit {
  @ViewChild('formRef')
  public formRef!: NgForm;

  public form!: FormGroup;

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
        { street: 'robledo' },
        { nonNullable: false, validators: [Validators.required] }
      ),
      attendant: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  resetForm() {
    this.formRef.resetForm();
    console.log(this.form.value);
  }

  submit() {
    console.log(this.form.value);
  }
}
