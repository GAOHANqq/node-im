<template>
  <el-container>
    <el-header>socketio</el-header>

    <el-container>
      <template v-if="user.userid">
        <el-aside width="200px">用户列表</el-aside>
        <el-container>
          <el-main>{{ user }}</el-main>
          <el-footer>输入区域</el-footer>
        </el-container>
      </template>

      <el-form
          v-else
          :model="form"
          status-icon
          :rules="rules"
          ref="formRef"
          label-width="100px"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model.number="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
              type="password"
              v-model="form.password"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>

    </el-container>
  </el-container>

</template>

<script lang="ts">
import {defineComponent, computed, reactive, ref, toRefs, inject, onMounted} from 'vue'
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {useWebSocket} from "@vueuse/core";
import {ElMessage} from "element-plus";


export default defineComponent({

  name: 'chat',

  setup(props, ctx) {
    interface IUser{
      username: string;
      userid: string;
    }
    interface IRes{
      code: number
      data: string
      msg: string
    }

    const formRef = ref<any>(null)
    const router = useRouter()
    const state = reactive({
      // socket实例
      socket: null,
      // 当前用户
      user:{} as IUser,
      // 表单信息
      form:{username: '', password: ''},
      // 表单规则
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      // 已连接用户数
      onlineCount: 0,
      // 用户集合
      userList: new Map()
    })
    const login = ()=>{
      if( state.form.username === '' ){
          ElMessage.warning('请输入用户名!')
      }
      if( state.form.password === '' ){
        ElMessage.warning('请输入密码!')
      }
      state.socket.emit('login', state.form);
    }
    const logout = ()=>{
      state.socket.emit('logout', state.user);
    }
    const sendMsg = ()=>{
      if( state.message  === ''  ){
         return
      }
      state.socket.emit('message', {
        ...state.user,
        message: state.message
      });
    }
    const initSocket = ()=>{
      let socket = io.connect('ws://localhost:3001');
      // 监听用户登录
      socket.on('login', (res:IRes)=>{
        if( res.code === 1 ){
          state.user = JSON.parse(res.data)
        }
      });
      // 监听用户退出
      socket.on('logout', (res:IRes)=>{
        if( res.code === 1 ){
          let data = JSON.parse(res.data)
          if( data.userid === state.user.userid ){
            state.user = {}
          }
        }
      });
      // 监听用户消息
      socket.on('message', (res:IRes)=>{
        if( res.code === 1 ){
          let data = JSON.parse(res.data)
          debugger
        }
      });
      // 监听连接
      socket.on('info', (res:IRes)=>{
        console.warn('[socket]: ',res.msg)
      });
      // 用户数更新
      socket.on('change-count', (res:IRes)=>{
        state.onlineCount = res.data
      });
      state.socket = socket
    }
    const submit = () => {
      formRef.value.validate((valid:boolean) => {
        if (valid) {
          state.socket.emit('login', state.form)
        } else {
          return false
        }
      })
    }

    onMounted(()=>{
      initSocket()
    })
    return {
      formRef,
      ...toRefs(state),
      submit
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
