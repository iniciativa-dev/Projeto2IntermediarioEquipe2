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


function trataCookie(cookie){
    let idCookie, tokenCookie, acessoCookie
    for (i=0; i< cookie.split(' ').length; i++){
        if (cookie.split(' ')[i].split('=')[0] == 'id'){
            idCookie = cookie.split(' ')[i].split('=')
            if (idCookie[1].charAt(idCookie[1].length-1) == ';'){
                idCookie[1] = idCookie[1].substring(0, idCookie[1].length -1)
            }
            
        }
        if (cookie.split(' ')[i].split('=')[0] == 'token'){
            tokenCookie = cookie.split(' ')[i].split('=')
            if (tokenCookie[1].charAt(tokenCookie[1].length-1) == ';'){
                tokenCookie[1] = tokenCookie[1].substring(0, tokenCookie[1].length -1)
            }
        }
        if (cookie.split(' ')[i].split('=')[0] == 'acesso'){
            acessoCookie = cookie.split(' ')[i].split('=')
            if (acessoCookie[1].charAt(acessoCookie[1].length-1) == ';'){
                acessoCookie[1] = acessoCookie[1].substring(0, acessoCookie[1].length -1)
            }
        }
    }
    return [idCookie, tokenCookie, acessoCookie];
}

//================= execuçao do programa =======================

http.createServer((req, res)=>{
    let caminho = req.url;
    if (caminho.indexOf('?') > 0) caminho = caminho.substring(0,caminho.indexOf('?'));
    let ext = path.extname(caminho).slice(1);

    switch(caminho){
        
        case "/form":
            req.on('data', chunk => {
                body = '';
                body += chunk;
                body = qs.parse(body);

                if (body['senha']  && body['email']){
                    async function verificar(){
                        let id_func = await db.verificaConexao(body['email'], body['senha']);
                        if (id_func) {
                            if (body['conexao'] == 'on'){
                                let token = await db.setToken(id_func, body['conexao'] == 'on' ? true : false);
                                tempo = new Date();
                                tempo.setDate(tempo.getDate() + 30);
                                res.setHeader('Set-Cookie', [`id=${id_func};Expires=${tempo};Path=/;`, `token=${token};Expires=${tempo};Path=/;`, `acesso=ok;Expires=${tempo};Path=/;`])
                            } else {
                                let token = await db.setToken(id_func, body['conexao'] == 'off' ? true : false);
                                res.setHeader('Set-Cookie', [`id=${id_func};Expires=-1;Path=/;`, `token=${token};Expires=-1;Path=/;`, 'acesso=ok;Expires=-1;Path=/;'])
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
        
        case "/app":
            let cookie = req.headers.cookie;
            if(cookie){
                async function verCookie() {
                    let cookies = trataCookie(cookie);
                    token = await db.verificaCookie(parseInt(cookies[0][1]));
                    if (cookies[1][1] = token && cookies[2][1] == 'ok'){
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(arquivos['app']);
                    } else {
                        res.setHeader('Location', '/?erro1=true');
                        res.statusCode = 301;
                        res.end();
                    }
                    
                }
                verCookie();
            } else {
                res.setHeader('Location', '/?erro1=true');
                res.statusCode = 301;
                res.end();
            }
            break;

        case "/":
            let cookieIndex = req.headers.cookie;
            if(cookieIndex){
                let cookies = trataCookie(cookieIndex);
                async function verCookie() {
                    token = await db.verificaCookie(parseInt(cookies[0][1]));
                    if (cookies[1][1] = token && cookies[2][1] == 'ok'){
                        res.setHeader('Location', '/app');
                        res.statusCode = 301;
                        res.end();
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(arquivos['index']);
                        res.end();
                    }
                    
                }
                verCookie();
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(arquivos['index']);
            }
            break;

        default:
            if(extencoes[ext]){
                res.writeHead(200, {'Content-Type': extencoes[ext]});
                if (ext == 'ico' || ext == 'png'){
                    res.end(arquivos[ext], 'binary');
                } else {
                    res.end(arquivos[ext]);
                }
                
            } else {
                res.writeHead(404, {'content-Type': 'text/html'});
                res.end("Erro 404 - Page not Found");
            }        
            break;
    }
    
}).listen(8080, ()=>{console.log("Server on 8080 Port")})