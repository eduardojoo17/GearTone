import { BadRequestError } from "./apiError.js";

const FORMATO_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Converte o valor recebido no corpo da requisição (normalmente uma string)
 * para Date. Retorna null quando o campo não foi informado.
 */
export const converterData = (
  valor: unknown,
  campo = "data",
): Date | null => {
  if (valor === undefined || valor === null || valor === "") return null;

  const data = valor instanceof Date ? valor : new Date(String(valor));
  if (Number.isNaN(data.getTime()))
    throw new BadRequestError(`O campo ${campo} não é uma data válida`);

  return data;
};

/**
 * Instrumento, Repertorio e SessaoEstudo usam uuid como id. Sem essa checagem
 * o Postgres recusa o valor e o erro chega no middleware como 500.
 */
export const validarUuid = (valor: string, mensagem: string): string => {
  if (!FORMATO_UUID.test(valor)) throw new BadRequestError(mensagem);
  return valor;
};
