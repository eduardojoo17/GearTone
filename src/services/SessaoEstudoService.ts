import { validate } from "class-validator";
import type { FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../data-source.js";
import { SessaoEstudo } from "../entity/SessaoEstudo.js";
import { Repertorio } from "../entity/Repertorio.js";
import { Instrumento } from "../entity/Instrumento.js";
import { BadRequestError, NotFoundError } from "../helpers/apiError.js";
import { converterData, validarUuid } from "../helpers/validacoes.js";

export type DadosSessao = {
  data?: string | Date;
  duracaoMinutos?: number;
  observacoes?: string | null;
  musicaId?: string | null;
  instrumentoId?: string | null;
};

export class SessaoEstudoService {
  private sessaoRepository = AppDataSource.getRepository(SessaoEstudo);
  private repertorioRepository = AppDataSource.getRepository(Repertorio);
  private instrumentoRepository = AppDataSource.getRepository(Instrumento);

  /** RF08 - música e instrumento são opcionais, mas precisam ser do usuário. */
  async criar(usuarioId: number, dados: DadosSessao): Promise<SessaoEstudo> {
    const sessao = this.sessaoRepository.create({
      data: converterData(dados.data, "data") ?? undefined,
      duracaoMinutos: dados.duracaoMinutos,
      observacoes: dados.observacoes ?? null,
      musicaId: dados.musicaId ?? null,
      instrumentoId: dados.instrumentoId ?? null,
      usuarioId,
    });

    const errors = await validate(sessao);
    if (errors.length > 0)
      throw new BadRequestError("Falha de validação", errors);

    await this.garantirVinculos(sessao, usuarioId);

    return await this.sessaoRepository.save(sessao);
  }

  async listar(
    usuarioId: number,
    filtros: { musicaId?: string; instrumentoId?: string } = {},
  ): Promise<SessaoEstudo[]> {
    const where: FindOptionsWhere<SessaoEstudo> = { usuarioId };

    if (filtros.musicaId)
      where.musicaId = validarUuid(filtros.musicaId, "Id de música inválido");
    if (filtros.instrumentoId)
      where.instrumentoId = validarUuid(
        filtros.instrumentoId,
        "Id de instrumento inválido",
      );

    return await this.sessaoRepository.find({
      where,
      relations: { musica: true, instrumento: true },
      order: { data: "DESC" },
    });
  }

  async buscarPorId(id: string, usuarioId: number): Promise<SessaoEstudo> {
    validarUuid(id, "Id de sessão inválido");

    const sessao = await this.sessaoRepository.findOne({
      where: { id, usuarioId },
      relations: { musica: true, instrumento: true },
    });
    if (!sessao) throw new NotFoundError("Sessão de estudo não encontrada");

    return sessao;
  }

  async atualizar(
    id: string,
    usuarioId: number,
    dados: DadosSessao,
  ): Promise<SessaoEstudo> {
    const sessao = await this.buscarPorId(id, usuarioId);

    if (dados.data !== undefined)
      sessao.data = converterData(dados.data, "data") ?? sessao.data;
    if (dados.duracaoMinutos !== undefined)
      sessao.duracaoMinutos = dados.duracaoMinutos;
    if (dados.observacoes !== undefined) sessao.observacoes = dados.observacoes;
    if (dados.musicaId !== undefined) sessao.musicaId = dados.musicaId;
    if (dados.instrumentoId !== undefined)
      sessao.instrumentoId = dados.instrumentoId;

    const errors = await validate(sessao, { skipMissingProperties: true });
    if (errors.length > 0)
      throw new BadRequestError("Falha de validação", errors);

    await this.garantirVinculos(sessao, usuarioId);

    return await this.sessaoRepository.save(sessao);
  }

  async remover(id: string, usuarioId: number): Promise<{ message: string }> {
    const sessao = await this.buscarPorId(id, usuarioId);
    await this.sessaoRepository.remove(sessao);

    return { message: "Sessão de estudo removida com sucesso" };
  }

  /**
   * RNF02 - impede vincular a sessão a uma música ou instrumento de outro
   * usuário. Carrega as relações para que o retorno já venha completo.
   */
  private async garantirVinculos(
    sessao: SessaoEstudo,
    usuarioId: number,
  ): Promise<void> {
    if (sessao.musicaId) {
      validarUuid(sessao.musicaId, "Id de música inválido");
      const musica = await this.repertorioRepository.findOneBy({
        id: sessao.musicaId,
        usuarioId,
      });
      if (!musica)
        throw new NotFoundError("Música não encontrada no seu repertório");
      sessao.musica = musica;
    } else {
      sessao.musica = null;
    }

    if (sessao.instrumentoId) {
      validarUuid(sessao.instrumentoId, "Id de instrumento inválido");
      const instrumento = await this.instrumentoRepository.findOneBy({
        id: sessao.instrumentoId,
        usuarioId,
      });
      if (!instrumento)
        throw new NotFoundError("Instrumento não encontrado");
      sessao.instrumento = instrumento;
    } else {
      sessao.instrumento = null;
    }
  }
}
