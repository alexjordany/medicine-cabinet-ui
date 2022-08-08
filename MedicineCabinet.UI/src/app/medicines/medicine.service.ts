import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IMedicine } from "./medicines-list.component";


@Injectable({
    providedIn: 'root'
})

export class MedicineService{
    private medicineUrl = 'https://localhost:7159/api/medicines/all';
    constructor(private http: HttpClient){}

    getMedicines(): Observable<IMedicine[]>{
        return this.http.get<IMedicine[]>(this.medicineUrl);
    }
}