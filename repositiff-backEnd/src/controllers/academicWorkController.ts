import { CreateProjectUseCase } from "@src/domain/application/academicWork-useCases/createAcademicWork-useCase.js";
import { DownloadFileUseCase } from "@src/domain/application/academicWork-useCases/dowloadFile-use-case.ts.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { CloudFlareFileStorage } from "@src/infra/fileStorage/cloudFlare-fileStorage.js";
import { PrismaAcademicWorkRepository } from "@src/infra/repositories/prisma/prisma-academicWork-repository.js";
import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export interface IRequestAcademicWorkController {
    authors: string[],
    idAdvisors: string[],
    title: string,
    type: string,
    year: number,
    qtdPag: number,
    description: string,
    idCourse: string,
    keyWords: string[],
    ilustration: string,
    references: number[],
    optinalParameters: {
        cduCode?: string,
        cddCode?: string,
        file?: Buffer
    }
}
export class academicWorkController {
    async cadastrated(
        req: IRequestAcademicWorkController,
        res: FastifyReply
    ): Promise<void> {
        // console.log(req);

        const resultSanitize = this.sanitizeReceivedData(req);
        if (resultSanitize.isLeft()) {
            return res.status(400).send({
                Error: "ERROR_WITH_SINTAX_REQUEST",
                detail: resultSanitize.value
            });
        }

        const repo = new PrismaAcademicWorkRepository();
        const courseRepo = new PrismaCourseRepostory();
        const advisorRepo = new PrismaAdvisorRepository();
        const flare = new CloudFlareFileStorage();
        const useCase = new CreateProjectUseCase(
            repo,
            advisorRepo,
            courseRepo,
            flare
        )

        const result = await useCase.execute({
            authors: req.authors,
            idAdvisors: req.idAdvisors,
            title: req.title,
            type: req.type,
            year: req.year,
            qtdPag: req.qtdPag,
            description: req.description,
            idCourse: req.idCourse,
            keyWords: req.keyWords,
            ilustration: req.ilustration,
            references: req.references,
            cddCode: req.optinalParameters.cddCode,
            cduCode: req.optinalParameters.cduCode,
            file: req.optinalParameters.file
        })

        if (result.isLeft())
            return res.status(400).send({
                Error: result.value
            });

        res.code(200).send({
            isRight: result,
            Message: "DEU BOM AKI",
        });


    }

    async list(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const repo = await new PrismaAcademicWorkRepository().listAllProjects();
        console.log("askldjfasdfasdjkfasdfa")
        console.log(repo)
        res.code(200).send({
            result: repo
        });
    }

    async find(
        req: string,
        res: FastifyReply
    ): Promise<void> {
        const repo = new PrismaAcademicWorkRepository();
        const academicWork = await repo.findByIdDoc(req);
        if (!academicWork) {
            res.code(400).send({
                Error: "AcademicWork not found"
            })
        }
        res.code(200).send({
            result: academicWork
        });
    }


    async download(
        req: string,
        res: FastifyReply
    ): Promise<void> {
        const repo = new PrismaAcademicWorkRepository();
        const flare = new CloudFlareFileStorage();
        const useCase = new DownloadFileUseCase(repo, flare);
        const result = await useCase.execute(req);
        if ((result).isLeft()) {
            res.code(400).send({
                Error: result
            })
        }
        res.code(200).send({
            result: result
        });
    }


    sanitizeReceivedData(request: IRequestAcademicWorkController): Either<string, void> {
        const { optinalParameters, ...parameters } = request;
        const verify = Object.entries(parameters)
            .filter(([key, value]) => value === undefined);
        if (verify.length > 0)
            return new Left("All parameters must be provided");
        // console.log(request);
        const {
            authors,
            idAdvisors,
            title,
            type,
            year,
            qtdPag,
            description,
            idCourse,
            keyWords,
            ilustration,
            references,
        } = request;

        // Validate authors
        if (!Array.isArray(authors) || authors.some((author) => typeof author !== 'string')) {
            return new Left('Authors must be an array of strings.');
        }

        // Validate idAdvisors
        if (!Array.isArray(idAdvisors) || idAdvisors.some((id) => typeof id !== 'string')) {
            console.log(idAdvisors[0]);
            console.log(Array.isArray(idAdvisors));
            return new Left('Advisors must be an array of strings.');
        }

        // Validate title
        if (typeof title !== 'string') {
            return new Left('Title must be a string.');
        }

        // Validate type
        if (typeof type !== 'string') {
            return new Left('Type must be a string.');
        }

        // Validate year
        if (typeof year !== 'number' || isNaN(year)) {
            return new Left('Year must be a number.');
        }

        // Validate qtdPag
        if (typeof qtdPag !== 'number' || isNaN(qtdPag)) {
            return new Left('Page count must be a number.');
        }

        // Validate description
        if (typeof description !== 'string') {
            return new Left('Description must be a string.');
        }

        // Validate idCourse
        if (typeof idCourse !== 'string') {
            return new Left('Course ID must be a string.');
        }

        // Validate keyWords
        if (!Array.isArray(keyWords) || keyWords.some((keyword) => typeof keyword !== 'string')) {
            return new Left('Keywords must be an array of strings.');
        }

        // Validate ilustration

        if (typeof ilustration !== 'string') {
            return new Left('Illustration must be a string.');
        }

        // Validate references
        if (!Array.isArray(references) || references.some((reference) => typeof reference !== 'number')) {
            return new Left('References must be an array of numbers.');
        }

        // Validate cduCode (optional)
        if (optinalParameters.cduCode && typeof optinalParameters.cduCode !== 'string') {
            return new Left('CDU code, if provided, must be a string.');
        }

        // Validate cddCode (optional)
        if (optinalParameters.cddCode && typeof optinalParameters.cddCode !== 'string') {
            return new Left('CDD code, if provided, must be a string.');
        }

        // Validate file (optional)
        if (optinalParameters.file && !(optinalParameters.file instanceof Buffer)) {
            return new Left('File, if provided, must be an instance of File.');
        }

        return new Right(undefined);
    }
}