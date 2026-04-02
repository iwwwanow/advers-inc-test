import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Customer } from './entities/Customer';
import { Position } from './entities/Position';
import { Translation } from './entities/Translation';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
  username: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'root',
  database: process.env.MYSQL_DATABASE ?? 'advers',
  charset: 'utf8mb4',
  synchronize: false,
  entities: [Customer, Position, Translation],
});

export async function initDb(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}
