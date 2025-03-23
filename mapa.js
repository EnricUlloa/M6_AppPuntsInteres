class Mapa {
    constructor() {
        this.mapa = L.map('mapa').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.mapa);
    }

    mostrarPunto(lat, lon, descripcion) {
        L.marker([lat, lon]).addTo(this.mapa)
            .bindPopup(descripcion)
            .openPopup();
    }

    limpiarMapa() {
        this.mapa.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                this.mapa.removeLayer(layer);
            }
        });
    }
    

}
