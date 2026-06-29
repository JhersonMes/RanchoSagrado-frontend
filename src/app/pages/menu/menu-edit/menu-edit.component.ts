import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Menu } from '../../../model/menu';
import { switchMap, tap } from 'rxjs';
import { positivePriceValidator } from '../../../shared/app-validators';

@Component({
  selector: 'app-menu-edit',
  imports: [FormHeaderComponent, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './menu-edit.component.html',
  styleUrl: './menu-edit.component.css',
})
export class MenuEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);

  protected $form = signal(new FormGroup({
    idMenu: new FormControl<number | null>(null),
    name: new FormControl<string>('', [Validators.required]),
    dishQuantity: new FormControl<number | null>(null, [Validators.required]),
    description: new FormControl<string>(''),
    price: new FormControl<number | null>(null, [Validators.required, positivePriceValidator]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.menuService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate() {
    if (this.$form().invalid) return;

    const isEdit = this.$isEdit();
    const id = this.$id();
    const menu: Menu = this.$form().value as unknown as Menu;

    const operation$ = isEdit ? this.menuService.update(id, menu) : this.menuService.save(menu);

    operation$.pipe(
      switchMap(() => this.menuService.findAll()),
      tap(data => this.menuService.setListChange(data)),
      tap(() => this.menuService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => {
      this.router.navigate(['/pages/menu']);
    });
  }
}
