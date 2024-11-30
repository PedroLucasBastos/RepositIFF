import { Advisor } from "@src/domain/advisor.js";
import { AdvisorFactory } from "@src/domain/factories/advisorFactory.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";

export interface UpdateAdvisorPropsDTO {
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

    async execute(updateAdvisorProps: UpdateAdvisorPropsDTO): Promise<DomainError | Advisor> {
        const updateFields = updateAdvisorProps.updateFields;

        // filtra os valores que não são undfined, deixando apenas o que será atualizado
        const advisorDefinedFields = Object.entries(updateFields)
            .filter(([key, value]) => value !== undefined); // Garante que as chaves correspondem ao tipo UpdateFields
        // .filter(([key, value]) => value !== undefined) as [keyof UpdateAdvisorPropsDTO["updateFields"], string][]; // Garante que as chaves correspondem ao tipo UpdateFields

        // Verificação para saber se todos os campos para upload não foram passados
        if (advisorDefinedFields.length === 0) {
            return new DomainError(
                ErrorCategory.Application,
                "Error to update advisor attributes",
                ["Any of the 3 fields must be provided."]
            );
        }
        // Seleciona o orientador que terá seus dados atualizados
        const advisorExisting = await this.advisorRepository.advisorExisting(updateAdvisorProps.advisorIdentification);
        if (!advisorExisting) {
            return new DomainError(
                ErrorCategory.Application,
                "Error to selecting Advisor",
                [
                    "Advisor not registrated"
                ]);
        }
        let validFields: UpdateFieldsDTO = {};
        for (let i = 0; i < advisorDefinedFields.length; i++) {
            const fieldUpdate = this.updateValidateFields(
                advisorDefinedFields[i][0],// Pega a "chave" Ex: "name"
                advisorDefinedFields[i][1] // Pega o "valor" Ex: "fulano" 
            );

            if (fieldUpdate.isLeft()) {
                return fieldUpdate.value; // Retorna o erro imediatamente, se houver.
            }

            validFields = { ...validFields, ...fieldUpdate.value };
        }
        const advisor = await this.advisorRepository.updateAdvisor(validFields, updateAdvisorProps.advisorIdentification);
        return advisor;
        // const advisorDefinedFieldsToUpdate: UpdateFieldsDTO = Object.fromEntries(advisorDefinedFields);


        // advisorDefinedFieldsToUpdate.

        // console.log(validFields);
        // const advisor = await this.advisorRepository.updateAdvisor(validFields, advisorExisting.id);

    }

    private updateValidateFields(key: string, value: string): Either<DomainError, Partial<UpdateFieldsDTO>> {

        switch (key) {
            case "name": {
                const updatedNameToApplyOrNot = AdvisorFactory.validateNameField(value);
                if (updatedNameToApplyOrNot.isLeft()) {
                    return new Left(updatedNameToApplyOrNot.value);
                } else if (updatedNameToApplyOrNot.isRight())
                    return new Right({ name: updatedNameToApplyOrNot.value });
            }
            case "surname": {
                const updatedSurnameToApplyOrNot = AdvisorFactory.validateSurnameField(value);
                if (updatedSurnameToApplyOrNot.isLeft()) {
                    return new Left(updatedSurnameToApplyOrNot.value);
                } if ((updatedSurnameToApplyOrNot.isRight()))
                    return new Right({ surname: updatedSurnameToApplyOrNot.value });
            }
            case "registrationNumber": {
                const updatedRegistrationNumberToApplyOrNot = AdvisorFactory.validateRegistrationNumberField(value);
                if (updatedRegistrationNumberToApplyOrNot.isLeft()) {
                    return new Left(updatedRegistrationNumberToApplyOrNot.value);
                } if (updatedRegistrationNumberToApplyOrNot.isRight())
                    return new Right({ registrationNumber: updatedRegistrationNumberToApplyOrNot.value });
            }
        }
        return new Left(new DomainError(ErrorCategory.Application, "Unexpected Error", ["Undexpected error to validate fields to update "]));
    }

    // Descontinuado
    // private updateRequiredFields(key: string, value: string, advisor: Advisor): DomainError | Partial<UpdateFieldsDTO> {

    //     switch (key) {
    //         case "name": {
    //             const updatedNameToApplyOrNot = AdvisorFactory.updateName(value, advisor);
    //             if (updatedNameToApplyOrNot.isLeft()) {
    //                 return updatedNameToApplyOrNot.value;
    //             }
    //             return { name: advisor.name };
    //         }
    //         case "surname": {
    //             const updatedSurnameToApplyOrNot = AdvisorFactory.updateSurname(value, advisor);
    //             if (updatedSurnameToApplyOrNot.isLeft()) {
    //                 return updatedSurnameToApplyOrNot.value;
    //             }
    //             return { surname: advisor.surname };
    //         }
    //         case "registrationNumber": {
    //             const updatedRegistrationNumberToApplyOrNot = AdvisorFactory.updateRegistrationNumber(value, advisor);
    //             if (updatedRegistrationNumberToApplyOrNot.isLeft()) {
    //                 return updatedRegistrationNumberToApplyOrNot.value;
    //             }
    //             return { registrationNumber: advisor.registrationNumber };
    //         }
    //     }
    //     return {}
    // }
}