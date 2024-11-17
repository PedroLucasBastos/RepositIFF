import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";

export class fileStorageFake implements IFileStorage{
    uploadAcademicFile(academicFile: File): Promise<string> {
        return Promise.resolve("URL in Memory");
    }

}