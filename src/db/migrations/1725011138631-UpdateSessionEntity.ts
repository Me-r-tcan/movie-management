import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSessionEntity1725011138631 implements MigrationInterface {
    name = 'UpdateSessionEntity1725011138631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session_watched_by_user" ("sessionId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_af1f845d0261c9fa7aa7ddf0c25" PRIMARY KEY ("sessionId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b93368e5e75a8cf59e5858b022" ON "session_watched_by_user" ("sessionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7d14926a395157f170440d6970" ON "session_watched_by_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "session_watched_by_user" ADD CONSTRAINT "FK_b93368e5e75a8cf59e5858b022e" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "session_watched_by_user" ADD CONSTRAINT "FK_7d14926a395157f170440d69702" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_watched_by_user" DROP CONSTRAINT "FK_7d14926a395157f170440d69702"`);
        await queryRunner.query(`ALTER TABLE "session_watched_by_user" DROP CONSTRAINT "FK_b93368e5e75a8cf59e5858b022e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d14926a395157f170440d6970"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b93368e5e75a8cf59e5858b022"`);
        await queryRunner.query(`DROP TABLE "session_watched_by_user"`);
    }

}
