<template>
  <div id="app">
    <div class="app-header">
      <div class="header-content">
        <h1>种子热度查询工具</h1>
        <p class="subtitle">实时查看Torrent种子的Peer连接情况</p>
      </div>
      <div class="header-controls">
        <theme-selector />
      </div>
    </div>
    <peer-query />
  </div>
</template>

<script setup>
import PeerQuery from './components/PeerQuery.vue';
import ThemeSelector from './components/ThemeSelector.vue';
import { useHead } from '@vueuse/head'

useHead({
  title: '种子热度查询 - 实时查看Torrent做种情况',
  meta: [
    { name: 'description', content: '专业Torrent种子热度查询工具，实时显示peer连接数和种子可用性' },
    { name: 'keywords', content: 'BT下载, 种子查询, peer数, 做种热度, 种子健康度' },
    { property: 'og:title', content: '种子热度查询 - 实时查看Torrent做种情况' },
    { property: 'og:description', content: '专业Torrent种子热度查询工具，实时显示peer连接情况' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<style>
#app {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  gap: 20px;
}

.header-content {
  flex: 1;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

h1 {
  color: var(--color-primary, #1890ff);
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.subtitle {
  color: var(--color-text, #666);
  margin-bottom: 0;
  font-size: 16px;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .header-controls {
    margin-top: 15px;
  }
  
  h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  #app {
    padding: 15px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 14px;
  }
}
</style>