<template>
  <div>
      <div id="map" style="height: 500px;"></div>
  </div>
</template>

<script>


import { mapGetters } from "vuex"

const L = window.L

export default ({ 
  name: 'Map',
  data() {
      return {
            bounds: [-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085],
            zoom: 6,
            params: {
                opacity: 0.5
            },
            layersParams: [
                {
                    filter: '&qc=&&fq=occurrence_status:present&fq=identification_verification_status:(%22Unconfirmed%22%20OR%20%22Unconfirmed%20-%20plausible%22%20OR%20%22Unconfirmed%20-%20not%20reviewed%22)',
                    color: 'fe2221',
                    id: "unconfirmed"
                },
                {
                    filter: '&qc=&&fq=occurrence_status:present&fq=identification_verification_status:(%22Accepted%22%20OR%20%22Accepted%20-%20considered%20correct%22%20OR%20%22Accepted%20-%20correct%22%20OR%20%22verified%22)',
                    color: '3aba77',
                    id: "accepted"
                }
            ]
      }
  },
  computed: {
     ...mapGetters([
      'location'
    ]),
    size() {
        let value
        if (this.zoom < 8) {
            value = 4
        } else {
            value = 10
        }
        return value
    }
  },
   watch: {
       location() {
            this.update()
       }
   },
   methods: {
       init() { 

            this.map = L.map('map')

            this.map.fitBounds(L.latLngBounds(L.latLng(49.959999905, -7.57216793459), L.latLng(58.6350001085, 1.68153079591)))
            
            this.setZoom()
            this.baseLayer()
            this.addLayers()

            this.map.on('zoomend', () => {
                this.setZoom()
            });

       },

       baseLayer() {
            L.tileLayer(
                "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
                    styleId: 22677,
                    attribution: ""
            }).addTo(this.map)
            
       },

       removeLayers() {
            this.map.eachLayer((layer) => {
                if (layer.options.type) {
                    this.map.removeLayer(layer)
                }
            })
       },

       addLayers() {
            this.layersParams.forEach((layer) => {
                L.tileLayer.wms(
                    "https://records-ws.nbnatlas.org/mapping/wms/reflect?q=lsid:NHMSYS0000458716" + layer.filter, {
                        OUTLINE: false,
                        type: 'markers',
                        ENV: `name:circle;color:${layer.color};size:${this.size};opacity:${this.params.opacity};`,
                }).addTo(this.map)
            })
       },

       updateLayers() {
           this.removeLayers()
           this.addLayers()
       },

       setZoom() {
           const zoom = this.map.getZoom()
           const prevZoom = this.zoom

            if (zoom < 8 && prevZoom >= 8) {
                this.updateLayers()
            } else if (zoom >= 8 && prevZoom < 8) {
                this.updateLayers()
            }

           this.zoom = zoom
       },

       update() {
           console.log('update')
           const lat = this.location.latitude
           const lng = this.location.longitude
           this.map.setView([lat, lng], 15)
       }
   },
   mounted() {
       this.init()
   }
})
</script>
