const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

let requestsCount = 0
var FAVICON = path.join(__dirname, 'public', 'favicon.ico');

const server = http.createServer((request, response) => {
    
    var pathname = url.parse(request.url).pathname;
    if (request.method === 'GET' && pathname === '/favicon.ico') {
        response.setHeader('Content-Type', 'image/x-icon');
        fs.createReadStream(FAVICON).pipe(response);
        return;
      }
    switch (request.url) {
        case '/students':
            response.write('STUDENTS')
            break;
        case '/courses':
            response.write('Front + Back ')
            break
        default:
            response.write('404 not found ')
    }
    setTimeout(function() {
        requestsCount++
    }, 0)
    response.write('IT-KAMASUTRA: ' + requestsCount)
    response.end()

})

server.listen(3000, function (){
    console.log('HTTP server started on port 3000')
})