import { UpdateFieldsDTO } from "@src/domain/application/advisor-useCases/updateAdvisor.js";
import { Advisor } from "@src/domain/entities/advisor.js";

export interface IAdvisorRepository {
    addAdvisor(advisor: Advisor): Promise<Error | Advisor>;
    listAllAdvisors(): Promise<Advisor[]>;
    updateAdvisor(updateFields: UpdateFieldsDTO, id: string): Promise<Error | Advisor>;
    deleteAdvisor(idAdvisor: string): Promise<Error | Advisor>;

    countAllAdvisors(): Promise<null | number>;
    findAdvisorById(id: String): Promise<null | Advisor>;
    advisorExisting(id: String): Promise<boolean>;
    findAdvisorByRegistrationNumber(registrationNumber: string): Promise<null | Advisor>;
}
// addCourse(newCourse: Course): Promise<Error | Advisor>;
// deleteCourse(courseId: string): Promise<Error | Advisor>;
// updateCourse(courseId: string, updateFields: ICourseUpdateFields): Promise<Error | Advisor>;
// findCourseById(courseId: string): Promise<null | Advisor>;
// findCourseByCode(code: string): Promise<null | Advisor>;
// listAllCourses(): Promise<Advisor[]>;