import { AppDataSource } from "../data-source.js";
import { Instrumento, StatusInstrumento } from "../entity/Instrumento.js";
import { Repertorio, StatusMusica } from "../entity/Repertorio.js";
import { SessaoEstudo } from "../entity/SessaoEstudo.js";

export class DashboardService {
  private instrumentoRepository = AppDataSource.getRepository(Instrumento);
  private repertorioRepository = AppDataSource.getRepository(Repertorio);
  private sessaoRepository = AppDataSource.getRepository(SessaoEstudo);

  /** RF09/UC07 - resumo da vida musical do usuário logado. */
  async resumo(usuarioId: number) {
    const [
      totalInstrumentos,
      instrumentosAtivos,
      favorito,
      atual,
      totalMusicas,
      musicasParaRevisar,
      totalSessoes,
      tempoEstudadoMinutos,
    ] = await Promise.all([
      this.instrumentoRepository.countBy({ usuarioId }),
      this.instrumentoRepository.countBy({
        usuarioId,
        status: StatusInstrumento.ATIVO,
      }),
      this.instrumentoRepository.findOneBy({ usuarioId, favorito: true }),
      this.instrumentoRepository.findOneBy({ usuarioId, atual: true }),
      this.repertorioRepository.countBy({ usuarioId }),
      this.repertorioRepository.find({
        where: { usuarioId, status: StatusMusica.REVISAR },
        order: { artista: "ASC", nome: "ASC" },
      }),
      this.sessaoRepository.countBy({ usuarioId }),
      this.somarTempoEstudado(usuarioId),
    ]);

    return {
      instrumentos: {
        total: totalInstrumentos,
        ativos: instrumentosAtivos,
        inativos: totalInstrumentos - instrumentosAtivos,
        favorito,
        atual,
      },
      repertorio: {
        total: totalMusicas,
        paraRevisar: musicasParaRevisar,
      },
      estudos: {
        totalSessoes,
        tempoEstudadoMinutos,
        tempoEstudadoHoras: Number((tempoEstudadoMinutos / 60).toFixed(1)),
      },
    };
  }

  private async somarTempoEstudado(usuarioId: number): Promise<number> {
    const resultado = await this.sessaoRepository
      .createQueryBuilder("sessao")
      .select("SUM(sessao.duracaoMinutos)", "total")
      .where("sessao.usuarioId = :usuarioId", { usuarioId })
      .getRawOne<{ total: string | null }>();

    return Number(resultado?.total ?? 0);
  }
}
