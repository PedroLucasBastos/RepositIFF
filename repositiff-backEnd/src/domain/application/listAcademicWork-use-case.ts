import { Either } from "@src/error_handling/either.Funcional.js";
import { PrismaAcademicWorkRepository } from "@src/infra/repositories/prisma/prisma-academicWork-repository.js";
import { AcademicWork } from "../entities/academicWork.js";
import { IReturnFullAcademicWorkDTO } from "@src/infra/repositories/IAcademicWorkRepository.js";

export class ListAcademicWorkUseCase {
  constructor(private _repo: PrismaAcademicWorkRepository) {}

  async execute(userId: string, role: string): Promise<Either<Error, IReturnFullAcademicWorkDTO[]>> {
    if (role !== "admin") {
      return left(new Error("Unauthorized"));
    }

    return right(academicWorks);
  }
}
