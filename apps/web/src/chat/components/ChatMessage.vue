<template>
<div class="msg-item" :class="msg.role">
  <span>{{ msg.content }}</span>
</div>
</template>
<script setup lang="ts">
import type { ChatMessage } from '@/stores/chat'
defineProps<{msg: ChatMessage}>()
</script>
<style scoped>
.msg-item{
  margin:8px 0;
  padding:8px 12px;
}
.user{
  text-align:right;
  background:#e6f7ff;
}
.assistant{
  text-align:left;
  background:#f5f5f5;
}
</style>
