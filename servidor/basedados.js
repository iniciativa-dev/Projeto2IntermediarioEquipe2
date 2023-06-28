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
    
    if (achou) return true;
    return false;
}

async function setToken(funcionario){

    let colecao = await conecta('funcionario');

    let query = {email: funcionario};
    const id = await colecao.findOne(query, {'id_funcionario' : 1, '_id': 0 });
    console.log(id);
    cliente.close();

}


module.exports = {verifica,setToken};