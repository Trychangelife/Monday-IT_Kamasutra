import { bloggers } from "../repositories/bloggers-repositories";


type PostsType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName: string
}
export let posts: PostsType[] = [
    { id: 1, title: "string1", shortDescription: "str1", content: "JS", bloggerId: 1, bloggerName: "Alex" },
    { id: 2, title: "string2", shortDescription: "str2", content: "Python", bloggerId: 2, bloggerName: "Bob" },
    { id: 3, title: "string3", shortDescription: "str3", content: "Nest", bloggerId: 3, bloggerName: "Jon" },
    { id: 4, title: "string4", shortDescription: "str4", content: "Express", bloggerId: 4, bloggerName: "Trevis" },
    { id: 5, title: "string5", shortDescription: "str5", content: "NodeJS", bloggerId: 5, bloggerName: "Michael" }
]

function doSomeString() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
export const postsRepository = {
    allPosts() {
        return posts
    },

    targetPosts(postId: number){
        const id = postId
        const targetPost = posts.find((b) => {
            if (b.id === id) return true;
            else return false;
        })
        return targetPost;

    },

    releasePost(title: string, content: string, shortDescription: string, bloggerId: number) {
        const findBlogger = bloggers.find(b => b.id === bloggerId)?.id
        
        if (findBlogger !== bloggerId) {
            return '400'
        }
        let newPosts = {
            id: +(new Date()),
            title: title,
            content: content,
            shortDescription: shortDescription,
            bloggerId: findBlogger,
            bloggerName: doSomeString()
        }
        posts.push(newPosts)
        return newPosts
    },

    changePost(postId: number, title: string, shortDescription: string, content: string, bloggerId: number) {

        const post = posts.find((i) => {
            const id = postId;
            if (i.id === id) return true
            else return false
        })
        const findBlogger = bloggers.find(b => b.id === bloggerId)?.id
        if (post !== undefined && findBlogger == bloggerId) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.bloggerId
            return post
        }
        else if (findBlogger !== bloggerId) {
            return '400'
        }
        else {
            return "404"
        }
    },
    deletePost(deleteId: number) {
        const beforeFilter = [...posts].length
        posts = posts.filter((v) => v.id !== deleteId)
        return beforeFilter === posts.length
    }
}