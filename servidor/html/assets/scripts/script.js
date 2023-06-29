const urlParm = new URLSearchParams(window.location.search);
if(urlParm.get('email')){
    document.getElementById('loginfailed').innerHTML = 'Usuario ou senha invalido';
    document.getElementById('email').value = urlParm.get('email')
} else if (urlParm.get('erro1')){
    document.getElementById('loginfailed').innerHTML = 'Erro de connexao';
}

function logout(){
    let idCookie, tokenCookie;
    let cookie = document.cookie;
    console.log(cookie)
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
    }
    console.log(idCookie[1])
    console.log(tokenCookie[1])
    document.cookie = 'acesso=non;Expires=-1;Path=/;'
    document.cookie = `id=${idCookie[1]};Expires=-1;Path=/;`
    document.cookie = `token=${tokenCookie[1]};Expires=-1;Path=/;`
    window.location.href = '/'
}