//Aqui habria que poner el iva de otros paises, de momento solo funciona con españa
const IVA_PAISES = {
    Espanya: 0.21,

};

class PuntoInteres {//decalramos una nueva clase llamada PuntoInteres
    constructor(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion) {
        this.id = id;
        this.pais = pais;
        this.ciudad = ciudad;
        this.nombre = nombre;
        this.direccion = direccion;
        this.tipo = tipo;
        this.latitud = latitud;
        this.longitud = longitud;
        this.puntuacion = puntuacion;
    }
}

class Atraccion extends PuntoInteres {//creamos una subclase llamada Atraccion, que hereda de PuntosInteres
    constructor(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion, horarios, precio, moneda) {
        super(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion);
        this.horarios = horarios;
        this.precio = precio;
        this.moneda = moneda;
    }

    get preuIva() {
        if (this.precio === 0) return "Entrada gratuïta";//Si la entrada es gratis, sale ese mensaje
    
        const iva = IVA_PAISES[this.pais];//Busca el IVA del pais correspondiente usando el objeto IVA_PAISES
        const precioFinal = iva ? (this.precio * (1 + iva)).toFixed(2) : this.precio.toFixed(2); //Si el pais tiene IVA lo aplica, si no, solo muestra el precio original. Tambien redondea
        const etiqueta = iva ? "" : "(no IVA)";//Si hay IVA no sale nada, si no se encontro dira "(no IVA)"
    
        return `${precioFinal}${this.moneda} ${etiqueta}`;//Esto devuelve lo que saldra dependiendo del IVA
    }
    
}

class Museo extends PuntoInteres {//declaramos calse Museo que hereda de PuntoInteres
    constructor(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion, horarios, precio, moneda, descripcion) {
        super(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion);
        this.horarios = horarios;
        this.precio = precio;
        this.moneda = moneda;
        this.descripcion = descripcion;
    }

    get preuIva() {//Esto es un getter llamada preuIVA
        if (this.precio === 0) return "Entrada gratuïta";//Si el precio es 0, es gratis
    
        const iva = IVA_PAISES[this.pais];//Busca la tasa de IVA en el objeto IVA_PAISES
        const precioFinal = iva ? (this.precio * (1 + iva)).toFixed(2) : this.precio.toFixed(2);//Aqui calcula el precio final con Iva incluido si es que hay IVA.
        const etiqueta = iva ? "" : "(no IVA)";
    
        return `${precioFinal}${this.moneda} ${etiqueta}`;
    }

}

//Esto hace que las clases sean globales
//window: es el objeto global mas alto en la jerarquia de los objetos. Esto hace que se pueda acceder a la definiciones de las classes utilizando window.PuntoInteres
window.PuntoInteres = PuntoInteres;
window.Atraccion = Atraccion;
window.Museo = Museo;
