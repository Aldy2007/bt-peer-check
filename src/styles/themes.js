// 主题配置
export const themes = {
  hacker: {
    name: '黑客风格',
    description: '绿色荧光，科幻炫酷',
    colors: {
      primary: '#00ff66',
      secondary: '#00aa33',
      background: '#000000',
      surface: 'rgba(0, 25, 0, 0.95)',
      text: '#00ff66',
      border: '#00aa33',
      glow: 'rgba(0, 255, 65, 0.4)'
    },
    effects: {
      textShadow: '0 0 2px #00ff66, 0 0 4px #00ff66',
      boxShadow: '0 0 15px rgba(0, 255, 65, 0.2)',
      animation: true,
      scanlines: true,
      matrixRain: true
    }
  },
  
  classic: {
    name: '经典风格',
    description: '简洁优雅，专业商务',
    colors: {
      primary: '#1890ff',
      secondary: '#096dd9',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#333333',
      border: '#d9d9d9',
      glow: 'rgba(24, 144, 255, 0.2)'
    },
    effects: {
      textShadow: 'none',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      animation: false,
      scanlines: false,
      matrixRain: false
    }
  },
  
  dark: {
    name: '暗黑模式',
    description: '护眼深色，现代简约',
    colors: {
      primary: '#1890ff',
      secondary: '#096dd9',
      background: '#141414',
      surface: '#1f1f1f',
      text: '#ffffff',
      border: '#303030',
      glow: 'rgba(24, 144, 255, 0.3)'
    },
    effects: {
      textShadow: 'none',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      animation: false,
      scanlines: false,
      matrixRain: false
    }
  },
  
  cyberpunk: {
    name: '赛博朋克',
    description: '紫粉霓虹，未来科技',
    colors: {
      primary: '#ff0080',
      secondary: '#8000ff',
      background: '#0a0a0a',
      surface: 'rgba(40, 0, 40, 0.9)',
      text: '#ff00ff',
      border: '#8000ff',
      glow: 'rgba(255, 0, 255, 0.5)'
    },
    effects: {
      textShadow: '0 0 3px #ff00ff, 0 0 6px #ff00ff',
      boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)',
      animation: true,
      scanlines: true,
      matrixRain: false
    }
  },
  
  retro: {
    name: '复古终端',
    description: '琥珀色调，怀旧经典',
    colors: {
      primary: '#ffb000',
      secondary: '#cc8800',
      background: '#1a1a0a',
      surface: 'rgba(40, 40, 0, 0.9)',
      text: '#ffb000',
      border: '#cc8800',
      glow: 'rgba(255, 176, 0, 0.4)'
    },
    effects: {
      textShadow: '0 0 2px #ffb000, 0 0 4px #ffb000',
      boxShadow: '0 0 15px rgba(255, 176, 0, 0.2)',
      animation: true,
      scanlines: true,
      matrixRain: false
    }
  }
};

export const defaultTheme = 'hacker';