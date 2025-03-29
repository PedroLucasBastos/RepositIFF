import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { IReturnAcademicWorkDTO } from '@src/infra/repositories/IAcademicWorkRepository.js';
import { MapperAdvisor } from "./mapperAdvisor.js";
import { MapperCourse } from "./mapperCourse.js";
import { AcademicWork, Illustration, typeWork } from "@src/domain/entities/academicWork.js";

export class MapperAcademicWork {
    static dbToCode(data: IReturnAcademicWorkDTO): DomainError | AcademicWork {
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
        const result = AcademicWork.createAcademicWorkFactory({
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
        })
        return result.value;
    }
}