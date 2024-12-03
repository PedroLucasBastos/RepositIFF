import { AdvisorProps } from "@src/domain/entities/advisor.js";
import { UpdateAdvisorPropsDTO, UpdateFieldsDTO } from "../updateAdvisor.js";

type updateForm = {
    registrationNumber: string,
    surname: string,
}

export class AdvisorsProducts {
    static valid(): AdvisorProps {
        return {
            name: "João",
            surname: "Peçanha",
            registrationNumber: "12345",
        };
    }

    static invalidName(): AdvisorProps {
        return {
            name: "   ",
            surname: "Peçanha",
            registrationNumber: "12345",
        };
    }
    static invalidSurname(): AdvisorProps {
        return {
            name: "João",
            surname: "   ",
            registrationNumber: "12345",
        };
    }
    static invalidRegistrationNumber(): AdvisorProps {
        return {
            name: "João",
            surname: "Peçanha",
            registrationNumber: "  ",
        };
    }
    static duplicateRegistrationNumber(): AdvisorProps {
        return {
            name: "Raquel",
            surname: "Duarte",
            registrationNumber: "12345",
        }

    }
    static updateSurnameValid(): updateForm {
        return {
            registrationNumber: "12345",
            surname: "Sobronome atualizado",
        }
    }

    static delete(): string {
        return "12345"
    }
}