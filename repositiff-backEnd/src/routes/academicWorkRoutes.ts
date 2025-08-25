import { academicWorkController, IRequestAcademicWorkController } from "@src/controllers/academicWorkController.js";
import { IUpdateAcademicWorkUseCaseDTO } from "@src/domain/application/academicWork-useCases/updateAcademicWork-use-case.js";
import { UpdateAcademicWorkBasicInfoPROPS } from "@src/domain/application/academicWork-useCases/UpdateAcademicWorkBasicInfoUse_case.js";
import { AddAdvisorToAcademicWorkProps } from "@src/domain/application/academicWork_Advisors-useCases/addAdvisorToAcademickWork-useCase.js";
import { IDelAdvisorProps } from "@src/domain/application/academicWork_Advisors-useCases/delAdvisorToAcademicWork-useCase.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import multipart from "@fastify/multipart";
import { DefineProps } from "@src/domain/application/academicWork_Advisors-useCases/defineMainAdvisor-use-case.js";

export async function academicWorkRoutes(fastify: FastifyInstance) {
  const controller = new academicWorkController();
  // Define a rota que recebe o arquivo

  //   fastify.register(multipart, {
  //     limits: {
  //       fileSize: 50 * 1024 * 1024, // 50MB
  //     },
  //   });

  fastify.post("/create", async (req, res) => {
    try {
      const parts = req.parts();
      console.log(parts);
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
      const requestObj: IRequestAcademicWorkController = {
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

  fastify.put(
    "/basicUpdate",
    async (req: FastifyRequest<{ Body: UpdateAcademicWorkBasicInfoPROPS }>, res: FastifyReply) => {
      console.log("\n INICIO DOS TRABALHOS DE BASIC UPDATE");
      console.log(req.body);
      try {
        const body = req.body;
        await controller.basicUpdate(body, res);
      } catch (error: any) {
        res.code(500).send({ error: error.message, message: "Updation has failed" });
      }
    }
  );

  // ANTIGO UPDATE
  fastify.post("/update", async (req, res) => {
    try {
      const parts = req.parts();
      console.log(parts);
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

      console.log(body);
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

  fastify.get("/", async (request, res) => {
    try {
      await controller.list(request, res);
    } catch (error: any) {
      res.code(500).send({
        error: error.message,
        message: "List has failed",
      });
    }
  });

  fastify.get("/:id", async (request, res) => {
    const { id } = request.params as { id: string }; // Pegando o parâmetro da URL
    try {
      await controller.find(id, res);

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

  fastify.delete("/:id/delete", async (request, res) => {
    const { id } = request.params as { id: string }; // Pegando o parâmetro da URL
    try {
      await controller.deleteAcademicWork(id, res);

      // Agora `req.body` é do tipo IRequestAcademicWorkController
    } catch (error: any) {
      res.code(500).send({
        error: error.message,
        message: "DELETE has failed",
      });
    }
  });

  fastify.put("/defineMainAdvisor", async (req: FastifyRequest<{ Body: DefineProps }>, res: FastifyReply) => {
    console.log(req.body);
    try {
      const body = req.body;
      await controller.defineMainAdvisor(body, res);
    } catch (error: any) {
      res.code(500).send({ error: error.message, message: "Updation has failed" });
    }
  });

  fastify.post(
    "/uploadFile",
    async (req: FastifyRequest<{ Body: UpdateAcademicWorkBasicInfoPROPS }>, res: FastifyReply) => {}
  );

  fastify.post(
    "/addAdvisor",
    async (req: FastifyRequest<{ Body: AddAdvisorToAcademicWorkProps }>, res: FastifyReply) => {
      console.log(req.body);
      try {
        const body = req.body;
        await controller.addAdvisor(body, res);
      } catch (error: any) {
        res.code(500).send({ error: error.message, message: "Add advsior has failed" });
      }
    }
  );

  fastify.post("/deleteAdvisor", async (req: FastifyRequest<{ Body: IDelAdvisorProps }>, res: FastifyReply) => {
    console.log(req.body);
    try {
      const body = req.body;
      await controller.delAdvisor(body, res);
    } catch (error: any) {
      res.code(500).send({ error: error.message, message: "Add advsior has failed" });
    }
  });

  fastify.get("/listAdvisors", async (req: any, res: any) => {});
}
