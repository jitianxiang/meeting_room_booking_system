import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '1319706721@qq.com',
        pass: 'hzzbokuuapdrhdeb',
      },
    });
  }
  async sendEmail({ to, subject, html }) {
    const info = await this.transporter.sendMail({
      from: '"Captcha" <1319706721@qq.com>',
      to,
      subject,
      html,
    });
    console.log(info);
  }
}
