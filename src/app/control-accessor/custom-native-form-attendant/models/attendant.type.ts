import { AddressType } from './../../custom-native-form-address/models';

export interface AttendantType {
  name: string | null;
  lastName: string | null;
  age: string | null;
  address: AddressType | null;
}
