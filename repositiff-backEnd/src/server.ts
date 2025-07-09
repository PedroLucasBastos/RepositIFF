import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import appRoutes from "@src/routes.js";
import * as dotenv from "dotenv";

dotenv.config();
const app = fastify();
const PORT = process.env.PORT || 1111;

// Registra o suporte para multipart/form-data **antes das rotas**
app.register(fastifyMultipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Configura o CORS
app.register(cors, {
  origin: [process.env.URL_ACCEPTED || ""],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Registra as rotas depois de configurar os plugins
app.register(appRoutes);

// app.post('/test', async (req, reply) => {
//     try {
//         if (!req.isMultipart()) {
//             return reply.status(400).send({ error: 'A requisição precisa ser multipart/form-data' });
//         }
//         const parts = req.parts();
//         console.log(parts)
//         const body: Record<string, any> = {};
//         let fileBuffer;

//         console.log("📌 Iniciando processamento do multipart...");
//         // console.log(parts.)
//         let cont = 1;
//         for await (const part of parts) {
//             // console.log(part)
//             // console.log(`O NÚMERO DE VOLTAS FOI ${cont}`)
//             // console.log("Recebido:", part);
//             if (part.type === 'file') {
//                 fileBuffer = {
//                     buffer: await part.toBuffer(), // Lê a stream do arquivo corretamente
//                 };
//             } else {
//                 // console.log(part.value)
//                 body[part.fieldname] = part.value;
//             }
//             // cont++;
//         }

//         const requestObj: IRequestAcademicWorkController = {
//             authors: body.authors,
//             idAdvisors: body.idAdvisors,
//             title: body.title,
//             type: body.type,
//             year: body.year,
//             qtdPag: body.qtdPag,
//             description: body.description,
//             idCourse: body.idCourse,
//             keyWords: body.keyWords,
//             ilustration: body.ilustration,
//             references: body.references,
//             optinalParameters: {
//                 file: fileBuffer?.buffer
//             }
//         }

//         // console.log("📌 Processamento finalizado.");
//         console.log("📌 Body:", body);
//         // console.log("📌 Arquivo:", file?.filename);
//         console.log(fileBuffer)
//         reply.send({
//             message: 'Arquivo recebido com sucesso!',
//             body,
//             file: fileBuffer || null
//         });
//     } catch (error) {
//         console.error("❌ Erro ao processar multipart:", error);
//         reply.status(500).send({ error: 'Erro interno no servidor' });
//     }
// });

app.listen({ port: Number(PORT) }).then(() => {
  console.log(`Http Server running in PORT -> ${PORT}`);
});
