import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: +process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'artical',
    synchronize: false, // يجب تعيينه إلى false في الإنتاج واستخدام الهجرات بدلاً من ذلك
    migrations: ['src/migration/*{.ts,.js}'],
    entities: ['src/**/*.entity{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();

export default dataSource;
