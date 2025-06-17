import { Course } from "@src/domain/entities/course.js";
import { ICourseRepository } from "../ICourse-repository.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { ICourseUpdateFields } from "@src/domain/application/course-use-case/update-course-use-case.js";
import { CourseErrorDomain } from '@src/domain/errorsDomain/courseErrorDomain.js';
import { DomainError } from "@src/error_handling/domainServicesErrors.js";


const prismaErrorMessages: Record<string, string> = {
    P2002: "Duplicate value for unique field(s) - PRISMA ERROR CODE P2002",
    P2003: 'Foreign key constraint failed - PRISMA ERROR CODE P2003',
    P2000: 'Value is too long for a column - PRISMA ERROR CODE P2000',
    P2025: 'Record not found - PRISMA ERROR CODE P2025',
    P2006: 'Invalid data for a column - PRISMA ERROR CODE P2006',
    P2016: 'Invalid connection to the database - PRISMA ERROR CODE P2016',
};

export class PrismaCourseRepostory implements ICourseRepository {
    private _prismaCli: PrismaClient;
    constructor() {
        this._prismaCli = new PrismaClient();
    }

    async deleteAll(): Promise<void> {
        await this._prismaCli.$executeRawUnsafe(`
            TRUNCATE TABLE 
                "Advisor_AcademicWork", 
                "AcademicWork", 
                "Advisor", 
                "Course", 
                "Librarian"
            RESTART IDENTITY CASCADE;
        `);
    }

    async addCourse(newCourse: Course): Promise<Error | Course> {
        try {
            const course = await this._prismaCli.course.create({
                data: {
                    id: newCourse.id,
                    name: newCourse.name,
                    courseCode: newCourse.courseCode,
                    degreeType: newCourse.degreeType,
                }
            })
            // const courseMapped = this.mapperToCourseEntity(course);
            // if (courseMapped instanceof DomainError)
            //     return new Error(
            //         courseMapped.message,
            //         courseMapped.details
            //     )
            return this.mapperToCourseEntity(course);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                return new Error(customMessage);
            }
            return new Error("Unexpected Error to database");
        }
    }
    async deleteCourse(courseId: string): Promise<Error | Course> {
        try {
            const course = await this._prismaCli.course.delete({
                where: {
                    id: courseId
                }
            })
            return this.mapperToCourseEntity(course);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                return new Error(customMessage);
            }
        }
        throw new Error("Method not implemented.");
    }

    async updateCourse(courseId: string, updateFields: ICourseUpdateFields): Promise<Error | Course> {
        try {
            const coursePrisma = await this._prismaCli.course.update({
                where: {
                    id: courseId
                },
                data: updateFields
            })
            console.log(coursePrisma);
            return this.mapperToCourseEntity(coursePrisma);
        } catch (error) {
            console.log("\n------------ERROR---------\n");
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                return new Error(customMessage);
            }
            // Retorno para erros não tratados
            throw new Error('An unexpected error occurred while updating the course');
        }
    }

    async findCourseById(courseId: string): Promise<null | Course> {
        try {
            const course = await this._prismaCli.course.findUnique({
                where: {
                    id: courseId
                }
            })
            if (!course)
                return null;
            const result = this.mapperToCourseEntity(course);
            if (result instanceof Error) {
                console.log("Unexpected error");
                console.log(course);
                throw new Error("Information incompatible with the database and business rules ", result);
            }
            return result;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                throw new Error(customMessage);
            }
        }
        throw new Error("Unexpected error");
    }
    async findCourseByCode(code: string): Promise<null | Course> {
        try {
            const course = await this._prismaCli.course.findUnique({
                where: {
                    courseCode: code
                }
            })
            if (!course)
                return null;
            const result = this.mapperToCourseEntity(course);
            if (result instanceof Error) {
                console.log("Unexpected error");
                console.log(course);
                throw new Error("Information incompatible with the database and business rules ", result);
            }
            return this.mapperToCourseEntity(course) as Course;
        } catch (error) {
            return null
        }
        throw new Error("Method not implemented.");
    }
    async listAllCourses(): Promise<Course[]> {
        try {
            const courses = await this._prismaCli.course.findMany()
            const listCourses: Course[] = [];
            for (const course of courses) {
                const result = this.mapperToCourseEntity(course);
                if (result instanceof Error) {
                    console.log("Unexpected error");
                    console.log(course);
                    throw new Error("Information incompatible with the database and business rules ", result);
                }
                listCourses.push(result);
            }
            return listCourses;
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }


    async existing(courseId: string): Promise<boolean> {
        try {
            const exists = await this._prismaCli.advisor.count({
                where: {
                    id: "254"
                }
            })
            if (exists > 0) {
                return true;
            }
            return false;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                throw new Error(customMessage);
            }
        }
        return false;
    }

    private mapperToCourseEntity(databaseEntity: any): Error | Course {
        const { id, name, courseCode, degreeType } = databaseEntity;
        const result = Course.createCourse({
            name,
            courseCode,
            degreeType
        }, id)
        if (result.isLeft())
            return new Error(result.value.details);
        return result.value as Course;
    }
}