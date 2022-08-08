import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IMedicine } from "./medicine-list/medicines-list.component";


@Injectable({
    providedIn: 'root'
})

export class MedicineService{
    private medicineUrlAll = 'https://localhost:7159/api/medicines/all';
    private medicineUrl = 'https://localhost:7159/api/medicines';
    constructor(private http: HttpClient){}

    getMedicines(): Observable<IMedicine[]>{
        return this.http.get<IMedicine[]>(this.medicineUrlAll);
    }
}