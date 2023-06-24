//=================== Import modulos ==========================

const http = require('http');
const path = require('path');
const fs = require('fs');
var qs = require('querystring');

//=================== Declaraçao variaveis ==========================

const extencoes = {
    '.css' : 'text/css',
    '.js' : 'application/javascript',
    '.jpeg' : 'image/jpeg',
    '.png' : 'image/x-png',
    '.ico' : 'image/x-icon',
    '.txt' :'text/plain'
}

//=================== Declaraçao funçoes ==========================

function sendFile(percurso, res, binary=false){
    fs.promises.readFile(path.join(__dirname, percurso), (err)=>{
        if (err){ 
            console.log(err); 
            res.end("<p>Erro 421 - Misdirected Request</p>");
        };
    }).then(file=>{
        binary ? res.end(file, 'binary') : res.end(file);
    }).catch(erro=>{
        console.log(erro);
        res.end("<p>Erro 404 - Page not Found</p>");
    })
}

//================= execuçao do programa =======================

http.createServer((req, res)=>{
    const caminho = req.url;
    const ext = path.extname(caminho);
    switch(caminho){

        case "/":
            res.writeHead(200, {'Content-Type': 'text/html'});
            sendFile('/html/index.html', res)
            break;
        
        case "/app":
            res.writeHead(200, {'Content-Type': extencoes['.txt']});
            sendFile('/html/app.html', res)
            break;

        case "/form":
            let body= ''
            req.on('data', chunk => {
                body += chunk;
                body = qs.parse(body);

                if (body['senha']  && body['email']){
                    res.writeHead(301, {'Location': '/app'});
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': extencoes['.txt']});
                    res.end("<p>Erro 401 - Unauthorized</p>");
                }

              })            
            break;

        default:
            if(extencoes[ext]){
                res.writeHead(200, {'Content-Type': extencoes[ext]});
                console.log(extencoes[ext])
                if ([ext] == '.png' || [ext] == '.jpeg' || [ext] == '.ico'){
                    sendFile(caminho, res, true)
                } else {
                    sendFile(caminho, res)
                }
                
            } else {
                res.writeHead(404, {'content-Type': extencoes['.txt']});
                res.end("Erro 404 - Page not Found");
            }
                
                
            break;
    }
    
}).listen(8080, ()=>{console.log("Server on 8080 Port")})