import { academicWorkController, IRequestAcademicWorkController } from "@src/controllers/academicWorkController.js";
import { FastifyInstance } from "fastify";

export async function academicWorkRoutes(fastify: FastifyInstance) {
    const controller = new academicWorkController();

    // Define a rota que recebe o arquivo
    fastify.post(
        "/upload",
        async (req, res) => {
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
                    if (part.type === 'file') {
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
                    type: body.type,
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
                        file: fileBuffer?.buffer
                    }
                }
                // Agora `req.body` é do tipo IRequestAcademicWorkController
                await controller.cadastrated(requestObj, res); // Pode usar `req.body` já tipado
            } catch (error: any) {
                res.code(500).send({
                    error: error.message,
                    message: 'Registration has failed'
                });
            }
        }
    );

    fastify.get(
        "/",
        async (request, res) => {
            try {
                await controller.list(request, res);
                // Agora `req.body` é do tipo IRequestAcademicWorkController
            } catch (error: any) {
                res.code(500).send({
                    error: error.message,
                    message: 'List has failed'
                });
            }
        });


    fastify.get(
        "/:id",
        async (request, res) => {
            const { id } = request.params as { id: string }; // Pegando o parâmetro da URL
            try {
                await controller.download(id, res);

                // Agora `req.body` é do tipo IRequestAcademicWorkController
            } catch (error: any) {
                res.code(500).send({
                    error: error.message,
                    message: 'Registration has failed'
                });
            }
        });
}
