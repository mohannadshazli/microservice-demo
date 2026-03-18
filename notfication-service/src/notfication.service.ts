import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import * as nodemailer from "nodemailer";

@Injectable()
export class NotficationService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    const info = await this.mailerService.sendMail({
      to: email,
      subject: `Welcome ${name}🎉`,
      html: `<h1>Welcome ${name} 👋</h1><p>Glad to have you!</p>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Preview URL:", previewUrl);
  }
}
