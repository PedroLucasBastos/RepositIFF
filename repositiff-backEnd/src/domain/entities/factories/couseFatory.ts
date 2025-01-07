import { Either, Left, Right } from "@src/error_handling/either.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { CourseErrorDomain } from "@src/domain/errorsDomain/courseErrorDomain.js";
import { Course, ICourseProps, degreeType } from '@src/domain/entities/course.js';

export class CourseFactory {

    static createCourse(props: ICourseProps): Either<DomainError, Course> {
        const errorList: string[] = [
            this.validateNameField(props.name),
            this.validateCourseCodeField(props.courseCode),
            this.validateDegreeType(props.degreeType)
        ].filter((error) => error.isLeft()) // Filtra para pegar apenas os erros
            .map((error) => error.value.details)
            .flat()
        if (errorList.length > 0)
            return new Left(CourseErrorDomain.InvalidParameters(errorList));
        return new Right(new Course(props));
    }

    static validationProps(newProps: IUpdateCourseFields): Either<DomainError, void> {
        const { name, courseCode, degreeType } = newProps;
        let validateResult = [];
        if (name)
            validateResult.push(this.validateNameField(name));
        if (courseCode)
            validateResult.push(this.validateCourseCodeField(courseCode));
        if (degreeType)
            validateResult.push(this.validateDegreeType(degreeType));
        const errorsList = validateResult
            .filter((error) => error.isLeft()) // Filtra para pegar apenas os erros
            .map((error) => error.value.details)
            .flat()
        if (errorsList.length > 0)
            return new Left(CourseErrorDomain.InvalidParameters(errorsList));
        return new Right(undefined);
    }

    static updateName(name: string, course: Course): Either<DomainError, void> {
        const isValidOrNot = this.validateNameField(name);
        if (isValidOrNot.isLeft())
            return new Left(isValidOrNot.value);
        course.setName = name;
        return new Right(undefined);
    }

    static updateCourseCode(courseCode: string, course: Course): Either<DomainError, void> {
        const isValidOrNot = this.validateCourseCodeField(courseCode);
        if (isValidOrNot.isLeft())
            return new Left(isValidOrNot.value);
        course.setCourseCode = courseCode;
        return new Right(undefined);
    }

    static updateDegreeType(newDegreeType: degreeType, course: Course): Either<DomainError, void> {
        const isValidOrNot = this.validateDegreeType(newDegreeType);
        if (isValidOrNot.isLeft())
            return new Left(isValidOrNot.value);
        course.setDegreeType = newDegreeType;
        return new Right(undefined);
    }

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