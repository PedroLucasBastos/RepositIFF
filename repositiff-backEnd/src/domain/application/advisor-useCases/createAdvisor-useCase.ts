import { Advisor, AdvisorProps } from "@src/domain/entities/advisor.js";
import { AdvisorFactory } from "@src/domain/entities/factories/advisorFactory.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { AdvisorErrors } from "@src/domain/errorsDomain/advisorErrorDomain.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { Role, User } from "@src/domain/entities/user.js";

type response = EitherOO<DomainError, Advisor>;

interface ICreateAdvisorUseCaseProps {
  newAdvisor: {
    name: string;
    surname: string;
    registrationNumber: string;
  };
}

export class CreateAdvisorUseCase {
  constructor(private advisorRepostory: IAdvisorRepository) {}
  async execute(newAdvisorProps: AdvisorProps, userRole: string): Promise<response> {
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

    const advisorOrError = AdvisorFactory.createAdvisor(newAdvisorProps);
    if (advisorOrError.isLeft()) {
      return new Left(advisorOrError.value);
    }

    const advisor = advisorOrError.value as Advisor;
    // console.log(advisor);

    const resultOrError = await this.advisorRepostory.addAdvisor(advisor);
    if (resultOrError instanceof Error) {
      return new Left(
        new DomainError(ErrorCategory.Application, "ERROR_TO_CADASTRATE_ADVISOR", resultOrError.message, resultOrError)
      );
    }
    return new Right(resultOrError as Advisor);
  }

  async teste() {
    // const resultOrError = await this._repo.addCourse(course);
    // if (resultOrError instanceof Error)
    //     return new Left(
    //         new DomainError(
    //             ErrorCategory.Application,
    //             "ERROR_TO_CADASTRATE_COURSE",
    //             resultOrError.message,
    //             resultOrError
    //         )
    //     )
    // return new Right(resultOrError as Course);
  }
}
