import { Either, Right } from "@src/error_handling/either.Funcional.js";
import { PrismaAcademicWorkRepository } from "@src/infra/repositories/prisma/prisma-academicWork-repository.js";
import { AcademicWork } from "../../entities/academicWork.js";
import {
  IAcademicWorkRepository,
  IReturnFullAcademicWorkDTO,
} from "@src/infra/repositories/IAcademicWorkRepository.js";

export interface listAcademicWorks {
  id: string;
  userRole?: string;
  optionalParameters?: {
    year?: number;
    courseId?: string;
    advisorId?: string;
  };
}

export class ListAcademicWorkUseCase {
  constructor(private _repo: IAcademicWorkRepository) {}

  async execute(props: listAcademicWorks): Promise<Either<Error, IReturnFullAcademicWorkDTO[]>> {
    const where: any = {
      ...(props.userRole ? {} : { academicWorkVisibility: true }), // só público se não autenticado
      ...(props.optionalParameters?.year && { year: props.optionalParameters.year }),
      ...(props.optionalParameters?.courseId && { courseId: props.optionalParameters.courseId }),
      ...(props.optionalParameters?.advisorId && {
        advisors: {
          some: { advisorId: props.optionalParameters.advisorId },
        },
      }),
    };

    const result = await this._repo.listCustomAcademicWork(where);

    return new Right(result);
  }
}
