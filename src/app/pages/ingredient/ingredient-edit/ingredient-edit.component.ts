import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IngredientService } from '../../../services/ingredient.service';
import { IngredientCategoryService } from '../../../services/ingredientcategory.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Ingredient } from '../../../model/ingredient';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-ingredient-edit',
  imports: [FormHeaderComponent, 
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, RouterLink,
    MatSelectModule, MatCheckboxModule
  ],
  templateUrl: './ingredient-edit.component.html',
  styleUrl: './ingredient-edit.component.css',
})
export class IngredientEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(IngredientService);
  protected readonly categoryService = inject(IngredientCategoryService);

  protected $form = signal(new FormGroup({
    idIngredient: new FormControl<number | null>(null),
    name: new FormControl<string>('', [Validators.required]),
    unitOfMeasure: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    status: new FormControl<boolean>(true),
    unitCost: new FormControl<number | null>(null, [Validators.required]),
    ingredientCategory: new FormControl<any>(null, [Validators.required]),
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
    return a && b ? a.idCategory === b.idCategory : a === b;
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: Ingredient = this.$form().value as unknown as Ingredient;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/ingredient']));
  }
}
