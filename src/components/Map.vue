<template>
    <div  class="app-map__wrapper">
        <div id="app-map-container"></div>
        <div v-if="isPopup && clickedOccurrances.length > 0" class="app-map__popup__wrapper">
            <div class="app-map__popup">
                <div class="_content">
                    <div class="_title">Knotweed Record</div>

                    <div class="_item">
                        <div>Date Recorded</div>
                        <div>{{ getDateRecorded(clickedOccurrances[0]) }}</div>
                    </div>

                    <div class="_item" v-if="clickedOccurrances[0].eventDateEnd">
                        <div>Date Resolved</div>
                        <div>{{ getDateResolved(clickedOccurrances[0]) }}</div>
                    </div>



                    <div class="_item">
                        <div>Rights Holder</div>
                        <div>{{ getHolder(clickedOccurrances[0]) }}</div>
                    </div>

                    <div class="_item">
                        <div>Basis of Record</div>
                        <div>{{ getBasisOfRecord(clickedOccurrances[0].basisOfRecord) }}</div>
                    </div>

                    <!-- <div class="_item">
                        <div>Status</div>
                         <div>{{ clickedOccurrances[0].identificationVerificationStatus}}</div>
                    </div> -->

                </div>
                <div class="_button" @click="closePopup"></div>
            </div>
        </div>
        <a href="#" class="app-map__link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32"><path fill="#fff" d="M12.5 0A12.5 12.5 0 000 12.5c0 8.05 11 18.63 11.46 19.08a1.48 1.48 0 001 .42 1.48 1.48 0 001-.42c.47-.45 11.47-11 11.47-19.08A12.51 12.51 0 0012.5 0zm0 19.5a7 7 0 01-7-7 7 7 0 017-7 7 7 0 017 7 7 7 0 01-7 7z"/></svg>
            <span>Submit a new record</span>
        </a>
    </div>
</template>

<script>

import { mapGetters } from "vuex"

const L = window.L

export default ({ 
  name: 'Map',
  data() {
      return {
            isPopup: false,
            search: 'lsid:NHMSYS0000458716',
            bounds: [-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085],
            zoom: 6,
            params: {
                opacity: 0.5
            },
            layersParams: [
                {
                    filter: `&qc=&&fq=occurrence_status:present&fq=occurrence_date_end_dt:[1900-01-01T00:00:00Z%20TO%20${new Date().toISOString()}]`,
                    color: '3aba77',
                    id: "resolved"
                },
                {
                    filter: `&qc=&&fq=occurrence_status:present&fq=-occurrence_date_end_dt:[1900-01-01T00:00:00Z%20TO%20${new Date().toISOString()}]`,
                    color: 'fe2221',
                    id: "live"
                }
            ]
      }
  },
  computed: {
     ...mapGetters([
      'location',
      'filters',
      'clickedOccurrances'
    ]),
    size() {
        let value = 4
        return value
    }
  },
   watch: {
       location() {
            this.update()
       },
       filters(newVal, oldVal) {
           if (newVal !== oldVal) {
            this.updateFilters()
           }
       }
   },
   methods: {
       init() { 

            this.map = L.map('app-map-container')

            this.map.fitBounds(L.latLngBounds(L.latLng(49.959999905, -7.57216793459), L.latLng(58.6350001085, 1.68153079591)))
            
            // this.setZoom()
            this.baseLayer()
            this.addLayers()

            this.map.on('zoomend', () => {
                // this.setZoom()
            });

            this.map.on('click', (e) => {
                // if (this.map.getZoom() > 10) {
                    this.getRecords(e.latlng.lat, e.latlng.lng)
                // }
            });

       },

       closePopup() {
           this.isPopup = false
           this.$store.commit('clickedOccurrances', [])
       },

       getDateRecorded(el) {
            let d; 
            if (el.eventDate) {
               d = new Date(el.eventDate) 
            } else {
                d = new Date(el.occurrenceYear) 
            }
            return d.toLocaleDateString()
       },

       getDateResolved(el) {
            let d = new Date(el.eventDateEnd);
            return d.toLocaleDateString()
       },

       getHolder(obj) {
           let name = 'Not provided'
           if (obj.collector) {
               name = obj.collector
           } else if (obj.dataProviderName) {
               name = obj.dataProviderName
           }
           return name
       },

       getBasisOfRecord(name) {
           if (name === 'HumanObservation') {
               name = 'Human Observation'
           }
           return name
       },

       getRecords(lat, lng) {
            const api = `https://records-ws.nbnatlas.org/occurrences/search?q=${this.search}&pageSize=100&lon=${lng}&lat=${lat}&radius=0.25`
            this.$http.get(api).then((response) => {
                console.log(response.data.occurrences)
                let arr = response.data.occurrences

                console.log('no filters', arr)

                if (this.filters === 'resolved') {
                    arr = arr.filter((x) => x.eventDateEnd !== undefined)
                } else if (this.filters === 'live'){
                    arr = arr.filter((x) => x.eventDateEnd === undefined)
                }

                console.log('filtered', arr)

                this.$store.commit('clickedOccurrances', arr)
                console.log(response.data.occurrences[0])
                if (response.data.occurrences.length > 0) {
                    this.isPopup = true
                }
            })
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
                    `https://records-ws.nbnatlas.org/mapping/wms/reflect?q=${this.search}${layer.filter}`, {
                        OUTLINE: false,
                        id: layer.id,
                        type: 'markers',
                        ENV: `name:circle;color:${layer.color};size:${this.size};opacity:${this.params.opacity};`,
                }).addTo(this.map)
            })
       },

       addLayer() {
           this.layersParams.forEach((layer) => {
               console.log(this.filters, layer.id)
               if (layer.id === this.filters) {
                    L.tileLayer.wms(
                        `https://records-ws.nbnatlas.org/mapping/wms/reflect?q=${this.search}${layer.filter}`, {
                            OUTLINE: false,
                            id: layer.id,
                            type: 'markers',
                            ENV: `name:circle;color:${layer.color};size:${this.size};opacity:${this.params.opacity};`,
                    }).addTo(this.map)
               }
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
       },

       updateFilters() {
            // this.removeLayers()console.log(this.map)
            if (this.filters === 'all') {
                this.removeLayers()
                this.updateLayers()
            } else {

                const isExist = []

                this.map.eachLayer((layer) => {
                    if (layer.options.type) {
                        if (layer.options.id !== this.filters) {
                            this.map.removeLayer(layer)
                        } else {
                            isExist.push(layer)
                        }
                    }
                })

                if (isExist.length === 0) {
                    this.addLayer()   
                }
            }
       }
   },
   mounted() {
       this.init()
   }
})
</script>
