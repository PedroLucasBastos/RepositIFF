import { describe, it, expect } from "vitest";
import { Course, degreeType } from "../course.js";

describe("Instatiate a Course entity", () => {
    it("Should be able instatiate a course class correctly ", () => {
        const courseOrError = Course.createCourse({
            name: "Sistemas de Informação",
            courseCode: "SI200",
            degreeType: degreeType.Bachelor
        });
        const course = courseOrError.value;
        expect(course).instanceOf(Course);
    })
})