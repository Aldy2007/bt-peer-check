const parseTorrent = require('../src/utils/bt');

// 使用文件路径
parseTorrent('DeepFaceLab.torrent').then(result => {
    console.log('Hash:', result.hash);
    console.log('Trackers:', result.trackers);
    console.log('Name:', result.name);
    console.log('Files:', result.files);
});
