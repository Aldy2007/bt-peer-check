<template>
  <div>
    <a-alert v-if="error" :message="error" type="error" show-icon closable class="error-alert" />
    <div v-if="results.length > 0" class="peer-stats">
      <a-space size="large">
        <a-statistic title="已完成" :value="totalComplete"
          :value-style="{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }" />
        <a-statistic title="总Peer数" :value="totalPeers" :value-style="{ fontSize: '24px', fontWeight: 'bold' }" />
        <div class="ratio">
          <span style="font-size: 16px; color: rgba(0, 0, 0, 0.45);">完成率&nbsp;&nbsp;&nbsp;</span>
          <span style="font-size: 24px; font-weight: bold">
            {{ completionRate }}%
          </span>
        </div>
      </a-space>
    </div>
    <a-tabs v-model:activeKey="localActiveTab" v-if="results.length > 0">
      <a-tab-pane key="summary" tab="汇总">
        <a-table :columns="summaryColumns" :dataSource="sortedResults"
          :pagination="false" size="small">
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
  methods: {
    sumValidField(field) {
      return this.results
        .filter(r => !r.error && typeof r[field] === 'number')
        .reduce((sum, r) => sum + r[field], 0);
    }
  },
  computed: {
    totalPeers() {
      return this.sumValidField('peerCount');
    },
    totalComplete() {
      return this.sumValidField('complete');
    },
    completionRate() {
      return this.totalPeers > 0
        ? Math.round((this.totalComplete / this.totalPeers) * 100)
        : 0;
    },
    sortedResults() {
      return [...this.results].sort((a, b) => {
        if (a.error === b.error) {
          return (a.tracker || '').localeCompare(b.tracker || '');
        }
        return a.error ? 1 : -1;
      });
    },
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
