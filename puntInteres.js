class PuntInteres {
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

class Atraccio extends PuntInteres {
    constructor(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion, horaris, preu, moneda) {
        super(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion);
        this.horaris = horaris;
        this.preu = preu;
        this.moneda = moneda;
    }
}

class Museu extends PuntInteres {
    constructor(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion, horaris, preu, moneda, descripcio) {
        super(id, pais, ciudad, nombre, direccion, tipo, latitud, longitud, puntuacion);
        this.horaris = horaris;
        this.preu = preu;
        this.moneda = moneda;
        this.descripcio = descripcio;
    }
}
