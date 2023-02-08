import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';

// Interface
import { FormsUtility, FormsUtilityInterface } from './../../utilities';

@Component({
  selector: 'app-native-form',
  templateUrl: './native-form.component.html',
})
export class NativeFormComponent
  implements OnInit, AfterViewInit, FormsUtilityInterface<any>
{
  @ViewChild('formRef')
  public formRef!: NgForm;

  public form!: FormGroup;
  public formsUtility!: FormsUtility<any>;

  get hobbiesFormArray() {
    return this.form.get('hobbies') as FormArray;
  }

  get hobbiesFormControls() {
    return (this.form.controls['hobbies'] as FormArray)
      .controls as Array<FormControl>;
  }

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = this.createForm();
  }

  ngAfterViewInit(): void {
    this.formsUtility = new FormsUtility<any>(this.formRef);
  }

  public createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      age: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      address: new FormControl(
        { street: 'Calle 10', neighborhood: 'Robledo', city: 'Medellin' },
        { nonNullable: false, validators: [Validators.required] }
      ),
      hobbies: new FormArray<FormControl>([], [Validators.required]),
      attendant: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  // FormArray methods
  public addHobbies(): void {
    this.hobbiesFormArray.push(new FormControl(null));
  }

  public deleteHobbies(hobbiesIndex: number): void {
    this.hobbiesFormArray.removeAt(hobbiesIndex);
  }

  public clearHobbies(): void {
    this.hobbiesFormArray.clear();
  }

  resetForm() {
    this.formsUtility.resetForm(() => this.clearHobbies());
    this.cd.detectChanges();
  }

  submit() {
    console.log(this.formsUtility.getFormData());
    console.log(this.formsUtility.getFormRawData());
  }
}
