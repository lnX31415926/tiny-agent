<template>
  <div class="msg" :class="msg.role">
    <div class="msg-content">{{ msg.content }}</div>
  </div>
</template>
<script setup lang="ts">
import type { ChatItem } from '@/chat/types'
defineProps<{ msg: ChatItem }>()
</script>
<style scoped>
.msg {
  margin: 8px 0;
  padding: 10px 14px;
  max-width: 70%;
}
.user {
  margin-left: auto;
  background: #409eff;
  color: white;
  border-radius: 12px 12px 2px 12px;
}
.assistant {
  margin-right: auto;
  background: #f0f0f0;
  border-radius: 12px 12px 12px 2px;
}
</style>
