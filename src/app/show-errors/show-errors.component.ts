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
   <ul *ngIf="shouldShowErrors()">
     <li style="color: red" *ngFor="let error of listOfErrors()">{{error}}</li>
   </ul>
 `,
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ShowErrorsComponent implements OnInit, OnDestroy {
  private static readonly errorMessages = {
    required: () => 'This field is required',
    minlength: (params) =>
      'The min number of characters is ' + params.requiredLength,
    maxlength: (params) =>
      'The max allowed number of characters is ' + params.requiredLength,
    pattern: (params) => 'The required pattern is: ' + params.requiredPattern,
    years: (params) => params.message,
    countryCity: (params) => params.message,
    uniqueName: (params) => params.message,
    telephoneNumbers: (params) => params.message,
    telephoneNumber: (params) => params.message,
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  private readonly unSubscribe$: Subject<void> = new Subject();

  constructor(public formGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    console.log(this.formGroupDirective);
    this.formGroupDirective.ngSubmit
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((_) =>
        console.log(this.control, this.formGroupDirective.submitted)
      );
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  shouldShowErrors(): boolean {
    return (
      this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    );
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors).map((field) =>
      this.getMessage(field, this.control.errors[field])
    );
  }

  private getMessage(type: string, params: any) {
    return ShowErrorsComponent.errorMessages[type](params);
  }
}
