import { Advisor } from "@src/domain/entities/advisor.js";
import { AdvisorFactory } from "@src/domain/entities/factories/advisorFactory.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { AdvisorErrors } from "../../errorsDomain/advisorErrorDomain.js";
import { Role } from "@src/domain/entities/user.js";

export interface UpdateAdvisorPropsDTO {
  advisorIdentification: string;
  updateFields: UpdateFieldsDTO;
}

export interface UpdateFieldsDTO {
  name?: string;
  surname?: string;
  registrationNumber?: string;
}
export class UpdateAdvisorUseCase {
  constructor(private advisorRepository: IAdvisorRepository) {}
  async execute(updateAdvisorProps: UpdateAdvisorPropsDTO, userRole: string): Promise<EitherOO<Error, Advisor>> {
    if (userRole !== Role.LIBRARIAN) {
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "PERMISSION_DENIED",
          "your role does not have permission",
          new Error("Permission denied")
        )
      );
    }
    const { updateFields, advisorIdentification } = updateAdvisorProps;

    // Faz a validação para garantir que os novos dados do orientador sigam as regras de negócio
    const advisorDefinedFields = Object.entries(updateFields);
    let validFieldsToUpdate: UpdateFieldsDTO = {};
    for (let i = 0; i < advisorDefinedFields.length; i++) {
      const fieldUpdate = this.updateValidateFields(
        advisorDefinedFields[i][0], // Pega a "chave" Ex: "name"
        advisorDefinedFields[i][1] // Pega o "valor" Ex: "fulano"
      );
      // Se houver algum campo que não segue as regras necessárias, irá retornar um erro
      if (fieldUpdate.isLeft()) {
        return new Left(fieldUpdate.value); // Retorna o erro imediatamente, se houver.
      }
      validFieldsToUpdate = { ...validFieldsToUpdate, ...fieldUpdate.value };
    }
    const result = await this.advisorRepository.updateAdvisor(validFieldsToUpdate, advisorIdentification);
    if (result instanceof Error) {
      return new Left(new DomainError(ErrorCategory.Application, "ERROR_TO_UPDATED_ADVISOR", result.message, result));
    }
    return new Right(result as Advisor);
  }

  private updateValidateFields(key: string, value: string): EitherOO<DomainError, Partial<UpdateFieldsDTO>> {
    switch (key) {
      case "name": {
        const updatedNameToApplyOrNot = AdvisorFactory.validateNameField(value);
        if (updatedNameToApplyOrNot.isLeft()) {
          return new Left(updatedNameToApplyOrNot.value);
        } else if (updatedNameToApplyOrNot.isRight()) return new Right({ name: updatedNameToApplyOrNot.value });
      }
      case "surname": {
        const updatedSurnameToApplyOrNot = AdvisorFactory.validateSurnameField(value);
        if (updatedSurnameToApplyOrNot.isLeft()) {
          return new Left(updatedSurnameToApplyOrNot.value);
        }
        if (updatedSurnameToApplyOrNot.isRight()) return new Right({ surname: updatedSurnameToApplyOrNot.value });
      }
      case "registrationNumber": {
        const updatedRegistrationNumberToApplyOrNot = AdvisorFactory.validateRegistrationNumberField(value);
        if (updatedRegistrationNumberToApplyOrNot.isLeft()) {
          return new Left(updatedRegistrationNumberToApplyOrNot.value);
        }
        if (updatedRegistrationNumberToApplyOrNot.isRight())
          return new Right({ registrationNumber: updatedRegistrationNumberToApplyOrNot.value });
      }
    }
    return new Left(
      new DomainError(ErrorCategory.Application, "Unexpected Error", "Undexpected error to validate fields to update ")
    );
  }

  // async execute(updateAdvisorProps: UpdateAdvisorPropsDTO): Promise<Either<Error, Advisor>> {
  //     const updateFields = updateAdvisorProps.updateFields;
  //     const advisorIdentification = updateAdvisorProps.advisorIdentification;

  //     // Seleciona o orientador que terá seus dados atualizados
  //     const advisorExisting = await this.advisorRepository.advisorExisting(advisorIdentification);
  //     if (!advisorExisting) {
  //         return new Left(AdvisorErrors.AdvisorNotFound());
  //     }

  //     // Faz a validação para garantir que os novos dados do orientador sigam as regras de negócio
  //     const advisorDefinedFields = Object.entries(updateFields)
  //     let validFieldsToUpdate: UpdateFieldsDTO = {};
  //     for (let i = 0; i < advisorDefinedFields.length; i++) {
  //         const fieldUpdate = this.updateValidateFields(
  //             advisorDefinedFields[i][0],// Pega a "chave" Ex: "name"
  //             advisorDefinedFields[i][1] // Pega o "valor" Ex: "fulano"
  //         );
  //         // Se houver algum campo que não segue as regras necessárias, irá retornar um erro
  //         if (fieldUpdate.isLeft()) {
  //             return new Left(fieldUpdate.value); // Retorna o erro imediatamente, se houver.
  //         }
  //         validFieldsToUpdate = { ...validFieldsToUpdate, ...fieldUpdate.value };
  //     }
  //     const advisorUpdated = await this.advisorRepository.updateAdvisor(validFieldsToUpdate, updateAdvisorProps.advisorIdentification);
  //     if (advisorUpdated.isLeft()) {
  //         return new Left(advisorUpdated.value);
  //     }
  //     return new Right(advisorUpdated.value as Advisor);
  // }

  // private updateValidateFields(key: string, value: string): Either<DomainError, Partial<UpdateFieldsDTO>> {
  //     switch (key) {
  //         case "name": {
  //             const updatedNameToApplyOrNot = AdvisorFactory.validateNameField(value);
  //             if (updatedNameToApplyOrNot.isLeft()) {
  //                 return new Left(updatedNameToApplyOrNot.value);
  //             } else if (updatedNameToApplyOrNot.isRight())
  //                 return new Right({ name: updatedNameToApplyOrNot.value });
  //         }
  //         case "surname": {
  //             const updatedSurnameToApplyOrNot = AdvisorFactory.validateSurnameField(value);
  //             if (updatedSurnameToApplyOrNot.isLeft()) {
  //                 return new Left(updatedSurnameToApplyOrNot.value);
  //             } if ((updatedSurnameToApplyOrNot.isRight()))
  //                 return new Right({ surname: updatedSurnameToApplyOrNot.value });
  //         }
  //         case "registrationNumber": {
  //             const updatedRegistrationNumberToApplyOrNot = AdvisorFactory.validateRegistrationNumberField(value);
  //             if (updatedRegistrationNumberToApplyOrNot.isLeft()) {
  //                 return new Left(updatedRegistrationNumberToApplyOrNot.value);
  //             } if (updatedRegistrationNumberToApplyOrNot.isRight())
  //                 return new Right({ registrationNumber: updatedRegistrationNumberToApplyOrNot.value });
  //         }
  //     }
  //     return new Left(new DomainError(ErrorCategory.Application, "Unexpected Error", ["Undexpected error to validate fields to update "]));
  // }
}
