<template>
  <div id="app">
    <h1>种子热度查询工具</h1>
    <p class="subtitle">实时查看Torrent种子的Peer连接情况</p>
    <peer-query />
  </div>
</template>

<script setup>
import PeerQuery from './components/PeerQuery.vue';
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

h1 {
  color: #1890ff;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}
</style>