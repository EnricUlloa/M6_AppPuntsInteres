class Map {
    constructor() {
        //Aqui lo que hacemos es poner la ubicacion -> ([coordenada1, coordenada2], zoom)
        this.map = L.map('map').setView([41.65, 1.5], 8);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.mostrarPuntInicial(); // Cargar ubicación del usuario
    }

    mostrarPuntInicial() {
        this.getPosicioActual().then(({ lat, lon }) => {
            this.marker = L.marker([lat, lon]).addTo(this.map);
            this.marker.bindPopup("<b>Estàs aquí</b>").openPopup();
            this.actualitzarPosInitMapa(lat, lon);
        }).catch(() => {
            // Si no se puede obtener ubicación, usamos una por defecto
            const lat = 41.40241, lon = 2.19439;
            this.marker = L.marker([lat, lon]).addTo(this.map);
            this.marker.bindPopup("<b>Estàs aquí</b>").openPopup();
        });
    }

    actualitzarPosInitMapa(lat, lon) {
        this.map.setView([lat, lon], 10); // Acercamos un poco más
    }

    mostrarPunto(lat, lon, descripcion) {
        L.marker([lat, lon]).addTo(this.map)
            .bindPopup(descripcion);
    }

    limpiarMap() {
        this.map.eachLayer(layer => {
            if (layer instanceof L.Marker && layer !== this.marker) {
                this.map.removeLayer(layer);
            }
        });
    }

    mostraPunts(punts) {
        this.limpiarMap();

        punts.forEach(punt => {
            const descripcion = `
                <b>${punt.nombre}</b><br>
                ${punt.direccion}<br>
                <i>Tipo:</i> ${punt.tipo}<br>
                <i>Puntuación:</i> ${punt.puntuacion}
            `;

            this.mostrarPunto(punt.latitud, punt.longitud, descripcion);
        });
    }

    async getPosicioActual() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                    () => reject()
                );
            } else {
                reject();
            }
        });
    }
}
