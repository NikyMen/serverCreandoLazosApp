ALTER TABLE "User"
ADD COLUMN "name" TEXT,
ADD COLUMN "dni" TEXT;

UPDATE "User"
SET
  "name" = COALESCE(NULLIF(split_part("email", '@', 1), ''), 'Usuario'),
  "dni" = 'TEMP-' || replace("id", '-', '')
WHERE "name" IS NULL OR "dni" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "dni" SET NOT NULL;

CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");
