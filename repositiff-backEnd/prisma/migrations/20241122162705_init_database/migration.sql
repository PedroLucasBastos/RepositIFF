-- CreateTable
CREATE TABLE "AcademicWork" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "typeWork" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "qtdPag" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "keyWords" TEXT[],
    "academicWorkStatus" TEXT NOT NULL,
    "cutterNumber" TEXT,
    "cduCode" TEXT,
    "cddCode" TEXT,
    "url" TEXT,

    CONSTRAINT "AcademicWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advisor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Librarian" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "pass" TEXT NOT NULL,

    CONSTRAINT "Librarian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AcademicWorkToAdvisor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AcademicWorkToAuthor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Librarian_email_key" ON "Librarian"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Librarian_registrationNumber_key" ON "Librarian"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_AcademicWorkToAdvisor_AB_unique" ON "_AcademicWorkToAdvisor"("A", "B");

-- CreateIndex
CREATE INDEX "_AcademicWorkToAdvisor_B_index" ON "_AcademicWorkToAdvisor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AcademicWorkToAuthor_AB_unique" ON "_AcademicWorkToAuthor"("A", "B");

-- CreateIndex
CREATE INDEX "_AcademicWorkToAuthor_B_index" ON "_AcademicWorkToAuthor"("B");

-- AddForeignKey
ALTER TABLE "_AcademicWorkToAdvisor" ADD CONSTRAINT "_AcademicWorkToAdvisor_A_fkey" FOREIGN KEY ("A") REFERENCES "AcademicWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcademicWorkToAdvisor" ADD CONSTRAINT "_AcademicWorkToAdvisor_B_fkey" FOREIGN KEY ("B") REFERENCES "Advisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcademicWorkToAuthor" ADD CONSTRAINT "_AcademicWorkToAuthor_A_fkey" FOREIGN KEY ("A") REFERENCES "AcademicWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcademicWorkToAuthor" ADD CONSTRAINT "_AcademicWorkToAuthor_B_fkey" FOREIGN KEY ("B") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
