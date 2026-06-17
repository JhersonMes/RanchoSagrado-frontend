import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ProductCategoryService } from '../../../services/productcategory.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../model/product';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, RouterLink,
    MatSelectModule, MatCheckboxModule
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ProductService);
  protected readonly categoryService = inject(ProductCategoryService);

  protected $form = signal(new FormGroup({
    idProduct: new FormControl<number | null>(null),
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    preparationTime: new FormControl<number | null>(null, [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required]),
    availability: new FormControl<boolean>(true),
    category: new FormControl<any>(null, [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.categoryService.findAll().subscribe(data => this.categoryService.setListChange(data));
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  compareFn(a: any, b: any): boolean {
    return a && b ? a.idProductCategory === b.idProductCategory : a === b;
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: Product = this.$form().value as unknown as Product;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/product']));
  }
}
