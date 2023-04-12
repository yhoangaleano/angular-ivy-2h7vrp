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
    callback: Function = () => {},
    value?: unknown
  ) {
    if (this.formGroupDirective) {
      this.listenAndReplicateParentSubmit();
      this.overrideAndReplicateParentResetForm(callback, value);
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
    this.formGroupDirective.ngSubmit
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: () => {
          this.formRef.onSubmit(new Event(''));
        },
      });
  }

  private overrideAndReplicateParentResetForm(
    callback: Function,
    childValue?: unknown
  ): void {
    const resetFormFunc: Function = this.formGroupDirective.resetForm;
    this.formGroupDirective.resetForm = (
      parentValue: unknown = resetFormFunc.valueOf()
    ) => {
      callback();
      this.formRef.resetForm(childValue);
      resetFormFunc.apply(this.formGroupDirective, [parentValue]);
    };
  }
}
