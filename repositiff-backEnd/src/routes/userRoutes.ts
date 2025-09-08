import { ValidatorJWT } from "@src/controllers/middlewares/validateResetToken.ts/validatorJWT.js";
import {
  UserController,
  RegisterUserRegisterBody as RegisterUserRegisterBody,
} from "@src/controllers/userController.js";
import { JWTService } from "@src/infra/security/jwtService.js";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// Plugin de rotas para bibliotecários
export async function librarianRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  fastify.post(
    "/register",
    // { preHandler: ValidatorJWT.validateAcess(require) },
    async (req: FastifyRequest<{ Body: RegisterUserRegisterBody }>, reply: FastifyReply) => {
      try {
        await userController.register(req, reply);
      } catch (error: any) {
        reply.code(400).send({ error: error.message, message: "Registration asdf failed" });
      }
    }
  );

  fastify.post("/login", async (req: any, res: FastifyReply) => {
    try {
      await userController.login(req, res);
    } catch (error: any) {
      res.code(400).send({ error: error.message, message: "Login failed" });
    }
  });

  fastify.post(
    "/reset-password-request",
    async (req: FastifyRequest<{ Body: { registrationNumber: string } }>, reply: FastifyReply) => {
      try {
        console.log(req.body);
        await userController.resetPasswordRequest(req, reply);
      } catch (error: any) {
        reply.code(400).send({ error: error.message, message: "Reset password failed" });
      }
    }
  );

  fastify.post(
    "/reset-password",
    async (req: FastifyRequest<{ Body: { newPassword: string; confirmPassword: string } }>, reply: FastifyReply) => {
      try {
        await userController.resetPassword(req, reply);
      } catch (error: any) {
        reply.code(400).send({ error: error.message, message: "Reset password failed" });
      }
    }
  );

  fastify.get("/list", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await userController.listsUsers(req.headers, reply);
    } catch (error: any) {
      reply.code(400).send({ error: error.message, message: "Listation failed" });
    }
  });
}
