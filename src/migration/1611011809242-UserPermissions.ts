import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPermissions1611011809242 implements MigrationInterface {
	name = "UserPermissions1611011809242";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" RENAME COLUMN "role" TO "permissions"`
		);
		await queryRunner.query(
			`ALTER TYPE "public"."user_role_enum" RENAME TO "user_permissions_enum"`
		);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "permissions"`);
		await queryRunner.query(
			`ALTER TABLE "user" ADD "permissions" text array`
		);

		await queryRunner.query(`UPDATE "user" SET "permissions"='{}'`);

		await queryRunner.query(
			`ALTER TABLE "user" ALTER COLUMN "permissions" SET NOT NULL`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "permissions"`);
		await queryRunner.query(
			`ALTER TABLE "user" ADD "permissions" "user_permissions_enum" NOT NULL DEFAULT 'user'`
		);
		await queryRunner.query(
			`ALTER TYPE "user_permissions_enum" RENAME TO "user_role_enum"`
		);
		await queryRunner.query(
			`ALTER TABLE "user" RENAME COLUMN "permissions" TO "role"`
		);
	}
}
