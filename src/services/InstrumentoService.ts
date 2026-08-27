import { validate } from "class-validator";
import { AppDataSource } from "../data-source.js";
import { Instrumento, StatusInstrumento } from "../entity/Instrumento.js";
import { BadRequestError, NotFoundError } from "../helpers/apiError.js";
import { converterData, validarUuid } from "../helpers/validacoes.js";

export type DadosInstrumento = {
  nome?: string;
  status?: StatusInstrumento;
  statusAlteradoEm?: string | Date | null;
  observacoes?: string | null;
  favorito?: boolean;
  atual?: boolean;
};

export class InstrumentoService {
  private instrumentoRepository = AppDataSource.getRepository(Instrumento);

  async criar(
    usuarioId: number,
    dados: DadosInstrumento,
  ): Promise<Instrumento> {
    const instrumento = this.instrumentoRepository.create({
      nome: dados.nome,
      status: dados.status ?? StatusInstrumento.ATIVO,
      statusAlteradoEm: converterData(
        dados.statusAlteradoEm,
        "statusAlteradoEm",
      ),
      observacoes: dados.observacoes ?? null,
      favorito: dados.favorito ?? false,
      atual: dados.atual ?? false,
      usuarioId,
    });

    const errors = await validate(instrumento);
    if (errors.length > 0)
      throw new BadRequestError("Falha de validação", errors);

    // RF03/RF04: só pode existir um favorito e um atual por usuário
    if (instrumento.favorito) await this.limparMarcacao("favorito", usuarioId);
    if (instrumento.atual) await this.limparMarcacao("atual", usuarioId);

    return await this.instrumentoRepository.save(instrumento);
  }

  async listar(usuarioId: number, status?: string): Promise<Instrumento[]> {
    if (status && !this.statusValido(status))
      throw new BadRequestError("Status inválido");

    return await this.instrumentoRepository.find({
      where: status
        ? { usuarioId, status: status as StatusInstrumento }
        : { usuarioId },
      order: { favorito: "DESC", atual: "DESC", nome: "ASC" },
    });
  }

  async buscarPorId(id: string, usuarioId: number): Promise<Instrumento> {
    validarUuid(id, "Id de instrumento inválido");

    const instrumento = await this.instrumentoRepository.findOneBy({
      id,
      usuarioId,
    });
    if (!instrumento) throw new NotFoundError("Instrumento não encontrado");

    return instrumento;
  }

  async atualizar(
    id: string,
    usuarioId: number,
    dados: DadosInstrumento,
  ): Promise<Instrumento> {
    const instrumento = await this.buscarPorId(id, usuarioId);

    // Campos copiados um a um de propósito: assim o corpo da requisição não
    // consegue trocar o dono do instrumento (usuarioId) nem o id.
    if (dados.nome !== undefined) instrumento.nome = dados.nome;
    if (dados.status !== undefined) instrumento.status = dados.status;
    if (dados.observacoes !== undefined)
      instrumento.observacoes = dados.observacoes;
    if (dados.statusAlteradoEm !== undefined)
      instrumento.statusAlteradoEm = converterData(
        dados.statusAlteradoEm,
        "statusAlteradoEm",
      );
    if (dados.favorito !== undefined) instrumento.favorito = dados.favorito;
    if (dados.atual !== undefined) instrumento.atual = dados.atual;

    const errors = await validate(instrumento, { skipMissingProperties: true });
    if (errors.length > 0)
      throw new BadRequestError("Falha de validação", errors);

    if (dados.favorito === true) await this.limparMarcacao("favorito", usuarioId);
    if (dados.atual === true) await this.limparMarcacao("atual", usuarioId);

    return await this.instrumentoRepository.save(instrumento);
  }

  /** UC04 - altera o status e registra data/observações no histórico. */
  async alterarStatus(
    id: string,
    usuarioId: number,
    dados: {
      status?: StatusInstrumento;
      statusAlteradoEm?: string | Date | null;
      observacoes?: string | null;
    },
  ): Promise<Instrumento> {
    if (!dados.status) throw new BadRequestError("O status é obrigatório");
    if (!this.statusValido(dados.status))
      throw new BadRequestError("Status inválido");

    const instrumento = await this.buscarPorId(id, usuarioId);

    instrumento.status = dados.status;
    instrumento.statusAlteradoEm =
      converterData(dados.statusAlteradoEm, "statusAlteradoEm") ?? new Date();
    if (dados.observacoes !== undefined)
      instrumento.observacoes = dados.observacoes;

    // Um instrumento que saiu da coleção não continua sendo o "em uso"
    if (instrumento.status !== StatusInstrumento.ATIVO) instrumento.atual = false;

    return await this.instrumentoRepository.save(instrumento);
  }

  /** UC02 - define o favorito, removendo a marcação do anterior. */
  async definirFavorito(id: string, usuarioId: number): Promise<Instrumento> {
    const instrumento = await this.buscarPorId(id, usuarioId);

    await this.limparMarcacao("favorito", usuarioId);
    instrumento.favorito = true;

    return await this.instrumentoRepository.save(instrumento);
  }

  /** UC03 - define o instrumento em uso, removendo a marcação do anterior. */
  async definirAtual(id: string, usuarioId: number): Promise<Instrumento> {
    const instrumento = await this.buscarPorId(id, usuarioId);

    if (instrumento.status !== StatusInstrumento.ATIVO)
      throw new BadRequestError(
        "Apenas um instrumento ativo pode ser definido como atual",
      );

    await this.limparMarcacao("atual", usuarioId);
    instrumento.atual = true;

    return await this.instrumentoRepository.save(instrumento);
  }

  async remover(id: string, usuarioId: number): Promise<{ message: string }> {
    const instrumento = await this.buscarPorId(id, usuarioId);
    await this.instrumentoRepository.remove(instrumento);

    return { message: "Instrumento removido com sucesso" };
  }

  private async limparMarcacao(
    campo: "favorito" | "atual",
    usuarioId: number,
  ): Promise<void> {
    const marcacao =
      campo === "favorito" ? { favorito: false } : { atual: false };
    await this.instrumentoRepository.update({ usuarioId }, marcacao);
  }

  private statusValido(status: string): boolean {
    return Object.values(StatusInstrumento).includes(
      status as StatusInstrumento,
    );
  }
}
