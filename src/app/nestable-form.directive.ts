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
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

const resolvedPromise = Promise.resolve(null);

@Directive({
  selector: '[nestableForm]',
})
export class NestableFormDirective implements OnInit, OnDestroy {
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
    private parentForm: NestableFormDirective,
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
        next: () =>
          this.formGroupDirective?.onSubmit(new SubmitEvent('submit')),
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
}
