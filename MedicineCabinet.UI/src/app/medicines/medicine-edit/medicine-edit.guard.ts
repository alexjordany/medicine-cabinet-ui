import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MedicineEditComponent } from './medicine-edit.component';

@Injectable({
  providedIn: 'root'
})
export class MedicineEditGuard implements CanDeactivate<MedicineEditComponent> {
  canDeactivate(component: MedicineEditComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.medicineForm.dirty) {
      const medicineName = component.medicineForm.get('medicineName')?.value || 'New Medicine';
      return confirm(`Navigate away and lose all changes to ${medicineName}?`);
    }
    return true;
  }
  
}
