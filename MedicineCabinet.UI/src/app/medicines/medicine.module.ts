import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MedicineListComponent } from './medicine-list/medicines-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MedicineDetailComponent } from './medicine-detail/medicine-detail.component';
import { MedicineEditComponent } from './medicine-edit/medicine-edit.component';
import { MedicineEditGuard } from './medicine-edit/medicine-edit.guard';

@NgModule({
    declarations:[
        MedicineListComponent,
        MedicineDetailComponent,
        MedicineEditComponent
    ],
    imports: [
        RouterModule.forChild([
            {path: 'medicines', component: MedicineListComponent},
            { path: 'medicines/:id', component: MedicineDetailComponent },
            {
                path: 'medicines/:id/edit',
                canDeactivate: [MedicineEditGuard],
                component: MedicineEditComponent
              }
          ]),  
        SharedModule,
        ReactiveFormsModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    providers: [DatePipe]
})

export class MedicineModule {}