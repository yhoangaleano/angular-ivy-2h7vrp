// show-errors.component.ts
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControlDirective,
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'show-errors',
  template: `
    <ul *ngIf="shouldShowErrors">
      <li style="color: red" *ngFor="let error of listOfErrors()">
        {{ error }}
      </li>
    </ul>
  `,
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ShowErrorsComponent implements OnInit, OnDestroy {
  private static readonly errorMessages: { [key: string]: Function } = {
    required: (params: { message: unknown }) =>
      'This field is required' + params,
    minlength: (params: { requiredLength: unknown }) =>
      'The min number of characters is ' + params.requiredLength,
    maxlength: (params: { requiredLength: unknown }) =>
      'The max allowed number of characters is ' + JSON.stringify(params),
    pattern: (params: { requiredPattern: unknown }) =>
      'The required pattern is: ' + params.requiredPattern,
    years: (params: { message: unknown }) => params.message,
    countryCity: (params: { message: unknown }) => params.message,
    uniqueName: (params: { message: unknown }) => params.message,
    telephoneNumbers: (params: { message: unknown }) => params.message,
    telephoneNumber: (params: { message: unknown }) => params.message,
  };

  @Input()
  public control!: AbstractControlDirective | AbstractControl;

  private readonly unSubscribe$: Subject<void> = new Subject();

  constructor(public formGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.formGroupDirective.ngSubmit
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((_) => {
        console.log(this.formGroupDirective.form.value);
      });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  get shouldShowErrors(): boolean {
    return (
      ((this.control &&
        this.control.errors &&
        (this.control.dirty || this.control.touched)) ||
        this.formGroupDirective.submitted) ??
      false
    );
  }

  listOfErrors(): string[] {
    return this.control.errors
      ? Object.keys(this.control.errors).map((field) =>
          this.getMessage(field, this.control.errors![field])
        )
      : [];
  }

  private getMessage(type: string, params: any) {
    return ShowErrorsComponent.errorMessages[type](params);
  }
}
