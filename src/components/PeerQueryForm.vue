<template>
  <a-form layout="vertical">
    <a-form-item label="Info Hash" required>
      <a-input v-model:value="infoHash" placeholder="输入 torrent 的 info hash (40 个字符)" :maxlength="40" allow-clear />
    </a-form-item>
    <a-form-item label="Tracker 服务器列表" required>
      <div style="display: flex; gap: 8px;">
        <a-textarea v-model:value="trackersText" placeholder="每行输入一个 tracker URL" :rows="4" allow-clear style="flex: 1;" />
        <a-button @click="fetchTrackers" :loading="fetchingTrackers" style="align-self: flex-start;">
          获取推荐Tracker
        </a-button>
      </div>
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
      trackersText: '',
      fetchingTrackers: false
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
  methods: {
    async fetchTrackers() {
      this.fetchingTrackers = true;
      try {
        const response = await fetch('https://cf.trackerslist.com/http.txt');
        if (response.ok) {
          const text = await response.text();
          this.trackersText = text.trim();
        } else {
          throw new Error('获取 Tracker 列表失败');
        }
      } catch (error) {
        console.error('获取 Tracker 列表出错:', error);
        this.$message.error('获取 Tracker 列表失败，请稍后重试');
      } finally {
        this.fetchingTrackers = false;
      }
    }
  },
};
</script>