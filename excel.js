class Excel {
    static async readCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const contenido = e.target.result;
                const lineas = contenido.split("\n").map(line => line.split(";")); 
                const objetos = [];

                
                for (let i = 1; i < lineas.length; i++) {
                    const [pais, codi, ciutat, tipus, nom, direccio, latitud, longitud, horaris, preu, descripcio, puntuacio, moneda] = lineas[i];

                    if (!nom) continue;

                    let objeto;
                    if (tipus === "Espai") {
                        objeto = new PuntInteres(i, pais, ciutat, nom, direccio, tipus, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacio));
                    } else if (tipus === "Atraccio") {
                        objeto = new Atraccio(i, pais, ciutat, nom, direccio, tipus, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacio), horaris, parseFloat(preu), moneda);
                    } else if (tipus === "Museu") {
                        objeto = new Museu(i, pais, ciutat, nom, direccio, tipus, parseFloat(latitud), parseFloat(longitud), parseFloat(puntuacio), horaris, parseFloat(preu), moneda, descripcio);
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
