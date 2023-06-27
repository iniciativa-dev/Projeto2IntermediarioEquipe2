//=================== Import modulos ==========================

const http = require('http');
const path = require('path');
const fs = require('fs');
const db = require('./basedados')
const qs = require('querystring');

//=================== Declaraçao variaveis ==========================

const extencoes = {
    '.html': 'text/html', 
    '.css' : 'text/css',
    '.js' : 'application/javascript',
    '.jpeg' : 'image/jpeg',
    '.png' : 'image/x-png',
    '.ico' : 'image/x-icon',
    '.txt' :'text/plain'
}

//=================== Declaraçao funçoes ==========================

function sendFile(percurso, res, binary=false){
    console.log(percurso)
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
    let caminho = req.url;
    if (caminho.indexOf('?') > 0) caminho = caminho.substring(0,caminho.indexOf('?'));
    let ext = path.extname(caminho);
    switch(caminho){
        
        case "/form":
            req.on('data', chunk => {
                body = '';
                body += chunk;
                body = qs.parse(body);
                console.log(body['senha']);
                console.log(body['email']);

                if (body['senha']  && body['email']){
                    async function verificar(){
                        let verifica = await db.verifica(body['email'], body['senha']);
                        if (verifica) {
                            res.setHeader('Set-Cookie', 'acesso=ok2');
                            res.setHeader('Location', '/app');
                        }else {
                            res.setHeader('Location', `/?email=${body['email']}`);
                        }
                        res.statusCode = 301;
                        res.end();
                    }
                    verificar();
                } else {
                    res.writeHead(200, {'Content-Type': extencoes['.txt']});
                    res.end("<p>Erro 401 - Unauthorized</p>");
                }

              })            
            break;

        case "/":
            ext = '.html'
            if (caminho == '/') caminho = '/html/index.html';
        
        case "/app":
            ext = '.html'
            if (caminho == '/app') {
                cookie = req.headers.cookie;
                if(cookie && cookie.split('=')[1] == 'ok2'){
                    caminho = '/html/app.html'
                } else {
                    res.setHeader('Location', '/');
                    res.statusCode = 301;
                    res.end();
                    break;
                }
                
            };
            

        default:
            if(extencoes[ext]){
                res.writeHead(200, {'Content-Type': extencoes[ext]});
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