import { Component, inject, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../model/supplier';
import { CommonModule } from '@angular/common'; // Importante para usar ngFor

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule], // Agregamos CommonModule para poder usar directivas como *ngFor
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {
  protected suppliers: Supplier[] = [];
  private readonly supplierService = inject(SupplierService);

  ngOnInit(): void {
    this.supplierService.findAll().subscribe((data) => {
      this.suppliers = data;
    });
  }
}
