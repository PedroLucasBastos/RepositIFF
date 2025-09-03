import { LibrarianController, RegisterLibrarianRegisterBody } from "@src/controllers/librarianController.js";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// Plugin de rotas para bibliotecários
export async function librarianRoutes(fastify: FastifyInstance) {
  const librarianController = new LibrarianController();

  fastify.post(
    "/register",
    async (req: FastifyRequest<{ Body: RegisterLibrarianRegisterBody }>, reply: FastifyReply) => {
      try {
        await librarianController.register(req, reply);
      } catch (error: any) {
        reply.code(400).send({ error: error.message, message: "Registration asdf failed" });
      }
    }
  );

  fastify.post("/login", async (req: FastifyRequest<{ Body: RegisterLibrarianRegisterBody }>, reply: FastifyReply) => {
    try {
      await librarianController.login(req, reply);
    } catch (error: any) {
      reply.code(400).send({ error: error.message, message: "Login failed" });
    }
  });

  fastify.post(
    "/reset-password-request",
    async (req: FastifyRequest<{ Body: { id: string } }>, reply: FastifyReply) => {
      try {
        console.log(req.body);
        await librarianController.resetPasswordRequest(req, reply);
      } catch (error: any) {
        reply.code(400).send({ error: error.message, message: "Reset password failed" });
      }
    }
  );

  fastify.post(
    "/reset-password",
    async (req: FastifyRequest<{ Body: { newPassword: string; confirmPassword: string } }>, reply: FastifyReply) => {
      try {
        await librarianController.resetPassword(req, reply);
      } catch (error: any) {
        reply.code(400).send({ error: error.message, message: "Reset password failed" });
      }
    }
  );

  fastify.get("/list", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await librarianController.listLibrarians(req.headers, reply);
    } catch (error: any) {
      reply.code(400).send({ error: error.message, message: "Listation failed" });
    }
  });
}
