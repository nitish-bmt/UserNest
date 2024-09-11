import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { UsersModule } from './user/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDataSource } from './appDataSource';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: '.env',
      isGlobal: true 
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ()=> AppDataSource.options
    }),     
    HealthcheckModule,
    UsersModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource){}
}
