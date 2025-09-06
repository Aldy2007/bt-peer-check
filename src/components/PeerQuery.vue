<template>
    <a-card title="多 Tracker Peer 查询工具" class="peer-query">
        <PeerQueryForm :loading="loading" @query="onQuery" />
        <a-divider />
        <ProgressTracker v-if="loading" :total="totalTrackers" :completed="completedTrackers" :successCount="successCount" />
        <PeerQueryResult :error="error" :results="results" :activeTab="activeTab" :selectedResult="selectedResult"
            :summaryColumns="summaryColumns" @showDetails="showDetails" />
    </a-card>
</template>

<script>
import axios from 'axios';
import { message } from 'ant-design-vue';
import Bencode from "bencode-js";
import PeerQueryForm from './PeerQueryForm.vue';
import PeerQueryResult from './PeerQueryResult.vue';
import ProgressTracker from './ProgressTracker.vue'; 
import {
    normalizeTrackerError,
    generatePeerId,
    encodeTorrentHashForTrackerStrict,
} from '../utils/tracker';

export default {
    name: 'PeerQuery',
    components: {
        PeerQueryForm,
        PeerQueryResult,
        ProgressTracker
    },
    data() {
        return {
            loading: false,
            error: null,
            results: [],
            activeTab: 'summary',
            selectedResult: null,
            totalTrackers: 0,
            completedTrackers: 0,
            successCount: 0,
            summaryColumns: [
                { title: 'Tracker', dataIndex: 'tracker', key: 'tracker' },
                { title: '状态', key: 'status' },
                { title: 'Peer 数量', key: 'peers' },
                { title: '操作', key: 'actions' },
            ],
        };
    },
    methods: {
        async onQuery({ infoHash, trackersText }) {
            if (infoHash.length !== 40 || trackersText.trim() === '') {
                message.warning('请输入有效的 Info Hash 和至少一个 Tracker URL');
                return;
            }
            this.loading = true;
            this.error = null;
            this.results = [];
            this.activeTab = 'summary';

            this.completedTrackers = 0;
            this.successCount = 0;

            const trackers = trackersText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
            this.totalTrackers = trackers.length; 
            try {
                const requests = trackers.map(tracker => this.queryTracker(tracker, infoHash));
                this.results = await Promise.all(requests);
                message.success(`成功查询 ${this.results.filter(r => !r.error).length}/${trackers.length} 个 Tracker`);
            } catch (err) {
                console.error('查询出错:', err);
                this.error = `查询过程中出错: ${err.message}`;
            } finally {
                this.loading = false;
            }
        },
        async queryTracker(trackerUrl, infoHash) {
            const result = {
                tracker: trackerUrl,
                complete: 0,
                error: null,
                peerCount: 0,
                rawResponse: null,
            };
            try {
                const peerId = generatePeerId();
                const params = {
                    info_hash: encodeTorrentHashForTrackerStrict(infoHash),
                    peer_id: peerId,
                    port: 6881,
                    uploaded: 268435456,
                    downloaded: 536870912,
                    left: 536870912,
                };
                const proxyUrl = `https://api.vercel.aldyh.top/proxy`;
                // const proxyUrl = `http://192.168.10.49:44444/proxy`;
                const response = await axios.get(proxyUrl, {
                    params: {
                        url: trackerUrl,
                        ...params
                    },
                    responseType: 'arraybuffer',
                    timeout: 5000
                });
                // 解析响应
                let parsedResponse = null;
                try {
                    const decoder = new TextDecoder('ascii');
                    const bencodedString = decoder.decode(response.data);
                    parsedResponse = Bencode.decode(bencodedString);
                } catch (decodeErr) {
                    console.error(`[Decode Error] ${trackerUrl}:`, decodeErr);
                    result.error = '响应解码失败';
                }
                result.rawResponse = parsedResponse;
                console.log(parsedResponse);
                if (parsedResponse && parsedResponse.complete) {
                    result.complete = parsedResponse.complete;
                }
                if (parsedResponse && parsedResponse.peers) {
                    result.peerCount = typeof parsedResponse.peers === 'string'
                        ? parsedResponse.peers.length / 6
                        : Array.isArray(parsedResponse.peers)
                            ? parsedResponse.peers.length
                            : 0;
                }
            } catch (err) {
                console.error(`[Tracker Proxy] 查询 ${trackerUrl} 失败:`, err);
                result.error = normalizeTrackerError(err);
                try {
                    result.rawResponse = err.response?.data
                        ? Bencode.decode(new Uint8Array(err.response.data))
                        : null;
                } catch (decodeErr) {
                    result.rawResponse = null;
                }
            } finally {
                this.completedTrackers++;
            }
            return result;
        },
        showDetails(result) {
            this.selectedResult = result;
            this.activeTab = 'details';
        },
    },
};
</script>

<style scoped>
.peer-query {
    max-width: 1000px;
    margin: 20px auto;
}
</style>