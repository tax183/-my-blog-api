import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    
    type: 'postgres',
        host: process.env.DB_HOST,
        port:  Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        entities: ['src/**/*.entity{.ts,.js}'],
        migrations: ['src/migration/*{.ts,.js}'],
   
};

const dataSource = new DataSource(dataSourceOptions);

dataSource.initialize()
    .then(() => console.log('Data Source has been initialized!'))
    .catch((err) => console.error('Error during Data Source initialization:', err));

export default dataSource;
//
