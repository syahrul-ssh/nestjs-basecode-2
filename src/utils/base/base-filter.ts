import { SelectQueryBuilder } from 'typeorm';

export interface BaseFilter<Entity, FilterDto> {
  apply(
    qb: SelectQueryBuilder<Entity>,
    filter: FilterDto,
  ): SelectQueryBuilder<Entity>;
}