import { AdvisorController } from "@src/controllers/advisorController.js";
import { deleteAdvisor } from "@src/domain/application/advisor-useCases/deleteAdvisor-useCase.js";
import { UpdateAdvisorPropsDTO } from "@src/domain/application/advisor-useCases/updateAdvisor.js";
import { AdvisorProps } from "@src/domain/entities/advisor.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";



export async function advisorRoutes(fastify: FastifyInstance) {
    const controller = new AdvisorController();

    fastify.post('/register', async (req: FastifyRequest<{ Body: AdvisorProps }>, reply: FastifyReply) => {
        try {
            await controller.create(req, reply);
        } catch (error: any) {
            reply.code(500).send({ error: error.message, message: 'Registration has failed' });
        }
    });

    fastify.put('/update', async (req: FastifyRequest<{ Body: UpdateAdvisorPropsDTO }>, reply: FastifyReply) => {
        try {
            await controller.update(req, reply);
        } catch (error: any) {
            reply.code(500).send({ error: error.message, message: 'Update has failed.' });
        }
    });

    fastify.delete('/update', async (req: FastifyRequest<{ Body: deleteAdvisor }>, reply: FastifyReply) => {
        try {
            await controller.delete(req, reply);
        } catch (error: any) {
            reply.code(500).send({ error: error.message, message: 'Delete has failed.' });
        }
    });

}