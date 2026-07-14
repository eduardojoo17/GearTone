import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { Usuario } from "./Usuario.js";
import { Instrumento } from "./Instrumento.js";
import { Repertorio } from "./Repertorio.js";

@Entity("sessoes_estudo")
export class SessaoEstudo {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "timestamp" })
  @IsNotEmpty({ message: "A data da sessão é obrigatória" })
  data!: Date;

  @Column({ type: "int" })
  @IsInt({ message: "A duração precisa ser um número inteiro (em minutos)" })
  @Min(1, { message: "A duração precisa ser maior que zero" })
  duracaoMinutos!: number;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString({ message: "As observações precisam ser um texto" })
  observacoes!: string | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.sessoesEstudo)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @Column({ type: "int" }) // ◄ Tipo explícito adicionado
  usuarioId!: number;

  @ManyToOne(() => Repertorio, (repertorio) => repertorio.sessoesEstudo, {
    nullable: true,
  })
  @JoinColumn({ name: "musicaId" })
  musica!: Repertorio | null;

  @Column({ type: "varchar", nullable: true }) // ◄ Tipo explícito adicionado
  musicaId!: string | null;

  @ManyToOne(() => Instrumento, (instrumento) => instrumento.sessoesEstudo, {
    nullable: true,
  })
  @JoinColumn({ name: "instrumentoId" })
  instrumento!: Instrumento | null;

  @Column({ type: "varchar", nullable: true }) // ◄ Tipo explícito adicionado
  instrumentoId!: string | null;
}
