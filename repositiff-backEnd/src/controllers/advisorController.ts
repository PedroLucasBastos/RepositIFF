import { CreateAdvisorUseCase } from "@src/domain/application/advisor-useCases/createAdvisor-useCase.js";
import { AdvisorProps } from "@src/domain/entities/advisor.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateAdvisorPropsDTO, UpdateAdvisorUseCase } from '@src/domain/application/advisor-useCases/updateAdvisor.js';
import { deleteAdvisor, DeleteAdvisorUseCase } from "@src/domain/application/advisor-useCases/deleteAdvisor-useCase.js";


export class AdvisorController {
    async create(
        req: FastifyRequest<{ Body: AdvisorProps }>,
        res: FastifyReply
    ): Promise<void> {
        console.log("Chegou aki")
        const sanitizeOrError = this.sanitizeReceivedData(req.body);
        if (sanitizeOrError.isLeft())
            res.code(400).send({
                Error: sanitizeOrError.value
            });
        const { name, surname, registrationNumber } = req.body;
        const repo = new PrismaAdvisorRepository();
        const createUseCase = new CreateAdvisorUseCase(repo);
        const resultOrError = await createUseCase.execute({
            name: name,
            surname: surname,
            registrationNumber: registrationNumber,
        });
        if (resultOrError.isLeft())
            return res.code(400).send({
                Message: "Dont be possible registred a advisor",
                Error: resultOrError.value.show
            })
        return res.code(201).send({
            Message: "Advisor registred"
        });
    }

    async update(
        req: FastifyRequest<{ Body: UpdateAdvisorPropsDTO }>,
        res: FastifyReply): Promise<void> {
        const idAdvisor = req.body.advisorIdentification;
        const fields = req.body.updateFields

        const sanitizeIdOrError = this.sanitizeReceivedData(idAdvisor);
        if (sanitizeIdOrError.isLeft())
            res.code(400).send({
                Error: "Advisor Identification must be provided"
            });

        const sanitizeFieldsOrError = this.sanitizeReceivedDataToUpdateFields(fields);
        if (sanitizeFieldsOrError.isLeft())
            res.code(400).send({
                Error: sanitizeFieldsOrError.value
            });

        const repo = new PrismaAdvisorRepository();
        const updateUseCase = new UpdateAdvisorUseCase(repo);
        const updateOrError = await updateUseCase.execute({
            advisorIdentification: idAdvisor,
            updateFields: fields
        })
        if (updateOrError.isLeft())
            res.code(400).send({
                error: updateOrError.value
            })
        res.code(200).send({
            Message: "Advisor is updated"
        })
    }

    async delete(
        req: FastifyRequest<{ Body: deleteAdvisor }>,
        res: FastifyReply
    ): Promise<void> {
        const advisorIdentification = req.body.advisorIdentification
        const sanitizeOrError = this.sanitizeReceivedData(advisorIdentification);
        if (sanitizeOrError.isLeft())
            res.code(400).send({
                Error: sanitizeOrError.value
            });
        const repo = new PrismaAdvisorRepository()
        const deleteUseCase = new DeleteAdvisorUseCase(repo);
        const deleteOrError = await deleteUseCase.execute({ advisorIdentification });
        if (deleteOrError.isLeft())
            res.code(400).send({
                Message: "Unable to delete advisor",
                Error: deleteOrError.value
            })
        res.code(200).send({
            Message: "Advisor has be deleted"
        })
    }

    async listAllAdvisors(
        res: FastifyReply
    ) {
        const repo = new PrismaAdvisorRepository();
        const listAdvisor = await repo.listAllAdvisors();
        const countAdvisor = await repo.countAllAdvisors();
        res.code(200).send({
            Qtd: countAdvisor.value,
            Advisors: listAdvisor
        })
    }


    sanitizeReceivedData(request: any): Either<string, void> {
        const parameters = Object.entries(request)
            .filter(([key, value]) => value === undefined);
        if (parameters.length > 0)
            return new Left("All parameters must be provided");
        return new Right(undefined);
    }
    sanitizeReceivedDataToUpdateFields(request: any): Either<string, void> {
        const parameters = Object.entries(request)
            .filter(([key, value]) => value !== undefined);
        if (parameters.length === 0)
            return new Left("Any of the 3 fields must be provided.");
        return new Right(undefined);
    }
}