const mongodb = require('mongodb');
const uri = 'mongodb+srv://projetonovashopping:M27KyjKCyk8Dx6Z3@clusternovashopping.kd2otni.mongodb.net/?retryWrites=true&w=majority';


let cliente = new mongodb.MongoClient(uri);

async function conecta(colec='funcionario'){
    try{
        
        const dataBase = cliente.db("novaShoppingDb");
        const colecao = dataBase.collection(colec);

        await cliente.connect();

        return colecao;

    }catch(e){
        console.log(e);
        return false
    }
}

async function verifica(funcionario, senha){

    
    let colecao = await conecta('funcionario');
    
    const query = {email: funcionario, senha: senha};
    let achou = await colecao.findOne(query);

    cliente.close();

    if (achou) return achou['id_funcionario'];
    return false;
}

async function setToken(id, acesso){

    let colecao = await conecta('conexao');

    token = geraToken();

    const query = {user: id}
    const update = {$set: {"token": token, "acesso": acesso}};
    const query2 = {user: id, token: token, acesso: acesso};
    let resultado = await colecao.findOneAndUpdate(query, update);
    await colecao.insertOne(query2);
    return resultado;
    cliente.close();

}

function geraToken(){
    token = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxwyxz0123456789';
    for (i=0; i<10; i++){
        token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return token;
}

module.exports = {verifica,setToken};