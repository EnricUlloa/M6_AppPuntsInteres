document.addEventListener("DOMContentLoaded", () => {
    const map = new Map();//Esto nos ayudara a mostrar donde estan los museos, atraccions y espais
    
    const inputCSV = document.getElementById("cargarCSV");//El boton donde eligimos el CSV
    const lista = document.getElementById("lista");//Mostrar una lista con la informacion de los puntos de interes
    const filtroTipo = document.getElementById("filtroTipo");//Menu desplegable donde eligimos el tipo de puntointeres
    const inputBuscar = document.getElementById("buscar");//Escribir para buscar el punto de interes
    const filtroOrden = document.getElementById("filtroOrden");//Para ordenar la lisat

    //hacemos esto para que este disponible de forma global
    window.puntos = [];

    //Cuando escogemos un archivo en el btn "cargarCSV", esto lee el archvio y muestra la lista de los puntos
    inputCSV.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
            window.puntos = await Excel.readCSV(file);
            actualizarListaYMap();
        } else {
            alert("El archivo no es un CSV válido.");
        }
    });

    filtroTipo.addEventListener("change", actualizarListaYMap);//Si cambiamos la opcion en el menu de filtroTipo, esto volvera a mostra la lista y el mapa pero solo con los puntos que hemos eligido
    inputBuscar.addEventListener("input", actualizarListaYMap);//esto actualiza la lista y el mapa cada vez que escribimos algo en el cuadrito de busqueda
    filtroOrden.addEventListener("change", actualizarListaYMap);//muestra la lista pero ordenada como lo elegimos

    function actualizarListaYMap() {//Esta funcion decide que puntos mostrar
        const tipoSeleccionado = filtroTipo.value;//Revisa el tipo de punto que hemos eligido en el menu (filtroTipo)
        const textoBusqueda = inputBuscar.value.toLowerCase();//Mira lo que hemos escrito en el cuadrito de buscar. Convirte todo a minisculas para que no importe si escribimos en mayusculas o minisculas
        const ordenSeleccionado = filtroOrden.value;//Mira cómo queremos ordenar la lista en el menú filtroOrden.

        //Coje todos los puntos y decide cuales mostrar segun los filtros que hemos aplicado
        let puntosFiltrados = window.puntos.filter(punto => {
            const coincideTipo = tipoSeleccionado === "Todos" || punto.tipo === tipoSeleccionado;//Si elegimos TODOS los muestra o solo a los puntos del tipo que hemos eligido
            const coincideNombre = punto.nombre.toLowerCase().includes(textoBusqueda);//Muestra los puntos cuyo nombre contien lo que escribimos en el buscador
            return coincideTipo && coincideNombre;//Muestra el punto si cumple las 2 condiciones: coincide con el tipo escogido y su nombre contiene lo que buscamos
        });

        // Esto sirve para ordenar los puntos de interes y los ordena segun nustra eleccion en el menu filtroOrden
        puntosFiltrados.sort((a, b) => {
            return ordenSeleccionado === "Ascendente"
                ? a.nombre.localeCompare(b.nombre)
                : b.nombre.localeCompare(a.nombre);
        });

        mostrarLista(puntosFiltrados);
        mostrarEnMap(puntosFiltrados, map);//Llama a la funcion "mostrarEnMap" para que coja la lista de puntos y los muestre en el mapa
    }

    function mostrarLista(puntos) {//Esta funcion poner los puntos en la lista
        lista.innerHTML = "";//vacia la lista para que no se repita si lo actualizamos

        //Si no hay un punto que mostrar dira el mensaje de abajo
        if (puntos.length === 0) {
            lista.innerHTML = "<p>No hi ha informació per mostrar</p>";
            return;
        }

        //Para cada punto en la lista crea un div para mostrar la info del punto, pone un color, muestra la bandera(llama a la funcion obtenerBandera), pone el nombre del punto, asi como su tipo
        //Si el punto es museo o atraccion muestra sus horarios y precios. Si es museo mustra la descripcion.
        //Tambien aqui crea un boton "eliminar". Si lo picamos pregunta si lo queremos eliminar
        puntos.forEach(async (punto) => {
            const item = document.createElement("div");
            item.className = `punto tarjeta-${punto.tipo.toLowerCase()}`; // Para darle color
    
            // Esto coje la bandera del país con la API
            const banderaURL = await obtenerBandera(punto.pais);

            let contenido = `
                <img src="${banderaURL}" alt="${punto.pais}" width="30">
                <strong>${punto.nombre}</strong><br>
                ${punto.ciudad} | Tipus: ${punto.tipo}
            `;
    
            // Añadir detalles según tipo
            if (punto instanceof Atraccion || punto instanceof Museo) {
                contenido += `| Horaris: ${punto.horarios} `;
                contenido += `| Preu: ${punto.preuIva}<br>`;

            }
    
            if (punto instanceof Museo) {
                contenido += `Descripció: ${punto.descripcion}<br>`;
            }
    
            // Botón eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.addEventListener("click", () => {
                if (confirm("Estàs segur que vols eliminar el punt d’interès?")) {
                    eliminarPunto(punto.id);
                }
            });
    
            item.innerHTML = contenido;
            item.appendChild(btnEliminar);
            lista.appendChild(item);
        });
    
        // Mostrar total. Esto crea un texto que dice cuantos puntos hay en la lista
        const total = document.createElement("p");
        total.textContent = `Total d’elements: ${puntos.length}`;
        lista.appendChild(total);

    }

    // La funcion que hace posible obtner la bandera. Le damos el nombre del pais y mediante la API devuelve la direccion de internet donde esta la imagen de la bandera
    // Si el pais es "espanya" lo cambia a Spain para que lo entienda
    // Entonces va al enlace que esta abajo y obtiene la bandera del pais
    // si no encutra la bandera dara una direccion vacia
    async function obtenerBandera(pais) {
        try {
            if (pais.toLowerCase() === "espanya") {
                pais = "Spain";
            }

            const respuesta = await fetch(`https://restcountries.com/v3.1/name/${pais}?fields=flags`);
            const datos = await respuesta.json();

            return datos[0]?.flags?.png || "";
        } catch (error) {
            console.error("Error al obtener la bandera:", error);
            return "";
        }
    }

    //Esta funcion lo que hace es poner los puntos en el mapa
    function mostrarEnMap(puntos, map) {
        map.limpiarMap();//Primero borra los puntos que habia en el mapa

        //Para cada punto crea una descripcion con su nombre, direccion y puntuacion
        //Le dice a "map" que muestre un punto en las coords del punto y que cuando hagamos clic en el punto salga la descripcion
        puntos.forEach(punto => {
            const descripcion = `<b>${punto.nombre}</b><br>${punto.direccion}<br>Puntuación: ${punto.puntuacion}`;
            map.mostrarPunto(punto.latitud, punto.longitud, descripcion);
        });
    }

    //Esta funcion se encarga de quitar un punto en nuestra lista
    function eliminarPunto(id) {
        window.puntos = window.puntos.filter(p => p.id !== id);//Crea una nueva lista de puntos pero sin el punto que tiene el id que queremos quitar. Esta lista la guarda en "window.puntos". Y asi el punto ya no esta
        actualizarListaYMap(); // Refresca lista y mapa
    }
    
});
