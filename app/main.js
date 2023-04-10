//const { get } = require("request");

//Creamos una función que cargara un template dentro de la etiqueta body
const loadIniciaTemplate = () => {
    const template =
        `<h1>Usuario</h1>
        <form id="user-form">
        <div>
        <label>Nombre</label>
        <input name="name" />
        </div>
        <div>
        <label>Apellido</label>
        <input name="lastName" />
        </div>
        <button type="sumit">Enviar</button>
        </form>
        <ul id="user-list"></ul>
        `
        //Utilizamos la propiedad document.getElementBytagName para acceder a body y enviarle el HTML con innerHTML
    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}

const getUsers = async() => {
    //Realizamos la petición a /users con fetch
    const response = await fetch('/users');
    //LA respuesta que nos traiga el servidos debemos utilizar el metodo .json para que nos devuelva un objeto
    const users = await response.json();
    //Creamos una plantilla para mostrar los nombres
    const template = user => `
    <li>
        ${user.name} ${user.lastName} <button data-id="${user._id}">Eliminar</button
    </li>
    `
    const userList = document.getElementById('user-list');
    userList.innerHTML = users.map(user => template(user)).join('');

    // Eliminando elemento de la lista y de la base de datos
    users.forEach(user => {

        const userNode = document.querySelector(`[data-id="${user._id}"]`)
        userNode.onclick = async e => {
            await fetch(`/users/${user._id}`, {
                method: 'DELETE',
            })
            userNode.parentNode.remove();
            alert('Eliminado con exito');

        }

    });

}

const addForListener = () => {
    const userForm = document.getElementById('user-form');

    userForm.onsubmit = async(e) => {
        //e.preventDefault se utiliza para que la pagina no se refrezque cuando presionemos enviar
        e.preventDefault();
        // new formData nos permitira crear un nuevo objeto apartir de el formulario del cual capturamos los datos
        const formData = new FormData(userForm); //Le pasamos como parametro userForm
        //Object.fromEntries crea un objeto con todos los datos de entrada
        const data = Object.fromEntries(formData.entries());

        console.log(data);

        //Enviamos datos a la bd de mongodb usando el Exponint creado desde el archivo user

        await fetch('/users', {
                method: 'POST',
                //Transformados el objeto data en string para poder enviarlo a mongodb desde el servidos de express
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json'
                }
            })
            //Con el metodo reset limpiamos el formulario
        userForm.reset();
        getUsers();

    }
}

//Usamos la función window.load para cargar el html y despues el javascript
window.onload = () => {

    //Llamamos la función que cargara el template
    loadIniciaTemplate();
    addForListener();
    getUsers();

}