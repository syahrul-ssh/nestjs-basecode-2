import { SelectQueryBuilder } from 'typeorm';

export function applySorting<T>(
  qb: SelectQueryBuilder<T>,
  sort?: string,
  allowedFields: string[] = [],
) {
  if (!sort) {
    return qb;
  }

  const sorts = sort.split(',');

  for (const item of sorts) {
    const [field, direction] = item.split(':');

    if (!allowedFields.includes(field)) {
      continue;
    }

    qb.addOrderBy(
      `${qb.alias}.${field}`,
      direction?.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC',
    );
  }

  return qb;
}