import { ref, computed, watch } from 'vue'
import { themes, defaultTheme } from '../styles/themes.js'

// 全局主题状态
const currentTheme = ref(localStorage.getItem('app-theme') || defaultTheme)

export function useTheme() {
  // 当前主题配置
  const theme = computed(() => themes[currentTheme.value])
  
  // 切换主题
  const setTheme = (themeName) => {
    if (themes[themeName]) {
      currentTheme.value = themeName
      localStorage.setItem('app-theme', themeName)
      applyTheme(themes[themeName])
    }
  }
  
  // 应用主题到DOM
  const applyTheme = (themeConfig) => {
    const root = document.documentElement
    
    // 设置CSS变量
    root.style.setProperty('--color-primary', themeConfig.colors.primary)
    root.style.setProperty('--color-secondary', themeConfig.colors.secondary)
    root.style.setProperty('--color-background', themeConfig.colors.background)
    root.style.setProperty('--color-surface', themeConfig.colors.surface)
    root.style.setProperty('--color-text', themeConfig.colors.text)
    root.style.setProperty('--color-border', themeConfig.colors.border)
    root.style.setProperty('--color-glow', themeConfig.colors.glow)
    
    // 设置效果变量
    root.style.setProperty('--text-shadow', themeConfig.effects.textShadow)
    root.style.setProperty('--box-shadow', themeConfig.effects.boxShadow)
    
    // 设置body背景
    document.body.style.backgroundColor = themeConfig.colors.background
    document.body.style.color = themeConfig.colors.text
    
    // 动态添加/移除主题类
    document.body.classList.remove('theme-hacker', 'theme-classic', 'theme-dark', 'theme-cyberpunk', 'theme-retro')
    document.body.classList.add(`theme-${currentTheme.value}`)
    
    // 处理特效
    handleEffects(themeConfig.effects)
  }
  
  // 处理特殊效果
  const handleEffects = (effects) => {
    // 移除所有效果类
    document.body.classList.remove('has-scanlines', 'has-matrix-rain', 'has-animations')
    
    // 根据配置添加效果类
    if (effects.scanlines) {
      document.body.classList.add('has-scanlines')
    }
    if (effects.matrixRain) {
      document.body.classList.add('has-matrix-rain')
    }
    if (effects.animation) {
      document.body.classList.add('has-animations')
    }
  }
  
  // 获取所有可用主题
  const availableThemes = computed(() => 
    Object.keys(themes).map(key => ({
      key,
      ...themes[key]
    }))
  )
  
  // 监听主题变化
  watch(currentTheme, (newTheme) => {
    applyTheme(themes[newTheme])
  }, { immediate: true })
  
  return {
    currentTheme: computed(() => currentTheme.value),
    theme,
    availableThemes,
    setTheme
  }
}