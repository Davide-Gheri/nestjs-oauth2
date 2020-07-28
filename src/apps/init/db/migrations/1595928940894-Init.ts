import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1595928940894 implements MigrationInterface {
    name = 'Init1595928940894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "o_auth_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "clientId" uuid NOT NULL, "scopes" character varying array, "revoked" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, "redirectUri" character varying NOT NULL, CONSTRAINT "PK_b4747b19df91755088612f7c335" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8567908b2fff43992c65bae93f" ON "o_auth_code" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_14eb25a7bba8933deb6b312a4c" ON "o_auth_code" ("clientId") `);
        await queryRunner.query(`CREATE TABLE "o_auth_client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "secret" character varying NOT NULL, "redirect" character varying array NOT NULL, "meta" json NOT NULL DEFAULT '{}', "grantTypes" character varying array NOT NULL DEFAULT '{authorization_code}'::varchar[], "responseTypes" character varying array NOT NULL DEFAULT '{code}'::varchar[], "responseModes" character varying array NOT NULL DEFAULT '{query}'::varchar[], "scopes" character varying array NOT NULL DEFAULT '{openid,email,profile,offline_access}'::varchar[], "firstParty" boolean NOT NULL DEFAULT false, "authMethods" character varying array NOT NULL DEFAULT '{client_secret_basic,client_secret_post}'::varchar[], CONSTRAINT "PK_bb5360d8a267cd78c52e205311b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "o_auth_access_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "revokedAt" TIMESTAMP, "userId" uuid, "clientId" uuid NOT NULL, "scopes" character varying array, "grantType" character varying NOT NULL, CONSTRAINT "PK_3fcadb0995201785f571d30b061" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social_login" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "socialId" character varying NOT NULL, "userId" uuid NOT NULL, "picture" character varying, CONSTRAINT "PK_2bdf71561052225eff3012ba1fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nickname" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying, "emailVerifiedAt" TIMESTAMP, "password" character varying, "role" character varying NOT NULL DEFAULT 'USER', "tfaSecret" character varying, "tfaEnabled" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "o_auth_refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "revokedAt" TIMESTAMP, "accessTokenId" uuid NOT NULL, CONSTRAINT "PK_05c2c1fd0dcb16ca7dd795a7ec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" character varying NOT NULL, "data" text NOT NULL, CONSTRAINT "PK_5bd67cf28791e02bf07b0367ace" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "o_auth_code" ADD CONSTRAINT "FK_14eb25a7bba8933deb6b312a4ce" FOREIGN KEY ("clientId") REFERENCES "o_auth_client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "o_auth_code" ADD CONSTRAINT "FK_8567908b2fff43992c65bae93f7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "o_auth_access_token" ADD CONSTRAINT "FK_9c74e1755232ac931c59ce0c851" FOREIGN KEY ("clientId") REFERENCES "o_auth_client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "o_auth_access_token" ADD CONSTRAINT "FK_439df814d074c444e019b70fe41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "social_login" ADD CONSTRAINT "FK_83cf7c30a11f788f67ffd66577d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "o_auth_refresh_token" ADD CONSTRAINT "FK_32d26e5c30d22c7757288022419" FOREIGN KEY ("accessTokenId") REFERENCES "o_auth_access_token"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "o_auth_refresh_token" DROP CONSTRAINT "FK_32d26e5c30d22c7757288022419"`);
        await queryRunner.query(`ALTER TABLE "social_login" DROP CONSTRAINT "FK_83cf7c30a11f788f67ffd66577d"`);
        await queryRunner.query(`ALTER TABLE "o_auth_access_token" DROP CONSTRAINT "FK_439df814d074c444e019b70fe41"`);
        await queryRunner.query(`ALTER TABLE "o_auth_access_token" DROP CONSTRAINT "FK_9c74e1755232ac931c59ce0c851"`);
        await queryRunner.query(`ALTER TABLE "o_auth_code" DROP CONSTRAINT "FK_8567908b2fff43992c65bae93f7"`);
        await queryRunner.query(`ALTER TABLE "o_auth_code" DROP CONSTRAINT "FK_14eb25a7bba8933deb6b312a4ce"`);
        await queryRunner.query(`DROP TABLE "key"`);
        await queryRunner.query(`DROP TABLE "o_auth_refresh_token"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "social_login"`);
        await queryRunner.query(`DROP TABLE "o_auth_access_token"`);
        await queryRunner.query(`DROP TABLE "o_auth_client"`);
        await queryRunner.query(`DROP INDEX "IDX_14eb25a7bba8933deb6b312a4c"`);
        await queryRunner.query(`DROP INDEX "IDX_8567908b2fff43992c65bae93f"`);
        await queryRunner.query(`DROP TABLE "o_auth_code"`);
    }

}
