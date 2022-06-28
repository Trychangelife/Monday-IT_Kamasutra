import "reflect-metadata"
import { Container } from 'inversify'
import { AuthService } from "./domain/auth-service";
import { BloggerService } from "./domain/bloggers-service";
import { CommentsService } from "./domain/comments-service";
import { EmailService } from "./domain/email-service";
import { PostsService } from "./domain/posts-service";
import { UsersService } from "./domain/users-service";
import { BloggerRepository } from "./repositories/bloggers-repositories";
import { CommentsRepository } from "./repositories/comments-repository";
import { PostRepository } from "./repositories/posts-repositories";
import { UsersRepository } from "./repositories/users-repository";
import { AuthController } from "./routes/AuthController";
import { BloggerController } from "./routes/BloggerController";
import { CommentsController } from "./routes/CommentsController";
import { PostController } from "./routes/PostController";
import { UsersController } from "./routes/UsersController";



// const bloggerRepository = new BloggerRepository()
// const commentsRepository = new CommentsRepository()
// const postsRepository = new PostRepository()

// // Данный репозиторий экспортируется, для использования в сторонних сервисах, чтобы не переключать их на классы.
export const usersRepository = new UsersRepository()

// const bloggersService = new BloggerService(bloggerRepository)
// const commentsService = new CommentsService(commentsRepository)
const emailService = new EmailService()
// const authService = new AuthService(usersRepository)
// const postsService = new PostsService(postsRepository)

// // Данный сервис экспортируется, для использования в сторонних сервисах, чтобы не переключать их на классы.
export const usersService = new UsersService(usersRepository, emailService)

// export const authController = new AuthController(usersRepository, usersService, authService, emailService)
// export const bloggerController = new BloggerController(bloggersService, postsService)
// export const postsController = new PostController(postsService)
// export const commentsController = new CommentsController(commentsService)
// export const usersController = new UsersController(usersService)

export const container = new Container()

container.bind(BloggerController).to(BloggerController)
container.bind<BloggerService>(BloggerService).to(BloggerService)
container.bind<BloggerRepository>(BloggerRepository).to(BloggerRepository)

container.bind(PostController).to(PostController)
container.bind<PostsService>(PostsService).to(PostsService)
container.bind<PostRepository>(PostRepository).to(PostRepository)

container.bind(AuthController).to(AuthController)
container.bind<AuthService>(AuthService).to(AuthService)

container.bind(EmailService).to(EmailService)

container.bind<CommentsController>(CommentsController).to(CommentsController)
container.bind<CommentsService>(CommentsService).to(CommentsService)
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)

container.bind<UsersController>(UsersController).to(UsersController)
container.bind<UsersService>(UsersService).to(UsersService)
container.bind<UsersRepository>(UsersRepository).to(UsersRepository)