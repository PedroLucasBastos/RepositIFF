import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Advisor, AdvisorProps } from "../advisor.js";
import { AdvisorErrors } from "@src/domain/errorsDomain/advisorErrorDomain.js";


export class AdvisorFactory {
    static createAdvisor(props: AdvisorProps, id?: string): EitherOO<DomainError, Advisor> {
        const errorList: string[] = [
            this.validateNameField(props.name),
            this.validateSurnameField(props.surname),
            this.validateRegistrationNumberField(props.registrationNumber)
        ].filter((error) => error.isLeft()) // Filtra para pegar apenas os erros
            .map((error) => error.value.details)
            .flat()
        if (errorList.length > 0) {
            return new Left(AdvisorErrors.InvalidCreateAdvisorError(errorList.join("\n")));
        }

        return new Right(new Advisor(props, id));
    }

    // static updateAdvisor(updateAdvisorProps: updateAdvisorProps): Either<DomainError, Advisor>{

    static updateName(name: string, advisor: Advisor): EitherOO<DomainError, void> {
        const validatedOrNot = this.validateNameField(name);
        if (validatedOrNot.isLeft()) {
            return new Left(validatedOrNot.value);
        } else if (validatedOrNot.isRight()) {
            advisor.setName(validatedOrNot.value);
        }
        return new Right(undefined); // Retorna um Right<void> após o sucesso
    }

    static updateSurname(surname: string, advisor: Advisor): EitherOO<DomainError, void> {
        const validatedOrNot = this.validateSurnameField(surname);
        if (validatedOrNot.isLeft()) {
            return new Left(validatedOrNot.value);
        } else if (validatedOrNot.isRight()) {
            advisor.setSurname(validatedOrNot.value);
        }
        return new Right(undefined); // Retorna um Right<void> após o sucesso
    }

    static updateRegistrationNumber(registrationNumber: string, advisor: Advisor): EitherOO<DomainError, void> {
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
    static validateNameField(name: string): EitherOO<DomainError, string> {
        if (!name || name.length === 0)
            return new Left(AdvisorErrors.InvalidNameAdvisorField());
        return new Right(name);
    }

    static validateSurnameField(surname: string): EitherOO<DomainError, string> {
        if (!surname || surname.length === 0)
            return new Left(AdvisorErrors.InvalidSurnameAdvisorField());
        return new Right(surname);
    }

    static validateRegistrationNumberField(registrationNumber: string): EitherOO<DomainError, string> {
        if (!registrationNumber || registrationNumber.length === 0)
            return new Left(AdvisorErrors.InvalidRegistrationNumberField());
        return new Right(registrationNumber);
    }
}