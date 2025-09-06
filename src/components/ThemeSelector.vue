<template>
  <div class="theme-selector">
    <a-dropdown :trigger="['click']" placement="bottomRight">
      <a-button 
        type="text" 
        class="theme-button"
        :style="{ 
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`
        }"
      >
        <template #icon>
          <span class="theme-icon">🎨</span>
        </template>
        {{ theme.name }}
        <DownOutlined />
      </a-button>
      
      <template #overlay>
        <a-menu 
          :selected-keys="[currentTheme]"
          @click="handleThemeChange"
          class="theme-menu"
        >
          <a-menu-item 
            v-for="themeOption in availableThemes" 
            :key="themeOption.key"
            class="theme-menu-item"
          >
            <div class="theme-option">
              <div class="theme-preview">
                <div 
                  class="color-dot primary"
                  :style="{ backgroundColor: themeOption.colors.primary }"
                ></div>
                <div 
                  class="color-dot secondary"
                  :style="{ backgroundColor: themeOption.colors.secondary }"
                ></div>
                <div 
                  class="color-dot background"
                  :style="{ backgroundColor: themeOption.colors.background }"
                ></div>
              </div>
              <div class="theme-info">
                <div class="theme-name">{{ themeOption.name }}</div>
                <div class="theme-description">{{ themeOption.description }}</div>
              </div>
              <div class="theme-status" v-if="currentTheme === themeOption.key">
                ✓
              </div>
            </div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
import { DownOutlined } from '@ant-design/icons-vue'
import { useTheme } from '../composables/useTheme'

const { currentTheme, theme, availableThemes, setTheme } = useTheme()

const handleThemeChange = ({ key }) => {
  setTheme(key)
}
</script>

<style scoped>
.theme-selector {
  display: inline-block;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: var(--color-surface);
  backdrop-filter: blur(10px);
}

.theme-button:hover {
  background: var(--color-surface);
  opacity: 0.8;
  box-shadow: var(--box-shadow);
}

.theme-icon {
  font-size: 16px;
}

.theme-menu {
  background: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 8px !important;
  box-shadow: var(--box-shadow) !important;
  backdrop-filter: blur(10px);
  min-width: 280px;
}

.theme-menu-item {
  padding: 0 !important;
}

.theme-menu-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  color: var(--color-text);
}

.theme-preview {
  display: flex;
  gap: 4px;
  align-items: center;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
}

.theme-info {
  flex: 1;
}

.theme-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.theme-description {
  font-size: 12px;
  opacity: 0.7;
}

.theme-status {
  color: var(--color-primary);
  font-weight: bold;
  font-size: 16px;
}

/* 针对不同主题的特殊样式 */
:global(.theme-hacker) .theme-button {
  text-shadow: var(--text-shadow);
}

:global(.theme-cyberpunk) .theme-button {
  text-shadow: var(--text-shadow);
}

:global(.theme-retro) .theme-button {
  text-shadow: var(--text-shadow);
}
</style>