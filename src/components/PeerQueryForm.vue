<template>
  <a-form layout="vertical">
    <a-form-item label="Info Hash" required>
      <a-input v-model:value="infoHash" placeholder="输入 torrent 的 info hash (40 个字符)" :maxlength="40" allow-clear />
    </a-form-item>
    <a-form-item label="Tracker 服务器列表" required>
      <a-textarea v-model:value="trackersText" placeholder="每行输入一个 tracker URL" :rows="4" allow-clear />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="$emit('query', { infoHash, trackersText })" :disabled="!isValidInput" :loading="loading">
        查询所有 Tracker
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'PeerQueryForm',
  props: {
    loading: Boolean
  },
  data() {
    return {
      infoHash: '',
      trackersText: 'http://185.230.4.150:1337/announce',
    };
  },
  computed: {
    trackers() {
      return this.trackersText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    },
    isValidInput() {
      return this.infoHash.length === 40 && this.trackers.length > 0;
    },
  },
};
</script>
