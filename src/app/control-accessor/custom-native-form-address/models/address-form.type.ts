import { FormControl } from '@angular/forms';

export interface AddressFormType {
  street: FormControl<string | null>;
  city: FormControl<string | null>;
  neighborhood: FormControl<string | null>;
}
