import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

export function checkNameExists(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  const value: string = control.value;

  return of(value).pipe(
    debounceTime(1000),
    map((data: string) => {
      if (data === 'Andres') {
        return { checkNameExists: true };
      } else {
        return null;
      }
    })
  );
}
