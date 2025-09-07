import { FastifyInstance } from "fastify";
import { librarianRoutes } from "@src/routes/userRoutes.js";
import { advisorRoutes } from "./routes/advisorRoutes.js";
import { courseRoutes } from "./routes/courseRoutes.js";
import { academicWorkRoutes } from "./routes/academicWorkRoutes.js";

export default async function appRoutes(fastify: FastifyInstance) {
  // console.log("APPROUTES");
  // Registra as rotas relacionadas a bibliotecários com prefixo '/librarians'
  fastify.register(librarianRoutes, { prefix: "/user" });
  fastify.register(advisorRoutes, { prefix: "/advisor" });
  fastify.register(courseRoutes, { prefix: "/course" });
  fastify.register(academicWorkRoutes, { prefix: "/academicWork" });
  // fastify.register(genericRoutes, { prefix: '/login' });
  // Você pode registrar outras rotas aqui, por exemplo:
  // fastify.register(productRoutes, { prefix: '/products' });
}
