export let bloggers = [
    { id: 1, name: 'Alex', youtubeUrl: 'Alex_TV' },
    { id: 2, name: 'Bob', youtubeUrl: 'Bob_TV' },
    { id: 3, name: 'Jon', youtubeUrl: 'Jon_TV' },
    { id: 4, name: 'Trevis', youtubeUrl: 'Trevis_TV' },
    { id: 5, name: 'Michael', youtubeUrl: 'Michael_TV' },
]

export const bloggerRepository = {
    allBloggers() {
        return bloggers
    },

    targetBloggers(id: number) {

        const blogger = bloggers.find((b) => {
            if (b.id === id) return true;
            else return false;
        })
        return blogger
    },

    createBlogger(name: any, youtubeUrl: string) {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
            bloggers.push(newBlogger)
            return newBlogger
    },

    changeBlogger(id: number, name: any, youtubeUrl: string) {
        const blogger = bloggers.find((i) => {
            const findId = id;
            if (i.id === findId) return true
            else return false
        })
        if (blogger !== undefined) {
            blogger.name = name
            blogger.youtubeUrl = youtubeUrl
            return "update";
        }
        else {
            return "404"
        }
    },
    deleteBlogger(id: number) {
        const beforeFilter = [...bloggers].length
        bloggers = bloggers.filter((v) => v.id !== id)
        if (beforeFilter === bloggers.length) {
            return "404"
        }
        else {
            return "204"
        }
    }

}