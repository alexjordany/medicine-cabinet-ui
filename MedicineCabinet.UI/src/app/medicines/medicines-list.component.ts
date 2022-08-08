import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { MedicineService } from "./medicine.service";

@Component({
    templateUrl: './medicine-list.component.html',
    styleUrls: ['./medicine-list.component.css']
})

export class MedicineListComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Medicine List'
    errorMessage: string = '';
    sub!: Subscription;

    private _listFilter: string ='';
    get listFilter(): string{
        return this._listFilter;
    }

    set listFilter(value: string){
        this._listFilter = value;
        console.log('In setter:', value);
        this.filteredMedicines = this.performFilter(value);
    }

    filteredMedicines: IMedicine[] = [];

    medicines: IMedicine[] = [];

    constructor(private medicineService: MedicineService){

    }

    performFilter(filterBy: string): IMedicine[]{
        filterBy = filterBy.toLocaleLowerCase();
        return this.medicines.filter((medicine: IMedicine) => 
            medicine.medicineName.toLocaleLowerCase().includes(filterBy))
    }

    ngOnInit(): void {
        this.sub = this.medicineService.getMedicines().subscribe({
            next: medicines => {
                this.medicines = medicines;
                this.filteredMedicines = this.medicines;
            },
            error: err => this.errorMessage = err
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}





export interface IMedicine {
    medicineId: number;
    medicineName: string;
    quantity: number;
    expiration: Date;
    description: string;
}