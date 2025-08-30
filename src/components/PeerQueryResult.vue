<template>
  <div>
    <a-alert v-if="error" :message="error" type="error" show-icon closable class="error-alert" />
    <div v-if="results.length > 0" style="margin-bottom: 12px; font-weight: bold;">
      所有 Tracker Peer 总数：{{ totalPeers }}
    </div>
    <a-tabs v-model:activeKey="localActiveTab" v-if="results.length > 0">
      <a-tab-pane key="summary" tab="汇总">
        <a-table :columns="summaryColumns" :dataSource="results" :pagination="false" size="small">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.error ? 'error' : 'success'">
                {{ record.error ? '失败' : '成功' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'peers'">
              {{ record.error ? '-' : record.peerCount }}
            </template>
            <template v-if="column.key === 'actions'">
              <a-button size="small" @click="$emit('showDetails', record)">
                详情
              </a-button>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="details" tab="详细结果" :disabled="!selectedResult">
        <div v-if="selectedResult">
          <h3>{{ selectedResult.tracker }}</h3>
          <a-descriptions bordered size="small">
            <a-descriptions-item label="状态">
              <a-tag :color="selectedResult && selectedResult.error ? 'error' : 'success'">
                {{ selectedResult && selectedResult.error ? '失败' : '成功' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Peer 数量">
              {{ selectedResult && selectedResult.error ? '-' : (selectedResult && selectedResult.peerCount) }}
            </a-descriptions-item>
            <a-descriptions-item label="响应时间">
              {{ selectedResult && selectedResult.duration ? selectedResult.duration : '-' }} ms
            </a-descriptions-item>
          </a-descriptions>
          <a-collapse class="response-collapse">
            <a-collapse-panel key="1" header="原始响应">
              <pre>{{ selectedResult && selectedResult.rawResponse ? selectedResult.rawResponse : '-' }}</pre>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: 'PeerQueryResult',
  props: {
    error: String,
    results: Array,
    activeTab: String,
    selectedResult: Object,
    summaryColumns: Array
  },
  data() {
    return {
      localActiveTab: this.activeTab
    };
  },
  computed: {
    totalPeers() {
      // 只统计没有 error 的 peerCount
      return this.results
        .filter(r => !r.error && typeof r.peerCount === 'number')
        .reduce((sum, r) => sum + r.peerCount, 0);
    }
  },
  watch: {
    activeTab(newVal) {
      this.localActiveTab = newVal;
    },
    localActiveTab(newVal) {
      this.$emit('update:activeTab', newVal);
    }
  }
};
</script>

<style scoped>
.error-alert {
  margin-bottom: 20px;
}
.response-collapse {
  margin-top: 20px;
}
.response-collapse pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}
</style>
