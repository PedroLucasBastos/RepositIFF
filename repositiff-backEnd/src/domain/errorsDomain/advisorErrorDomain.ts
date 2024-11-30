import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";

export class AdvisorErrors extends DomainError {

    static AdvisorAlreadyExisting(): DomainError {
        return new DomainError(ErrorCategory.Application, "Error when registering advisor", "Advisor already exists on the platform"); new DomainError(ErrorCategory.Application, "Error when registering advisor", ["Advisor already exists on the platform"]);
    }

    static InvalidCreateAdvisorError(errorList: string[]): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "Error to instatiate the classe Advisor",
            errorList);
    }

    static InvalidNameAdvisorField(): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "Name is required",
            "The name field can't be empty"
        );
    }

    static InvalidSurnameAdvisorAttribute(): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "Surname is required",
            "The surname field can't be empty"
        )
    }

    static InvalidRegistrationNumberAttritube(): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "Registration number is required",
            "The registration number field can't be empty"
        )
    }

    static AdvisorNotFound(): DomainError {
        return new DomainError(
            ErrorCategory.Application,
            "Error to selecting Advisor",
            "Advisor not registrated"
        );
    }

    static AdvisorInvalidParameters(): DomainError {
        return new DomainError(
            ErrorCategory.Application,
            "Error to update advisor attributes",
            "Any of the 3 fields must be provided."
        );
    }




}