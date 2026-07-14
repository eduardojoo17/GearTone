import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Usuario } from "./Usuario.js";
import { SessaoEstudo } from "./SessaoEstudo.js";

export enum StatusMusica {
  QUERO_APRENDER = "quero_aprender",
  ESTUDANDO = "estudando",
  SEI_TOCAR = "sei_tocar",
  REVISAR = "revisar",
}

@Entity("repertorio")
export class Repertorio {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" }) // ◄ Tipo explícito adicionado
  @IsNotEmpty({ message: "O nome da música é obrigatório" })
  @IsString({ message: "O nome precisa ser um texto" })
  nome!: string;

  @Column({ type: "varchar" }) // ◄ Tipo explícito adicionado
  @IsNotEmpty({ message: "O artista/banda é obrigatório" })
  @IsString({ message: "O artista precisa ser um texto" })
  artista!: string;

  @Column({
    type: "enum",
    enum: StatusMusica,
    default: StatusMusica.QUERO_APRENDER,
  })
  @IsEnum(StatusMusica, { message: "Status inválido" })
  status!: StatusMusica;

  @ManyToOne(() => Usuario, (usuario) => usuario.repertorio)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @Column({ type: "int" }) // ◄ Tipo explícito adicionado
  usuarioId!: number;

  @OneToMany(() => SessaoEstudo, (sessao) => sessao.musica)
  sessoesEstudo!: SessaoEstudo[];
}
