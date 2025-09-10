import { JWTService } from "@src/infra/security/jwtService.js";
// import { IUsersRepository } from "../../../infra/repositories/IUserRepostory";
import { Role } from "@src/domain/entities/user.js";
import { IUsersRepository } from "@src/infra/repositories/IUserRepostory.js";

export class ValidatorJWT {
  static async validateToken(req: any, res: any): Promise<void> {
    const authHeader = req.headers["authorization"];
    console.log("TOKEN: ");
    console.log(authHeader);
    if (!authHeader) {
      return res.status(401).send({ msg: "Token não fornecido!asd" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <TOKEN>
    if (!token) {
      return res.status(401).send({ msg: "Token inválido!" });
    }

    const jwtSecret = process.env.SECRET || "";

    let payload: any;
    try {
      console.log(`PAYLOAD: ${token}`);
      payload = JWTService.verifyToken(token, jwtSecret);
      req.userId = payload.id;
      // console.log(`\n\nPAYLOAD DECODIFICADO NO VALIDATETOKEN: ${payload}`);
      console.log(payload.id);
    } catch (err: any) {
      console.log(err);
      return res.status(401).send({ msg: "Token inválido ou expirado! aaaaaaaa", error: err });
    }
  }

  static async getUserId(req: any, res: any): Promise<string | undefined> {
    const authHeader = req.headers["authorization"];
    console.log("TOKEN: ");
    console.log(authHeader);
    if (!authHeader) {
      return undefined;
    }

    const token = authHeader.split(" ")[1]; // Bearer <TOKEN>
    if (!token) {
      return undefined;
    }

    const jwtSecret = process.env.SECRET || "";

    let payload: any;
    try {
      console.log(`PAYLOAD: ${token}`);
      payload = JWTService.verifyToken(token, jwtSecret);
      return payload.id;
      // console.log(`\n\nPAYLOAD DECODIFICADO NO VALIDATETOKEN: ${payload}`);
      // console.log(payload.id);
    } catch (err: any) {
      console.log(err);
      return undefined;
    }
  }

  // static async validateAcess(req: any, res: any, userRepository: IUsersRepository, role: Role): Promise<void> {
  //   const authHeader = req.headers["authorization"];
  //   console.log("TOKEN: ");
  //   console.log(authHeader);
  //   if (!authHeader) {
  //     return res.status(401).send({ msg: "Token não fornecido!" });
  //   }

  //   const token = authHeader.split(" ")[1]; // Bearer <TOKEN>
  //   if (!token) {
  //     return res.status(401).send({ msg: "Token inválido!" });
  //   }

  //   const jwtSecret = process.env.SECRET || "";

  //   let payload: any;
  //   try {
  //     console.log(`PAYLOAD: ${token}`);
  //     payload = JWTService.verifyToken(token, jwtSecret);
  //     const userResult = await userRepository.findById(payload.id);
  //     if (!userResult) return res.status(401).send({ msg: "Token vinculado a um usuário que não está no sistema" });

  //     if (!Object.values(Role).includes(role as Role)) {
  //       return res.status(401).send({ msg: "Acesso negado para esse usuário" });
  //     }
  //   } catch (err) {
  //     return res.status(401).send({ msg: "Token inválido ou expirado!" });
  //   }
  // }
}
