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
import { HobbiesFormType, HobbiesType } from './models';

@Component({
  selector: 'custom-native-form-hobbies',
  templateUrl: './custom-native-form-hobbies.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomNativeFormHobbiesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomNativeFormHobbiesComponent),
      multi: true,
    },
  ],
})
export class CustomNativeFormHobbiesComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() public touchedChangingInput: boolean;

  @Output() public onBlur: EventEmitter<Event>;
  @Output() public onInput: EventEmitter<Partial<HobbiesType> | null>;

  @ViewChild('formRef')
  public formRef!: NgForm;

  private readonly unSubscribe$: Subject<void>;

  public form!: FormGroup;
  public onTouched!: Function;

  constructor(@Optional() public formGroupDirective?: FormGroupDirective) {
    this.touchedChangingInput = false;
    this.onBlur = new EventEmitter<Event>();
    this.onInput = new EventEmitter<Partial<HobbiesType> | null>();
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

  public onInputChange(value: Partial<HobbiesType> | null): void {
    if (this.touchedChangingInput) {
      this.onTouched();
    }
    this.onInput.emit(value);
  }

  public registerOnChange(
    fn: (val: Partial<HobbiesType> | null) => void
  ): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.unSubscribe$),
        map((value) => {
          return this.createHobbies(value);
        })
      )
      .subscribe((hobbies) => {
        fn(hobbies);
        this.onInputChange(hobbies);
      });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public createForm() {
    this.form = new FormGroup<HobbiesFormType>({
      name: new FormControl(null, {
        validators: Validators.required,
        nonNullable: true,
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
      order: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(10),
        ],
        nonNullable: true,
      }),
    });
  }

  writeValue(value: HobbiesType | null): void {
    const hobbies = this.createHobbies(value);
    this.form.patchValue(hobbies, { emitEvent: false });
  }

  setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private createHobbies(value: Partial<HobbiesType> | null): HobbiesType {
    return {
      name: value?.name ?? null,
      description: value?.description ?? null,
      order: value?.order ?? null,
    };
  }

  validate(control: AbstractControl<HobbiesType>): ValidationErrors | null {
    if (control.valid && this.form.valid) {
      return null;
    }
    let errors: Record<string, ValidationErrors> = {};
    errors = this.addControlErrors(errors, 'name');
    errors = this.addControlErrors(errors, 'description');
    errors = this.addControlErrors(errors, 'order');
    return { hobbies: { message: 'Hobbies is not valid', errors } };
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
          this.formRef?.onSubmit(new Event(''));
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
