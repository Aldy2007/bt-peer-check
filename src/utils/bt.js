import parseTorrent from 'parse-torrent';

/**
 * 解析种子文件或磁力链接
 * @param {File|string} input - 种子文件 (File 对象) 或磁力链接 (字符串)
 * @returns {Promise<{
 *   hash: string,
 *   trackers: { http: string[], other: string[] },
 *   name: string,
 *   files: Array<{ name: string, size: number, path: string[] }>
 * }>}
 */
export async function parseTorrentFile(input) {
    try {
        // 如果是 File 对象（用户上传的文件）
        if (input instanceof File) {
            const buffer = await readFileAsBuffer(input);
            const parsed = parseTorrent(buffer);
            return formatResult(parsed);
        }
        // 如果是磁力链接
        else if (typeof input === 'string' && input.startsWith('magnet:')) {
            const parsed = parseTorrent(input);
            return formatResult(parsed);
        }
        throw new Error('输入必须是种子文件或磁力链接');
    } catch (err) {
        console.error('解析种子失败:', err);
        throw new Error('解析种子文件失败，请检查文件格式');
    }
}

// 辅助函数：将 File 对象转为 Buffer
function readFileAsBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(Buffer.from(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// 格式化 parse-torrent 的输出
function formatResult(parsed) {
    const trackers = {
        http: [],
        other: []
    };

    // 分类 tracker 协议
    (parsed.announce || []).forEach(tracker => {
        if (typeof tracker === 'string') {
            if (/^https?:\/\//i.test(tracker)) {
                trackers.http.push(tracker);
            } else {
                trackers.other.push(tracker);
            }
        }
    });

    // 处理文件信息
    const files = parsed.files?.map(file => ({
        name: file.name,
        size: file.length,
        path: file.path.split('/')
    })) || [];

    return {
        hash: parsed.infoHash,
        trackers,
        name: parsed.name,
        files
    };
}