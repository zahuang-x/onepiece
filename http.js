var http = require('http');

var server = http.createServer();

server.listen(8000,function(){
    console.log('启动成功：8000')
})

var router = require('./router');
router.start(server);

