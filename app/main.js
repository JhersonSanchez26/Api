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
        <button type="submit">Enviar</button>
        </form>
        <ul id="user-list"></ul>
        `
        //Utilizamos la propiedad document.getElementBytagName para acceder a body y enviarle el HTML con innerHTML
    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}

const getUsers = async() => {
    //Realizamos la petición a /users con fetch y pasamos token de acceso a la cabecera
    const response = await fetch('/users', {
        headers: {
            Authorization: localStorage.getItem('jwt')
        }
    });
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
                Authorization: localStorage.getItem('jwt')
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
                    'Content-type': 'application/json',
                    Authorization: localStorage.getItem('jwt')

                }
            })
            //Con el metodo reset limpiamos el formulario
        userForm.reset();
        getUsers();

    }
}

//Chequeamos en localStorage si existe un archivo jwt para poder cargar la pagina.
const checkLogin = () => localStorage.getItem('jwt')


const userPage = () => {
    //Llamamos la función que cargara el template Login
    loadIniciaTemplate();
    addForListener();
    getUsers();

}

const loadRegisterTemplate = () => {
    const template =
        `<h1>Registro</h1>
            <form id="register-form">
            <div>
            <label>Correo</label>
            <input name="email" />
            </div>
            <div>
            <label>Contraseña</label>
            <input  name="password" />
            </div>
            <button type="submit">Enviar</button>
            </form>
            <a href="#" id="login">Iniciar sesión</a>
            <div id="error"></div>
        `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template;
}
const addRegistirListener = () => {
    const registerForm = document.getElementById('register-form');
    registerForm.onsubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());
        const response = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const responseData = await response.text();
        if (response.status > 300) {
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData;
        } else {
            //Almacenar token en local estorage. Se debe usar jwt y la palabra `Bearer ` separada de un espacio 
            localStorage.setItem('jwt', `Bearer ${responseData}`);
            userPage();
            console.log(responseData);


        }
    }
}
const gotoLoginListener = () => {
    const gotoLogin = document.getElementById('login');
    gotoLogin.onclick = (e) => {
        e.preventDefault();
        loginPage();
    }
}

const registerPage = () => {
    //Llamamos la función que cargara el template Registro
    console.log('Pagina de registro');
    loadRegisterTemplate();
    addRegistirListener();
    gotoLoginListener();

}

const loginPage = () => {
    loadLogintemplate();
    addLoginListener();
    gotoRegisterListener();

}


const loadLogintemplate = () => {
    const template =
        `<h1>Login</h1>
            <form id="login-form">
            <div>
            <label>Correo</label>
            <input name="email" />
            </div>
            <div>
            <label>Contraseña</label>
            <input  name="password" />
            </div>
            <button type="submit">Enviar</button>
            </form>
            <a href="#" id="register">Registrarse</a>
            <div id="error"></div>
        `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template;
}

const gotoRegisterListener = () => {
    const gotoRegister = document.getElementById('register');
    gotoRegister.onclick = (e) => {
        e.preventDefault();
        registerPage();
    }
}

//Accedemos al formulario y cambiamos la acción del boton sumit
const addLoginListener = () => {
    const loginForm = document.getElementById('login-form');
    loginForm.onsubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const responseData = await response.text();
        if (response.status > 300) {
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData;
        } else {
            localStorage.setItem('jwt', `Bearer ${responseData}`);
            userPage();
            console.log(responseData);
        }
    }

}

//Usamos la función window.load para cargar el html y despues el javascript
window.onload = () => {
    //Verificamos si el usuario a iniciado sesión
    const isLoggedIn = checkLogin();
    if (isLoggedIn) {
        userPage();
    } else {
        loginPage();
    }
}