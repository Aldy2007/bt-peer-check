<template>
    <div class="progress-tracker">
        <a-progress :percent="percent" :status="status" :stroke-color="color" />
        <div class="progress-info">
            <span>{{ completed }}/{{ total }} 完成</span>
            <span v-if="statusText" class="status-text">{{ statusText }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProgressTracker',
    props: {
        total: {
            type: Number,
            required: true,
            default: 0
        },
        completed: {
            type: Number,
            required: true,
            default: 0
        },
        successCount: {
            type: Number,
            default: 0
        }
    },
    computed: {
        percent() {
            return this.total > 0 ? Math.round((this.completed / this.total) * 100) : 0;
        },
        status() {
            if (this.completed === 0) return 'active';
            if (this.successCount === this.total) return 'success';
            if (this.successCount === 0) return 'exception';
            return 'normal';
        },
        color() {
            if (this.successCount === this.total) return '#52c41a';
            if (this.successCount === 0) return '#f5222d';
            return '#1890ff';
        },
        statusText() {
            if (this.completed === this.total) {
                if (this.successCount === this.total) return '全部成功';
                if (this.successCount === 0) return '全部失败';
                return `部分成功 (${this.successCount}/${this.total})`;
            }
            return '';
        }
    }
};
</script>

<style scoped>
.progress-tracker {
    margin-bottom: 20px;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
}

.status-text {
    color: var(--ant-primary-color);
}

.progress-tracker .ant-progress-success-bg,
.progress-tracker .ant-progress-bg {
    background-color: v-bind(color) !important;
}
</style>