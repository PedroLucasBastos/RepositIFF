import { CreateCourseUseCase } from "@src/domain/application/course-use-case/create-course-use-case.js";
import { DeleteCourseUseCase, IDeleteProps } from "@src/domain/application/course-use-case/delete-course-use-case.js";
import {
  ICourseUpdateFields,
  ICourseUpdateProps,
  UpdateCourseUseCase,
} from "@src/domain/application/course-use-case/update-course-use-case.js";
import { ICourseProps } from "@src/domain/entities/course.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { PrismaUserRepository } from "@src/infra/repositories/prisma/prisma-user-respository.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class CourseController {
  async create(req: any, res: FastifyReply): Promise<void> {
    const sanitizeOrError = this.sanitizeReceivedData(req.body);
    if (sanitizeOrError.isLeft())
      res.code(400).send({
        Error: sanitizeOrError.value,
      });
    const { name, courseCode, degreeType } = req.body;
    const repo = new PrismaCourseRepostory();
    const create = new CreateCourseUseCase(repo);

    const user = await new PrismaUserRepository().findById(req.userId);

    const courseOrError = await create.execute(
      {
        name,
        courseCode,
        degreeType,
      },
      user?.role || ""
    );
    if (courseOrError.isLeft())
      return res.code(400).send({
        Message: "Dont be possible registred a course",
        Error: courseOrError.value.show,
      });
    return res.code(201).send({
      Message: "Course registred",
      Course: courseOrError.value,
    });
  }

  async update(req: any, res: FastifyReply): Promise<void> {
    const sanitizeOrError = this.sanitizeReceivedDataToUpdateCourse(req.body.updateFields);
    if (sanitizeOrError.isLeft())
      res.code(400).send({
        Error: sanitizeOrError.value,
      });
    const { updateFields, courseId } = req.body;
    const repo = new PrismaCourseRepostory();
    const update = new UpdateCourseUseCase(repo);
    const user = await new PrismaUserRepository().findById(req.userId);
    const courseOrError = await update.execute(
      {
        courseId,
        updateFields,
      },
      user?.role || ""
    );
    if (courseOrError.isLeft())
      return res.code(400).send({
        Message: "Dont be possible Updatre Course",
        Error: courseOrError.value.show,
      });
    return res.code(201).send({
      Message: "Course registred",
      Course: courseOrError.value,
    });
  }

  async delete(req: any, res: FastifyReply): Promise<void> {
    const { courseId } = req.body;
    const sanitizeOrError = this.sanitizeReceivedData(req.body);
    if (sanitizeOrError.isLeft())
      res.code(400).send({
        Error: sanitizeOrError.value,
      });

    const repo = new PrismaCourseRepostory();
    const deleteUseCase = new DeleteCourseUseCase(repo);
    const user = await new PrismaUserRepository().findById(req.userId);
    const deleteOrError = await deleteUseCase.execute(
      {
        courseId,
      },
      user?.role || ""
    );

    if (deleteOrError.isLeft())
      return res.code(400).send({
        Message: "Dont be possible Delete Course",
        Error: deleteOrError.value.show,
      });
    return res.code(201).send({
      Message: "Course registred",
      Course: deleteOrError.value,
    });
  }

  async listAll(res: any): Promise<void> {
    const repo = new PrismaCourseRepostory();

    const courses = await repo.listAllCourses();

    return res.code(201).send({
      Message: "Course registred",
      Courses: courses,
    });
  }

  private sanitizeReceivedData(request: any): EitherOO<string, void> {
    const parameters = Object.entries(request).filter(([key, value]) => value === undefined);
    if (parameters.length > 0) return new Left("All parameters must be provided");
    return new Right(undefined);
  }

  private sanitizeReceivedDataToUpdateCourse(request: any): EitherOO<string, void> {
    const parameters = Object.entries(request).filter(([key, value]) => value === undefined);
    if (parameters.length === 3) return new Left("Any parameter must be provided to updating");
    return new Right(undefined);
  }
}
