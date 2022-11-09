import {
  Component,
  forwardRef,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Optional,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';

// Models
import { AttendantFormType, AttendantType } from './models';

@Component({
  selector: 'custom-native-form-attendant',
  templateUrl: './custom-native-form-attendant.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomNativeFormAttendantComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomNativeFormAttendantComponent),
      multi: true,
    },
  ],
})
export class CustomNativeFormAttendantComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() public touchedChangingInput: boolean;

  @Output() public onBlur: EventEmitter<Event>;
  @Output() public onInput: EventEmitter<Partial<AttendantType> | null>;

  @ViewChild('formRef')
  public formRef!: NgForm;

  private readonly unSubscribe$: Subject<void>;

  public form!: FormGroup;
  public onTouched!: Function;

  constructor(@Optional() public formGroupDirective?: FormGroupDirective) {
    this.touchedChangingInput = false;
    this.onBlur = new EventEmitter<Event>();
    this.onInput = new EventEmitter<Partial<AttendantType> | null>();
    this.unSubscribe$ = new Subject();
  }

  ngOnInit() {
    this.createForm();
    this.listenAndReplicateParentSubmit();
    this.overrideAndReplicateParentResetForm();
  }

  public ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  public onInputBlur(event: Event): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  public onInputChange(value: Partial<AttendantType> | null): void {
    if (this.touchedChangingInput) {
      this.onTouched();
    }
    this.onInput.emit(value);
  }

  public registerOnChange(
    fn: (val: Partial<AttendantType> | null) => void
  ): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.unSubscribe$),
        map((value) => {
          return this.createAttendant(value);
        })
      )
      .subscribe((attendant) => {
        fn(attendant);
        this.onInputChange(attendant);
      });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public createForm() {
    this.form = new FormGroup<AttendantFormType>({
      name: new FormControl(null, {
        validators: Validators.required,
        nonNullable: true,
      }),
      lastName: new FormControl(null, {
        validators: Validators.required,
        nonNullable: true,
      }),
      age: new FormControl(null, {
        validators: Validators.required,
        nonNullable: true,
      }),
      address: new FormControl(null, {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  writeValue(value: AttendantType | null): void {
    const attendant = this.createAttendant(value);
    this.form.patchValue(attendant, { emitEvent: false });
  }

  setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private createAttendant(value: Partial<AttendantType> | null): AttendantType {
    return {
      name: value?.name ?? null,
      lastName: value?.lastName ?? null,
      age: value?.age ?? null,
      address: value?.address ?? null,
    };
  }

  validate(control: AbstractControl<AttendantType>): ValidationErrors | null {
    if (control.valid && this.form.valid) {
      return null;
    }
    let errors: Record<string, ValidationErrors> = {};
    errors = this.addControlErrors(errors, 'name');
    errors = this.addControlErrors(errors, 'lastName');
    errors = this.addControlErrors(errors, 'age');
    errors = this.addControlErrors(errors, 'address');
    return { attendant: { message: 'Attendant is not valid', errors } };
  }

  addControlErrors(
    allErrors: Record<string, ValidationErrors>,
    controlName: string
  ): Record<string, ValidationErrors> {
    const errors = { ...allErrors };
    const controlErrors = this.form.controls[controlName].errors;
    if (controlErrors) {
      errors[controlName] = controlErrors;
    }
    return errors;
  }

  private listenAndReplicateParentSubmit(): void {
    this.formGroupDirective?.ngSubmit
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: () => {
          this.formRef?.onSubmit(new SubmitEvent('submit'));
        },
      });
  }

  private overrideAndReplicateParentResetForm(): void {
    if (this.formGroupDirective) {
      const resetFormFunc: Function = this.formGroupDirective.resetForm;
      this.formGroupDirective.resetForm = () => {
        this.formRef?.resetForm();
        resetFormFunc.apply(this.formGroupDirective, arguments);
      };
    }
  }
}
