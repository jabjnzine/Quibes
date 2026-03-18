import { SelectQueryBuilder, ObjectLiteral } from 'typeorm'
import { PaginatedResult } from '@quibes/shared'
import { PaginationDto } from '../dto/pagination.dto'

export async function paginate<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  { page = 1, limit = 20 }: PaginationDto,
): Promise<PaginatedResult<T>> {
  const total = await query.getCount()
  const data = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getMany()

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}
