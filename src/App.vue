<template>
  <div class="app-map">
    <div class="app-map__header">
        <div class="_title">
          Japanese Knotweed <span>in the</span> UK
        </div>
        <div class="_info">i</div>
    </div>
    <div class="app-map__dashboard">
      <div class="-right">
        <Search/> 
        <Filters/>
      </div>
      <Legend/>
    </div>
    <Map/>
    <Footer/>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Map from './components/Map.vue'
import Filters from './components/Filters.vue'
import Legend from './components/Legend.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Search,
    Filters,
    Map,
    Legend,
    Footer
  }
}
</script>