import { validate } from "class-validator";
import { ILike } from "typeorm";
import type { FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../data-source.js";
import { Repertorio, StatusMusica } from "../entity/Repertorio.js";
import { BadRequestError, NotFoundError } from "../helpers/apiError.js";
import { validarUuid } from "../helpers/validacoes.js";

export type DadosMusica = {
  nome?: string;
  artista?: string;
  status?: StatusMusica;
};

export class RepertorioService {
  private repertorioRepository = AppDataSource.getRepository(Repertorio);

  async criar(usuarioId: number, dados: DadosMusica): Promise<Repertorio> {
    const musica = this.repertorioRepository.create({
      nome: dados.nome,
      artista: dados.artista,
      status: dados.status ?? StatusMusica.QUERO_APRENDER,
      usuarioId,
    });

    const errors = await validate(musica);
    if (errors.length > 0)
      throw new BadRequestError("Falha de validação", errors);

    return await this.repertorioRepository.save(musica);
  }

  /** RF06/RF07 - lista o repertório com busca por nome/artista e filtro de status. */
  async listar(
    usuarioId: number,
    filtros: { busca?: string; status?: string } = {},
  ): Promise<Repertorio[]> {
    const { busca, status } = filtros;

    if (status && !this.statusValido(status))
      throw new BadRequestError("Status inválido");

    const base: FindOptionsWhere<Repertorio> = { usuarioId };
    if (status) base.status = status as StatusMusica;

    // Array de condições no TypeORM equivale a OR
    const where = busca
      ? [
          { ...base, nome: ILike(`%${busca}%`) },
          { ...base, artista: ILike(`%${busca}%`) },
        ]
      : base;

    return await this.repertorioRepository.find({
      where,
      order: { artista: "ASC", nome: "ASC" },
    });
  }

  async buscarPorId(id: string, usuarioId: number): Promise<Repertorio> {
    validarUuid(id, "Id de música inválido");

    const musica = await this.repertorioRepository.findOneBy({ id, usuarioId });
    if (!musica) throw new NotFoundError("Música não encontrada");

    return musica;
  }

  async atualizar(
    id: string,
    usuarioId: number,
    dados: DadosMusica,
  ): Promise<Repertorio> {
    const musica = await this.buscarPorId(id, usuarioId);

    if (dados.nome !== undefined) musica.nome = dados.nome;
    if (dados.artista !== undefined) musica.artista = dados.artista;
    if (dados.status !== undefined) musica.status = dados.status;

    const errors = await validate(musica, { skipMissingProperties: true });
    if (errors.length > 0)
      throw new BadRequestError("Falha de validação", errors);

    return await this.repertorioRepository.save(musica);
  }

  async remover(id: string, usuarioId: number): Promise<{ message: string }> {
    const musica = await this.buscarPorId(id, usuarioId);
    await this.repertorioRepository.remove(musica);

    return { message: "Música removida com sucesso" };
  }

  private statusValido(status: string): boolean {
    return Object.values(StatusMusica).includes(status as StatusMusica);
  }
}
