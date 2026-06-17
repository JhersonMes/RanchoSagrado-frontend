import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductCategoryService } from '../../../services/productcategory.service';
import { MenuService } from '../../../services/menu.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCategory } from '../../../model/productcategory';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-product-category-edit',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatSelectModule],
  templateUrl: './product-category-edit.component.html',
  styleUrl: './product-category-edit.component.css',
})
export class ProductCategoryEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ProductCategoryService);
  protected readonly menuService = inject(MenuService);

  protected $form = signal(new FormGroup({
    idProductCategory: new FormControl<number | null>(null),
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    menu: new FormControl<any>(null, [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.menuService.findAll().subscribe(data => this.menuService.setListChange(data));
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  compareFn(a: any, b: any): boolean {
    return a && b ? a.idMenu === b.idMenu : a === b;
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: ProductCategory = this.$form().value as unknown as ProductCategory;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/product-category']));
  }
}
