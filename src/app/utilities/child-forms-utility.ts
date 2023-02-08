import { FormGroupDirective, NgForm, ValidationErrors } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface ChildFormsUtilityInterface {
  childFormsUtility: ChildFormsUtility;
}

export class ChildFormsUtility {
  constructor(
    private unSubscribe$: Subject<void>,
    private formRef: NgForm,
    private formGroupDirective?: FormGroupDirective
  ) {}

  public listenSubmitAndResetParentFormGroupDirective(
    callback: Function = () => {}
  ) {
    if (this.formGroupDirective) {
      this.listenAndReplicateParentSubmit();
      this.overrideAndReplicateParentResetForm(callback);
    }
  }

  public getControlsErrors(): Record<string, ValidationErrors> {
    let errors: Record<string, ValidationErrors> = {};
    Object.keys(this.formRef?.form.controls ?? {}).forEach((controlName) => {
      const control = this.formRef.form.get(controlName)!;
      const controlErrors = control.errors;
      if (controlErrors) {
        errors[controlName] = controlErrors;
      }
    });
    return errors;
  }

  private listenAndReplicateParentSubmit(): void {
    this.formGroupDirective.ngSubmit.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe({
      next: () => {
        this.formRef.onSubmit(new Event(''));
      },
    });
  }

  private overrideAndReplicateParentResetForm(callback: Function): void {
    const resetFormFunc: Function = this.formGroupDirective.resetForm;
    this.formGroupDirective.resetForm = (value?: unknown) => {
      callback();
      this.formRef.resetForm();
      resetFormFunc.apply(this.formGroupDirective, value);
    };
  }
}
