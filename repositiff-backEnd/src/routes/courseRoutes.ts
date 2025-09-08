// export async function advisorRoutes(fastify: FastifyInstance) {

import { CourseController } from "@src/controllers/courseController.js";
import { ValidatorJWT } from "@src/controllers/middlewares/validateResetToken.ts/validatorJWT.js";
import { IDeleteProps } from "@src/domain/application/course-use-case/delete-course-use-case.js";
import { ICourseUpdateProps } from "@src/domain/application/course-use-case/update-course-use-case.js";
import { ICourseProps } from "@src/domain/entities/course.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function courseRoutes(fastify: FastifyInstance) {
  const controller = new CourseController();
  fastify.post(
    "/register",
    { preHandler: ValidatorJWT.validateToken },
    async (req: FastifyRequest<{ Body: ICourseProps }>, reply: FastifyReply) => {
      console.log(req.body);
      try {
        await controller.create(req, reply);
      } catch (error: any) {
        reply.code(500).send({ error: error.message, message: "Registration has failed" });
      }
    }
  );

  fastify.put(
    "/update",
    { preHandler: ValidatorJWT.validateToken },
    async (req: FastifyRequest<{ Body: ICourseUpdateProps }>, reply: FastifyReply) => {
      console.log(req.body);
      try {
        await controller.update(req, reply);
      } catch (error: any) {
        reply.code(500).send({ error: error.message, message: "Update has failed" });
      }
    }
  );

  fastify.delete(
    "/delete",
    { preHandler: ValidatorJWT.validateToken },
    async (req: FastifyRequest<{ Body: IDeleteProps }>, reply: FastifyReply) => {
      console.log(req.body);
      try {
        await controller.delete(req, reply);
      } catch (error: any) {
        reply.code(500).send({ error: error.message, message: "Delete has failed" });
      }
    }
  );

  fastify.get("/list", async (req: FastifyRequest<{}>, reply: FastifyReply) => {
    console.log(req.body);
    try {
      await controller.listAll(reply);
    } catch (error: any) {
      reply.code(500).send({ error: error.message, message: "List has failed" });
    }
  });
}
