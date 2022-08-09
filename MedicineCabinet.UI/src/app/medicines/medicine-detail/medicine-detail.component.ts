import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMedicine } from '../medicine';
import { MedicineService } from '../medicine.service';

@Component({
  templateUrl: './medicine-detail.component.html',
  styleUrls: ['./medicine-detail.component.css']
})
export class MedicineDetailComponent implements OnInit {
  pageTitle = 'Medicine Detail';
  errorMessage = '';
  medicine: IMedicine | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private medicineService:MedicineService) { }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if(param){
      const id = +param;
      this.getMedicine(id);
    }
  }

  getMedicine(id:number): void{
    this.medicineService.getMedicine(id).subscribe({
      next: medicine => this.medicine = medicine,
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/medicines']);
  }

}
