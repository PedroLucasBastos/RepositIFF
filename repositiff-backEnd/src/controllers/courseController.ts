import { CreateCourseUseCase } from "@src/domain/application/course-use-case/create-course-use-case.js";
import { DeleteCourseUseCase, IDeleteProps } from "@src/domain/application/course-use-case/delete-course-use-case.js";
import { ICourseUpdateFields, ICourseUpdateProps, UpdateCourseUseCase } from "@src/domain/application/course-use-case/update-course-use-case.js";
import { ICourseProps } from "@src/domain/entities/course.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class CourseController {
    async create(
        req: FastifyRequest<{ Body: ICourseProps }>,
        res: FastifyReply
    ): Promise<void> {
        const sanitizeOrError = this.sanitizeReceivedData(req.body);
        if (sanitizeOrError.isLeft())
            res.code(400).send({
                Error: sanitizeOrError.value
            });
        const { name, courseCode, degreeType } = req.body;
        const repo = new PrismaCourseRepostory();
        const create = new CreateCourseUseCase(repo);

        const courseOrError = await create.execute({
            name,
            courseCode,
            degreeType,
        })
        if (courseOrError.isLeft())
            return res.code(400).send({
                Message: "Dont be possible registred a course",
                Error: courseOrError.value.show
            })
        return res.code(201).send({
            Message: "Course registred",
            Course: courseOrError.value
        });
    }

    async update(
        req: FastifyRequest<{ Body: ICourseUpdateProps }>,
        res: FastifyReply
    ): Promise<void> {
        const sanitizeOrError = this.sanitizeReceivedDataToUpdateCourse(req.body.updateFields);
        if (sanitizeOrError.isLeft())
            res.code(400).send({
                Error: sanitizeOrError.value
            });
        const { updateFields, courseId } = req.body;
        const repo = new PrismaCourseRepostory();
        const update = new UpdateCourseUseCase(repo);

        const courseOrError = await update.execute({
            courseId,
            updateFields
        })
        if (courseOrError.isLeft())
            return res.code(400).send({
                Message: "Dont be possible Updatre Course",
                Error: courseOrError.value.show
            })
        return res.code(201).send({
            Message: "Course registred",
            Course: courseOrError.value
        });
    }

    async delete(
        req: FastifyRequest<{ Body: IDeleteProps }>,
        res: FastifyReply
    ): Promise<void> {
        const { courseId } = req.body;
        const sanitizeOrError = this.sanitizeReceivedData(req.body);
        if (sanitizeOrError.isLeft())
            res.code(400).send({
                Error: sanitizeOrError.value
            });

        const repo = new PrismaCourseRepostory();
        const deleteUseCase = new DeleteCourseUseCase(repo);

        const deleteOrError = await deleteUseCase.execute({
            courseId
        })

        if (deleteOrError.isLeft())
            return res.code(400).send({
                Message: "Dont be possible Delete Course",
                Error: deleteOrError.value.show
            })
        return res.code(201).send({
            Message: "Course registred",
            Course: deleteOrError.value
        });
    }

    async listAll(
        res: FastifyReply
    ): Promise<void> {
        const repo = new PrismaCourseRepostory();

        const courses = await repo.listAllCourses();

        return res.code(201).send({
            Message: "Course registred",
            Courses: courses
        });
    }


    private sanitizeReceivedData(request: any): Either<string, void> {
        const parameters = Object.entries(request)
            .filter(([key, value]) => value === undefined);
        if (parameters.length > 0)
            return new Left("All parameters must be provided");
        return new Right(undefined);
    }

    private sanitizeReceivedDataToUpdateCourse(request: any): Either<string, void> {
        const parameters = Object.entries(request)
            .filter(([key, value]) => value === undefined);
        if (parameters.length === 3)
            return new Left("Any parameter must be provided to updating");
        return new Right(undefined);
    }
}