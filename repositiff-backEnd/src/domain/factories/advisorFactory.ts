import { Either, Left, Right } from "@src/error_handling/either.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Advisor, AdvisorProps } from "../advisor.js";


export class AdvisorFactory {
    static createAdvisor(props: AdvisorProps): Either<DomainError, Advisor> {
        const errorList = [
            this.validateNameField(props.name),
            this.validateSurnameField(props.surname),
            this.validateRegistrationNumberField(props.registrationNumber)
        ].filter((error) => error.isLeft()); // Remove undefined ou null

        if (errorList.length > 0)
            return new Left(new DomainError(ErrorCategory.Domain, "Error to instatiate the classe Advisor", errorList));

        return new Right(new Advisor(props));
    }

    // static updateAdvisor(updateAdvisorProps: updateAdvisorProps): Either<DomainError, Advisor>{

    static updateName(name: string, advisor: Advisor): Either<DomainError, void> {
        const validatedOrNot = this.validateNameField(name);
        if (validatedOrNot.isLeft()) {
            return new Left(validatedOrNot.value);
        } else if (validatedOrNot.isRight()) {
            advisor.setName(validatedOrNot.value);
        }
        return new Right(undefined); // Retorna um Right<void> após o sucesso
    }

    static updateSurname(surname: string, advisor: Advisor): Either<DomainError, void> {
        const validatedOrNot = this.validateSurnameField(surname);
        if (validatedOrNot.isLeft()) {
            return new Left(validatedOrNot.value);
        } else if (validatedOrNot.isRight()) {
            advisor.setSurname(validatedOrNot.value);
        }
        return new Right(undefined); // Retorna um Right<void> após o sucesso
    }

    static updateRegistrationNumber(registrationNumber: string, advisor: Advisor): Either<DomainError, void> {
        const validatedOrNot = this.validateRegistrationNumberField(registrationNumber);
        if (validatedOrNot.isLeft()) {
            return new Left(validatedOrNot.value);
        } else if (validatedOrNot.isRight()) {
            advisor.setRegistrationNumber(validatedOrNot.value);
        }
        return new Right(undefined); // Retorna um Right<void> após o sucesso
    }

    // static updateSurname(name)
    // }/ Método de validação retornando Either (Left ou Right)
    static validateNameField(name: string): Either<DomainError, string> {
        if (!name || name.length === 0)
            return new Left(new DomainError(ErrorCategory.Domain, "Name is required", ["The name field can't be empty"]));
        return new Right(name);
    }

    static validateSurnameField(surname: string): Either<DomainError, string> {
        if (!surname || surname.length === 0)
            return new Left(new DomainError(ErrorCategory.Domain, "Surname is required", ["The surname field can't be empty"]));
        return new Right(surname);
    }

    static validateRegistrationNumberField(registrationNumber: string): Either<DomainError, string> {
        if (!registrationNumber || registrationNumber.length === 0)
            return new Left(new DomainError(ErrorCategory.Domain, "Registration number is required", ["The registration number field can't be empty"]));
        return new Right(registrationNumber);
    }
}