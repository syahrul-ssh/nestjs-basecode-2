import {
  plainToInstance,
  ClassTransformOptions,
} from 'class-transformer';


export type ClassConstructor<T> = {
  new (...args: any[]): T;
};

const defaultOptions: ClassTransformOptions = {
  excludeExtraneousValues: true,
  exposeUnsetFields: false,
};

export class DtoTransformer {
  static item<Entity, Dto>(
    dto: ClassConstructor<Dto>,
    data: Entity,
  ): Dto {
    return plainToInstance(
      dto,
      data,
      defaultOptions,
    );
  }

  static collection<Entity, Dto>(
    dto: ClassConstructor<Dto>,
    data: Entity[],
  ): Dto[] {
    return plainToInstance(
      dto,
      data,
      defaultOptions,
    );
  }

  static paginated<Entity, Dto>(
    dto: ClassConstructor<Dto>,
    result: {
      data: Entity[];
      meta: any;
    },
  ) {
    return {
      data: plainToInstance(
        dto,
        result.data,
        defaultOptions,
      ),
      meta: result.meta,
    };
  }
}