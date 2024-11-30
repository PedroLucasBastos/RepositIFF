import { Advisor } from "@src/domain/entities/advisor.js";
import { AdvisorFactory } from "@src/domain/entities/factories/advisorFactory.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { AdvisorErrors } from "../../errorsDomain/advisorErrorDomain.js";

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

        // Verificação para saber se todos os campos para upload não foram passados
        if (advisorDefinedFields.length === 0) {
            return AdvisorErrors.AdvisorInvalidParameters();
        }
        // Seleciona o orientador que terá seus dados atualizados
        const advisorExisting = await this.advisorRepository.advisorExisting(updateAdvisorProps.advisorIdentification);
        if (!advisorExisting) {
            return AdvisorErrors.AdvisorNotFound();
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
}