<template>
  <div class="input-wrap">
    <textarea
      v-model="inputText"
      @keydown.enter.prevent="handleSend"
      placeholder="输入消息，回车发送"
    ></textarea>
    <button @click="handleSend">发送</button>
  </div>
</template>
<script setup lang="ts">
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['send'])
const inputText = ref('')

const handleSend = () => {
  const text = inputText.value.trim()
  if (!text) return
  emit('send', text)
  inputText.value = ''
}
</script>
<style scoped>
.input-wrap {
  display: flex;
  gap: 8px;
  padding:12px;
}
textarea {
  flex: 1;
  padding:8px;
}
button {
  padding:0 16px;
}
</style>
