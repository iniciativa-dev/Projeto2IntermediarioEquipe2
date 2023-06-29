//=================== Import modulos ==========================

const http = require('http');
const path = require('path');
const fs = require('fs');
const db = require('./basedados')
const qs = require('querystring');

//=================== Declaraçao variaveis ==========================

const extencoes = {
    'html': 'text/html', 
    'css' : 'text/css',
    'js' : 'application/javascript',
    'jpeg' : 'image/jpeg',
    'png' : 'image/x-png',
    'ico' : 'image/x-icon',
    'txt' :'text/plain'
}

const arquivos = {
    index : fs.readFileSync(path.join(__dirname, '/html/index.html'), 'utf-8'),
    png: fs.readFileSync(path.join(__dirname, '/html/assets/img/logo.png')),
    css : fs.readFileSync(path.join(__dirname, '/html/assets/styles/style.css'), 'utf-8'),
    js : fs.readFileSync(path.join(__dirname, '/html/assets/scripts/script.js'), 'utf-8'),
    ico : fs.readFileSync(path.join(__dirname, '/html/assets/img/logo.ico')),
    app : fs.readFileSync(path.join(__dirname, '/html/app.html'), 'utf-8')
}

//=================== Declaraçao funçoes ==========================


//================= execuçao do programa =======================

http.createServer((req, res)=>{
    let caminho = req.url;
    if (caminho.indexOf('?') > 0) caminho = caminho.substring(0,caminho.indexOf('?'));
    let ext = path.extname(caminho).slice(1);

    let fileSaida;

    switch(caminho){
        
        case "/form":
            req.on('data', chunk => {
                body = '';
                body += chunk;
                body = qs.parse(body);

                if (body['senha']  && body['email']){
                    async function verificar(){
                        let id_func = await db.verifica(body['email'], body['senha']);
                        let token = await db.setToken(id_func, body['conexao'] == 'on' ? true : false);
                        if (id_func) {
                            if (body['conexao'] == 'on'){
                            } else {
                                res.setHeader('Set-Cookie', 'acesso=ok2');
                            }
                            res.setHeader('Location', '/app');
                        }else {
                            res.setHeader('Location', `/?email=${body['email']}`);
                        }
                        res.statusCode = 301;
                        res.end();
                    }
                    verificar();
                } else {
                    if (body['email'])
                        res.setHeader('Location', `/?email=${body['email']}`);
                    else
                        res.setHeader('Location', '/');
                    res.statusCode = 301;
                    res.end();
                }

              })            
            break;

        case "/":
            ext = 'html'
            if (caminho == '/') fileSaida = arquivos['index'];
        
        case "/app":
            ext = 'html'
            if (caminho == '/app') {
                cookie = req.headers.cookie;
                if(cookie && cookie.split('=')[1] == 'ok2'){
                    fileSaida = arquivos['app'];
                } else {
                    res.setHeader('Location', '/?email= ');
                    res.statusCode = 301;
                    res.end();
                    break;
                }
            };
            

        default:
            if(extencoes[ext]){
                res.writeHead(200, {'Content-Type': extencoes[ext]});
                if (ext == 'ico' || ext == 'png'){
                    res.end(arquivos[ext], 'binary');
                } else {
                    if (fileSaida){
                        res.end(fileSaida);
                    } else {
                        res.end(arquivos[ext]);
                    }
                }
                
            } else {
                res.writeHead(404, {'content-Type': 'text/html'});
                res.end("Erro 404 - Page not Found");
            }        
            break;
    }
    
}).listen(8080, ()=>{console.log("Server on 8080 Port")})