const socket = io();

const form = document.querySelector("#productForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.status = data.status === "on" ? true : false;
    socket.emit("product", data);
    form.reset();
});

socket.on("updateProducts", (data) => {
    const productsContainer = document.querySelector("#productsList");
    productsContainer.innerHTML = "";
    data.forEach((product) => {
        const productDiv = document.createElement("li");
        productDiv.innerHTML = `
            <li>
                <div>
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <p>Precio: ${product.price}</p>
                    <p>Stock: ${product.stock}</p>
                    <button id="delete" data-id=${product.id} onclick=deleteProduct('${product.id}')>Eliminar</button>
                </div>
            </li>
        `;
        productsContainer.appendChild(productDiv);
    });
});

function deleteProduct(productId) {
    socket.emit("deleteProduct", productId);
}
