import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { CustomFormGroupComponent } from './custom-form-group/custom-form-group.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { PrincipalFormComponent } from './principal-form/principal-form.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { CustomAddressFormGroupComponent } from './custom-address-form-group/custom-address-form-group.component';
import { CustomInput2Component } from './custom-input-2/custom-input-2.component';
import { GetControlFromPipe } from './get-control-from.pipe';
import { NestableFormDirective } from './nestable-form.directive';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, FormsModule],
  declarations: [
    AppComponent,
    HelloComponent,
    CustomAddressFormGroupComponent,
    CustomFormGroupComponent,
    CustomInputComponent,
    CustomInput2Component,
    PrincipalFormComponent,
    ShowErrorsComponent,
    GetControlFromPipe,
    NestableFormDirective,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}