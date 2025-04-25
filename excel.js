class Excel {//declaramos una clase llamada Excel con un metodo asincrono de nombre readCSV que procesa un archivo CSV
    static async readCSV(file) {//definiemos que sea un metodo estatico y asincron 
        return new Promise((resolve, reject) => {//Esto devuelve una promise
            const reader = new FileReader();//FileReader(): es una interfaz en JS que permite a las aplicaciones web leer el contenido de archivos.
            //FileReader() podriamos decir que es como el lector que hace que la pagina web utiliza para abrir y leer ese archivo

                //FileReader lee el contenido de achivos a través de un <input type="file">.
                //Lo hacemos de forma asincrona para que no bloquee la ejecucion de otras tareas en la pagina web.

                //Podriamos sacar como conclusion de que es una herramienta que nos permite que las paginas web interactuen con archivos locales

            reader.onload = (e) => {
                const contenido = e.target.result;//esto de aca obtiene el contenido del archivo 
                const lineas = contenido.split("\n").map(line => line.split(";")); 
                //Aqui realiza dos operaciones importantes
                    //contenido.split("\n"): esto divide el contenido del archivo en un array de lineas haciendo uso del salto de linea como separador
                    //.map(line => line.split(";"));: itera sobre cada linea y la divide en un array de valores, usando el punto y coma como separador

                //Esto se hace con la finalidad de convertir el texto plano del archivo CSV en un array de arrays

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
