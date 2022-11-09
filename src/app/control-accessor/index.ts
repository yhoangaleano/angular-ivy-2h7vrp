import { CustomNativeFormAddressComponent } from './custom-native-form-address';
import { CustomNativeFormAttendantComponent } from './custom-native-form-attendant';
import { CustomNativeInputComponent } from './custom-native-input';
import { NativeFormComponent } from './native-form/native-form.component';

export const controlAccessorComponents = [
  CustomNativeFormAddressComponent,
  CustomNativeFormAttendantComponent,
  CustomNativeInputComponent,
  NativeFormComponent
];

export * from './custom-native-form-address';
export * from './custom-native-form-attendant';
export * from './custom-native-input';
export * from './native-form/native-form.component';
