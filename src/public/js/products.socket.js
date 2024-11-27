// Establece la conexión con el servidor usando Socket.IO
const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const errorMessage = document.getElementById("error-message");
const inputProductId = document.getElementById("delete-product-id");
const btnDeleteId = document.getElementById("btn-delete-product");


socket.on ("products-list", (data) =>{
    const products = data.products || [];

    productsList.innerText = "";

    products.forEach(item => {
        productsList.innerHTML += `<li> Id = ${item.id} <br> Nombre = ${item.title} <br> Precio = ${item.price} </li>`;
    });
});

productsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);
    
    errorMessage.innerText = "";
    form.reset();

    socket.emit("insert-product", {
        title: formdata.get("title"),
        status : formdata.get("status") || "off",
        stock: formdata.get("stock"),
        description: formdata.get("description"),
        category: formdata.get("category"),
        code: formdata.get("code"),
        price: formdata.get("price"),
    })
});

btnDeleteId.addEventListener("click", () => {
    const id = inputProductId.value;
    inputProductId.innerText = "";
    errorMessage.innerText = "";

    if(id > 0){
        socket.emit("delete-product", { id })
    }
});


socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});

