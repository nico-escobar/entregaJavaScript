class Burger {
    constructor(id, nombre, precio, img) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.cantidad = 0;
    }
}

const baconesa = new Burger(1, "Baconesa", 3550, "fotos/baconesa.jpg");
const crispy = new Burger(2, "Crispy", 4050, "fotos/crispy.jpg");
const libra = new Burger(3, "Libra", 3000, "fotos/libra.jpg");
const oklahoma = new Burger(4, "Oklahoma", 3100, "fotos/oklahoma.jpg");

const burgers = [baconesa, crispy, libra, oklahoma];

let carrito = [];
const burgersQuantity = {};

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    carrito.forEach(burger => {
        burgersQuantity[burger.id] = burger.cantidad;
    })
}

const contenedorBurgers = document.getElementById("contenedorBurgers");

const removeBurger = (id) => {
    if (burgersQuantity[id] > 0) {
        burgersQuantity[id]--
        const burgerQuantityInput = document.getElementById(`burger-quantity-${id}`);
        burgerQuantityInput.textContent = burgersQuantity[id];
    }
}

const addBurger = (id) => {
    burgersQuantity[id]++
    const burgerQuantityInput = document.getElementById(`burger-quantity-${id}`);
    burgerQuantityInput.textContent = burgersQuantity[id];
}

const mostrarBurgers = () => {
    contenedorBurgers.innerHTML = ''
    burgers.forEach((burger) => {
        if (!burgersQuantity[burger.id]) {
            burgersQuantity[burger.id] = 0;
        }
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
            <div class="card">
                <img src="${burger.img}" class="card-img-top imgBurgers" alt="${burger.nombre}">
                <div class="card-body">
                <h5 class="card-title"> ${burger.nombre} </h5>
                <p class="card-text"> $${burger.precio} </p>
                <div style="display: flex; justify-content: space-around">
                    <button onclick="javascript:removeBurger(${burger.id})">-</button>
                    <p id="burger-quantity-${burger.id}">${burgersQuantity[burger.id]}</p>
                    <button  onclick="javascript:addBurger(${burger.id})">+</button>
                </div>
                <button class="btn colorBoton" id="boton${burger.id}"> Agregar al Carrito </button>
                </div>
            </div>
        `
        contenedorBurgers.appendChild(card);

        const boton = document.getElementById(`boton${burger.id}`);
        boton.addEventListener("click", () => {
            Toastify({
                text: "Burger agregada al carrito",
                duration: 2000,
                gravity: "bottom",
                position: "right"
            }).showToast();
            agregarAlCarrito(burger.id);

            const contenedorCarrito = document.getElementById("contenedorCarrito");
            if (contenedorCarrito.hasChildNodes()) {
                mostrarCarrito();
            }
        })
    })
    console.log(burgersQuantity);
}

const isInCarrito = (id) => {
    return carrito.some(burger => burger.id === id)
}

const agregarAlCarrito = (id) => {
    const burger = burgers.find((burger) => burger.id === id);
    burger.cantidad = burgersQuantity[id];
    if (burger.cantidad === 0 && !isInCarrito(id)) {
        return;
    } else if (burger.cantidad === 0) {
        const carritoUpdated = carrito.filter(burger => burger.id !== id);
        carrito = carritoUpdated;
    } else if (!isInCarrito(id)) {
        carrito.push(burger);
    } else {
        const carritoUpdated = carrito.map(burgerAdded => {
            if (burgerAdded.id === id) {
                burgerUpdated = {
                    ...burgerAdded,
                    cantidad: burger.cantidad
                }
                return burgerUpdated;
            } else {
                return burgerAdded;
            }
        })
        carrito = carritoUpdated;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    calcularTotal();
}

mostrarBurgers();

const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
})

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((burger) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
            <div class="card">
                <img src="${burger.img}" class="card-img-top imgBurger" alt="${burger.nombre}">
                <div class="card-body">
                <h5 class="card-title"> ${burger.nombre} </h5>
                <p class="card-text"> $${burger.precio} </p>
                <p class="card-text"> Cantidad: ${burger.cantidad} </p>
                <button class="btn colorBoton" id="eliminar${burger.id}"> Eliminar Burger </button>
                </div>
            </div>
        `
        contenedorCarrito.appendChild(card);

        const boton = document.getElementById(`eliminar${burger.id}`);
        boton.addEventListener("click", () => {
            Swal.fire({
                title: "¿Desea eliminar esta Burger?",
                icon: "warning",
                confirmButtonText: "Aceptar",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                cancelButtonColor: "#ffc107",
                confirmButtonColor: "#ffc107",
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarDelCarrito(burger.id);
                    console.log(carrito);
                    Swal.fire({
                        title: "Burger eliminada",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#ffc107",
                    })
                }
            })
        })
    })
    calcularTotal();
}

const eliminarDelCarrito = (id) => {
    const burger = carrito.find((burger) => burger.id === id);
    const indice = carrito.indexOf(burger);
    carrito.splice(indice, 1);
    mostrarCarrito();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
    Swal.fire({
        title: "¿Desea eliminar todo el carrito?",
        icon: "warning",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#ffc107",
        confirmButtonColor: "#ffc107",
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarTodoElCarrito();
            console.log(carrito);
            Swal.fire({
                title: "Ha eliminado todas las burgers del carrito",
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#ffc107",
            })
        }
    })
})

const eliminarTodoElCarrito = () => {
    carrito = [];

    for (const id in Object.entries(burgersQuantity)) {
        burgersQuantity[id] = 0;
    }
    mostrarBurgers();
    mostrarCarrito();

    localStorage.clear();
}

const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0;
    carrito.forEach((burger) => {
        totalCompra += burger.precio * burger.cantidad;
    })
    total.innerHTML = ` Final: $${totalCompra}`;
}

login.addEventListener("click", () => {
    Swal.fire({
        title: "Login",
        html: `<input type="text" id="email" class="swal2-input" placeholder="Email">
        <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        confirmButtonText: "Enviar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            console.log(email, password);
            Swal.fire({
                title: "Ha iniciado sesión exitosamente",
                icon: "success",
                confirmButtonText: "Aceptar",
            })
        }
    })
})

registro.addEventListener("click", () => {
    Swal.fire({
        title: "Registro",
        html: `<input type="text" id="email" class="swal2-input" placeholder="Email">
        <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        confirmButtonText: "Enviar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            console.log(email, password);
            Swal.fire({
                title: "Se ha registrado tu usuario exitosamente",
                icon: "success",
                confirmButtonText: "Aceptar",
            })
        }
    })
})


const listado = document.getElementById("listado");
const listadoSalsas = "json/salsas.json";

fetch(listadoSalsas)
    .then(respuesta => respuesta.json())
    .then(datos => {
        datos.forEach(salsa => {
            const card = document.createElement("div");
            card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
            card.innerHTML = `
            <div class="card">
                <div class="card-body">
                <h5 class="card-title"> ${salsa.nombre} </h5>
                <p class="card-text"> $${salsa.precio} </p>
                </div>
            </div>
        `
            listado.appendChild(card);
        })
    })
    .catch(error => console.log(error));


    finalizarCompra.addEventListener("click", () => {
        Swal.fire({
            title: "¿Desea finalizar la compra?",
            icon: "warning",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#ffc107",
            confirmButtonColor: "#ffc107",
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTodoElCarrito();
                console.log(carrito);
                Swal.fire({
                    title: "Gracias por elegirnos",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#ffc107",
                })
            }
        })
    })