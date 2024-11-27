const productsList = document.getElementById("products-list");
const btnRefresh = document.getElementById("btn-refresh-products");

const loadProductsList = async () => {
    const res = await fetch("/api/products", {method: "GET"});
    const data = await res.json();
    const products = data.payload || [];
    
    productsList.innerText = "";

    products.forEach(item => {
        productsList.innerHTML += `<li> Id = ${item.id} <br> Nombre = ${item.title} <br> Precio = ${item.price} </li>`;
        
    });
};

btnRefresh.addEventListener("click", ()=> {
    loadProductsList();
})

loadProductsList();