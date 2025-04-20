class Map {
    constructor() {
        //Aqui lo que hacemos es poner la ubicacion -> ([coordenada1, coordenada2], zoom)
        this.map = L.map('map').setView([41.65, 1.5], 8); // Centramos en cataluña y con un zoom de 8

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, //zoom maximo
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.mostrarPuntInicial(); // Cargar ubicación del usuario. En el navegador te pedira acceso a tu ubicacion
    }

    mostrarPuntInicial() {

        //Llama al metodo getPosicioActual
        this.getPosicioActual().then(({ lat, lon }) => {
            this.marker = L.marker([lat, lon]).addTo(this.map); //Crea un marcador de Leaflet
            this.marker.bindPopup("<b>Estàs aquí</b>").openPopup(); //sale el popup con el mensaje
            this.actualitzarPosInitMapa(lat, lon);
        }).catch(() => {
            // Si no se puede obtener ubicación, usamos una por defecto. Aqui te ubica en el INS TIC
            const lat = 41.40241, lon = 2.19439; //Coords del INS TIC
            this.marker = L.marker([lat, lon]).addTo(this.map);
            this.marker.bindPopup("<b>Estàs aquí</b>").openPopup();
        });
    }

    actualitzarPosInitMapa(lat, lon) {
        this.map.setView([lat, lon], 10); // Acercamos un poco más, un poco mas de zoom
    }

    mostrarPunto(lat, lon, descripcion) {
        L.marker([lat, lon]).addTo(this.map) //Crea un marcadror
            .bindPopup(descripcion);
    }

    limpiarMap() {
        this.map.eachLayer(layer => {
            if (layer instanceof L.Marker && layer !== this.marker) {
                this.map.removeLayer(layer); //Elimina el marcador del mapa
            }
        });
    }

    mostraPunts(punts) {
        this.limpiarMap(); //Llama a la funcion que borra los marcadores anteriores

        punts.forEach(punt => {
            //Crea el tesxto que saldra en el popup
            const descripcion = `
                <b>${punt.nombre}</b><br>
                ${punt.direccion}<br>
                <i>Tipo:</i> ${punt.tipo}<br>
                <i>Puntuación:</i> ${punt.puntuacion}
            `;

            this.mostrarPunto(punt.latitud, punt.longitud, descripcion);//Llama a la funcion que coloca un marcadro en el mapa
        });
    }

    async getPosicioActual() {//devueve una promise. osea una operacion que puede tardar y completarse mas tarde
        return new Promise((resolve, reject) => { //crea una nueva promesa
            if (navigator.geolocation) {//Compureva si el navegador tiene ubicacion
                navigator.geolocation.getCurrentPosition(//Esto pide al navegador la posicion del usuario
                    pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),//Si el usuario acepta lo localiza
                    () => reject()//Si no acepta, lo rechaza(no lo pudo localizar) y pues como hemos visto antes lo ubicara en el ins tic
                );
            } else {
                reject();
            }
        });
    }
}
