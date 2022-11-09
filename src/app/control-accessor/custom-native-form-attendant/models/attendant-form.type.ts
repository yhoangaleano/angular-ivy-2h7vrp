import { FormControl } from '@angular/forms';
import { AddressType } from '../../custom-native-form-address/models';

export interface AttendantFormType {
  name: FormControl<string | null>;
  lastName: FormControl<string | null>;
  age: FormControl<string | null>;
  address: FormControl<AddressType | null>;
}
