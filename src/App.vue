<template>
  <div id="app">
    <Search/>
    <Map/>
    <Filters/>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Map from './components/Map.vue'
import Filters from './components/Filters.vue'

export default {
  name: 'App',
  components: {
    Search,
    Filters,
    Map,
  }
}
</script>