const mongodb = require('mongodb');
const uri = 'mongodb+srv://projetonovashopping:M27KyjKCyk8Dx6Z3@clusternovashopping.kd2otni.mongodb.net/?retryWrites=true&w=majority';

let cliente = new mongodb.MongoClient(uri);

async function verifica(funcionario, senha){
    try{
        const dataBase = cliente.db("novaShoppingDb");
        const colecao = dataBase.collection('funcionario');

        const query = {email: funcionario, senha: senha};

        await cliente.connect();

        let achou = await colecao.findOne(query);
        
        if (achou) return true;
        return false

    }catch(e){
        console.log(e);
        return false
    }
}


module.exports = {verifica};