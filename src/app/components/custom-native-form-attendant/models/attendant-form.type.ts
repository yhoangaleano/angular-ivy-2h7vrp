import { FormControl, FormArray } from '@angular/forms';
import { AddressType } from '../../custom-native-form-address/models';
import { HobbiesType } from '../../custom-native-form-hobbies';

export interface AttendantFormType {
  name: FormControl<string | null>;
  lastName: FormControl<string | null>;
  age: FormControl<string | null>;
  address: FormControl<AddressType | null>;
  hobbies: FormArray<FormControl<HobbiesType | null>>;
}
