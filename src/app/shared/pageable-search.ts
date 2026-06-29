import { computed, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../model/page';

export class PageableSearch<T> {
  readonly filterValue = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly serverTotal = signal(0);
  readonly serverContent = signal<T[]>([]);

  readonly isFiltering = computed(() => this.filterValue().trim().length > 0);

  readonly filteredFull = computed(() => {
    const term = this.filterValue().trim().toLowerCase();
    if (!term) return [];
    return this.fullList().filter((row) => JSON.stringify(row).toLowerCase().includes(term));
  });

  readonly length = computed(() => (this.isFiltering() ? this.filteredFull().length : this.serverTotal()));

  readonly data = computed(() => {
    if (this.isFiltering()) {
      const start = this.pageIndex() * this.pageSize();
      return this.filteredFull().slice(start, start + this.pageSize());
    }
    return this.serverContent();
  });

  constructor(
    private readonly fetchPage: (page: number, size: number) => Observable<Page<T>>,
    private readonly fullList: () => T[],
  ) {}

  loadServerPage(): void {
    this.fetchPage(this.pageIndex(), this.pageSize()).subscribe((page) => {
      this.serverContent.set(page.content);
      this.serverTotal.set(page.totalElements);
    });
  }

  applyFilter(value: string): void {
    this.filterValue.set(value);
    this.pageIndex.set(0);
  }

  onPage(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    if (!this.isFiltering()) this.loadServerPage();
  }
}
