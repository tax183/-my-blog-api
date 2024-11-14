import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticles1731429879971 implements MigrationInterface {
    name = 'CreateArticles1731429879971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`isnew\` \`authorId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`authorId\``);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`authorId\``);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`authorId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`authorId\` \`isnew\` varchar(255) NOT NULL`);
    }

}
