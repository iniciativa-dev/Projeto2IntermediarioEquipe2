const mongodb = require('mongodb');
const uri = 'mongodb+srv://projetonovashopping:M27KyjKCyk8Dx6Z3@clusternovashopping.kd2otni.mongodb.net/?retryWrites=true&w=majority';


let cliente = new mongodb.MongoClient(uri);

async function conecta(colection='funcionario'){
    try{
        
        await cliente.connect();

        const dataBase = cliente.db("novaShoppingDb");
        const colecao = dataBase.collection(colection);

        return colecao;

    }catch(e){
        console.log(e);
        return false
    }
}

async function verificaConexao(funcionario, senha){

    
    const colecao = await conecta('funcionario');
    
    const query = {email: funcionario, senha: senha};
    let achou = await colecao.findOne(query);

    cliente.close();

    if (achou) return achou['id_funcionario'];
    return false;
}

async function verificaCookie (id){
    const colecao = await conecta('conexao');
    const query = {'user': id};
    const resultado = await colecao.findOne(query);
    return resultado.token;
}

async function setToken(id, acesso){

    const colecao = await conecta('conexao');

    token = geraToken();

    const query = {user: id};
    const update = {$set: {"token": token, "acesso": acesso}};
    const query2 = {user: id, token: token, acesso: acesso};
    let resultado = await colecao.findOneAndUpdate(query, update);
    cliente.close();

    if (!resultado.lastErrorObject.updatedExisting){
        const conection = await conecta('conexao');
        resultado = await conection.insertOne(query2);
        cliente.close();
    }
    
    
    return token;

}

function geraToken(){
    token = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxwyxz0123456789';
    for (i=0; i<10; i++){
        token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return token;
}

module.exports = {verificaConexao,setToken,verificaCookie};