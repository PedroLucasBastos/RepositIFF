import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { it, expect, describe } from "vitest";
import { CreateAdvisorUseCase } from "../createAdvisor-useCase.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { Advisor } from "@src/domain/entities/advisor.js";
import { AdvisorsProducts } from "./advisorsProducts.js";
import { DeleteAdvisorUseCase } from "../deleteAdvisor-useCase.js";
import { UpdateAdvisorUseCase } from "../updateAdvisor.js";
import { IAdvisorRepository } from '@src/infra/repositories/IAdvisorRepository.js';

// validar número de matricula (Ex: 1278884)


describe("Test the guiding actor use cases", () => {
    const repo = new PrismaAdvisorRepository();
    it("Should ble able to create and registred a dvisor in database", async () => {
        const useCase = new CreateAdvisorUseCase(repo);
        const advisorValid = AdvisorsProducts.valid();

        const advisorUseCaseOrError = await useCase.execute(advisorValid);

        if (advisorUseCaseOrError.isLeft()) {
            throw (advisorUseCaseOrError.value);
        }
        let advisor = advisorUseCaseOrError.value as Advisor

        const advisorExisting = await repo.findAdvisorById(
            advisor.id
        )
        expect(advisorExisting).toBeTruthy();
        expect(advisor.name).toEqual(advisorValid.name);
        expect(advisor.surname).toEqual(advisorValid.surname);
        expect(advisor.registrationNumber).toEqual(advisorValid.registrationNumber);

    })
    it("Should not be able to register a new advisor with a registration number that is already in use", async () => {
        const useCase = new CreateAdvisorUseCase(repo);
        const advisorRegistratonNumberInvalid = AdvisorsProducts.duplicateRegistrationNumber();
        const advisorUseCaseOrError = await useCase.execute(advisorRegistratonNumberInvalid);

        expect(advisorUseCaseOrError.isLeft).toBeTruthy();
        const errorDomain = advisorUseCaseOrError.value as DomainError;
        expect(errorDomain).toBeInstanceOf(DomainError);
        expect(errorDomain.name).toEqual("ApplicationError");
        expect(errorDomain.details).toEqual("Advisor already exists on the platform");

    });


    it("It should be able to update the surname of a supervisor registered in the database", async () => {
        const updateUseCase = new UpdateAdvisorUseCase(repo);
        const { registrationNumber, surname } = AdvisorsProducts.updateSurnameValid();

        const advisorOrError = await repo.findAdvisorByRegistrationNumber(registrationNumber);

        expect(advisorOrError.isRight()).toBeTruthy();

        const advisorToBeUpdated = advisorOrError.value as Advisor;

        const resultOrError = await updateUseCase.execute({
            advisorIdentification: advisorToBeUpdated.id,
            updateFields: {
                surname: surname
            }
        })
        expect(resultOrError.isRight()).toBeTruthy();

        const advisorWithNewSurname = await repo.findAdvisorById(
            advisorToBeUpdated.id
        )
        expect(advisorWithNewSurname.isRight()).toBeTruthy();

        const advisor = advisorWithNewSurname.value as Advisor
        expect(advisor.surname).toEqual(surname);

    });

    it("Should be able to delete a advisor registred in databse with id", async () => {
        const deleteUseCase = new DeleteAdvisorUseCase(repo);
        const registrationNumber = AdvisorsProducts.delete();

        const advisorOrError = await repo.findAdvisorByRegistrationNumber(registrationNumber);

        expect(advisorOrError.isRight()).toBeTruthy();
        const advisorToDelete = advisorOrError.value as Advisor

        const deleteOrError = await deleteUseCase.execute({ advisorIdentification: advisorToDelete.id });
        // console.log(domainError.value);
        // console.log(domainError.isLeft());
        // console.log(domainError.isRight());
        expect(deleteOrError.isRight()).toBeTruthy();
        const verification = await repo.findAdvisorByRegistrationNumber(advisorToDelete.registrationNumber);
        expect(verification.isLeft()).toBeTruthy();
        expect(verification.value).toBeNull;
    })
})