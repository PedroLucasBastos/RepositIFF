import jwt, { SignOptions, VerifyErrors } from "jsonwebtoken";

interface jwtPayload {
  id: string;
}

export class JWTService {
  private _secret: string;
  private _expiresIn: string;

  constructor(secret: string, expiresIn: string = "2h") {
    if (!secret) {
      throw new Error("JWT secret must be provided");
    }
    this._secret = secret;
    this._expiresIn = expiresIn;
  }

  /**
   * Gera um token JWT.
   * @param payload Dados a serem incluídos no token.
   * @param options Opções adicionais do JWT.
   * @returns Token JWT como string.
   */
  generateToken(payload: jwtPayload, options?: SignOptions): string {
    return jwt.sign(payload, this._secret, { expiresIn: this._expiresIn, ...options });
  }

  static idUserInToken(token: string): any {
    try {
      // const id = jwt.decode(token);
      // if(!id)
      //   return
      return jwt.decode(token);
    } catch (error) {}
  }

  /**
   * Verifica a validade de um token JWT.
   * @param token Token JWT a ser verificado.
   * @returns O payload decodificado, se válido.
   * @throws Error se o token for inválido ou expirado.
   */
  static verifyToken(token: string, secret: string): jwtPayload {
    try {
      // jwt.
      return jwt.verify(token, secret) as jwtPayload;
    } catch (error) {
      throw new Error(`Não autorizado`);
    }
  }

  /**
    //  * Decodifica um token JWT sem verificar sua validade.
    //  * @param token Token JWT a ser decodificado.
    //  * @returns O payload decodificado.
    //  */
  // decodeToken(token: string): object | null {
  //     return jwt.decode(token);
  // }
}
