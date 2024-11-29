import { Advisor } from "@src/domain/advisor.js";
import { AdvisorFactory } from "@src/domain/factories/advisorFactory.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";

export interface updateAdvisorPropsDTO {
    advisorIdentification: string,
    updateFields: UpdateFieldsDTO
}

export interface UpdateFieldsDTO {
    name?: string,
    surname?: string,
    registrationNumber?: string,
}


export class UpdateAdvisorUseCase {
    constructor(
        private advisorRepository: IAdvisorRepository,
    ) { }

    async execute(updateAdvisorProps: updateAdvisorPropsDTO): Promise<DomainError | Advisor> {
        const updateFields = updateAdvisorProps.updateFields;

        // filtra os valores que não são undfined, deixando apenas o que será atualizado
        const advisorDefinedFieldsToUpdate = Object.entries(updateFields)
            .filter(([key, value]) => value !== undefined) as [keyof updateAdvisorPropsDTO["updateFields"], string][]; // Garante que as chaves correspondem ao tipo UpdateFields
        // Verificação para saber se todos os campos para upload não foram passados
        if (advisorDefinedFieldsToUpdate.length === 0) {
            return new DomainError(
                ErrorCategory.Application,
                "Error to update advisor attributes",
                ["Any of the 3 fields must be provided."]
            );
        }
        // Seleciona o orientador que terá seus dados atualizados
        const advisorExisting = await this.advisorRepository.findAdvisorById(updateAdvisorProps.advisorIdentification);
        if (!advisorExisting) {
            return new DomainError(
                ErrorCategory.Application,
                "Error to selecting Advisor",
                [
                    "Advisor not registrated"
                ]);
        }

        advisorDefinedFieldsToUpdate.forEach(([key, value]) => {
            switch (key) {
                case "name": {
                    const updatedNameToApplyOrNot = AdvisorFactory.updateName(value, advisorExisting);
                    if (updatedNameToApplyOrNot.isLeft()) {
                        return updatedNameToApplyOrNot.value;
                    }
                    break;
                }
                case "surname": {
                    const updatedSurnameToApplyOrNot = AdvisorFactory.updateSurname(value, advisorExisting);
                    if (updatedSurnameToApplyOrNot.isLeft()) {
                        return updatedSurnameToApplyOrNot.value;
                    }
                    break;
                }
                case "registrationNumber": {
                    const updatedRegistrationNumberToApplyOrNot = AdvisorFactory.updateRegistrationNumber(value, advisorExisting);
                    if (updatedRegistrationNumberToApplyOrNot.isLeft()) {
                        return updatedRegistrationNumberToApplyOrNot.value;
                    }
                    break;

                }
            }
        });


        // Irá verificar se pelos um dos campos não é undefined
        // const hasAtLeastOneFieldDefined = Object.values(updateFields).some((field) => field !== undefined);
        // if (!hasAtLeastOneFieldDefined) {
        //     return new DomainError(
        //         ErrorCategory.Application,    
        //         "Error to update advisor attributes",
        //         ["Any of the 3 fields must be provided."]
        //     );
        // }


        // filtra os valores que não são undfined, deixando apenas o que será atualizado
        // const advisorDefinedFieldsToUpdate = Object.entries(updateFields)
        //     .filter(
        //         ([key, value]) => value !== undefined) as [keyof updateAdvisorPropsDTO["updateFields"], string][]; // Garante que as chaves correspondem ao tipo UpdateFields
        // advisorDefinedFieldsToUpdate
        //     .forEach(([key, value]) => {
        //         switch (key) {
        //             case "name": {
        //                 const updatedNameToApplyOrNot = AdvisorFactory.updateName(value, advisorExisting);
        //                 if (updatedNameToApplyOrNot.isLeft()) {
        //                     return updatedNameToApplyOrNot.value;
        //                 }

        //                 break;
        //             }
        //             case "surname": {
        //                 const updatedSurnameToApplyOrNot = AdvisorFactory.updateSurname(value, advisorExisting);
        //                 if (updatedSurnameToApplyOrNot.isLeft()) {
        //                     return updatedSurnameToApplyOrNot.value;
        //                 }
        //                 break;
        //             }
        //             case "registrationNumber": {
        //                 const updatedRegistrationNumberToApplyOrNot = AdvisorFactory.updateRegistrationNumber(value, advisorExisting);
        //                 if (updatedRegistrationNumberToApplyOrNot.isLeft()) {
        //                     return updatedRegistrationNumberToApplyOrNot.value;
        //                 }
        //                 break;

        //             }
        //             default:
        //                 // Handle any unexpected keys or log a warning
        //                 console.warn(`Unexpected field: ${key}`);
        //                 break;
        //         }
        //     });
        const advisor = await this.advisorRepository.updateAdvisor({}, advisorExisting.id);

        return advisor;
    }
}