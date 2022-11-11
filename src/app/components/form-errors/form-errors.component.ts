// show-errors.component.ts
import {
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  DoCheck,
  OnInit,
  Optional,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

export type FormErrorType = {
  errorName: string;
  errorText: string;
  errorId?: string;
};
export type DisplayErrorStrategyType = 'SUBMIT' | 'TOUCHED';

@Component({
  selector: 'form-errors-item',
  template: `<small [id]="errorId" class="form-errors-item">
    {{ error }}
  </small>`,
  encapsulation: ViewEncapsulation.None,
})
export class FormErrorsItem {
  @Input() error: string | undefined = '';
  @Input() errorId: string | undefined = '';
}

@Component({
  selector: 'form-errors',
  template: `<div><ng-container #viewContainerRef></ng-container></div>`,
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class FormErrorsComponent
  implements OnInit, DoCheck, AfterViewInit, OnDestroy
{
  private static readonly errorMessages: { [key: string]: Function | string } =
    {
      required: 'This field is required',
      minlength: (params: { requiredLength: unknown }) =>
        'The min number of characters is ' + params.requiredLength,
      maxlength: (params: { requiredLength: unknown }) =>
        'The max allowed number of characters is ' + JSON.stringify(params),
      pattern: (params: { requiredPattern: unknown }) =>
        'The required pattern is: ' + params.requiredPattern,
      years: (params: { message: unknown }) => params.message,
      countryCity: (params: { message: unknown }) => params.message,
      address: (params: { message: unknown }) =>
        params.message + ' ' + JSON.stringify(params),
      attendant: 'Attendant is required',
      hobbies: 'Hobbies is required',
      checkNameExists: () => 'Name exist, change',
      uniqueName: (params: { message: unknown }) => params.message,
      telephoneNumbers: (params: { message: unknown }) => params.message,
      telephoneNumber: (params: { message: unknown }) => params.message,
    };

  @Input()
  public control?: AbstractControl;
  @Input()
  public controlName?: string;

  @Input()
  public displayErrorStrategy: DisplayErrorStrategyType;

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
  public errorsViewContainer!: ViewContainerRef;
  private refComponent: ComponentRef<FormErrorsItem> | null;

  private controlRef!: AbstractControl;

  private unSubscribe$: Subject<void>;
  private controlState$: BehaviorSubject<Array<string>>;
  private subjectErrors$: BehaviorSubject<string | null>;

  constructor(
    @Optional() private readonly formGroupDirective?: FormGroupDirective
  ) {
    this.displayErrorStrategy = 'SUBMIT';
    this.refComponent = null;
    this.unSubscribe$ = new Subject();
    this.controlState$ = new BehaviorSubject<Array<string>>([]);
    this.subjectErrors$ = new BehaviorSubject<string | null>(null);
  }

  ngOnInit(): void {
    this.resolveControlRef();
    this.decideWhenTheErrorShow();
  }

  ngDoCheck(): void {
    this.controlState$.next(this.control as unknown as string[]);
  }

  ngAfterViewInit(): void {
    this.checkStatus();
    this.controlRef?.statusChanges
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(this.checkStatus.bind(this));
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  private resolveControlRef(): void {
    if (this.formGroupDirective && this.controlName && !this.control) {
      this.controlRef = this.formGroupDirective.form.get(this.controlName)!;
    } else {
      this.controlRef = this.control!;
    }
  }

  private getMessage(error: string, params: any): string | null {
    const errorMessage = FormErrorsComponent.errorMessages[error];
    if (errorMessage) {
      if (typeof errorMessage === 'string') {
        return errorMessage;
      } else {
        return errorMessage(params);
      }
    } else {
      return null;
    }
  }

  private decideWhenTheErrorShow(): void {
    combineLatest([this.checkForErrorsToShow$(), this.controlState$])
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: ([error]) => {
          if (error && this.validateErrorStrategy()) {
            this.showError(error);
          } else {
            this.doNotShowError();
          }
        },
      });
  }

  private validateErrorStrategy(): boolean {
    return (
      (this.controlRef.touched &&
        this.controlRef.dirty &&
        this.displayErrorStrategy === 'TOUCHED') ||
      (this.formGroupDirective?.submitted ?? false)
    );
  }

  private showError(error: string): void {
    this.errorsViewContainer.clear();
    this.refComponent =
      this.errorsViewContainer.createComponent(FormErrorsItem);
    const instanceComponent = this.refComponent.instance;
    instanceComponent.error = error;
    instanceComponent.errorId = '';
  }

  private doNotShowError(): void {
    this.refComponent?.destroy();
  }

  private checkStatus(): void {
    if (this.controlRef.errors) {
      Object.keys(this.controlRef.errors).forEach((error) =>
        this.subjectErrors$.next(error)
      );
    } else {
      this.subjectErrors$.next(null);
    }
  }

  private checkForErrorsToShow$(): Observable<string | null> {
    return this.subjectErrors$.pipe(
      map((errorName: string | null) =>
        errorName
          ? this.getMessage(errorName, this.controlRef.errors![errorName])
          : null
      )
    );
  }
}
