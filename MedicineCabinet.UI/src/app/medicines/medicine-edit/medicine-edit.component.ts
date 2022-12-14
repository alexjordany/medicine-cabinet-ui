import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { IMedicine } from '../medicine';
import { MedicineService } from '../medicine.service';

@Component({
  templateUrl: './medicine-edit.component.html',
})
export class MedicineEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements!: ElementRef[];

  pageTitle = 'Medicine Edit';
  errorMessage= '';
  medicineForm!: FormGroup;

  medicine!: IMedicine;
  private sub!: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;


  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private medicineService: MedicineService) { 

      this.validationMessages = {
        medicineName: {
          required: 'medicine name is required.',
          maxlength: 'Medicine name cannot exceed 35 characters.'
        },
        medicineQuantity: {
          required: 'medicine quantity is required',
          min: 'quantity must be at least 0'
        },
        medicineDescription: {
          maxlength: 'Description name cannot exceed 150 characters.'
        }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.medicineForm = this.fb.group({
      medicineName: ['', [Validators.required, Validators.maxLength(35)]],
      medicineQuantity: ['', [Validators.required]],
      medicineExpiration: [''],
      medicineDescription: ['', [Validators.maxLength(150)]]
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.getMedicine(id);
      }
    );
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
      const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.medicineForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.medicineForm);
    });
  }

  getMedicine(id: number): void {
    this.medicineService.getMedicine(id)
    .subscribe({next:(medicine: IMedicine)=> this.displayMedicine(medicine), error: err => this.errorMessage = err});
  }

  displayMedicine(medicine: IMedicine): void {
    if(this.medicineForm){
      this.medicineForm.reset();
    }
    this.medicine = medicine;

    if(this.medicine.medicineId === 0){
      this.pageTitle = 'Add Medicine';
    } else {
      this.pageTitle = `Edit Medicine: ${this.medicine.medicineName}`;
    }

    this.medicineForm.patchValue({
      medicineName: this.medicine.medicineName,
      medicineQuantity: this.medicine.medicineQuantity,
      medicineExpiration: this.medicine.medicineExpiration,
      medicineDescription: this.medicine.medicineDescription
    });
  }

  deleteMedicine(): void {
    if(this.medicine.medicineId === 0){
      this.onSaveComplete();
    } else if(this.medicine.medicineId){
      if(confirm(`Really delete this medicine: ${this.medicine.medicineName}?`)){
        this.medicineService.deleteMedicine(this.medicine.medicineId).subscribe({next: () => this.onSaveComplete(),
        error: err => this.errorMessage = err});
      }
    }
  }

  saveMedicine(): void {
    if(this.medicineForm.valid){
      if(this.medicineForm.dirty){
        const p = {...this.medicine, ...this.medicineForm.value};

        if(p.medicineId === 0){
          this.medicineService.createMedicine(p)
          .subscribe({
            next: x =>{
              console.log(x);
              return this.onSaveComplete();
            },
            error: err => this.errorMessage = err
          });
        } else {
          this.medicineService.updateMedicine(p).subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err 
          });
        }
      } else {
        this.onSaveComplete();
      }
    } else{
      this.errorMessage = 'Please correct the validation errors.';
    }
}

  onSaveComplete(): void{
    this.medicineForm.reset();
    this.router.navigate(['/medicines']);
  }
}
