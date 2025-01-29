import { degreeType, ICourseProps } from "@src/domain/entities/course.js";


export class CoursesToTests {

    static Correctly(): ICourseProps {
        return {
            name: "Sistemas de Informação",
            courseCode: "CO1025",
            degreeType: degreeType.Bachelor,
        }
    }

    static duplicate(): ICourseProps[] {
        return [
            {
                name: "Sistemas de Informação",
                courseCode: "CA",
                degreeType: degreeType.Bachelor,
            },
            {
                name: "Análise e desenvolviemnto de Sistemas",
                courseCode: "CO1025",
                degreeType: degreeType.Licentiate,
            },

        ]
    }

    static IncorrectlyCourseCode(): ICourseProps {
        return {
            name: "Sistemas de Informação",
            courseCode: "",
            degreeType: degreeType.Bachelor,
        }
    }


}