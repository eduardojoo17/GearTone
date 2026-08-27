import { validate } from "class-validator";
import bcrypt from "bcryptjs";
import { Not } from "typeorm";
import { AppDataSource } from "../data-source.js";
import { Usuario } from "../entity/Usuario.js";
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../helpers/apiError.js";

type Solicitante = { id: number; role: "admin" | "usuario" };

type DadosUsuario = {
  nome?: string;
  email?: string;
  senha?: string;
  role?: "admin" | "usuario";
};

export class UsuarioService {
  private usuarioRepository = AppDataSource.getRepository(Usuario);

  /** Listagem completa: só faz sentido para administradores (ver RNF02). */
  async list(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async update(id: number, dados: DadosUsuario, solicitante: Solicitante) {
    this.garantirAcesso(id, solicitante);

    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundError("Usuario não encontrado");

    if (dados.nome !== undefined) usuario.nome = dados.nome;

    if (dados.email !== undefined && dados.email !== usuario.email) {
      const emailEmUso = await this.usuarioRepository.findOneBy({
        email: dados.email,
        id: Not(id),
      });
      if (emailEmUso) throw new ConflictError("E-mail já cadastrado");
      usuario.email = dados.email;
    }

    // RNF04 - a senha nunca é gravada em texto puro
    if (dados.senha !== undefined)
      usuario.senha = await bcrypt.hash(dados.senha, 10);

    if (dados.role !== undefined && dados.role !== usuario.role) {
      if (solicitante.role !== "admin")
        throw new UnauthorizedError(
          "Apenas administradores podem alterar o papel do usuário",
        );
      usuario.role = dados.role;
    }

    const errors = await validate(usuario, { skipMissingProperties: true });
    if (errors.length > 0)
      throw new BadRequestError("Falha de validação", errors);

    const salvo = await this.usuarioRepository.save(usuario);

    const { senha: _, ...usuarioSemSenha } = salvo;
    return usuarioSemSenha;
  }

  async delete(
    id: number,
    solicitante: Solicitante,
  ): Promise<{ message: string }> {
    this.garantirAcesso(id, solicitante);

    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundError("Usuario não encontrado");

    await this.usuarioRepository.remove(usuario);
    return { message: "usuario deletado com sucesso" };
  }

  async findById(id: number, solicitante: Solicitante): Promise<Usuario> {
    this.garantirAcesso(id, solicitante);

    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundError("Usuário não encontrado");

    return usuario;
  }

  /** RNF02 - cada usuário só enxerga os próprios dados; admin enxerga todos. */
  private garantirAcesso(id: number, solicitante: Solicitante): void {
    if (Number.isNaN(id)) throw new BadRequestError("Id inválido");

    if (solicitante.role !== "admin" && solicitante.id !== id)
      throw new UnauthorizedError(
        "Você só pode acessar os seus próprios dados",
      );
  }
}
