import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { ShowErrorsComponent, NestableForm2Directive } from './examples';

import { components } from './components';
import { pipes } from './pipes';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, FormsModule],
  declarations: [
    AppComponent,
    HelloComponent,
    ShowErrorsComponent,
    NestableForm2Directive,
    ...components,
    ...pipes,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
