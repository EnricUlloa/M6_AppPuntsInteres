class Excel {
    static async readCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const contenido = e.target.result;
                const lineas = contenido.split("\n").map(line => line.split(";")); 
                const objetos = [];

                for (let i = 1; i < lineas.length; i++) {
                    const [pais, codigo, ciudad, tipo, nombre, direccion, latitud, longitud, horaris, preu, descripcion, puntuacion, moneda] = lineas[i];

                    if (!nombre) continue;

                    let objeto;
                    if (tipo === "Espai") {
                        objeto = new PuntoInteres(i, pais, ciudad, nombre, direccion, tipo, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacion));
                    } else if (tipo === "Atraccio") {
                        objeto = new Atraccion(i, pais, ciudad, nombre, direccion, tipo, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacion), horaris, parseFloat(preu), moneda);
                    } else if (tipo === "Museu") {
                        objeto = new Museo(i, pais, ciudad, nombre, direccion, tipo, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacion), horaris, parseFloat(preu), moneda, descripcion);
                    }

                    objetos.push(objeto);
                }

                resolve(objetos);
            };

            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
        });
    }
}
