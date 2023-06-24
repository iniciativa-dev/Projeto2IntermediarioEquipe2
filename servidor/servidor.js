//=================== Import modulos ==========================

const http = require('http');
const path = require('path');
const fs = require('fs');
const db = require('./basedados')
const qs = require('querystring');
const { type } = require('os');

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
    const ext = path.extname(caminho);
    switch(caminho){

        case "/":
            //verificaCookie();
            console.log(req.headers.cookie);
            res.writeHead(200, {'Content-Type': extencoes['.html']});
            sendFile('/html/index.html', res)
            break;
        
        case "/app":
            //verificaCookie();
            console.log(req.headers.cookie);
            cookie = req.headers.cookie
            res.setHeader('Content-Type', extencoes['.html']);
            //res.setHeader('Set-Cookie', 'acesso=true;expires=-1;overwrite=true' )
            res.statusCode = 200;
            sendFile('/html/app.html', res)
            break;

        case "/form":
            let body= ''
            req.on('data', chunk => {
                body += chunk;
                body = qs.parse(body);

                if (body['senha']  && body['email']){
                    let verifica
                    async function verificar(){
                        verifica = await db.verifica(body['email'], body['senha']);
                        if (verifica) {
                            hoje = Date.parse(new Date());
                            console.log(new Date());
                            console.log(hoje)
                            hoje += 3600000*5;
                            hoje = new Date(hoje);
                            console.log(hoje)
                            res.setHeader('Location', '/app');
                            res.setHeader('Set-Cookie', ['acesso=true;Expires='+ hoje]);
                            res.statusCode = 301;
                        }else {
                            res.writeHead(301, {
                                'Location': `/?email=${body['email']}`, 
                                "Set-Cookie": ['conexao=false', 'maxAge=3600000']
                            });
                        }
                        res.end();
                    }
                    verificar();
                } else {
                    res.writeHead(200, {'Content-Type': extencoes['.txt']});
                    res.end("<p>Erro 401 - Unauthorized</p>");
                }

              })            
            break;

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