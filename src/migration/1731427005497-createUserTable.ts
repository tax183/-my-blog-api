import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1731427005497 implements MigrationInterface {
    name = 'CreateUserTable1731427005497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // تم إزالة السطر التالي لأن العمود `isactiav` غير موجود في قاعدة البيانات
        // await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isactiav\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // تم تعليق السطر الذي يضيف العمود `isactiav` أثناء عملية التراجع، إذا لم يكن العمود مطلوبًا.
        // await queryRunner.query(`ALTER TABLE \`users\` ADD \`isactiav\` varchar(255) NOT NULL`);
    }
}

