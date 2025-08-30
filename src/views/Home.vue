<template>
  <div>
    <h1>首页</h1>
    <PeerQuery />
    <TrackerQueryForm />
  </div>
</template>

<script>
import PeerQuery from '../components/PeerQuery.vue';
import TrackerQueryForm from '../components/TrackerQueryForm.vue';

export default {
  name: 'HomePage',
  components: {
    PeerQuery,
    TrackerQueryForm
  }
};
</script>
