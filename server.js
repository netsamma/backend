import http from 'node:http';

http.createServer(function (req, res) {
    const headers = {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    // if (req.method === 'OPTIONS') {
    //     res.writeHead(204, headers);
    //     res.end();
    //     return;
    // }

    res.writeHead(200, headers);
    res.end('Hello World!');
}).listen(8080);