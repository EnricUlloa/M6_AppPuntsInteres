class Map {
    constructor() {

        //Aqui lo que hacemos es poner la ubicacion -> ([coordenada1, coordenada2], zoom)
        this.map = L.map('map').setView([40.21571, -3.64779], 5);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Esto de aqui hace posible que salga el popup diciendo "Estas aqui"
        this.marker = L.marker([41.40241, 2.19439]).addTo(this.map);
        this.marker.bindPopup("<b>Estàs aqui<b>").openPopup();

    }

    mostrarPunto(lat, lon, descripcion) {
        L.marker([lat, lon]).addTo(this.map)
            .bindPopup(descripcion)
            .openPopup();
    }

    limpiarMap() {
        this.map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                this.map.removeLayer(layer);
            }
        });
    }
    
}
