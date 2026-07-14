import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source.js";
import { Usuario } from "../entity/Usuario.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../helpers/apiError.js";
import { validate } from "class-validator";

export class AuthService {
  private usuRepository = AppDataSource.getRepository(Usuario);

  registrar = async (dados: {
    nome: string;
    email: string;
    senha: string;
    role?: "admin" | "usuario";
  }) => {
    const existe = await this.usuRepository.findOneBy({ email: dados.email });
    if (existe) throw new ConflictError("E-mail já cadastrado");

    // Criptografa a senha antes de criar a entidade
    const hash = await bcrypt.hash(dados.senha, 10); // Aumentado o salt para 10 (padrão de mercado seguro)
    const usuario = this.usuRepository.create({ ...dados, senha: hash });

    const errors = await validate(usuario, {
      skipMissingProperties: true,
    });
    if (errors.length > 0) {
      throw new BadRequestError("Falha de validação", errors);
    }

    const salvo = await this.usuRepository.save(usuario);

    // Remove a senha do retorno por segurança
    const { senha: _, ...usuarioSemSenha } = salvo;
    return usuarioSemSenha;
  };
  logar = async (email: string, senha: string) => {
    // Usamos o QueryBuilder para selecionar explicitamente o campo 'senha' (que tem select: false)
    const usuario = await this.usuRepository
      .createQueryBuilder("usuario")
      .addSelect("usuario.senha") // <--- Aqui está o segredo! Ele força a busca da senha
      .where("usuario.email = :email", { email })
      .getOne();

    if (!usuario) throw new NotFoundError("Login ou senha incorretos");

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) throw new NotFoundError("Login ou senha inválidos");

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT as string,
      { expiresIn: "8h" },
    );

    return { token };
  };
}
