import { SelectQueryBuilder } from 'typeorm';

export async function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}