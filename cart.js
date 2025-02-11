const productos = [
  {
    idProducto: 1,
    codigoInterno: "PD001",
    nombre: "Running Shoes",
    estado: "Activo",
    precio: 50,
  },
  {
    idProducto: 2,
    codigoInterno: "PD002",
    nombre: "Yoga Mat",
    estado: "Activo",
    precio: 20,
  },
  {
    idProducto: 3,
    codigoInterno: "PD003",
    nombre: "Gym Bag",
    estado: "Inactivo",
    precio: 25,
  },
  {
    idProducto: 4,
    codigoInterno: "PD004",
    nombre: "Water Bottle",
    estado: "Activo",
    precio: 10,
  },
  {
    idProducto: 5,
    codigoInterno: "PD005",
    nombre: "Sports Bra",
    estado: "Activo",
    precio: 30,
  },
  {
    idProducto: 6,
    codigoInterno: "PD006",
    nombre: "Athletic Shorts",
    estado: "Inactivo",
    precio: 15,
  },
  {
    idProducto: 7,
    codigoInterno: "PD007",
    nombre: "Resistance Bands",
    estado: "Activo",
    precio: 12,
  },
];

console.log(productos)


let carrito = [];


function mostrarProductos() {
    let mensaje = "Productos disponibles:\n";
    let productosDisponibles = [];  

    
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].estado === "Activo") {
            productosDisponibles.push(productos[i]);
        }
    }

    if (productosDisponibles.length === 0) {
        mensaje = "No hay productos disponibles en este momento.";
    } else {
        for (let i = 0; i < productosDisponibles.length; i++) {
            mensaje += `${i + 1}. ${productosDisponibles[i].nombre}- $${productosDisponibles[i].precio}\n`;
        }
        mensaje += "Escribe el número del producto para agregarlo al carrito (o 0 para terminar):";
    }

    return mensaje;
}


function agregarProducto() {
    let eleccion = prompt(mostrarProductos());
    
    while (eleccion !== "0") {
        eleccion = parseInt(eleccion) - 1;  

        let productosDisponibles = [];
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].estado === "Activo") {
                productosDisponibles.push(productos[i]);
            }
        }

        if (eleccion >= 0 && eleccion < productosDisponibles.length) {
            carrito.push(productosDisponibles[eleccion]);  
            alert(`${productosDisponibles[eleccion].nombre} ha sido agregado al carrito.`);
            console.log("Carrito actual:");
            for (let i = 0; i < carrito.length; i++) {
                console.log(`${carrito[i].nombre} - $${carrito[i].precio}`);
            }
        } else {
            alert("Opción no válida. Intenta de nuevo.");
            
        }

        eleccion = prompt(mostrarProductos());  
    }

    calcularTotal();  
}


function calcularTotal() {
    let total = 0;
    let resumen = "Productos en tu carrito:\n";

    
    for (let i = 0; i < carrito.length; i++) {
        resumen += `${carrito[i].nombre} (Código: ${carrito[i].codigoInterno}) - $${carrito[i].precio}\n`;
        total += carrito[i].precio;  
    }

    resumen += `\nTotal a pagar: $${total}`;
    alert(resumen);  
    console.log(resumen)
}


agregarProducto();
