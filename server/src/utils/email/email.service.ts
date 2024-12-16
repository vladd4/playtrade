import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ukr.net',
      port: 465,
      secure: true,
      auth: {
        user: 'maks.chell@ukr.net',
        pass: 'Q1CAXW9F7iCxrnYz',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    username: string,
    code: string,
  ): Promise<void> {
    const mailOptions = {
      from: '"PlayTrade" <maks.chell@ukr.net>',
      to: to,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="text-align: center; color: #4CAF50;">Verification Code</h2>
                <p>Dear ${username},</p>
                <p>Thank you for registering with PlayTrade. Please use the following verification code to complete your registration:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; padding: 10px 20px; font-size: 18px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;" onclick="navigator.clipboard.writeText('${code}'); alert('Verification code copied!');">
                        ${code}
                    </span>
                </div>
                <p>If you did not request this verification code, please ignore this email.</p>
                <p>Best regards,<br>PlayTrade Team</p>
            </div>
            `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendTemporaryPassword(
    to: string,
    username: string,
    temporaryPassword: string,
  ): Promise<void> {
    const mailOptions = {
      from: '"PlayTrade" <maks.chell@ukr.net>',
      to: to,
      subject: 'Temporary Password',
      text: `Dear ${username}, your temporary password is: ${temporaryPassword}. Please change it as soon as possible.`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="text-align: center; color: #4CAF50;">Temporary Password</h2>
                <p>Dear ${username},</p>
                <p>Your temporary password is:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; padding: 10px 20px; font-size: 18px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
                        ${temporaryPassword}
                    </span>
                </div>
                <p>Please change it as soon as possible.</p>
                <p>If you did not request this password, please ignore this email.</p>
                <p>Best regards,<br>PlayTrade Team</p>
            </div>
            `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
