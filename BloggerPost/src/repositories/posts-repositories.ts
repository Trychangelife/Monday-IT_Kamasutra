import { bloggers } from "../repositories/bloggers-repositories";
let posts = [
    { id: 1, title: "string1", shortDescription: "str1", content: "JS", bloggerId: 1, bloggerName: "JS-learn" },
    { id: 2, title: "string2", shortDescription: "str2", content: "Python", bloggerId: 2, bloggerName: "Python-learn" },
    { id: 3, title: "string3", shortDescription: "str3", content: "Nest", bloggerId: 3, bloggerName: "Nest-learn" },
    { id: 4, title: "string4", shortDescription: "str4", content: "Express", bloggerId: 4, bloggerName: "Express-learn" },
    { id: 5, title: "string5", shortDescription: "str5", content: "NodeJS", bloggerId: 5, bloggerName: "NodeJS-learn" }
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

    targetPosts(postId: number) {
        const id = postId
        const targetPost = posts.find((b) => {
            if (b.id === id) return true;
            else return false;
        })
        return targetPost;

    },

    releasePost(title: string, content: string, shortDescription: string, bloggerId: number) {
        let newPosts = {
            id: +(new Date()),
            title: title,
            content: content,
            shortDescription: shortDescription,
            bloggerId: +bloggerId,
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

        if (post !== undefined) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.bloggerId
            return post
        }
        else {
            return "404"
        }
    },
    deletePost(deleteId:number) {
        const beforeFilter = [...posts].length
        posts = posts.filter((v) => v.id !== deleteId)
        return beforeFilter === posts.length
    }
}