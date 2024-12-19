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
                    <button class="btn-info"><span class="ic--round-info"></span></button>
                    <div>
                        <button><span class="ic--twotone-add"></span></button>
                        <button><span class="mynaui--delete-solid"></span></button>
                    </div>
                </li>
            `;
        });

        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        // Habilitar/deshabilitar los botones de paginación
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

    } catch (error) {
        productsList.innerHTML = "<li>Error al cargar los productos. Intenta de nuevo más tarde.</li>";
    }
};

const changePage = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }
    loadProductsList();
};

ascPriceButton.addEventListener("click", () => {
    sort = "asc";  // Orden ascendente
    loadProductsList();
});

descPriceButton.addEventListener("click", () => {
    sort = "desc";  // Orden descendente
    loadProductsList();
});

resetSortButton.addEventListener("click", () => {
    sort = ""; // Restablecer la ordenación
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