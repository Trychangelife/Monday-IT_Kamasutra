let bloggers = [
    { id: 1, name: 'Alex', youtubeUrl: 'Alex_TV' },
    { id: 2, name: 'Bob', youtubeUrl: 'Bob_TV' },
    { id: 3, name: 'Jon', youtubeUrl: 'Jon_TV' },
    { id: 4, name: 'Trevis', youtubeUrl: 'Trevis_TV' },
    { id: 5, name: 'Michael', youtubeUrl: 'Michael_TV' },
]

export const bloggerRepository = {
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
        const setErrors = ({ errorsMessages: [{ message: "string", field: "youtubeUrl" }, { message: "string", field: "name" }], resultCode: 1 })
        const str: any = newBlogger.youtubeUrl;
        function isURL(str: any) {
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return pattern.test(str);
        }
        if (isURL(str) !== true || newBlogger.name == undefined) {
            return "invalide format"
        }

        const checkName = newBlogger.name.replaceAll(' ', '').length
        if (newBlogger.name == undefined || checkName === 0) {
            return 2
        }
        else if (newBlogger.name.length > 15 || newBlogger.youtubeUrl.length > 100) {
            return 3
          }
        else {
            bloggers.push(newBlogger)
            return newBlogger
        }

    }
}