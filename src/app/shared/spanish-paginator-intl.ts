import { MatPaginatorIntl } from '@angular/material/paginator';

export function createSpanishPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();

  intl.itemsPerPageLabel = 'Elementos por página:';
  intl.nextPageLabel = 'Página siguiente';
  intl.previousPageLabel = 'Página anterior';
  intl.firstPageLabel = 'Primera página';
  intl.lastPageLabel = 'Última página';

  intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) return `0 de ${length}`;
    const totalPages = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < totalPages
      ? Math.min(startIndex + pageSize, totalPages)
      : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} de ${totalPages}`;
  };

  return intl;
}
