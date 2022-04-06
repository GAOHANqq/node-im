<template>
  <div class="main-view">useClipboard</div>


  <input v-model="input" type="text">
  <button @click='copy(input)'>
    <span v-if='!copied'>复制</span>
    <span v-else>已复制!</span>
  </button>
  复制文本: {{text}}


  <button @click="toggleDark">主题变换</button>

  <hr>

  webSocket
  状态:{{webSocket.status}}
  数据:{{webSocket.data}}
  <button @click="webSocket.open()">连接</button>
  <button @click="webSocket.close()">关闭</button>
  <button >发送</button>
  <hr>

  base64: {{base64}}

</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import {useClipboard, useDark, useToggle, useWebSocket, useBase64,useUrlSearchParams } from "@vueuse/core";

export default defineComponent({
  setup() {
    const { text, copy, copied, isSupported } = useClipboard()
    // 主题变换
    const isDark = useDark({
      selector: 'html',
      attribute: 'color-scheme',
      valueDark: 'dark',
      valueLight: 'light'
    })
    // 文本复制
    const toggleDark = useToggle(isDark)
    // websocket连接

    const { status, data, send, open, close, ws } = useWebSocket('ws://127.0.0.1:3000',{
      // 自动重连
      autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
          console.info('【socket】: Failed to connect WebSocket after 3 retires')
        },
      },
      // 心跳反应
      heartbeat: {
        message: JSON.stringify({id: 'ping', message: ''}),
        interval: 1000,
      },
      onConnected: (ws:WebSocket)=>{
        console.info('[ws]: 服务端已连接!');
      },
      onDisconnected: (ws:WebSocket, event: CloseEvent)=>{
        console.info('[ws]: 服务端已断开!');
      },
      onMessage: (ws:WebSocket,event: MessageEvent)=>{
        console.info('[ws]: 客户端收到消息');
      },
      onError: (ws:WebSocket,event: Event)=>{
        console.info('[ws]: 服务端连接错误!');
      }
    })
    const webSocket = computed(()=>{ return {
      status, data, send, open, close
    }})
    // base64
    const {base64} = useBase64('1')

    return {
      text,
      copy,
      copied,
      isSupported,
      toggleDark,
      webSocket,
      base64
    }
  }
})
</script>

<style lang="scss">
  [color-scheme="dark"] {
    background-color: rgba(0,0,0,.5);
  }
</style>
