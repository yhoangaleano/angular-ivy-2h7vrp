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
import { AddressFormType, AddressType } from './models';

@Component({
  selector: 'custom-native-form-address',
  templateUrl: './custom-native-form-address.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomNativeFormAddressComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomNativeFormAddressComponent),
      multi: true,
    },
  ],
})
export class CustomNativeFormAddressComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() public touchedChangingInput: boolean;

  @Output() public onBlur: EventEmitter<Event>;
  @Output() public onInput: EventEmitter<Partial<AddressType> | null>;

  @ViewChild('formRef')
  public formRef!: NgForm;

  private readonly unSubscribe$: Subject<void>;

  public form!: FormGroup;
  public onTouched!: Function;

  constructor(@Optional() public formGroupDirective?: FormGroupDirective) {
    this.touchedChangingInput = false;
    this.onBlur = new EventEmitter<Event>();
    this.onInput = new EventEmitter<Partial<AddressType> | null>();
    this.unSubscribe$ = new Subject();
  }

  ngOnInit() {
    this.createForm();
    this.listenSubmitAndResetParentFormGroupDirective();
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  registerOnChange(fn: (val: Partial<AddressType> | null) => void): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.unSubscribe$),
        map((value) => {
          return this.createAddress(value);
        })
      )
      .subscribe((address) => {
        fn(address);
        this.onInputChange(address);
      });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: AddressType | null): void {
    const address = this.createAddress(value);
    this.form.patchValue(address, { emitEvent: false });
  }

  setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  validate(control: AbstractControl<AddressType>): ValidationErrors | null {
    if (control.valid && this.form.valid) {
      return null;
    }
    let errors: Record<string, ValidationErrors> = this.getControlsErrors();
    return { address: { message: 'Address is not valid', errors } };
  }

  public onInputBlur(event: Event): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  public onInputChange(value: Partial<AddressType> | null): void {
    if (this.touchedChangingInput) {
      this.onTouched();
    }
    this.onInput.emit(value);
  }

  private createForm() {
    this.form = new FormGroup<AddressFormType>({
      street: new FormControl(null, {
        validators: Validators.required,
        nonNullable: true,
      }),
      city: new FormControl(null, {
        validators: Validators.required,
        nonNullable: true,
      }),
      neighborhood: new FormControl(null, {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  private createAddress(value: Partial<AddressType> | null): AddressType {
    return {
      street: value?.street ?? null,
      city: value?.city ?? null,
      neighborhood: value?.neighborhood ?? null,
    };
  }

  private listenSubmitAndResetParentFormGroupDirective() {
    if (this.formGroupDirective) {
      this.listenAndReplicateParentSubmit();
      this.overrideAndReplicateParentResetForm();
    }
  }

  private getControlsErrors(): Record<string, ValidationErrors> {
    let errors: Record<string, ValidationErrors> = {};
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);
      const controlErrors = control?.errors;
      if (controlErrors) {
        errors[controlName] = controlErrors;
      }
    });
    return errors;
  }

  private listenAndReplicateParentSubmit(): void {
    this.formGroupDirective!.ngSubmit.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe({
      next: () => {
        this.formRef?.onSubmit(new SubmitEvent('submit'));
      },
    });
  }

  private overrideAndReplicateParentResetForm(): void {
    const resetFormFunc: Function = this.formGroupDirective!.resetForm;
    this.formGroupDirective!.resetForm = () => {
      this.formRef?.resetForm();
      resetFormFunc.apply(this.formGroupDirective!, arguments);
    };
  }
}
