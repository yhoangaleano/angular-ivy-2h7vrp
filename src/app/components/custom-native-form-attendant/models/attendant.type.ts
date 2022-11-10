import { AddressType } from './../../custom-native-form-address/models';
import { HobbiesType } from '../../custom-native-form-hobbies';

export interface AttendantType {
  name: string | null;
  lastName: string | null;
  age: string | null;
  address: AddressType | null;
  hobbies: Array<HobbiesType> | null;
}
