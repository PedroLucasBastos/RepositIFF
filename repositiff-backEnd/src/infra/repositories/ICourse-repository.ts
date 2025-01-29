import { ICourseUpdateFields, ICourseUpdateProps as IUpdateCourseFields } from "@src/domain/application/course-use-case/update-course-use-case.js";
import { Course } from "@src/domain/entities/course.js";
export interface ICourseRepository {
    addCourse(newCourse: Course): Promise<Error | Course>;
    deleteCourse(courseId: string): Promise<Error | Course>;
    updateCourse(courseId: string, updateFields: ICourseUpdateFields): Promise<Error | Course>;
    findCourseById(courseId: string): Promise<null | Course>;
    findCourseByCode(code: string): Promise<null | Course>;
    listAllCourses(): Promise<Course[]>;
}