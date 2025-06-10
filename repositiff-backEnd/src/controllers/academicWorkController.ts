import { CreateProjectUseCase } from "@src/domain/application/academicWork-useCases/createAcademicWork-useCase.js";
import { DownloadFileUseCase } from "@src/domain/application/academicWork-useCases/dowloadFile-use-case.ts.js";
import { Either, Left, right, Right } from "@src/error_handling/either.Funcional.js";
import { CloudFlareFileStorage } from "@src/infra/fileStorage/cloudFlare-fileStorage.js";
import { PrismaAcademicWorkRepository } from "@src/infra/repositories/prisma/prisma-academicWork-repository.js";
import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { J } from "vitest/dist/chunks/reporters.66aFHiyX.js";
import { IUpdateAcademicWorkUseCaseDTO, UpdateAcademicWork_useCase } from '@src/domain/application/academicWork-useCases/updateAcademicWork-use-case.js';
import { typeWork } from '@src/domain/entities/academicWork.js';
import { UpdateAcademicWorkBasicInfoPROPS, UpdateAcademicWorkBasicInfoUseCase } from "@src/domain/application/academicWork-useCases/UpdateAcademicWorkBasicInfoUse_case.js";
import { AddAdvisorToAcademicWorkProps, AddAdvisorToAcademicWorkUseCase } from "@src/domain/application/academicWork_Advisors-useCases/addAdvisorToAcademickWork-useCase.js";
import { DelAdvisorInAcademicWorkUseCase, IDelAdvisorProps } from "@src/domain/application/academicWork_Advisors-useCases/delAdvisorToAcademicWork-useCase.js";
import { DefineMainAdvisorUseCase, DefineProps } from "@src/domain/application/academicWork_Advisors-useCases/defineMainAdvisor-use-case.js";

