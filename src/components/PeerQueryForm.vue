<template>
  <a-form layout="vertical">
    <a-form-item label="Info Hash" required>
      <a-input v-model:value="magnetLink" placeholder="输入磁力链接" allow-clear @change="handleMagnetLinkChange" />
      <div v-if="torrentName" style="margin-top: 8px;">
        <span class="ant-tag ant-tag-success">{{ torrentName }}</span>
      </div>
    </a-form-item>
    <a-form-item label="Tracker 服务器列表" required>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <a-button @click="fetchTrackers" :loading="fetchingTrackers" size="small">
          获取推荐Tracker
        </a-button>
      </div>
      <a-textarea v-model:value="trackersText" placeholder="每行输入一个 tracker URL" :rows="4" allow-clear />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleQuery" :disabled="!isValidInput" :loading="loading">
        查询种子状态
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import parseMagnetLink from '../utils/magnet'; 

export default {
  name: 'PeerQueryForm',
  props: {
    loading: Boolean
  },
  data() {
    return {
      magnetLink: '',
      trackersText: '',
      fetchingTrackers: false,
      torrentName: '',
      hash: '',
    };
  },
  computed: {
    isValidInput() {
      return this.magnetLink.trim() && this.trackersText.trim();
    },
    trackers() {
      return this.trackersText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    },
  },
  methods: {
    handleQuery() {
      if (!this.isValidInput) return;

      const queryData = {
        infoHash: this.hash,
        trackersText: this.trackersText
      };

      this.$emit('query', queryData);
    },
    async fetchTrackers() {
      this.fetchingTrackers = true;
      try {
        const response = await fetch('https://cf.trackerslist.com/http.txt');
        if (response.ok) {
          const text = (await response.text()).split('\n').filter(line => line.trim()).join('\n');
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
    },
    handleMagnetLinkChange() {
      try {
        if (this.magnetLink && this.magnetLink.startsWith('magnet:?')) {
          const parsed = parseMagnetLink(this.magnetLink);
          this.torrentName = parsed.name;
          this.hash = parsed.hash;
          const allTrackers = [
            ...parsed.httpTrackers,
            // ...parsed.udpTrackers,
            // ...parsed.otherTrackers
          ];

          if (allTrackers.length > 0) {
            this.trackersText = allTrackers.join('\n');
          } else {
            this.$message.warning("这个磁力链接不包括tracker服务器");
          }
        }
      } catch (error) {
        console.error('解析磁力链接出错:', error);
      }
    }
  },
};
</script>