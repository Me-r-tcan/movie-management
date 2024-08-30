import { DataSourceOptions, DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const isTestEnv = process.env.NODE_ENV === 'test';

console.log(process.env.NODE_ENV)

export const dataSourceOptions: DataSourceOptions = isTestEnv
  ? {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: false,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      migrationsRun: false,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      logging: true,
      entities: ['**/*.entity{ .ts,.js}'],
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      migrationsRun: true,
    };

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
