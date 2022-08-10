import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap, map } from 'rxjs/operators';
import { IMedicine } from './medicine';


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

    getMedicine(id:number): Observable<IMedicine>{
        if(id ===0){
            return of(this.initializeMedicine());
        }
        const url = `${this.medicineUrl}/${id}`;
        return this.http.get<IMedicine>(url);
    }

    createMedicine(medicine: IMedicine): Observable<IMedicine>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post<IMedicine>(this.medicineUrl, medicine,{headers}).pipe(
            tap(data => console.log('createMedicine: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    updateMedicine(medicine: IMedicine): Observable<IMedicine>{
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.medicineUrl}/${medicine.medicineId}`;
        return this.http.put<IMedicine>(url, medicine, {headers}).pipe(
            tap(() => console.log('updateMedicine: ' + medicine.medicineId, medicine.medicineDescription, medicine.medicineQuantity)),
            map(() => medicine),
            catchError(this.handleError)
        );
    }

    deleteMedicine(id: number): Observable<{}> {
        const headers = new HttpHeaders({ 'Content-Type': 'application json' });
        const url = `${this.medicineUrl}/${id}`;
        return this.http.delete<IMedicine>(url, {headers}).pipe(
            tap(data => console.log('deleteMedicine: ' + id)),
        catchError(this.handleError)
        );
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          errorMessage = `An error occurred: ${err.error.message}`;
        } else {
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(() => errorMessage);
      }

    private initializeMedicine(): IMedicine{
        return {
            medicineId: 0,
            medicineName: '',
            medicineQuantity: 0,
            medicineExpiration: new Date('2022-08-23'),
            medicineDescription: '',
        };
    }
}