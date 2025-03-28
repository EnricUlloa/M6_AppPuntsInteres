document.addEventListener("DOMContentLoaded", () => {
    const map = new Map();
    const inputCSV = document.getElementById("cargarCSV");
    const lista = document.getElementById("lista");
    const filtroTipo = document.getElementById("filtroTipo");
    const inputBuscar = document.getElementById("buscar");
    const filtroOrden = document.getElementById("filtroOrden");

    let puntos = [];

    inputCSV.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
            puntos = await Excel.readCSV(file);
            actualizarListaYMap();
        } else {
            alert("El archivo no es un CSV válido.");
        }
    });

    filtroTipo.addEventListener("change", actualizarListaYMap);
    inputBuscar.addEventListener("input", actualizarListaYMap);
    filtroOrden.addEventListener("change", actualizarListaYMap);

    function actualizarListaYMap() {
        const tipoSeleccionado = filtroTipo.value;
        const textoBusqueda = inputBuscar.value.toLowerCase();
        const ordenSeleccionado = filtroOrden.value;

        let puntosFiltrados = puntos.filter(punto => {
            const coincideTipo = tipoSeleccionado === "Todos" || punto.tipo === tipoSeleccionado;
            const coincideNombre = punto.nombre.toLowerCase().includes(textoBusqueda);
            return coincideTipo && coincideNombre;
        });

        // Esto sirve para ordenar los puntos de interes
        puntosFiltrados.sort((a, b) => {
            return ordenSeleccionado === "Ascendente"
                ? a.nombre.localeCompare(b.nombre)
                : b.nombre.localeCompare(a.nombre);
        });

        mostrarLista(puntosFiltrados);
        mostrarEnMap(puntosFiltrados, map);
    }

    function mostrarLista(puntos) {
        lista.innerHTML = "";
        puntos.forEach(async (punto) => {
            const item = document.createElement("div");
            item.className = "punto";
    
            // Esto coje la bandera del país con la API
            const banderaURL = await obtenerBandera(punto.pais);
    
            item.innerHTML = `
                <img src="${banderaURL}" alt="${punto.pais}" width="30">
                <strong>${punto.nombre}</strong> - ${punto.ciudad} (${punto.tipo})
            `;
            lista.appendChild(item);
        });
    }

    // La funcion que hace posible obtner la bandera
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



    function mostrarEnMap(puntos, map) {
        map.limpiarMap();
        puntos.forEach(punto => {
            map.mostrarPunto(punto.latitud, punto.longitud, punto.nombre);
        });
    }
});

