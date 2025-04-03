import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";

export class AcademicWorkErros extends DomainError {

    static InvalidParameters(errorList: string): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "PARAMETERS_INVALID",
            errorList
        );
    }

    static InvalidChangeVisibility(errorList: string): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "VisibilityChangeError",
            errorList
        );
    }

    // static InvalidParameters(): DomainError {
    //     return new DomainError(
    //         ErrorCategory.Domain,
    //         "PARAMETERS_INVALID",
    //         "Title is invalid"
    //     );
    // }
    static InvalidTitleParamers(): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "PARAMETERS_INVALID",
            "Title is invalid"
        );
    }
}