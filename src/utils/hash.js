// hash.js 工具函数重构为 ES6 模块
export function hash(str) {
  // ...原有 hash 算法...
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
