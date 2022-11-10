import { CustomNativeFormAddressComponent } from './custom-native-form-address';
import { CustomNativeFormAttendantComponent } from './custom-native-form-attendant';
import { CustomNativeFormHobbiesComponent } from './custom-native-form-hobbies';
import { CustomNativeInputComponent } from './custom-native-input';
import { FormErrorsItem, FormErrorsComponent } from './form-errors';
import { NativeFormComponent } from './native-form/native-form.component';

export const controlAccessorComponents = [
  CustomNativeFormAddressComponent,
  CustomNativeFormAttendantComponent,
  CustomNativeFormHobbiesComponent,
  CustomNativeInputComponent,
  NativeFormComponent,
  FormErrorsItem,
  FormErrorsComponent
];

export * from './custom-native-form-address';
export * from './custom-native-form-attendant';
export * from './custom-native-form-hobbies';
export * from './custom-native-input';
export * from './form-errors';
export * from './native-form/native-form.component';
