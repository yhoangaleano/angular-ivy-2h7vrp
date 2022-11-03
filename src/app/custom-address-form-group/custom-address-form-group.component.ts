import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-address-form-group',
  templateUrl: './custom-address-form-group.component.html',
})
export class CustomAddressFormGroupComponent implements OnInit {

  @ViewChild('formRef')
  public formRef!: NgForm;

  @Input()
  public groupName!: string;

  public form!: FormGroup;

  constructor() {
    this.groupName = 'address';
  }

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.form = new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl(null),
      neighborhood: new FormControl(null, [Validators.required]),
      cellphone: new FormControl(null),
    });
  }
}
