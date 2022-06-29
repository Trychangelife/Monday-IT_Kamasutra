import { injectable } from "inversify"
import { emailManager } from "../managers/email-manager"
import { usersModel } from "../repositories/db"



@injectable()
export class EmailService {

    async emailConfirmation(email: string): Promise<object | boolean> {
        const foundUser = await usersModel.findOne({ 'accountData.email': email })
        const statusAccount = await usersModel.findOne({'accountData.email': email, 'emailConfirmation.activatedStatus': false})
        if (foundUser !== null && statusAccount !== null) {
            return await emailManager.sendEmailConfirmation(foundUser)
        }
        else {
            return false
        }
    }
}
