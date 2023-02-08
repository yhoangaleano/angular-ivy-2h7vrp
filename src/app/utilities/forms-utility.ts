import { AbstractControl, NgForm } from '@angular/forms';

export interface FormsUtilityInterface<T> {
  formsUtility: FormsUtility<T>;
}

export class FormsUtility<T> {
  constructor(public formRef: NgForm) {}

  public disabledControl(nameControl: string): void {
    this.getControl(nameControl)!.disable();
  }

  public enabledControl(nameControl: string): void {
    this.getControl(nameControl)!.enable();
  }

  public setValueInControl<Z = unknown>(nameControl: string, value: Z): void {
    this.getControl(nameControl)!.setValue(value);
  }

  public setValueAndDisabledControl<Z = unknown>(nameControl: string, value: Z): void {
    this.disabledControl(nameControl);
    this.setValueInControl(nameControl, value);
  }

  public getValueInControl<Z = unknown>(nameControl: string): Z {
    return this.getControl(nameControl)!.value as Z;
  }

  public getControl(nameControl: string): AbstractControl {
    return this.formRef.form.get(nameControl) as AbstractControl;
  }

  public isValidateForm(): boolean {
    return this.formRef.form.valid;
  }

  public submitForm(): void {
    this.formRef.onSubmit(new Event(''));
  }

  public resetForm(callback: () => void = () => {}) {
    callback();
    this.formRef.resetForm();
  }

  public submitAndIsValidateForm(): boolean {
    this.submitForm();
    return this.isValidateForm();
  }

  public getFormData(): T {
    return { ...this.formRef.form.value } as T;
  }

  public getFormRawData(): T {
    return this.formRef.form.getRawValue();
  }
}
