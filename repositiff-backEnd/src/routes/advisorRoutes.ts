import { AdvisorController } from "@src/controllers/advisorController.js";
import { ValidatorJWT } from "@src/controllers/middlewares/validateResetToken.ts/validatorJWT.js";
import { deleteAdvisor } from "@src/domain/application/advisor-useCases/deleteAdvisor-useCase.js";
import { UpdateAdvisorPropsDTO } from "@src/domain/application/advisor-useCases/updateAdvisor.js";
import { AdvisorProps } from "@src/domain/entities/advisor.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function advisorRoutes(fastify: FastifyInstance) {
  const controller = new AdvisorController();

  fastify.post(
    "/register",
    { preHandler: ValidatorJWT.validateToken },
    async (req: FastifyRequest<{ Body: AdvisorProps }>, reply: FastifyReply) => {
      console.log(req.body);
      try {
        await controller.create(req, reply);
      } catch (error: any) {
        reply.code(500).send({ error: error.message, message: "Registration has failed" });
      }
    }
  );

  //   fastify.get("/:id", async (request, res) => {
  //     const { id } = request.params as { id: string }; // Pegando o parâmetro da URL
  //     try {
  //       await controller.find(id, res);

  //       // Agora `req.body` é do tipo IRequestAcademicWorkController
  //     } catch (error: any) {
  //       res.code(500).send({
  //         error: error.message,
  //         message: "Get has failed",
  //       });
  //     }
  //   });

  fastify.put("/update", async (req: FastifyRequest<{ Body: UpdateAdvisorPropsDTO }>, reply: FastifyReply) => {
    try {
      await controller.update(req, reply);
    } catch (error: any) {
      reply.code(500).send({ error: error.message, message: "Update has failed." });
    }
  });

  fastify.delete("/delete", async (req: FastifyRequest<{ Body: deleteAdvisor }>, reply: FastifyReply) => {
    try {
      await controller.delete(req, reply);
    } catch (error: any) {
      reply.code(500).send({ error: error.message, message: "Delete has failed." });
    }
  });
  fastify.get(
    "/list",
    { preHandler: ValidatorJWT.validateToken },
    async (req: FastifyRequest<{ Body: deleteAdvisor }>, reply: FastifyReply) => {
      try {
        await controller.listAllAdvisors(reply);
      } catch (error: any) {
        reply.code(500).send({ error: error.message, message: "Delete has failed." });
      }
    }
  );
}
