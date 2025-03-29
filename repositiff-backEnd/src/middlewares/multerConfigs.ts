import multer from "fastify-multer";
import { FastifyRequest, FastifyReply } from "fastify";
import { IRequestAcademicWorkController } from "@src/controllers/academicWorkController.js";

// Configuração para armazenar o arquivo na memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = upload.single("file");


// Defina o tipo `File` da maneira correta
export interface MulterRequest extends FastifyRequest {
    body: IRequestAcademicWorkController;
    file?: Express.Multer.File; // Usando o tipo correto do multer para Express
}
export async function multerMapper(
    req: MulterRequest, // Tipo correto do req
    res: FastifyReply,
    done: Function
) {
    try {
        const formattedBody: IRequestAcademicWorkController = {
            authors: Array.isArray(req.body.authors) ? req.body.authors : JSON.parse(req.body.authors || "[]"),
            idAdvisors: Array.isArray(req.body.idAdvisors) ? req.body.idAdvisors : JSON.parse(req.body.idAdvisors || "[]"),
            title: req.body.title || "",
            type: req.body.type || "",
            year: Number(req.body.year) || 0,
            qtdPag: Number(req.body.qtdPag) || 0,
            description: req.body.description || "",
            idCourse: req.body.idCourse || "",
            keyWords: Array.isArray(req.body.keyWords) ? req.body.keyWords : JSON.parse(req.body.keyWords || "[]"),
            ilustration: req.body.ilustration || "",
            references: Array.isArray(req.body.references) ? req.body.references.map(Number) : JSON.parse(req.body.references || "[]").map(Number),
            cduCode: req.body.cduCode,
            cddCode: req.body.cddCode,
            file: req.file?.buffer || undefined, // Lógica de buffer do arquivo
        };

        // Substituindo o req.body pelo objeto formatado
        req.body = formattedBody as any;
        done();
    } catch (error) {
        console.error("Erro ao mapear o request:", error);
        return res.status(500).send({ error: "Error processing request data" });
    }
}