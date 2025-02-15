const productos = [
  {
    idProducto: 1,
    codigoInterno: "PD001",
    nombre: "Cap",
    estado: "Activo",
    precio: 10,
    imagen: "img/cap.jpg",
  },
  {
    idProducto: 2,
    codigoInterno: "PD002",
    nombre: "T-shirt",
    estado: "Activo",
    precio: 20,
    imagen: "img/t-shirt.jpg",
  },
  {
    idProducto: 3,
    codigoInterno: "PD003",
    nombre: "Gym Bag",
    estado: "Inactivo",
    precio: 25,
    imagen: "",
  },
  {
    idProducto: 4,
    codigoInterno: "PD004",
    nombre: "Water Bottle",
    estado: "Activo",
    precio: 10,
    imagen: "img/water bottle.jpg",
  },
  {
    idProducto: 5,
    codigoInterno: "PD005",
    nombre: "Jacket",
    estado: "Activo",
    precio: 30,
    imagen: "img/waterproof jacket.jpg",
  },
  {
    idProducto: 6,
    codigoInterno: "PD006",
    nombre: "Athletic Shorts",
    estado: "Inactivo",
    precio: 15,
    imagen: "",
  },
  {
    idProducto: 7,
    codigoInterno: "PD007",
    nombre: "Stretch band",
    estado: "Activo",
    precio: 12,
    imagen: "img/stretch band.jpg",
  },
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const containerCards = document.getElementById("containerCards");
const cartList = document.getElementById('cartList');
const cartIcon = document.getElementById("cartIcon");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function saveCart() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function viewProduct() {
  const productosDisponibles = productos.filter(
    (tipo) => tipo.estado === "Activo"
  );
  productosDisponibles.forEach((productosDisponibles) => {
    const card = document.createElement("div");
    card.classList.add("box");

    card.innerHTML = `
        <div  class="box-top">
          <img class="box-image" src="${productosDisponibles.imagen}" alt="${productosDisponibles.nombre}">
          <div class="title-flex">
            <h3 class="box-title">${productosDisponibles.nombre}</h3>
          </div>
          <p>${productosDisponibles.precio} $</p>
        </div>
        <a onclick="addCartProduct(${productosDisponibles.idProducto})" class="btn">Add to cart</a>
    `;

    containerCards.appendChild(card);
  });
}

function addCartProduct(idProducto) {
  const producto = productos.find((prod) => prod.idProducto === idProducto);
  if (producto) {
    
    const productoEnCarrito = carrito.find((item) => item.producto.idProducto === idProducto);
    if (productoEnCarrito) {
      
      productoEnCarrito.cantidad++;
    } else {
      
      carrito.push({ producto, cantidad: 1 });
    }
    saveCart();
    viewCart();
    updateCartIcon();
  }
}

function viewCart(){
  cartItems.innerHTML = "";
  if (carrito.length > 0) {
    carrito.forEach((item) => {
      const producto = item.producto;
      const cantidad = item.cantidad;

      
      const productDiv = document.createElement("div");
      productDiv.classList.add("cart-item", "d-flex", "align-items-center", "mb-3");

      productDiv.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover;">
        <div class="ms-3">
          <h6>${producto.nombre}</h6>
          <p>${producto.precio} $</p>
        </div>
        <div class="d-flex align-items-center ms-auto">
          <button class="btn btn-secondary btn-sm" onclick="updateQuantity(${producto.idProducto}, -1)">-</button>
          <span class="mx-2">${cantidad}</span>
          <button class="btn btn-secondary btn-sm" onclick="updateQuantity(${producto.idProducto}, 1)">+</button>
        </div>
      `;

      cartItems.appendChild(productDiv);
    });
  } else {
    const emptyCartMessage = document.createElement("p");
    emptyCartMessage.textContent = "Your cart is empty.";
    cartItems.appendChild(emptyCartMessage);
  }

  
  cartTotal.textContent = viewTotal();
}

function updateQuantity(idProducto, change) {
  const producto = carrito.find(item => item.producto.idProducto === idProducto);

  if (producto) {
    if (producto.cantidad + change > 0) {
      producto.cantidad += change;
    }
  }

  viewCart(); 
}


function viewTotal() {
  let total = 0;
  carrito.forEach(item => {
    total += item.producto.precio * item.cantidad;
  });
  return total;
}

function clearCart() {
  
  carrito = [];

  viewCart();
  updateCartIcon();
}

function updateCartIcon() {
  const cartIcon = document.getElementById("cartIcon");

  if (carrito.length > 0) {
    
    cartIcon.classList.remove("cart-icon-highlight"); 
    void cartIcon.offsetWidth; 
    cartIcon.classList.add("cart-icon-highlight"); 
  } else {
    cartIcon.classList.remove("cart-icon-highlight"); 
  }
}

viewProduct();

