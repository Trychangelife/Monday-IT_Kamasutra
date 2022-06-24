import { BloggerService } from "./domain/bloggers-service";
import { PostsService } from "./domain/posts-service";
import { BloggerRepository } from "./repositories/bloggers-repositories";
import { PostRepository } from "./repositories/posts-repositories";
import { BloggerController } from "./routes/BloggerController";
import { PostController } from "./routes/PostController";



const bloggerRepository = new BloggerRepository()
const postsRepository = new PostRepository()
const bloggersService = new BloggerService(bloggerRepository)
const postsService = new PostsService(postsRepository)
export const bloggerController = new BloggerController(bloggersService, postsService)
export const postsController = new PostController(postsService)




