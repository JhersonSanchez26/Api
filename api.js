const express = require('express');
const mongoose = require('mongoose');
const user = require('./user.controller');
const app = express();
const { Auth, isAuthenticated } = require('./auth.controller');
const port = 3000;

app.use(express.json());
mongoose.connect('mongodb+srv://jhersonsanchez26:Gaby8031756..@cluster0.dku7tvb.mongodb.net/miapp?retryWrites=true&w=majority');

//Agregando endpoint GET
app.get('/users', isAuthenticated, user.get)

//Agregando endpoint GET:id
app.get('/users/:id', isAuthenticated, user.getId)

//Agregando endpoint POST
app.post('/users', isAuthenticated, user.create)

//Agregando endpoint PUT
app.put('/users/:id', isAuthenticated, user.update)

//Agregando endpoint PATCH
app.patch('/users/:id', (req, res) => {
    res.sendStatus(204);
})


//Agregando endpoint Login
app.post('/login', Auth.login)
    //Agregando endpoint Register
app.post('/Register', Auth.register)

//Agregando endpoint DELETE
app.delete('/users/:id', user.destroy)

//Con el metodo express.static le indicamos al servidor que queremos que cargue todos los archivos que estan denro de la carpeta app.
app.use(express.static('app'));

// Creamos metodo get para enviarle al usuario una pagina html
app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(`${__dirname}/index.html`);
})

//Se utiliza para capturar el valor de las rutas no definidas
app.get('*', (req, res) => {
    res.status(404).send('Esta pagina no existe');
});

app.post('*', (req, res) => {
    res.status(404).send('Esta pagina no existe');
});


app.listen(port, user.listen);