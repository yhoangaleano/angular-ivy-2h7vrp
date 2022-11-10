import { FormControl } from '@angular/forms';

export interface HobbiesFormType {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  order: FormControl<number | null>;
}
