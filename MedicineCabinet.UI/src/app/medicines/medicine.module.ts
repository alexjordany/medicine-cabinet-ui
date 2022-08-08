import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MedicineListComponent } from './medicines-list.component';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
    declarations:[
        MedicineListComponent,
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