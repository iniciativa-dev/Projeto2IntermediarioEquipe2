const urlParm = new URLSearchParams(window.location.search);
if(urlParm.get('email')){
    document.getElementById('loginfailed').innerHTML = 'Usuario ou senha invalido';
    document.getElementById('email').value = urlParm.get('email')
}