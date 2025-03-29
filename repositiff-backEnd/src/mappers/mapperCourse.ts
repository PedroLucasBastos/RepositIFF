import { Course, degreeType } from "@src/domain/entities/course.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { IReturnCourseDTO } from "@src/infra/repositories/ICourse-repository.js";


export class MapperCourse {
    static mapping(data: IReturnCourseDTO): DomainError | Course {
        // // (!Object.values(typeWork).includes(type as typeWork))
        // if (!Object.values(degreeType).includes(data.degreeType as degreeType))
        //     return new DomainError();
        const courseOrError = Course.createCourse({
            courseCode: data.courseCode,
            name: data.name,
            degreeType: data.degreeType as degreeType,
        }, data.id)
        if (courseOrError.isLeft())
            return new DomainError(ErrorCategory.Application,
                "ERROR_TO_MAPPING_COURSE",
                `Something is wrong with database info about course entity\nCourse with Error is: ${courseOrError.value}`
            );
        return courseOrError.value;
    }
}