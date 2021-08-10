<template>
  <div id="app">
    <Search/>
    <Map/>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Map from './components/Map.vue'

export default {
  name: 'App',
  components: {
    Search,
    Map
  }
}
</script>