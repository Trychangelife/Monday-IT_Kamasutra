import { emailManager } from "../managers/email-manager"
import { usersCollection } from "../repositories/db"



export const emailService = {
    async emailConfirmation(email: string): Promise<object | boolean> {
        const foundUser = await usersCollection.findOne({ 'accountData.email': email })
        const statusAccount = await usersCollection.findOne({'accountData.email': email, 'emailConfirmation.activatedStatus': false})
        if (foundUser !== null && statusAccount !== null) {
            return await emailManager.sendEmailConfirmation(foundUser)
        }
        else {
            return false
        }
    }
}