class PuntoInteres {
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

class Atraccion extends PuntoInteres {
    constructor(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion, horarios, precio, moneda) {
        super(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion);
        this.horarios = horarios;
        this.precio = precio;
        this.moneda = moneda;
    }
}

class Museo extends PuntoInteres {
    constructor(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion, horarios, precio, moneda, descripcion) {
        super(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion);
        this.horarios = horarios;
        this.precio = precio;
        this.moneda = moneda;
        this.descripcion = descripcion;
    }
}
