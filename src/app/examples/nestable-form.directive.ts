import {
  OnInit,
  Directive,
  SkipSelf,
  Optional,
  Injector,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  NgForm,
  FormGroup,
  AbstractControl,
  FormGroupDirective,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

const resolvedPromise = Promise.resolve(null);

@Directive({
  selector: '[nestable2Form]',
})
export class NestableForm2Directive implements OnInit, OnDestroy {
  @Input()
  public formGroup!: FormGroup;

  @Input()
  public formGroupDirective?: FormGroupDirective;

  @Input()
  public isRoot: boolean;

  @Input()
  public nestedControlName: string;

  private currentForm!: FormGroup;
  private readonly unSubscribe$: Subject<void> = new Subject();

  constructor(
    @SkipSelf()
    @Optional()
    private parentForm: NestableForm2Directive,
    private injector: Injector
  ) {
    this.isRoot = false;
    this.nestedControlName = 'nestedControlName';
  }

  ngOnInit() {
    if (!this.currentForm) {
      this.executePostponed(() => this.resolveAndRegister());
    }
  }

  public ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  public registerNestedForm(
    controlName: string,
    control: AbstractControl
  ): void {
    if (control === this.currentForm) {
      throw new Error(
        'Trying to add itself! Nestable form can be added only on parent "NgForm" or "FormGroup".'
      );
    }
    this.currentForm.removeControl(controlName);
    this.currentForm.addControl(controlName, control);
  }

  private resolveAndRegister(): void {
    this.currentForm = this.resolveCurrentForm();
    this.registerToParent();
    this.listenSubmit();
  }

  private resolveCurrentForm(): FormGroup {
    // NOTE: template-driven or model-driven => determine by the formGroup input
    return this.formGroup ? this.formGroup : this.injector.get(NgForm).control;
  }

  private registerToParent(): void {
    if (this.parentForm !== null && !this.isRoot) {
      this.parentForm.registerNestedForm(
        this.nestedControlName,
        this.currentForm
      );
      this.listenAndReplicateParentSubmit();
      this.overrideAndReplicateParentResetForm();
    }
  }

  private executePostponed(callback: () => void): void {
    resolvedPromise.then(() => callback());
  }

  private listenAndReplicateParentSubmit(): void {
    this.parentForm.formGroupDirective?.ngSubmit
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: () => {
          this.formGroupDirective?.onSubmit(new SubmitEvent('submit'));
        },
      });
  }

  private listenSubmit(): void {
    this.formGroupDirective?.ngSubmit
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: () => {
          this.validateForm(this.formGroup);
        },
      });
  }

  private overrideAndReplicateParentResetForm(): void {
    const resetFormFunc: Function =
      this.parentForm.formGroupDirective!.resetForm;

    this.parentForm.formGroupDirective!.resetForm = () => {
      resetFormFunc.apply(this.parentForm.formGroupDirective, arguments);
      this.formGroupDirective?.resetForm();
    };
  }

  public validateForm(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormArray) {
        for (const control1 of control.controls) {
          if (control1 instanceof FormControl) {
            this.validateControl(control1);
          }
          if (control1 instanceof FormGroup) {
            this.validateForm(control1);
          }
        }
        this.validateControl(control);
      }
      if (control instanceof FormControl) {
        this.validateControl(control);
      } else if (control instanceof FormGroup) {
        this.validateForm(control);
      }
    });
  }

  public validateControl(control: FormControl | FormArray): void {
    control.markAsTouched();
    control.updateValueAndValidity();
  }
}
