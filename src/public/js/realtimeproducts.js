const socketClient = io();

const productsDIV = document.getElementById("productsList");

const btnAgregar = document.getElementById("btnAgregar");

let HTMLProducts = "";

socketClient.on("productsUpdate", (serverData) => {
    serverData.forEach(prod => {
        HTMLProducts = HTMLProducts + `Id: ${prod.id} - Nombre: ${prod.title} (${prod.code})<br />
        Descripción: ${prod.description}<br />
        Precio: ${prod.price}<br />
        Stock: ${prod.stock}<br />
        Categoría: ${prod.category}<br />`;
    });
    productsDIV.innerHTML = HTMLProducts;
});

btnAgregar.addEventListener("click", (e) => {
    socketClient.emit("newProduct", {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnails: [],
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: true
    });
});