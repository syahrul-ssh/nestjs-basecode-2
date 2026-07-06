import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';

import databaseConfig from './database.config';

export const getTypeOrmConfig = (
  dbConfig: ConfigType<typeof databaseConfig>,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,

  autoLoadEntities: true,

  synchronize: false,

  migrationsRun: false,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
});