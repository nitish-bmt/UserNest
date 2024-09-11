import { DataSource } from "typeorm";
import { User } from "./user/entity/user.entity";
import { ConfigService } from "@nestjs/config";
// import { User } from "./user/entity/user.entity";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: (process.env.POSTGRESS_HOST),
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USER || 'postgres', 
  password: process.env.POSTGRES_PASS || 'root',
  database: (process.env.POSTGRES_DB),
  entities: [User],
  synchronize: true,
})

// __dirname + '/../**/*.entity{.ts,.js}'

export async function setupDataSource() {
  try{
    await AppDataSource.initialize();
    console.log("Data source initialised");
  }
  catch(error){
    console.error("Data source could not be initialised", error);
  }
}

// setupDataSource();