export interface IRequestAcademicWorkController {
    authors: string[],
    idAdvisors: string[],
    title: string,
    typeWork: string,
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

export interface IUpdateRouteRequest {
    id: string,
    body: IUpdateAcademicWorkUseCaseDTO
}

// interface IReque
export class academicWorkController {
    async cadastrated(
        req: IRequestAcademicWorkController,
        res: FastifyReply
    ): Promise<void> {
        // console.log(req);

        const resultSanitize = this.sanitizeReceivedDataToAdd(req);
        if (resultSanitize.isLeft()) {
            return res.status(400).send({
                Error: "ERROR_WITH_SINTAX_REQUEST",
                detail: resultSanitize.value
            });
        }
        const parameters = resultSanitize.value;

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
        console.log("PARAMETROS DO CONTROLLER")
        console.log(parameters)
        const result = await useCase.execute({

            authors: parameters.authors,
            idAdvisors: parameters.idAdvisors,
            title: parameters.title,
            typeWork: parameters.typeWork,
            year: parameters.year,
            qtdPag: parameters.qtdPag,
            description: parameters.description,
            idCourse: parameters.idCourse,
            keyWords: parameters.keyWords,
            ilustration: parameters.ilustration,
            references: parameters.references,
            cddCode: parameters.optinalParameters.cddCode,
            cduCode: parameters.optinalParameters.cduCode,
            file: parameters.optinalParameters.file
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

    async basicUpdate(req: UpdateAcademicWorkBasicInfoPROPS, res: FastifyReply): Promise<void> {
        const { id, fields } = req;

        const resultSanitize = this.sanitizeReceivedDataToUpdateBasicInfo(req);
        if (resultSanitize.isLeft()) {
            return res.status(400).send({
                Error: "ERROR_WITH_SINTAX_REQUEST",
                detail: resultSanitize.value
            });
        }

        const repo = new PrismaAcademicWorkRepository();
        const useCase = new UpdateAcademicWorkBasicInfoUseCase(
            repo
        )

        const result = await useCase.execute({ id, fields });

        if (result.isLeft())
            return res.status(400).send({
                Error: result.value
            });

        res.code(200).send({
            isRight: result,
            Message: "DEU BOM AKI",
        });
    }


    async addAdvisor(req: AddAdvisorToAcademicWorkProps, res: FastifyReply): Promise<void> {

        const repo = new PrismaAcademicWorkRepository();
        const useCase = new AddAdvisorToAcademicWorkUseCase(
            repo
        )

        // const { id, academicWorkId, advisorId, isMain } = req;

        const result = await useCase.execute({
            academicWorkId: req.academicWorkId,
            advisorId: req.advisorId,
            isMain: req.isMain,
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


    async delAdvisor(req: IDelAdvisorProps, res: FastifyReply): Promise<void> {
        const repo = new PrismaAcademicWorkRepository();
        const useCase = new DelAdvisorInAcademicWorkUseCase(
            repo
        )

        // const { id, academicWorkId, advisorId, isMain } = req;

        const result = await useCase.execute({
            academicWorkId: req.academicWorkId,
            advisorId: req.advisorId,
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

    async defineMainAdvisor(req: DefineProps, res: FastifyReply): Promise<void> {
        const repo = new PrismaAcademicWorkRepository();
        const useCase = new DefineMainAdvisorUseCase(
            repo
        )

        // const { id, academicWorkId, advisorId, isMain } = req;

        const result = await useCase.execute({
            academicWorkId: req.academicWorkId,
            advisorId: req.advisorId,
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

    async update(req: IUpdateRouteRequest, res: FastifyReply): Promise<void> {
        console.log("COMEÇOU A ROTA AKIIIIIIIIIIIIII")
        console.log("req")
        console.log(req)
        const { id, body } = req;
        console.log(`id ${id}`)
        console.log(`body ${body}`)
        const resultSanitize = this.sanitizeReceivedDataToUpdate(body);
        if (resultSanitize.isLeft()) {
            return res.status(400).send({
                Error: "ERROR_WITH_SINTAX_REQUEST",
                detail: resultSanitize.value
            });
        }

        console.log("Depois de sanitizar");
        const parameters = resultSanitize.value;
        const repo = new PrismaAcademicWorkRepository();
        const flare = new CloudFlareFileStorage();
        const useCase = new UpdateAcademicWork_useCase(
            repo,
            flare
        )

        console.log("Parameters abaixo")
        console.log(parameters)
        console.log("ANTES DO USE CASE");

        const result = await useCase.execute(
            parameters, id
        )

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


    sanitizeReceivedDataToUpdateBasicInfo(request: any): Either<string, void> {
        const { id, fields } = request;
        const {
            authors,
            title,
            workType,
            year,
            pageCount,
            description,
            courseId,
            keyWords,
            ilustration,
            references,
            cduCode,
            cddCode,
        } = fields;


        if (!id) {
            return new Left('ID must be provided.');
        }
        // Validate authors
        const parseAuthors = authors ? JSON.parse(authors) : "";
        if (authors && (!Array.isArray(parseAuthors) || parseAuthors.some((author) => typeof author !== 'string'))) {
            return new Left('Authors must be an array of strings.');
        }


        // Validate title
        if (title && typeof title !== 'string') {
            return new Left('Title must be a string.');
        }

        // Validate type
        console.log("AKASIEKDASFJWEASDF")
        console.log(typeof typeWork)
        if (typeWork && typeof typeWork !== 'string') {
            return new Left('Type must be a string.ASDFASDFASD');
        }

        // Validate year

        if (year && (typeof year !== 'number' || isNaN(year))) {
            return new Left(`Year must be a number. Value: ${(year && typeof year !== 'number' || isNaN(year))
                } `);
        }

        // Validate qtdPag
        if (pageCount && (typeof pageCount !== 'number' || isNaN(pageCount))) {
            return new Left('Page count must be a number.');
        }

        // Validate description
        if (description && typeof description !== 'string') {
            return new Left('Description must be a string.');
        }

        // Validate idCourse
        if (courseId && typeof courseId !== 'string') {
            return new Left('Course ID must be a string.');
        }

        // Validate keyWords
        const parseKeyWords = keyWords ? JSON.parse(keyWords) : "";
        if (keyWords && (!Array.isArray(parseKeyWords) || parseKeyWords.some((keyword) => typeof keyword !== 'string'))) {
            return new Left('Keywords must be an array of strings.');
        }

        // Validate ilustration

        if (ilustration && typeof ilustration !== 'string') {
            return new Left('Illustration must be a string.');
        }

        // Validate references
        const parseReferences = references ? JSON.parse(references) : "";
        if (references && (!Array.isArray(parseReferences) || parseReferences.some((reference) => typeof reference !== 'number'))) {
            return new Left('References must be an array of numbers.');
        }
        // console.log("antes da verificação do cdu")
        // console.log(cduCode)
        // Validate cduCode (optional)

        // if (cduCode && typeof cduCode !== "string") {
        //     return new Left("CDU code, if provided, must be a string");
        // }

        if (cduCode && typeof cduCode !== 'string') {
            return new Left(`CDU code, if provided, must be a string.CDU: ${cduCode} `);
        }

        // Validate cddCode (optional)
        if (cddCode && typeof cddCode !== 'string') {
            return new Left('CDD code, if provided, must be a string.');
        }
        return new Right(undefined);
    }

    sanitizeReceivedDataToUpdate(request: any): Either<string, IUpdateAcademicWorkUseCaseDTO> {
        // const { ...parameters } = request;
        // const verify = Object.entries(parameters)
        //     .filter(([key, value]) => value === undefined);
        // if (verify.length > 0)
        //     return new Left("All parameters must be provided");
        // console.log(request);
        const {
            authors,
            idAdvisors,
            title,
            typeWork,
            year,
            qtdPag,
            description,
            idCourse,
            keyWords,
            ilustration,
            references,
            cduCode,
            cddCode,
            file
        } = request;

        // Validate authors
        const parseAuthors = authors ? JSON.parse(authors) : "";
        if (authors && (!Array.isArray(parseAuthors) || parseAuthors.some((author) => typeof author !== 'string'))) {
            return new Left('Authors must be an array of strings.');
        }

        // Validate idAdvisors
        const parseidAdvisors = idAdvisors ? JSON.parse(idAdvisors) : "";
        if (idAdvisors && (!Array.isArray(parseidAdvisors) || parseidAdvisors.some((id) => typeof id !== 'string'))) {
            console.log(parseidAdvisors[0]);
            console.log(Array.isArray(parseidAdvisors));
            return new Left('Advisors must be an array of strings.');
        }

        // Validate title
        if (title && typeof title !== 'string') {
            return new Left('Title must be a string.');
        }

        // Validate type
        console.log("AKASIEKDASFJWEASDF")
        console.log(typeof typeWork)
        if (typeWork && typeof typeWork !== 'string') {
            return new Left('Type must be a string.ASDFASDFASD');
        }

        // Validate year

        if (year && (typeof year !== 'number' || isNaN(year))) {
            return new Left(`Year must be a number. Value: ${(year && typeof year !== 'number' || isNaN(year))
                } `);
        }

        // Validate qtdPag
        if (qtdPag && (typeof qtdPag !== 'number' || isNaN(qtdPag))) {
            return new Left('Page count must be a number.');
        }

        // Validate description
        if (description && typeof description !== 'string') {
            return new Left('Description must be a string.');
        }

        // Validate idCourse
        if (idCourse && typeof idCourse !== 'string') {
            return new Left('Course ID must be a string.');
        }

        // Validate keyWords
        const parseKeyWords = keyWords ? JSON.parse(keyWords) : "";
        if (keyWords && (!Array.isArray(parseKeyWords) || parseKeyWords.some((keyword) => typeof keyword !== 'string'))) {
            return new Left('Keywords must be an array of strings.');
        }

        // Validate ilustration

        if (ilustration && typeof ilustration !== 'string') {
            return new Left('Illustration must be a string.');
        }

        // Validate references
        const parseReferences = references ? JSON.parse(references) : "";
        if (references && (!Array.isArray(parseReferences) || parseReferences.some((reference) => typeof reference !== 'number'))) {
            return new Left('References must be an array of numbers.');
        }
        // console.log("antes da verificação do cdu")
        // console.log(cduCode)
        // Validate cduCode (optional)

        // if (cduCode && typeof cduCode !== "string") {
        //     return new Left("CDU code, if provided, must be a string");
        // }

        if (cduCode && typeof cduCode !== 'string') {
            return new Left(`CDU code, if provided, must be a string.CDU: ${cduCode} `);
        }

        // Validate cddCode (optional)
        if (cddCode && typeof cddCode !== 'string') {
            return new Left('CDD code, if provided, must be a string.');
        }

        // Validate file (optional)
        if (file && !(file instanceof Buffer)) {
            return new Left('File, if provided, must be an instance of File.');
        }

        return new Right({
            authors: parseAuthors,
            idAdvisors: parseidAdvisors,
            title,
            year,
            qtdPag,
            description,
            idCourse,
            keyWords: parseKeyWords,
            ilustration,
            references: parseReferences,
            cduCode: cduCode,
            cddCode: cddCode,
            typeWork: typeWork,
            file: file,
        })
    }
    sanitizeReceivedDataToAdd(request: any): Either<string, IRequestAcademicWorkController> {
        console.log(request)
        const { optinalParameters, ...parameters } = request;
        const verify = Object.entries(parameters)
            .filter(([key, value]) => value === undefined);
        if (verify.length > 0)
            return new Left("All parameters must be provided");
        console.log(request);
        const {
            authors,
            idAdvisors,
            title,
            typeWork,
            year,
            qtdPag,
            description,
            idCourse,
            keyWords,
            ilustration,
            references,
        } = request;

        // Validate authors
        const parseAuthors = JSON.parse(authors);
        if (!Array.isArray(parseAuthors) || parseAuthors.some((author) => typeof author !== 'string')) {
            return new Left('Authors must be an array of strings.');
        }

        // Validate idAdvisors
        const parseidAdvisors = JSON.parse(idAdvisors);
        if (!Array.isArray(parseidAdvisors) || parseidAdvisors.some((id) => typeof id !== 'string')) {
            console.log(parseidAdvisors[0]);
            console.log(Array.isArray(parseidAdvisors));
            return new Left('Advisors must be an array of strings.');
        }

        // Validate title
        if (typeof title !== 'string') {
            return new Left('Title must be a string.');
        }

        // Validate type
        if (typeof typeWork !== 'string') {
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
        const parseKeyWords = JSON.parse(keyWords);
        if (!Array.isArray(parseKeyWords) || parseKeyWords.some((keyword) => typeof keyword !== 'string')) {
            return new Left('Keywords must be an array of strings.');
        }

        // Validate ilustration

        if (typeof ilustration !== 'string') {
            return new Left('Illustration must be a string.');
        }

        // Validate references
        const parseReferences = JSON.parse(references);
        if (!Array.isArray(parseReferences) || parseReferences.some((reference) => typeof reference !== 'number')) {
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

        return new Right({
            authors: parseAuthors,
            idAdvisors: parseidAdvisors,
            title,
            year,
            qtdPag,
            typeWork: typeWork,
            description,
            idCourse,
            keyWords: parseKeyWords,
            ilustration,
            references: parseReferences,
            optinalParameters: {
                cduCode: optinalParameters.cduCode,
                cddCode: optinalParameters.cddCode,
                file: optinalParameters.file
            }
        });
    }
}