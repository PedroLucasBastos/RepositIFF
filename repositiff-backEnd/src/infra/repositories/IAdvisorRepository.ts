import { UpdateFieldsDTO } from "@src/domain/application/advisor-useCases/updateAdvisor.js";
import { Advisor } from "@src/domain/entities/advisor.js";
export interface IAdvisorRepository {
    cadastrationNewAdvisor(advisor: Advisor): Promise<Advisor>;
    deleteAdvisor(idAdvisor: string): Promise<void>;
    listAllAdvisors(): Promise<Advisor[]>;
    updateAdvisor(updateFields: UpdateFieldsDTO, id: string): Promise<Advisor>;
    findAdvisorById(id: String): Promise<Advisor | void>;
    advisorExisting(id: String): Promise<boolean>;
    findAdvisorByRegistrationNumber(registrationNumber: string): Promise<void | Advisor>;
}