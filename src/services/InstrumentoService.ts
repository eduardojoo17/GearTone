import { validate } from "class-validator";
import { AppDataSource } from "../data-source.js";
import {
  Instrumento,
  StatusInstrumento,
  TipoInstrumento,
} from "../entity/Instrumento.js";
import { NotFoundError, BadRequestError } from "../helpers/apiError.js";

export class InstrumentoService {
  private instRepository = AppDataSource.getRepository(Instrumento);

  async list(): Promise<Instrumento[]> {
    return await this.instRepository.find();
  }

  async create(
    inst: { nome: string; tipo: TipoInstrumento; observacoes: string },
    usuarioId: number
  ) {
    const instrumento = this.instRepository.create({
      ...inst,
      status: StatusInstrumento.ATIVO,
      usuarioId,
    });

    const errors = await validate(instrumento);
    if (errors.length > 0) {
      throw new BadRequestError("Falha de validação", errors);
    }

    return await this.instRepository.save(instrumento);
  }

  async delete(id: number): Promise<{ message: string }> {
    const instrumento = await this.instRepository.findOneBy({ id });
    if (!instrumento) throw new NotFoundError("instrumento não encontrado");
    await this.instRepository.remove(instrumento);
    return { message: "Instrumento deletado com sucesso" };
  }
}
