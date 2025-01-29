import { CourseErrorDomain } from "@src/domain/errorsDomain/courseErrorDomain.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { degreeType } from "@src/domain/entities/course.js"

export class CourseValidator {
    static validateDegreeType(newDegreeType: degreeType): Either<DomainError, void> {
        const result = Object.values(degreeType).includes(newDegreeType);
        if (!result)
            return new Left(CourseErrorDomain.InvalidDegreeTypeValue())
        return new Right(undefined);
    }
    static validateNameField(name: string): Either<DomainError, string> {
        if (!name || name.length === 0)
            return new Left(CourseErrorDomain.InvalidName());
        return new Right(name);
    }
    static validateCourseCodeField(name: string): Either<DomainError, string> {
        if (!name || name.length === 0)
            return new Left(CourseErrorDomain.InvalidCourseCode());
        return new Right(name);
    }
}
