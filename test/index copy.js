const express = require('express');
const axios = require('axios');
const app = express();

// 允许跨域
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// 代理端点
app.get('/proxy', async (req, res) => {
    const startTime = Date.now();
    const { url, ...params } = req.query;

    console.log('\n======= 请求开始 =======');
    console.log(`[${new Date().toISOString()}] Tracker URL: ${url}`);
    console.log('请求参数:', JSON.stringify(params, null, 2));

    try {
        const { url, ...params } = req.query;
        if (!url) throw new Error('Missing tracker URL');

        // 1. 手动构建查询字符串（不依赖 Axios 的自动编码）
        const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)  // 保持 %XX 不变
            .join('&');

        // 2. 拼接完整 URL（如 "http://tracker/announce?info_hash=%E7FF..."）
        const trackerUrl = `${url}?${queryString}`;

        // 3. 发送请求（禁用 Axios 的自动编码）
        const response = await axios.get(trackerUrl, {
            responseType: 'arraybuffer',
            timeout: 10000
        });

        res.set('Content-Type', 'application/octet-stream');
        res.send(response.data);

        // 将二进制响应转换为可读格式
        const responseData = {
            hex: Buffer.from(response.data).toString('hex'),
            ascii: Buffer.from(response.data).toString('ascii'),
            length: response.data.length
        };

        console.log('\n======= 响应数据 =======');
        console.log(`状态码: ${response.status}`);
        console.log(`响应头: ${JSON.stringify(response.headers)}`);
        console.log('二进制(hex):', responseData.hex);
        console.log('ASCII尝试解码:', responseData.ascii);
        console.log(`数据长度: ${responseData.length}字节`);

        console.log('\n======= 请求结束 =======');
        console.log(`耗时: ${Date.now() - startTime}ms`);

    } catch (err) {
        console.error('\n======= 请求错误 =======');
        console.error('错误类型:', err.code || 'N/A');
        console.error('错误信息:', err.message);

        if (err.response) {
            console.error('Tracker响应状态:', err.response.status);
            try {
                const errorData = Buffer.from(err.response.data).toString('hex');
                console.error('错误响应(hex):', errorData.slice(0, 100) + (errorData.length > 100 ? '...' : ''));
            } catch (e) {
                console.error('无法解析错误响应');
            }
        }

        res.status(500).json({
            error: '代理请求失败',
            details: err.message
        });
    }
});

app.listen(7575, () => {
    console.log('================================');
    console.log('Tracker代理服务器已启动');
    console.log(`时间: ${new Date().toISOString()}`);
    console.log('日志模式: 完整返回值输出');
    console.log('================================');
});