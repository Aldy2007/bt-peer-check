export function normalizeTrackerError(err) {
  if (err.response) {
    return `Tracker响应异常 (HTTP ${err.response.status})`;
  }
  return err.message || '未知代理网络错误';
}

export function generatePeerId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function encodeTorrentHashForTrackerStrict(hash) {
  if (typeof hash !== 'string' || hash.length !== 40) {
    throw new Error('Invalid hash: must be a 40-character hexadecimal string');
  }
  if (!/^[0-9a-fA-F]{40}$/.test(hash)) {
    throw new Error('Invalid hash: contains non-hexadecimal characters');
  }
  const hexToBytes = (hex) => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
  };
  const bytes = hexToBytes(hash.toLowerCase());
  let encoded = '';
  for (const byte of bytes) {
    encoded += '%' + byte.toString(16).padStart(2, '0').toUpperCase();
  }
  return encoded;
}

export function parseBencodedResponse(data) {
  const decoder = new TextDecoder();
  const str = decoder.decode(data);
  // 这里建议在主组件中引入 bencode-js 并传入解析
  return str;
}
