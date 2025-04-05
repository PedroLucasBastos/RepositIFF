import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { IReturnAcademicWorkDTO } from '@src/infra/repositories/IAcademicWorkRepository.js';
import { MapperAdvisor } from "./mapperAdvisor.js";
import { MapperCourse } from "./mapperCourse.js";
import { AcademicWork, Illustration, typeWork } from "@src/domain/entities/academicWork.js";

export class MapperAcademicWork {

    static toDTO(data: any): IReturnAcademicWorkDTO {
        console.log("================================================ toDTO =====================================================================================")
        console.log(data.id)
        console.log("=======================================================")
        const mapper = {
            id: data.id,
            academicWorkStatus: data.academicWorkStatus,
            authors: data.authors,
            advisors: data.advisors.map((advisor: any) => ({
                id: advisor.id,
                name: advisor.Advisor.name,
                surname: advisor.Advisor.surname,
                registrationNumber: advisor.Advisor.registrationNumber
            })),
            course: {
                id: data.courseId,
                degreeType: data.course.degreeType,
                name: data.course.name,
                courseCode: data.course.courseCode
            },
            title: data.title,
            typeWork: data.typeWork,
            year: data.year,
            qtdPag: data.qtdPag,
            description: data.description,
            keyWords: data.keyWords,
            ilustration: data.ilustration,
            references: data.references,
            cutterNumber: data.cutterNumber,
            cduCode: data.cduCode,
            cddCode: data.cddCode,
            file: data.file
        };
        console.log(`Depois de mapear: ${mapper.id}`)
        return mapper;
    }

    static dtoToEntity(data: any): DomainError | AcademicWork {
        const { advisors, course, ...academicWorkDATA } = data;
        console.log("asdfasdjfasdjfkasd")
        console.log(academicWorkDATA.file)
        console.log("-------------------------------------")
        const advisorsEntity = MapperAdvisor.many(advisors);
        if (advisorsEntity instanceof DomainError)
            return advisorsEntity;
        const courseEntity = MapperCourse.mapping(course);
        if (courseEntity instanceof DomainError)
            return courseEntity;
        const result = AcademicWork.createAcademicWorkFactory(
            {
                authors: academicWorkDATA.authors,
                advisors: advisorsEntity,
                title: academicWorkDATA.title,
                typeWork: academicWorkDATA.typeWork as typeWork,
                year: academicWorkDATA.year,
                qtdPag: academicWorkDATA.qtdPag,
                description: academicWorkDATA.description,
                course: courseEntity,
                keyWords: academicWorkDATA.keyWords,
                illustration: academicWorkDATA.ilustration as Illustration,
                references: academicWorkDATA.references,
                file: academicWorkDATA.file || undefined
            }, data.id)
        return result.value;
    }
}