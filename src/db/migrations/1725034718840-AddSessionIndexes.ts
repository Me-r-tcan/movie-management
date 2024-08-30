import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionIndexes1725034718840 implements MigrationInterface {
    name = 'AddSessionIndexes1725034718840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_session_room_number" ON "session" ("roomNumber") `);
        await queryRunner.query(`CREATE INDEX "idx_session_date_time" ON "session" ("date", "timeSlot") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_session_date_time"`);
        await queryRunner.query(`DROP INDEX "public"."idx_session_room_number"`);
    }

}
