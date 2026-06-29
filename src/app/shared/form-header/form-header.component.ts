import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-header',
  standalone: true,
  templateUrl: './form-header.component.html',
})
export class FormHeaderComponent implements OnInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) form!: FormGroup;
  @Input() showTitle = true;

  private readonly tick = signal(0);

  readonly progress = computed(() => {
    this.tick();
    const controls = Object.values(this.form.controls).filter((c) => !c.disabled);
    const total = controls.length;
    if (!total) return { completed: 0, total: 0, percent: 0 };
    const completed = controls.filter((c) => {
      const v = c.value;
      return v !== null && v !== undefined && String(v).trim() !== '';
    }).length;
    return { completed, total, percent: Math.round((completed / total) * 100) };
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.tick.set(this.tick() + 1));
  }
}
