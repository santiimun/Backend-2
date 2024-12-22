const productsList = document.getElementById("products-list");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const ascPriceButton = document.getElementById("ascPrice");
const descPriceButton = document.getElementById("descPrice");
const resetSortButton = document.getElementById("resetSort");
const filterButton = document.getElementById("filter-button");
const filterCategoryInput = document.getElementById("filter-category");

let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let sort = "";
let categoryFilter = ""; 


const loadProductsList = async () => {
    try {
        let url = `http://localhost:8080/api/products?page=${currentPage}&limit=${itemsPerPage}`;
        
        if (categoryFilter) {
            url += `&category=${categoryFilter}`;
        }

        if (sort) {
            url += `&sort=${sort}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        const products = data.payload.docs || [];
        totalPages = data.payload.totalPages;

        productsList.innerHTML = ""; 

        products.forEach(item => {
            productsList.innerHTML += `
                <li class="products">
                    <p>Id: ${item._id} </p><br>
                    <p>Nombre: ${item.title} </p><br>
                    <p>Precio: $${item.price} </p><br>
                    <a href= "/product/${item._id}"><button class="btn-info"><span class="ic--round-info"></span></button></a>
                    <div>
                        <button class="add-button" data-product-id="${item._id}"><span class="ic--twotone-add"></span></button>
                        <button class="remove-button" data-product-id="${item._id}"><span class="mynaui--delete-solid"></span></button>
                    </div>
                </li>
            `;
        });

        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        // Habilitar/deshabilitar los botones de paginación
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        // Agregar eventos a los botones de agregar y eliminar
        document.querySelectorAll(".add-button").forEach(button => {
            button.addEventListener("click", async (e) => {
                const productId = e.target.closest("button").getAttribute("data-product-id");
                await addProductToCart(productId);
            });
        });

        document.querySelectorAll(".remove-button").forEach(button => {
            button.addEventListener("click", async (e) => {
                const productId = e.target.closest("button").getAttribute("data-product-id");
                await removeProductFromCart(productId);
            });
        });

    } catch (error) {
        productsList.innerHTML = "<li>Error al cargar los productos. Intenta de nuevo más tarde.</li>";
    }
};

// Función para agregar un producto al carrito
const addProductToCart = async (productId) => {
    try {
        const cartId = "676481305527010f3bec549d";
        const url = `http://localhost:8080/api/carts/${cartId}/products/${productId}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });
    } catch (error) {
        
    }
};

// Función para eliminar un producto del carrito
const removeProductFromCart = async (productId) => {
    try {
        const cartId = "676481305527010f3bec549d"; 
        const url = `http://localhost:8080/api/carts/${cartId}/products/${productId}`;
        const res = await fetch(url, {
            method: 'DELETE', 
        });

    } catch (error) {
        
    }
};

// Función para cambiar de página
const changePage = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }
    loadProductsList();
};

// Funciones de ordenación y filtrado
ascPriceButton.addEventListener("click", () => {
    sort = "asc";  
    loadProductsList();
});

descPriceButton.addEventListener("click", () => {
    sort = "desc";  
    loadProductsList();
});

resetSortButton.addEventListener("click", () => {
    sort = ""; 
    loadProductsList();
});

filterButton.addEventListener("click", () => {
    categoryFilter = filterCategoryInput.value.trim();
    currentPage = 1; 
    loadProductsList();
});

prevButton.addEventListener("click", () => changePage('prev'));
nextButton.addEventListener("click", () => changePage('next'));


loadProductsList();
