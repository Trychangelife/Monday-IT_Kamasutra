const http = require('http');
const fs = require('fs');


// Создаем промис (обещание) - где создаем искусственную задержку в количестве MS (А ms указываем, когда вызываем функцию)
const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

// 
const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}
// Для того чтобы асинхронные функции ВНУТРИ этой конструкции сработали и сервер запустился
// Необходимо добавить async перед передаваемыми аргументами (иначе будет ошибка await is only valid in async function the top level bodies modules)
const server = http.createServer(async (request, response) => {
    switch (request.url) {
        case '/home': {
            // Вызываем структуру Try/Catch для возможности обработки ошибки
            try {
            // Перед вызовом функции мы пишем Await - чтобы обозначить, что функция асинхронная
            const data = await readFile('pages/about.html')
            response.write(data)
            response.end()
            break;
        }
            catch (err) {
                response.write('Something wrong 500')
                response.end()
            }
        }
        case '/about': {
            // Перед вызовом функции мы пишем Await - чтобы обозначить, что функция асинхронная
            await delay(3000)
            response.write('About course')
            response.end()
            break;
        }
        default: {
            response.write('404 Not found')
            response.end()
        }
    }

})


server.listen(3000, () => {
    console.log('Server start at port 3000')
})