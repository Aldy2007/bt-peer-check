/**
 * 从Magnet链接中提取信息
 * @param {string} magnetLink - Magnet链接
 * @returns {Object} 包含种子名、哈希值和分类tracker服务器的对象
 */
function parseMagnetLink(magnetLink) {
    // 验证输入是否为有效的Magnet链接
    if (!magnetLink || !magnetLink.startsWith('magnet:?')) {
        throw new Error('Invalid magnet link format');
    }

    const result = {
        name: null,
        hash: null,
        httpTrackers: [],
        udpTrackers: [],
        otherTrackers: []
    };

    // 移除magnet:?前缀
    const paramsString = magnetLink.substring(8);

    // 分割参数
    const params = paramsString.split('&');

    params.forEach(param => {
        // 提取种子名称
        if (param.startsWith('dn=')) {
            result.name = decodeURIComponent(param.substring(3));
        }
        // 提取哈希值
        else if (param.startsWith('xt=urn:btih:')) {
            const hashPart = param.substring(12);

            if (hashPart.length === 40) {
                result.hash = hashPart.toLowerCase(); // SHA1 hex
            }
            else if (hashPart.length === 32) {
                result.hash = hashPart.toUpperCase(); // Base32
            }
        }
        // 提取并分类tracker服务器
        else if (param.startsWith('tr=')) {
            const trackerUrl = decodeURIComponent(param.substring(3));
            if (!trackerUrl) return;

            try {
                const url = new URL(trackerUrl);

                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    result.httpTrackers.push(trackerUrl);
                }
                else if (url.protocol === 'udp:') {
                    result.udpTrackers.push(trackerUrl);
                }
                else {
                    result.otherTrackers.push(trackerUrl);
                }
            } catch (e) {
                // 如果URL解析失败，放入otherTrackers
                result.otherTrackers.push(trackerUrl);
            }
        }
    });

    if (!result.hash) {
        throw new Error('No valid hash found in magnet link');
    }

    return result;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = parseMagnetLink;
}