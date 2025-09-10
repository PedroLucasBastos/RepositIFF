import { academicWorkController, IRequestAcademicWorkController } from "@src/controllers/academicWorkController.js";
import { IUpdateAcademicWorkUseCaseDTO } from "@src/domain/application/academicWork-useCases/updateAcademicWork-use-case.js";
import { UpdateAcademicWorkBasicInfoPROPS } from "@src/domain/application/academicWork-useCases/UpdateAcademicWorkBasicInfoUse_case.js";
import { AddAdvisorToAcademicWorkProps } from "@src/domain/application/academicWork_Advisors-useCases/addAdvisorToAcademickWork-useCase.js";
import { IDelAdvisorProps } from "@src/domain/application/academicWork_Advisors-useCases/delAdvisorToAcademicWork-useCase.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import multipart from "@fastify/multipart";
import { DefineProps } from "@src/domain/application/academicWork_Advisors-useCases/defineMainAdvisor-use-case.js";
import { ValidatorJWT } from "@src/controllers/middlewares/validateResetToken.ts/validatorJWT.js";

export async function academicWorkRoutes(fastify: FastifyInstance) {
  const controller = new academicWorkController();
  // Define a rota que recebe o arquivo

  //   fastify.register(multipart, {
  //     limits: {
  //       fileSize: 50 * 1024 * 1024, // 50MB
  //     },
  //   });

  fastify.post("/create", { preHandler: ValidatorJWT.validateToken }, async (req: any, res) => {
    try {
      // ValidatorJWT.validateToken(req, res);
      const parts = req.parts();
      // console.log(parts);
      const body: Record<string, any> = {};
      let fileBuffer;

      console.log("📌 Iniciando processamento do multipart...");
      // console.log(parts.)
      for await (const part of parts) {
        // console.log(part)
        // console.log(`O NÚMERO DE VOLTAS FOI ${cont}`)
        // console.log("Recebido:", part);
        if (part.type === "file") {
          fileBuffer = {
            buffer: await part.toBuffer(), // Lê a stream do arquivo corretamente
          };
        } else {
          // console.log(part.value)
          body[part.fieldname] = part.value;
        }
        // cont++;
      }
      // console.log('natantantantananta')
      const requestObj: any = {
        authors: body.authors,
        idAdvisors: body.idAdvisors,
        title: body.title,
        typeWork: body.typeWork,
        year: Number(body.year),
        qtdPag: Number(body.qtdPag),
        description: body.description,
        idCourse: body.idCourse,
        keyWords: body.keyWords,
        ilustration: body.ilustration,
        references: body.references,
        optinalParameters: {
          cduCode: body.cduCode,
          cddCode: body.cddCode,
          file: fileBuffer?.buffer,
        },
        userId: req.userId,
      };
      console.log("ACABOU DE CHEGAR - ACADEMICWORK ROUTES");
      console.log(requestObj);
      console.log(fileBuffer);
      console.log("\n\n");
      // Agora `req.body` é do tipo IRequestAcademicWorkController
      await controller.cadastrated(requestObj, res); // Pode usar `req.body` já tipado
    } catch (error: any) {
      res.code(500).send({
        error: error.message,
        message: "Registration has failed",
      });
    }
  });

  fastify.put("/basicUpdate", { preHandler: ValidatorJWT.validateToken }, async (req: any, res: FastifyReply) => {
    console.log("\n INICIO DOS TRABALHOS DE BASIC UPDATE");
    // console.log(req);
    try {
      // ValidatorJWT.validateToken(req, res);
      // const body = req.body;
      // console.log(body);
      // console.log(req);
      await controller.basicUpdate(req, res);
    } catch (error: any) {
      res.code(500).send({ error: error.message, message: "Updation has failed" });
    }
  });

  // ANTIGO UPDATE
  fastify.post("/update", async (req, res) => {
    try {
      ValidatorJWT.validateToken(req, res);
      const parts = req.parts();
      // console.log(parts);
      const body: Record<string, any> = {};
      let fileBuffer;

      console.log("📌 Iniciando processamento do multipart...");
      // console.log(parts)
      for await (const part of parts) {
        // console.log(part)
        // console.log(`O NÚMERO DE VOLTAS FOI ${cont}`)
        // console.log("Recebido:", part);
        if (part.type === "file") {
          fileBuffer = {
            buffer: await part.toBuffer(), // Lê a stream do arquivo corretamente
          };
        } else {
          // console.log(part.value)
          body[part.fieldname] = part.value;
        }
        // cont++;
      }

      // console.log(body);
      const requestObj: IUpdateAcademicWorkUseCaseDTO = {
        authors: body.authors,
        idAdvisors: body.idAdvisors,
        title: body.title,
        typeWork: body.typeWork,
        year: Number(body.year),
        qtdPag: Number(body.qtdPag),
        description: body.description,
        idCourse: body.idCourse,
        keyWords: body.keyWords,
        ilustration: body.ilustration,
        references: body.references,
        cduCode: body.cduCode,
        cddCode: body.cddCode,
        file: fileBuffer?.buffer,
      };
      console.log(requestObj);
      await controller.update({ id: body.id, body: requestObj }, res); // Pode usar `req.body` já tipado
    } catch (error: any) {
      res.code(500).send({
        error: error.message,
        message: "Registration has failed",
      });
    }
  });

  fastify.get("/", { preHandler: ValidatorJWT.getUserId }, async (request, res) => {
    try {
      // console.log("CHEGOU NO LIST");
      // await controller.list(request, res);

      await controller.newList(request, res);
    } catch (error: any) {
      res.code(500).send({
        error: error.message,
        message: "List has failed",
      });
    }
  });

  fastify.get("/:id", { preHandler: ValidatorJWT.getUserId }, async (req, res) => {
    const { id } = req.params as { id: string }; // Pegando o parâmetro da URL
    try {
      // ValidatorJWT.validateToken(req, res);
      await controller.find(req, res);

      // Agora `req.body` é do tipo IRequestAcademicWorkController
    } catch (error: any) {
      res.code(500).send({
        error: error.message,
        message: "Get has failed",
      });
    }
  });

  fastify.get("/:id/download", async (request, res) => {
    const { id } = request.params as { id: string }; // Pegando o parâmetro da URL
    try {
      await controller.download(id, res);
      // Agora `req.body` é do tipo IRequestAcademicWorkController
    } catch (error: any) {
      res.code(500).send({
        message: "Get has failed",
        error: error.message,
      });
    }
  });

  fastify.delete("/:id/delete", { preHandler: ValidatorJWT.validateToken }, async (req, res) => {
    const { id } = req.params as { id: string }; // Pegando o parâmetro da URL
    try {
      // ValidatorJWT.validateToken(req, res);
      await controller.deleteAcademicWork(req, res);

      // Agora `req.body` é do tipo IRequestAcademicWorkController
    } catch (error: any) {
      res.code(500).send({
        error: error.message,
        message: "DELETE has failed",
      });
    }
  });

  fastify.put(
    "/defineMainAdvisor",
    { preHandler: ValidatorJWT.validateToken },
    async (req: FastifyRequest<{ Body: DefineProps }>, res: FastifyReply) => {
      console.log(req.body);
      try {
        ValidatorJWT.validateToken(req, res);
        const body = req.body;
        await controller.defineMainAdvisor(body, res);
      } catch (error: any) {
        res.code(500).send({ error: error.message, message: "Updation has failed" });
      }
    }
  );

  // fastify.post(
  //   "/uploadFile",
  //   { preHandler: ValidatorJWT.validateToken },
  //   async (req: FastifyRequest<{ Body: UpdateAcademicWorkBasicInfoPROPS }>, res: FastifyReply) => {
  //     try {
  //       // ValidatorJWT.validateToken(req, res);
  //     } catch (error) {}
  //   }
  // );

  fastify.post("/addAdvisor", { preHandler: ValidatorJWT.validateToken }, async (req: any, res: FastifyReply) => {
    console.log(req.body);
    try {
      // ValidatorJWT.validateToken(req, res);
      const body = req.body;
      body.userId = req.userId;
      await controller.addAdvisor(body, res);
    } catch (error: any) {
      res.code(500).send({ error: error.message, message: "Add advsior has failed" });
    }
  });

  fastify.post(
    "/changeVisibility",
    { preHandler: ValidatorJWT.validateToken },
    async (req: FastifyRequest<{ Body: { id: string } }>, res: FastifyReply) => {
      console.log(req.body);
      try {
        // const body = req.body;
        // ValidatorJWT.validateToken(req, res);
        await controller.changeVisibility(req, res);
      } catch (error: any) {
        res.code(500).send({ error: error.message, message: "Change visibility has failed" });
      }
    }
  );

  fastify.delete("/deleteAdvisor", { preHandler: ValidatorJWT.validateToken }, async (req: any, res: FastifyReply) => {
    // console.log(req.body);
    try {
      // ValidatorJWT.validateToken(req, res);
      const body = req.body;
      body.userId = req.userId;
      await controller.delAdvisor(body, res);
    } catch (error: any) {
      res.code(500).send({ error: error.message, message: "Add advsior has failed" });
    }
  });

  fastify.get("/listAdvisors", async (req: any, res: any) => {});
}
