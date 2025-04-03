import { describe, it, expect } from "vitest";
import { Advisor } from "../advisor.js";
import { AdvisorFactory } from "../factories/advisorFactory.js";
import { EitherOO } from "@src/error_handling/either.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
describe("instantiate the advisor class", () => {
    it("Should be able to create a obj of Advisor class with required attributes", () => {
        const advisorOrError: EitherOO<DomainError, Advisor> = AdvisorFactory.createAdvisor({
            name: "Juciaryus",
            surname: "Alm`ida",
            registrationNumber: "24242424"
        });
        if (advisorOrError.isLeft()) {
            const error = advisorOrError.value;
            console.log(error.show); // OK: Acesso ao método show de ErrorsParameters.
            return;
        }
        const advisor = advisorOrError.value as Advisor;
        expect(advisor).instanceOf(Advisor);
    })
    it("Dont should be able to create a obj of Advisor class, whitout surname and name attributtes", () => {
        const advisorOrError = AdvisorFactory.createAdvisor({
            name: "",
            surname: "",
            registrationNumber: "24242424"
        });
        if (advisorOrError.isLeft()) {
            // console.log(advisorOrError.value.show)
            expect(advisorOrError.value).toBeInstanceOf(DomainError);
            return
        }
        const advisor = advisorOrError.value


        expect(advisor).toBeInstanceOf(Advisor);
    })
});