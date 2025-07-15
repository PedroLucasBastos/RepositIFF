import { LibrarianController, RegisterLibrarianRegisterBody } from "@src/controllers/librarianController.js";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// Plugin de rotas para bibliotecários
export async function librarianRoutes(fastify: FastifyInstance) {
  const librarianController = new LibrarianController();

  fastify.post("/register", async (req: FastifyRequest<{ Body: RegisterLibrarianRegisterBody }>, reply: FastifyReply) => {
    try {
      await librarianController.register(req, reply);
    } catch (error: any) {
      reply.code(400).send({ error: error.message, message: "Registration asdf failed" });
    }
  });

  fastify.post("/login", async (req: FastifyRequest<{ Body: RegisterLibrarianRegisterBody }>, reply: FastifyReply) => {
    try {
      await librarianController.login(req, reply);
    } catch (error: any) {
      reply.code(400).send({ error: error.message, message: "Login failed" });
    }
  });

  fastify.get("/list", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await librarianController.listLibrarians(req.headers, reply);
    } catch (error: any) {
      reply.code(400).send({ error: error.message, message: "Listation failed" });
    }
  });
}
