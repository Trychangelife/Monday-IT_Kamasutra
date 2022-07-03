import "reflect-metadata"
import { Container } from 'inversify'
import { UsersRepository } from "../repositories/users-repository"
import { EmailService } from "./email-service"
import { UsersService } from "./users-service"
import { BloggerController } from "../routes/BloggerController"
import { BloggerService } from "./bloggers-service"
import { BloggerRepository } from "../repositories/bloggers-repositories"
import { PostController } from "../routes/PostController"
import { PostsService } from "./posts-service"
import { PostRepository } from "../repositories/posts-repositories"
import { AuthController } from "../routes/AuthController"
import { AuthService } from "./auth-service"
import { CommentsController } from "../routes/CommentsController"
import { CommentsService } from "./comments-service"
import { CommentsRepository } from "../repositories/comments-repository"
import { UsersController } from "../routes/UsersController"
import { UsersType } from "../types/Types"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { usersModel } from "../repositories/db"

describe("integration tests for AuthService", () => {

    let mongoServer: MongoMemoryServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    const usersRepository = new UsersRepository()
    const emailService = new EmailService()
    const usersService = new UsersService(usersRepository, emailService)

    describe("create user", () => {
        const login = "LoginForTest"
            const password = "6length"
            const email = "zkonstantinov1@bk.ru"
            const ip = "172.168.202.232"
        afterAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })


        it('Should return', async () => {
            const result: UsersType | null | boolean = await usersService.createUser(login, password, email, ip)
            if (typeof result == "object") {
                expect(result?.login).toBe(login)
                expect(result?.accountData.email).toBe(email)
                expect(result?.emailConfirmation.activatedStatus).toBe(false)

            }
        })
        it('Should return error becouse email and login already use', async () => {
            const result: UsersType | null | boolean = await usersService.createUser(login, password, email, ip)
            expect(result).toBeFalsy()
        })
    })
})











// const container = new Container()

// container.bind(BloggerController).to(BloggerController)
// container.bind<BloggerService>(BloggerService).to(BloggerService)
// container.bind<BloggerRepository>(BloggerRepository).to(BloggerRepository)

// container.bind(PostController).to(PostController)
// container.bind<PostsService>(PostsService).to(PostsService)
// container.bind<PostRepository>(PostRepository).to(PostRepository)

// container.bind(AuthController).to(AuthController)
// container.bind<AuthService>(AuthService).to(AuthService)

// container.bind(EmailService).to(EmailService)

// container.bind<CommentsController>(CommentsController).to(CommentsController)
// container.bind<CommentsService>(CommentsService).to(CommentsService)
// container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)

// container.bind<UsersController>(UsersController).to(UsersController)
// container.bind<UsersService>(UsersService).to(UsersService)
// container.bind<UsersRepository>(UsersRepository).to(UsersRepository)
