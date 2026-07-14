import { validate } from "class-validator";
import { AppDataSource } from "../data-source.js";
import { Usuario } from "../entity/Usuario.js";
import { NotFoundError, BadRequestError } from "../helpers/apiError.js";

export class UsuarioService {
  private usuarioRepository = AppDataSource.getRepository(Usuario);

  async list(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async update(id: number, dados: Partial<Usuario>): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundError("Usuario não encontrado");
    const usuarioAtualizado = this.usuarioRepository.merge(usuario, dados);
    const errors = await validate(usuarioAtualizado, {
      skipMissingProperties: true,
    });
    if (errors.length > 0)
      throw new BadRequestError("Falha de validação", errors);
    return await this.usuarioRepository.save(usuarioAtualizado);
  }

  async delete(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundError("Usuario não encontrado");
    await this.usuarioRepository.remove(usuario);
    return { message: "usuario deletado com sucesso" };
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundError("Usuário não encontrado");
    return usuario;
  }
}
