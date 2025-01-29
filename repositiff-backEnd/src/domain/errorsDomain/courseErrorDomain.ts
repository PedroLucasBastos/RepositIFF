import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";


export class CourseErrorDomain extends DomainError {

    static InconsistentDataInDatabase(fieldsError: string): DomainError {
        const message = "The dates in the database are inconsistent with the business rules.";
        const details = [message, ...fieldsError].join("\n");
        return new DomainError(
            ErrorCategory.Persistence,
            "ERROR_IN_DATABASE_DATES",
            details
        )
    }


    static CourseCodeAlreadyInUse(): DomainError {
        return new DomainError(
            ErrorCategory.Application,
            "COURSE_ALREADY_IN_DATABASE",
            "Course is already in the database or you are trying to register a new course with credentials from a course that is already registered"
        );
    }

    static CourseNotFound(): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "COURSE_NOT_FOUND",
            "Course not cadastrated in database"
        );
    }


    static InvalidDegreeTypeValue(): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "DegreeType is invalid",
            "The degreeType field is invalid"
        );
    }

    static InvalidParameters(errorList: string): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "PARAMETERS_INVALID",
            errorList
        );
    }

    static InvalidName(): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "Name is required",
            "The name field can't be empty"
        );
    }
    static InvalidCourseCode(): DomainError {
        return new DomainError(
            ErrorCategory.Domain,
            "Course code is required",
            "The course code field can't be empty"
        );
    }
}