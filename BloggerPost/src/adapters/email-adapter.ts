import nodemailer from "nodemailer"
export const emailAdapter = {
    async sendEmail (email: string, message: string, subject: string): Promise<object> {
        let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "developerjuniorevgeniy@gmail.com",
          pass: "umbzrnxajzjjirul"
        },
      })
        let info = await transport.sendMail({
        from: 'Evgeniy <developerjuniorevgeniy@gmail.com>',
        to: email,
        subject: subject,
        html: message
    })
        console.log(info)
        return ({
        "email": email,
        "message": message,
        "subject": subject
    })
    }
}