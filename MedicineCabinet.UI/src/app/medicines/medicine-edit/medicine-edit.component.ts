import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from 'src/app/shared/generic-validator';

import { IMedicine } from '../medicine';
import { MedicineService } from '../medicine.service';

@Component({
  templateUrl: './medicine-edit.component.html'
})
export class MedicineEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  pageTitle = 'Medicine Edit';
  errorMessage = '';
  medicineForm!: FormGroup;

  medicine!: IMedicine;
  private sub!: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private medicineService: MedicineService) { 
    this.validationMessages = {
      medicineName: {
        required: 'Medicine name is required.',
        maxlength: 'Product name cannot exceed 35 characters.'
      },
      medicineQuantity: {
        required: 'Quantity is required'
      },
      medicineDescription: {
        maxlength: 'Product name cannot exceed 150 characters.'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.medicineForm = this.fb.group({
      medicineName: ['', [Validators.required, Validators.maxLength(35)]],
      medicineQuantity: ['', [Validators.required]],
      medicineExpiration: ['', []],
      medicineDescription: ['', [Validators.maxLength(150)]]
    });

    this.sub = this.route.paramMap.subscribe(params =>{
      const id = Number(this.route.snapshot.paramMap.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.medicineForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.medicineForm);
    });
  }

  getMedicine(id: number): void {
    this.medicineService.getMedicine(id)
      .subscribe({
        next: (medicine: IMedicine) => this.displayMedicine(medicine),
        error: err => this.errorMessage = err
      });
  }

  displayMedicine(medicine: IMedicine): void {
    if(this.medicineForm){
      this.medicineForm.reset();
    }
    this.medicine = medicine;

    if(this.medicine.medicineId === 0){
      this.pageTitle = 'Add Product';
    } else {
      this.pageTitle = `Edit Product: ${this.medicine.medicineName}`;
    }

    this.medicineForm.patchValue({
      medicineName: this.medicine.medicineName,
      medicineQuantity: this.medicine.quantity,
      medicineExpiration: this.medicine.expiration,
      medicineDescription: this.medicine.description
    });
  }

  deleteMedicine(): void {
    if (this.medicine.medicineId === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else if (this.medicine.medicineId) {
      if (confirm(`Really delete the product: ${this.medicine.medicineName}?`)) {
        this.medicineService.deleteMedicine(this.medicine.medicineId)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  saveMedicine(): void {
    if (this.medicineForm.valid) {
      if (this.medicineForm.dirty) {
        const m = { ...this.medicine, ...this.medicineForm.value };

        if (m.medicineId === 0) {
          this.medicineService.createMedicine(m)
            .subscribe({
              next: x => {
                console.log(x);
                return this.onSaveComplete();
              },
              error: err => this.errorMessage = err
            });
        } else {
          this.medicineService.updateMedicine(m)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.medicineForm.reset();
    this.router.navigate(['/medicines']);
  }
}
