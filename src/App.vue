
<template>
  <div id="app">
    <peer-query />
  </div>
</template>

<script>
import PeerQuery from './components/PeerQuery.vue';
export default {
  name: 'App',
  components: {
    PeerQuery
  }
}
</script>

<style>
#app {
  text-align: center;
}
</style>