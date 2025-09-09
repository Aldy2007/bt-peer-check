<template>
  <div>
    <a-alert v-if="error" :message="error" type="error" show-icon closable class="error-alert" />

    <!-- 统计信息区域 -->
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
        <div class="recommendation">
          <span style="font-size: 16px; color: rgba(0, 0, 0, 0.45);">推荐度&nbsp;&nbsp;&nbsp;</span>
          <span :style="{
            fontSize: '24px',
            fontWeight: 'bold',
            color: recommendationColor
          }">
            {{ downloadRecommendation }}
          </span>
        </div>
      </a-space>
    </div>

    <!-- 结果标签页 -->
    <a-tabs v-model:activeKey="localActiveTab" v-if="results.length > 0">
      <a-tab-pane key="summary" tab="汇总">
        <a-table :columns="summaryColumns" :dataSource="sortedResults" :pagination="false" size="small">
          <template #bodyCell="{ column, record }">
            <!-- 状态列 -->
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.loading" color="processing">查询中</a-tag>
              <a-tag v-else :color="record.error ? 'error' : 'success'">
                {{ record.error ? '失败' : '成功' }}
              </a-tag>
            </template>

            <!-- Peer数量列 -->
            <template v-if="column.key === 'peers'">
              <span v-if="record.loading">
                <a-spin size="small" />
              </span>
              <span v-else>
                {{ record.error ? '-' : record.peerCount }}
              </span>
            </template>

            <!-- 操作列 -->
            <template v-if="column.key === 'actions'">
              <a-button size="small" @click="$emit('showDetails', record)" :disabled="record.loading">
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
              <a-tag :color="selectedResult.error ? 'error' : 'success'">
                {{ selectedResult.error ? '失败' : '成功' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Peer 数量">
              {{ selectedResult.error ? '-' : selectedResult.peerCount }}
            </a-descriptions-item>
            <a-descriptions-item label="完成数">
              {{ selectedResult.error ? '-' : selectedResult.complete }}
            </a-descriptions-item>
          </a-descriptions>

          <a-collapse class="response-collapse">
            <a-collapse-panel key="1" header="原始响应">
              <pre>{{ selectedResult.rawResponse ? JSON.stringify(selectedResult.rawResponse, null, 2) : '-' }}</pre>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="错误信息" v-if="selectedResult.error">
              <pre>{{ selectedResult.error }}</pre>
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
        .filter(r => !r.error && !r.loading && typeof r[field] === 'number')
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
        // 先按加载状态排序（正在加载的排前面）
        if (a.loading !== b.loading) {
          return a.loading ? -1 : 1;
        }
        // 然后按错误状态排序（错误的排后面）
        if (a.error !== b.error) {
          return a.error ? 1 : -1;
        }
        // 最后按tracker名称排序
        return (a.tracker || '').localeCompare(b.tracker || '');
      });
    },
    downloadRecommendation() {
      const completed = this.totalComplete;
      if (completed >= 1000) return '极快';
      if (completed >= 500) return '速度快';
      if (completed >= 100) return '速度一般';
      return '不推荐下载';
    },
    recommendationColor() {
      const completed = this.totalComplete;
      if (completed >= 1000) return '#52c41a'; // 绿色（极快）
      if (completed >= 500) return '#52c41a'; // 绿色（快）
      if (completed >= 100) return '#faad14'; // 橙色（一般）
      return '#f5222d'; // 红色（不推荐）
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

.peer-stats {
  margin-bottom: 20px;
}

.response-collapse {
  margin-top: 20px;
}

.response-collapse pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
}

/* 为加载中的行添加浅色背景 */
:deep(.ant-table-tbody) tr[data-loading="true"] {
  background-color: rgba(24, 144, 255, 0.05);
}
</style>