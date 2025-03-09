

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const containerCards = document.getElementById("containerCards");
const cartList = document.getElementById('cartList');
const cartIcon = document.getElementById("cartIcon");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function showAlert(message) {
  const alertModalBody = document.getElementById('alertModalBody');
  alertModalBody.textContent = message; 
  const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
  alertModal.show(); 
}


function showConfirm(message, callback) {
  const confirmModalBody = document.getElementById('confirmModalBody');
  confirmModalBody.textContent = message; 

  const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));

  
  const confirmModalAccept = document.getElementById('confirmModalAccept');
  confirmModalAccept.onclick = () => {
      callback(true); 
      confirmModal.hide(); 
  };

  
  confirmModal._element.addEventListener('hidden.bs.modal', () => {
      callback(false); 
  });

  confirmModal.show(); 
}


function showPrompt(message, callback) {
  const promptModalLabel = document.getElementById('promptModalLabel');
  promptModalLabel.textContent = message; 

  const promptModal = new bootstrap.Modal(document.getElementById('promptModal'));

  
  const promptModalAccept = document.getElementById('promptModalAccept');
  promptModalAccept.onclick = () => {
      const inputValue = document.getElementById('promptInput').value;
      callback(inputValue); ingresado
      promptModal.hide(); 
  };

  
  promptModal._element.addEventListener('hidden.bs.modal', () => {
      document.getElementById('promptInput').value = ""; 
  });

  promptModal.show(); 
}

function loadCheckoutSummary() {
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutTotal = document.getElementById('checkoutTotal');
  checkoutItems.innerHTML = ""; 
  let total = 0;

  if (carrito.length > 0) {
      carrito.forEach(item => {
          const productDiv = document.createElement('div');
          productDiv.classList.add('d-flex', 'justify-content-between', 'mb-2');
          productDiv.innerHTML = `
              <p>${item.producto.nombre} (${item.cantidad} x ${item.producto.precio} $)</p>
              <p>${item.producto.precio * item.cantidad} $</p>
          `;
          checkoutItems.appendChild(productDiv);
          total += item.producto.precio * item.cantidad;
      });
  } else {
      checkoutItems.innerHTML = "<p>No hay productos en el carrito.</p>";
  }

  checkoutTotal.textContent = total;
}


document.getElementById('checkoutModal').addEventListener('show.bs.modal', () => {
  loadCheckoutSummary();
});

function processCheckout() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const card = document.getElementById('card').value;
  const cvv = document.getElementById('cvv').value;

  
  if (!name || !email || !address || !card || !cvv) {
    showAlert('Por favor, complete todos los campos.');
      return;
  }

  
  showAlert('Pago realizado con éxito. Gracias por su compra.');
  carrito = []; 
  localStorage.setItem('carrito', JSON.stringify(carrito)); 
  viewCart(); 
  updateCartIcon(); 

  
  const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
  modal.hide();
}

let productos = [];

const searchProducts = async () => {
  try {
    
    const response = await fetch('productos.json');
    if (!response.ok) {
      throw new Error('Error al cargar los productos');
    }

    productos = await response.json();

    
    viewProduct(productos);

  } catch (error) {
    console.error('Error:', error);
  } 
};

function saveCart() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function viewProduct(productos) {
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
          productoEnCarrito.cantidad += 1; 
      } else {
          carrito.push({ producto, cantidad: 1 }); 
      }
      saveCart();
      viewCart();
      updateCartIcon();
      showAlert("Producto agregado al carrito."); 
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
    } else {
      carrito = carrito.filter(item => item.producto.idProducto !== idProducto);
    }
    saveCart();
    viewCart();
    updateCartIcon(); 
  }
}


function viewTotal() {
  let total = 0;
  carrito.forEach(item => {
    total += item.producto.precio * item.cantidad;
  });
  return total;
}

function clearCart() {
  showConfirm("¿Estás seguro de que quieres vaciar el carrito?", (response) => {
      if (response) {
          carrito = [];
          localStorage.setItem('carrito', JSON.stringify(carrito)); 
          viewCart();
          updateCartIcon();
      }
  });
}

function updateCartIcon() {
  const cartIcon = document.getElementById("cartIcon");
  const shopNowButton = document.getElementById("shopNowButton");

  if (carrito.length > 0) {
    shopNowButton.disabled = false;
    cartIcon.classList.remove("cart-icon-highlight");
    void cartIcon.offsetWidth; 
    cartIcon.classList.add("cart-icon-highlight");
  } else {
    shopNowButton.disabled = true;
    cartIcon.classList.remove("cart-icon-highlight");
  }
}

window.addEventListener('load', () => {
  searchProducts(); 
  viewCart(); 
  updateCartIcon();
});

