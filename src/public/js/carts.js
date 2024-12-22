const cartList = document.getElementById("list-cart");
const btnDeleteCart = document.getElementById("btn-delete-cart");

const loadCartList = async ()=>{
    try {
        let url = `http://localhost:8080/api/carts/676481305527010f3bec549d`;
        const res= await fetch(url);
        const data= await res.json();
        const cart= data.payload.products || [];
        console.log(data);
        cartList.innerHTML= "";

        if(cart.length != 0){

            cart.forEach(item => {
                cartList.innerHTML+=`
                <li class="products">
                <p><strong>ID:</strong>${item.product._id}</p>
                <p><strong>Nombre:</strong>${item.product.title}</p>
                <p><strong>Precio:</strong>${item.product.price}</p>
                <p><strong>Cantidad:</strong>${item.quantity}</p>
                
                
                </li>
                `
            });
        }else{
            cartList.innerHTML +=`<p>Carrito vacio</p>`
        }
    } catch (error) {
        console.log(error);
        
        cartList.innerHTML = "<li>Error al cargar los productos del carrito. Intenta de nuevo más tarde.</li>";
    }
}
const deleteCart = async () => {
    try {
        const res = await fetch(`http://localhost:8080/api/carts/676481305527010f3bec549d/products`, {
            method: "DELETE",
        });

        const data = await res.json();

        if (data.status === "success") {
            loadCartList();
        }

    } catch (error) {
        alert("Error al vaciar el carrito. Intenta de nuevo más tarde.");
    }
};

btnDeleteCart.addEventListener("click", deleteCart);



loadCartList();