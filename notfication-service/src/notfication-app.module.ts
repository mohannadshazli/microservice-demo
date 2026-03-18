import { Module } from "@nestjs/common";
import { NotficationService } from "./notfication.service";
import { NotficationHandler } from "./notfication.handler";
import { MailerModule } from "@nestjs-modules/mailer";
import * as nodemailer from "nodemailer";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        const testAccount = await nodemailer.createTestAccount();

        return {
          transport: {
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          },
          defaults: {
            from: '"No Reply" <no-reply@test.com>',
          },
        };
      },
    }),
  ],
  providers: [NotficationService],
  controllers: [NotficationHandler],
})
export class NotficationAppModule {}
