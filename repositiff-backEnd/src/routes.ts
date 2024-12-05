import { FastifyInstance } from 'fastify';
import { librarianRoutes } from '@src/routes/librarianRoutes.js';
import { advisorRoutes } from './routes/advisorRoutes.js';

export default async function appRoutes(fastify: FastifyInstance) {
    // console.log("APPROUTES");
    // Registra as rotas relacionadas a bibliotecários com prefixo '/librarians'
    fastify.register(librarianRoutes, { prefix: '/librarian' });
    fastify.register(advisorRoutes, { prefix: "advisor" });
    // fastify.register(genericRoutes, { prefix: '/login' });
    // Você pode registrar outras rotas aqui, por exemplo:
    // fastify.register(productRoutes, { prefix: '/products' });
}