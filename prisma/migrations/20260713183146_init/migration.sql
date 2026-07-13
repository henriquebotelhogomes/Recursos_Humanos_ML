-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeNumber" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "attrition" TEXT NOT NULL,
    "businessTravel" TEXT NOT NULL,
    "dailyRate" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "distanceFromHome" INTEGER NOT NULL,
    "education" INTEGER NOT NULL,
    "educationField" TEXT NOT NULL,
    "environmentSatisfaction" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "hourlyRate" INTEGER NOT NULL,
    "jobInvolvement" INTEGER NOT NULL,
    "jobLevel" INTEGER NOT NULL,
    "jobRole" TEXT NOT NULL,
    "jobSatisfaction" INTEGER NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "monthlyIncome" INTEGER NOT NULL,
    "monthlyRate" INTEGER NOT NULL,
    "numCompaniesWorked" INTEGER NOT NULL,
    "over18" TEXT NOT NULL,
    "overTime" TEXT NOT NULL,
    "percentSalaryHike" INTEGER NOT NULL,
    "performanceRating" INTEGER NOT NULL,
    "relationshipSatisfaction" INTEGER NOT NULL,
    "standardHours" INTEGER NOT NULL,
    "stockOptionLevel" INTEGER NOT NULL,
    "totalWorkingYears" INTEGER NOT NULL,
    "trainingTimesLastYear" INTEGER NOT NULL,
    "workLifeBalance" INTEGER NOT NULL,
    "yearsAtCompany" INTEGER NOT NULL,
    "yearsInCurrentRole" INTEGER NOT NULL,
    "yearsSinceLastPromotion" INTEGER NOT NULL,
    "yearsWithCurrManager" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "attritionProbability" REAL,
    "predictedAttrition" BOOLEAN,
    "riskScore" INTEGER,
    "riskLevel" TEXT,
    "topRiskFactors" TEXT,
    "modelVersion" TEXT,
    "scoredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiskConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "mediumRiskThreshold" INTEGER NOT NULL DEFAULT 35,
    "highRiskThreshold" INTEGER NOT NULL DEFAULT 60,
    "criticalRiskThreshold" INTEGER NOT NULL DEFAULT 80,
    "activeModelVersion" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ModelRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modelVersion" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "rocAuc" REAL NOT NULL,
    "prAuc" REAL NOT NULL,
    "precision" REAL NOT NULL,
    "recall" REAL NOT NULL,
    "f1" REAL NOT NULL,
    "accuracy" REAL NOT NULL,
    "threshold" REAL NOT NULL,
    "trainedAt" DATETIME NOT NULL,
    "notes" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeNumber_key" ON "Employee"("employeeNumber");

-- CreateIndex
CREATE INDEX "Employee_isActive_idx" ON "Employee"("isActive");

-- CreateIndex
CREATE INDEX "Employee_department_idx" ON "Employee"("department");

-- CreateIndex
CREATE INDEX "Employee_riskLevel_idx" ON "Employee"("riskLevel");
