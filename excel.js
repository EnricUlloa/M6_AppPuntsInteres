class Excel {//declaramso calse llamada Excel
    static async readCSV(file) {//definiemos que sea un metodo estatico y asincron
        return new Promise((resolve, reject) => {//Esto devuelve una promise
            const reader = new FileReader();//

            reader.onload = (e) => {
                const contenido = e.target.result;
                const lineas = contenido.split("\n").map(line => line.split(";")); //Procesa el contenido del archivo CSV
                const objetos = [];//Inicializa un array vacío llamado objetos

                for (let i = 1; i < lineas.length; i++) {
                    const [pais, codigo, ciudad, tipo, nombre, direccion, latitud, longitud, horaris, preu, descripcion, puntuacion, moneda] = lineas[i];

                    if (!nombre) continue;//Comprueba si la columna "nombre" esta vacia

                    const tipoLimpio = tipo.trim();//Elimina los espacios en blanco al principio y al final del valor de la columna "tipo".
                    let tipoFinal = tipoLimpio === "Atraccio" ? "Atraccion" :
                                    tipoLimpio === "Museu" ? "Museo" :
                                    tipoLimpio;

                    let objeto;

                    if (tipoFinal === "Espai") {//Si tipoFinal es "Espai", crea una nueva instancia de PuntoInteres.
                        objeto = new PuntoInteres(i, pais, ciudad, nombre, direccion, tipoFinal, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacion));
                    } else if (tipoFinal === "Atraccion") {//Si tipoFinal es "Atraccion", crea una nueva instancia de Atraccion.
                        objeto = new Atraccion(i, pais, ciudad, nombre, direccion, tipoFinal, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacion), horaris, parseFloat(preu), moneda);
                    } else if (tipoFinal === "Museo") {//Si tipoFinal es "Museo", crea una nueva instancia de Museo.
                        objeto = new Museo(i, pais, ciudad, nombre, direccion, tipoFinal, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacion), horaris, parseFloat(preu), moneda, descripcion);
                    }

                    if (objeto) {
                        objetos.push(objeto);
                    }
                    
                }

                resolve(objetos);
            };

            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
        });
    }
}
