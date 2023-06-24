const mongodb = require('mongodb');
const uri = 'mongodb+srv://projetonovashopping:M27KyjKCyk8Dx6Z3@clusternovashopping.kd2otni.mongodb.net/?retryWrites=true&w=majority';

let cliente = new mongodb.MongoClient(uri);

async function run(usuario, senha){
    try{
        const dataBase = cliente.db("novaShoppingDb");
        const colecao = dataBase.collection('funcionario');

        const query = {email: usuario, senha: senha};

        await cliente.connect();

        let achou = await colecao.findOne(query);
        console.log(achou)

    }catch(e){
        console.log(e);
    }
}

run('alexandre@gmail.com', '12341234');

//module.exports(run);