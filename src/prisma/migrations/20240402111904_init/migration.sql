-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_telegram" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT
);
INSERT INTO "new_User" ("email", "id", "id_telegram", "name") SELECT "email", "id", "id_telegram", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_telegram_key" ON "User"("id_telegram");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
