import { updateAdvisorPropsDTO, UpdateFieldsDTO } from "@src/application/advisor-useCases/updateAdvisor.js";
import { Advisor } from "@src/domain/advisor.js";
export interface IAdvisorRepository {
    cadastrationNewAdvisor(advisor: Advisor): Promise<Advisor>;
    deleteAdvisor(advisor: Advisor): Promise<void>;
    listAllAdvisors(): Promise<Advisor[]>;
    updateAdvisor(updateAdvisorFields: UpdateFieldsDTO, id: string): Promise<Advisor>;
    findAdvisorById(id: String): Promise<Advisor | void>;
    findAdvisorByRegistrationNumber(registrationNumber: string): Promise<void | Advisor>;
}