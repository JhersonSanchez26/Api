// Luego de haber instalado la librreria de mongoose importamos el metodo para conectar con nuestra bd en mongo
const mongoose = require('mongoose');
// con el metodo mongoose.connect + credenciales nos conectamos a la base de datos
mongoose.connect('mongodb+srv://jhersonsanchez26:Gaby8031756..@cluster0.dku7tvb.mongodb.net/miapp?retryWrites=true&w=majority');

// Creamos modelos de la base de datos, es decir, los campos como se van a almacenar en formato JSON.

const User = mongoose.model('User', {
    username: String,
    edad: Number
});

//Creamos el metodo para almacenar usuarios en la base de datos

const crear = async() => {
    const user = new User({ username: 'Jherson Gregorio Sanchez Rivas', edad: 31 })
    const saveUser = await user.save();
    console.log(saveUser);

}

//crear();

// Para mostras todos los resultados almacenados en un modelo usamos el metodo find() ejem:

const buscarTodo = async() => {

    const users = await User.find();
    console.log(users);

}

//buscarTodo();

const buscar = async() => {
    //Usamos el metodo find() para que nos muestre el valor de un registro enviandole como parametro la propiedad username ejm:
    const user = await User.find({ username: 'Deyanira Carbajal Crespo' });
    console.log(user);
}

//buscar();

//El método findOne(); devuelve un objeto {} ejm:
const buscarUno = async() => {
    const user = await User.findOne({ _id: '642f13692c418664e070c863' });
    console.log(user);
}

//buscarUno();

const actualizar = async() => {
    const user = await User.findOne({ username: 'Deyanira Carbajal Crespo' });
    user.edad = 30;
    await user.save();
    console.log(user);
}

//actualizar();

const eleminar = async() => {
    const user = await User.findOne({ _id: '642f13692c418664e070c863' });
    console.log(user);
    if (user) {
        await user.deleteOne();
    } else { console.log('No hay registros para eliminar'); }
}

eleminar();