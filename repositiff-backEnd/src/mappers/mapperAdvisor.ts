import { Advisor } from "@src/domain/entities/advisor.js";
import { AdvisorFactory } from "@src/domain/entities/factories/advisorFactory.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Right } from "@src/error_handling/either.js";
import { IAdvisorDTO } from "@src/infra/repositories/IAdvisorRepository.js";


export class MapperAdvisor {

    static many(data: IAdvisorDTO[]): DomainError | Advisor[] {
        let errorResult: {
            advisor: {
                id: string,
                name: string,
                surname: string,
            },
            error: DomainError
        }[] = [];

        const advisorOrError = data.map(advisor => {
            const result = AdvisorFactory.createAdvisor({
                name: advisor.name,
                surname: advisor.surname,
                registrationNumber: advisor.registrationNumber,
            }, advisor.id)
            if (result.isLeft())
                errorResult.push({
                    advisor: {
                        id: advisor.id,
                        name: advisor.name,
                        surname: advisor.surname,
                    },
                    error: result.value
                });
            return result;
        })
        if (errorResult.length > 0) {
            // Concatenando as mensagens de erro de forma adequada
            const errorDetails = errorResult.map((result) => {
                return `Advisor ID: ${result.advisor.id}, Name: ${result.advisor.name} ${result.advisor.surname}, Error: ${result.error.message}`;
            }).join('\n');

            return new DomainError(
                ErrorCategory.Application,
                "ERROR_TO_MAPPING_MANY_ADVISORS",
                `Error to mapping many advisors - Advisor wrong is: \n${errorDetails}`
            );
        }
        return (advisorOrError.map((result) => result.value as Advisor));
    }
}
