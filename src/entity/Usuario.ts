import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Instrumento } from "./Instrumento.js";
import { Repertorio } from "./Repertorio.js";
import { SessaoEstudo } from "./SessaoEstudo.js";
import { type } from "node:os";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  @IsNotEmpty({ message: "O nome é obrigatório!" })
  @IsString({ message: "O nome precisa ser um texto" })
  nome!: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  @IsNotEmpty({ message: "O e-mail é obrigatório" })
  @IsEmail({}, { message: "O e-mail não é válido" })
  email!: string;

  @Column({ type: "varchar", select: false })
  @IsNotEmpty({ message: "A senha é obrigatória" })
  senha!: string;

  @Column({ type: "varchar", default: "usuario" })
  role!: "usuario" | "admin";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  criadoEm!: Date;

  @OneToMany(() => Instrumento, (instrumento) => instrumento.usuario)
  instrumentos!: Instrumento[];

  @OneToMany(() => Repertorio, (repertorio) => repertorio.usuario)
  repertorio!: Repertorio[];

  @OneToMany(() => SessaoEstudo, (sessao) => sessao.usuario)
  sessoesEstudo!: SessaoEstudo[];
}
