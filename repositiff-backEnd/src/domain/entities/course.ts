import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { CourseErrorDomain } from "../errorsDomain/courseErrorDomain.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { CourseValidator } from "./validators/course-validators.js";
export enum degreeType {
    Bachelor = "BACHELOR",
    Licentiate = "LICENTIATE",
}
export interface ICourseProps {
    courseCode: string;
    name: string;
    degreeType: degreeType
}
export class Course {
    private _id: string;

    private constructor(private _props: ICourseProps, id?: string) {
        this._id = id || crypto.randomUUID();
    }
    static createCourse(props: ICourseProps, id?: string): EitherOO<DomainError, Course> {
        const errorList: string[] = [
            CourseValidator.validateNameField(props.name),
            CourseValidator.validateCourseCodeField(props.courseCode),
            CourseValidator.validateDegreeType(props.degreeType)
        ]
            .filter((error) => error.isLeft()) // Filtra para pegar apenas os erros
            .map((error) => error.value.details)
            .flat()
        if (errorList.length > 0)
            return new Left(CourseErrorDomain.InvalidParameters(errorList.join("\n")));
        return new Right(new Course(props, id));
    }
    //------------------ PUBLIC METHODS -----------------------
    public updateName(name: string): EitherOO<DomainError, void> {
        const isValidOrNot = CourseValidator.validateNameField(name);
        if (isValidOrNot.isLeft())
            return new Left(isValidOrNot.value);
        this._props.name = name;
        return new Right(undefined);
    }
    public updateCourseCode(courseCode: string): EitherOO<DomainError, void> {
        const isValidOrNot = CourseValidator.validateCourseCodeField(courseCode);
        if (isValidOrNot.isLeft())
            return new Left(isValidOrNot.value);
        this._props.courseCode = courseCode;
        return new Right(undefined);
    }
    public updateDegreeType(newDegreeType: degreeType): EitherOO<DomainError, void> {
        const isValidOrNot = CourseValidator.validateDegreeType(newDegreeType);
        if (isValidOrNot.isLeft())
            return new Left(isValidOrNot.value);
        this._props.degreeType = newDegreeType;
        return new Right(undefined);
    }
    //------------------ GETTERS -----------------------

    get getProps(): ICourseProps {
        return this._props;
    }

    get id(): string {
        return this._id;
    }
    get name(): string {
        return this._props.name;
    }
    get courseCode(): string {
        return this._props.courseCode;
    }
    get degreeType(): string {
        return this._props.degreeType;
    }
}
