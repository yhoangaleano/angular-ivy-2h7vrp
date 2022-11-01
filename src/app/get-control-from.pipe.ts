import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Pipe({
  name: 'getControlFrom',
})
export class GetControlFromPipe implements PipeTransform {
  public transform(formGroup: FormGroup, name: string): FormControl {
    return (formGroup.get(name) as FormControl) ?? new FormControl();
  }
}
