import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-input-2',
  template: `
    <p>
      custom input 2: 
      <input
        type="text"
        [formControl]="control"
      >
    </p>
  `,
})
export class CustomInput2Component implements OnInit {
  @Input()
  public control!: FormControl;

  ngOnInit() {
    this.control?.addValidators([
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^3[0-9]*$'),
    ]);
  }
}
