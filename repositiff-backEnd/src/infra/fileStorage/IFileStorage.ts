export interface IFileStorage{
    uploadAcademicFile(academicFile: File): Promise<string>;
}