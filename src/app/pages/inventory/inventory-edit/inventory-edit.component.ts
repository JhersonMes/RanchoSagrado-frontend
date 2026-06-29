import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { IngredientService } from '../../../services/ingredient.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Inventory } from '../../../model/inventory';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-inventory-edit',
  imports: [FormHeaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatSelectModule],
  templateUrl: './inventory-edit.component.html',
  styleUrl: './inventory-edit.component.css',
})
export class InventoryEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(InventoryService);
  protected readonly ingredientService = inject(IngredientService);

  protected $form = signal(new FormGroup({
    idInventory: new FormControl<number | null>(null),
    stockQuantity: new FormControl<number | null>(null, [Validators.required]),
    lastReplenishmentDate: new FormControl<string>('', [Validators.required]),
    minStock: new FormControl<number | null>(null, [Validators.required]),
    maxStock: new FormControl<number | null>(null, [Validators.required]),
    ingredient: new FormControl<any>(null, [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.ingredientService.findAll().subscribe(data => this.ingredientService.setListChange(data));
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  compareFn(a: any, b: any): boolean {
    return a && b ? a.idIngredient === b.idIngredient : a === b;
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: Inventory = this.$form().value as unknown as Inventory;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/inventory']));
  }
}
