import { Either } from "@src/error_handling/either.js";

export interface IFileStorage {
    uploadAcademicFile(academicFile: File): Promise<Either<Error, string>>;
}