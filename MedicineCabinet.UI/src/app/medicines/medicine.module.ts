import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MedicineListComponent } from './medicine-list/medicines-list.component';

@NgModule({
    declarations:[
        MedicineListComponent
    ],
    imports: [
        RouterModule.forChild([
            {path: 'medicines', component: MedicineListComponent}
          ]),  
        SharedModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    providers: [DatePipe]
})

export class MedicineModule {}