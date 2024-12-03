import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { it, expect, describe } from "vitest";
import { CreateAdvisorUseCase } from "../createAdvisor-useCase.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { Advisor } from "@src/domain/entities/advisor.js";

describe("test to use case a create a advisor e registrat in database", () => {
    const repo = new PrismaAdvisorRepository();

    it("Should be able to create e registred a advisor in database", async () => {
        const useCase = new CreateAdvisorUseCase(repo);
        const advisorProps = {
            name: "Carlos",
            surname: "Silva",
            registrationNumber: "12345",
        };
        const advisorUseCaseOrError = await useCase.execute(advisorProps);

        const advisor = advisorUseCaseOrError.value as Advisor;

        const advisorExisting = await repo.advisorExisting(
            advisor.id
        )
        expect(advisorExisting).toBeTruthy();
        const advisorSeleted = await repo.findAdvisorByRegistrationNumber(
            advisorProps.registrationNumber
        )
        expect(advisorSeleted.value?.id).toEqual(advisor.id);
        expect(advisorSeleted.value?.name).toEqual(advisorProps.name);
        expect(advisorSeleted.value?.surname).toEqual(advisorProps.surname);
        expect(advisorSeleted.value?.registrationNumber).toEqual(advisorProps.registrationNumber);


        // DELETE ADVISOR IN DATABASE
        const advisorHasBeDeleted = await repo.findAdvisorByRegistrationNumber(
            advisorProps.registrationNumber
        );
        if ((advisorHasBeDeleted).isRight()) {
            const pop = await repo.deleteAdvisor(advisorHasBeDeleted.value.id);
            const advisorDeleted = await repo.findAdvisorByRegistrationNumber(
                advisorProps.registrationNumber
            );
            expect(advisorDeleted.isLeft()).toBeTruthy();
            expect(advisorDeleted.value).toBeNull;
        }
    });


    it("Deve retornar um erro ao tentar cadastrar um Advisor com número de registro duplicado", async () => {
        const useCase = new CreateAdvisorUseCase(repo);
        const advisorProps = {
            name: "João",
            surname: "Peçanha",
            registrationNumber: "12345",
        };
        const advisorPropsRegistratinNumberDuplicated = {
            name: "Beowulf",
            surname: "Mendonça",
            registrationNumber: "12345",
        }
        await useCase.execute(advisorProps);
        const secundAdvisorOrError = await useCase.execute(advisorPropsRegistratinNumberDuplicated);
        expect(secundAdvisorOrError.isLeft).toBeTruthy();

        expect(secundAdvisorOrError.value).toBeInstanceOf(DomainError);
        expect(secundAdvisorOrError.value.name).toEqual("ApplicationError");


        // DELETE ADVISOR IN DATABASE
        const advisorHasBeDeleted = await repo.findAdvisorByRegistrationNumber(
            advisorProps.registrationNumber
        );
        if ((advisorHasBeDeleted).isRight()) {
            await repo.deleteAdvisor(advisorHasBeDeleted.value.id);
            const advisorDeleted = await repo.findAdvisorByRegistrationNumber(
                advisorProps.registrationNumber
            );
            expect(advisorDeleted.isLeft()).toBeTruthy();
            expect(advisorDeleted.value).toBeNull;
        }
    });

    // it("Should be able to delete a advisor registred", async () => {
    //     const registrationNumber = "12345";
    //     const advisorHasBeDeleted = await repo.findAdvisorByRegistrationNumber(registrationNumber);
    //     console.log(advisorHasBeDeleted);
    //     if ((advisorHasBeDeleted).isRight()) {
    //         repo.deleteAdvisor(advisorHasBeDeleted.value.id);
    //     }
    //     const advisorDeleted = await repo.findAdvisorByRegistrationNumber(registrationNumber);
    //     expect(advisorDeleted.isLeft()).toBeTruthy();
    //     expect(advisorDeleted.value).toBeNull;
    //     // expect(result).toBeInstanceOf(DomainError);
    //     // expect(result?.details).toContain("Invalid advisor data");
    // });
})