/**
 * 将种子哈希值转换为Tracker服务器可用的格式（严格模式）
 * @param {string} hash - 种子的哈希值（40字符的十六进制字符串）
 * @returns {string} - 编码后的Tracker服务器可用的哈希字符串
 * @throws {Error} - 如果输入哈希无效则抛出错误
 */
function encodeTorrentHashForTrackerStrict(hash) {
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

// 使用示例
try {
    const infoHash = 'e7ffdcb4ada863de9504f2a741f924dcd56ab84a'; // 注意这是原始十六进制，不带%号
    const encodedHash = encodeTorrentHashForTrackerStrict(infoHash);
    console.log('Strict encoded hash:', encodedHash);

    // 构建完整的Tracker URL示例
    const trackerUrl = `http://tracker.example.com/announce?info_hash=${encodedHash}`;
    console.log('Tracker URL:', trackerUrl);
} catch (error) {
    console.error('Error:', error.message);
}