import nodemailer from "nodemailer"
export const emailAdapter = {
    async sendEmail (email: string, message: string, subject: string): Promise<object> {
        let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "jenbka999@gmail.com",
          pass: process.env.PASSWORD_GMAIL
        },
      })
        let info = await transport.sendMail({
        from: 'Evgeniy <jenbka999@gmail.com>',
        to: email,
        subject: subject,
        html: message
    })
     return info
    }
}