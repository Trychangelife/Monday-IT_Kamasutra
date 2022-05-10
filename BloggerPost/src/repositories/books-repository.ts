
export let books = [
    { id: 1, title: "string1", shortDescription: "str1", content: "hello JS bla bla bla bla"   },
    { id: 2, title: "string2", shortDescription: "str2", content: "Python"},
    { id: 3, title: "string3", shortDescription: "str3", content: "Nest" },
    { id: 4, title: "string4", shortDescription: "str4", content: "Express" },
    { id: 5, title: "string5", shortDescription: "str5", content: "NodeJS" }
]



export const booksRepository = {
    getBooks() {
        return books
    },

    find(contentFragment: string) {
        return books.filter((book) => book.content.includes(contentFragment))
    }
}