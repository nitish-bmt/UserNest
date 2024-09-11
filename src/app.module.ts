import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { UsersModule } from './user/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRESS_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.POSTGRES_USER, 
        password: process.env.POSTGRES_PASS,
        database: process.env.POSTGRES_DB,
        entities: [User],  
        synchronize: true,  //don't use in production (might llose data)
      })
    }),     
    HealthcheckModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers:[
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy
  ]
})
export class AppModule {

}
