import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Example } from '../../entities/example.entity';
import { ExampleFilterDto } from './dto/filter-example.dto';

@Injectable()
export class ExampleFilter {
  apply(
    qb: SelectQueryBuilder<Example>,
    filter: ExampleFilterDto,
  ) {
    this.applyStatus(qb, filter);
    this.applySorting(qb, filter);

    return qb;
  }

  private applyStatus(
    qb: SelectQueryBuilder<Example>,
    filter: ExampleFilterDto,
  ) {
    if (!filter.status) {
      return;
    }

    qb.andWhere(
      'example.status = :status',
      {
        status: filter.status,
      },
    );
  }

  private applySorting(
    qb: SelectQueryBuilder<Example>,
    filter: ExampleFilterDto,
  ) {
    const allowedFields = [
      'name',
      'email',
      'createdAt',
    ];

    if (!filter.sort) {
      qb.orderBy(
        'example.createdAt',
        'DESC',
      );

      return;
    }

    const sorts = filter.sort.split(',');

    for (const item of sorts) {
      const [field, direction] =
        item.split(':');

      if (!allowedFields.includes(field)) {
        continue;
      }

      qb.addOrderBy(
        `example.${field}`,
        direction?.toUpperCase() === 'DESC'
          ? 'DESC'
          : 'ASC',
      );
    }
  }
}