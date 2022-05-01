

var app = require('express')();
var http = require('http').Server(app);
let count = 0

app.get('/', function (req, res){
    count++
    if (req.url === '/1') {
        res.write('students')
    }
    else {
        res.write("404 NOT FOUND" + count)
    }
    res.sendFile(__dirname, '/public/index.html')
    res.end()
})

http.listen(3000, function (){
    console.log('HTTP server started on port 3000')
})