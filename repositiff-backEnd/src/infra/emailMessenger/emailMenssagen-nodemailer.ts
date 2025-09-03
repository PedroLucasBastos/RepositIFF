import nodemailer from "nodemailer";

export class EmailMessengerNodemailer {
  private _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendResetPassEmail(email: string, token: string): Promise<void> {
    const subject = "Redefinição de Senha";
    const body = `
      <h1>Redefinição de Senha</h1>
      <p>Para redefinir sua senha, clique no link abaixo:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Redefinir Senha</a>
    `;
    await this._transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: body,
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this._transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html: body,
    });
  }
}
