import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  async sendEmail({ to, subject, html }) {
    // resend免费邮件服务器发送示例邮件
    const resend = new Resend('re_HeUX2Wgq_E9L5NmSr7JyhZYmKC7UcDxc7');
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
    if (error) {
      return console.error({ error });
    }
    console.log({ data });
  }
}
