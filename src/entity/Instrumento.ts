import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Usuario } from "./Usuario.js";
import { SessaoEstudo } from "./SessaoEstudo.js";

export enum StatusInstrumento {
  ATIVO = "ativo",
  VENDIDO = "vendido",
  TROCADO = "trocado",
  DOADO = "doado",
  PERDIDO = "perdido",
  FURTADO = "furtado",
}

@Entity("instrumentos")
export class Instrumento {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" }) // ◄ Tipo explícito adicionado
  @IsNotEmpty({ message: "O nome do instrumento é obrigatório" })
  @IsString({ message: "O nome precisa ser um texto" })
  nome!: string;

  @Column({
    type: "enum",
    enum: StatusInstrumento,
    default: StatusInstrumento.ATIVO,
  })
  @IsEnum(StatusInstrumento, { message: "Status inválido" })
  status!: StatusInstrumento;

  @Column({ type: "timestamp", nullable: true })
  @IsOptional()
  @IsDate({ message: "Data de alteração inválida" })
  statusAlteradoEm!: Date | null;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString({ message: "As observações precisam ser um texto" })
  observacoes!: string | null;

  @Column({ type: "boolean", default: false }) // ◄ Tipo explícito adicionado
  @IsBoolean({ message: "Favorito precisa ser verdadeiro ou falso" })
  favorito!: boolean;

  @Column({ type: "boolean", default: false }) // ◄ Tipo explícito adicionado
  @IsBoolean({ message: "Atual precisa ser verdadeiro ou falso" })
  atual!: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.instrumentos)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @Column({ type: "int" }) // ◄ Tipo explícito adicionado
  usuarioId!: number;

  @OneToMany(() => SessaoEstudo, (sessao) => sessao.instrumento)
  sessoesEstudo!: SessaoEstudo[];
}
