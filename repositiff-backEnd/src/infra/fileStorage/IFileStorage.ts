import { AcademicWorkFile } from "@src/domain/entities/academicWorkFile.js";
import { EitherOO } from "@src/error_handling/either.js";

export interface IFileStorage {
    upload(key: string, file: Buffer): Promise<Error | void>;
    download(key: string): Promise<Error | string>;
}