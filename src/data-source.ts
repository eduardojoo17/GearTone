import { DataSource, DataSourceOptions } from "typeorm";
import { Usuario } from "./entity/Usuario.js";
import { Instrumento } from "./entity/Instrumento.js";
import { Repertorio } from "./entity/Repertorio.js";
import { SessaoEstudo } from "./entity/SessaoEstudo.js";

const options: DataSourceOptions = {
  type: (process.env.DB_TYPE as "postgres") || "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  // Passando as classes importadas diretamente no array
  entities: [Usuario, Instrumento, Repertorio, SessaoEstudo],

  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(options);
