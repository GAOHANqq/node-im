<template>
  <el-container>
    <el-header>socketio</el-header>

    <el-container>
      <!--已登录-->
      <template v-if="user.userid">
        <el-aside width="200px">
          <el-header>
              <span style="margin-right: 5px">在线用户列表</span>
              <el-button size="small" @click="logout">退出登录</el-button>
          </el-header>

          <ul>
            <li v-for="item in userList" :key="item.id">{{item.username}}</li>
          </ul>
        </el-aside>
        <el-container>
          <el-main>
            <el-row v-if="messageList.length">
              <el-col v-for="item in messageList" :key="item.messageId">
                <p v-if="item.userid===user.userid" style="text-align: right">
                  <span class="msg">{{item.message}}</span>
                  <span>  :{{item.username}}</span>
                </p>
                <p v-else style="text-align: left">
                  <span>{{item.username}}:  </span>
                  <span class="msg">{{item.message}}</span>
                </p>

              </el-col>
            </el-row>
            <el-row v-else>
              暂无聊天记录
            </el-row>
            <el-input type="textarea" rows="2" v-model="message"></el-input>
          </el-main>
          <el-footer>
            <el-button size="small" @click="sendMsg">确定</el-button>
          </el-footer>
        </el-container>
      </template>

      <!--未登录-->
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
import {defineComponent,  reactive, ref, toRefs,  onMounted} from 'vue'

export default defineComponent({

  name: 'chat',

  setup() {
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
      userList: new Map(),
      // 消息
      message: '',

      messageList: []
    })

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
      state.message = ''
    }
    const initSocket = ()=>{
      let socket = io.connect('ws://localhost:3001');
      // 监听用户登录
      socket.on('login', (res:IRes)=>{
        if( res.code === 1 && !state.user.userid){
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
          state.messageList.push(data)
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
      socket.on('change-users', (res:IRes)=>{
        state.userList = res.data
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
      submit,
      logout,
      sendMsg
    }
  }
})
</script>

<style lang="scss" scoped>
  li{
    list-style: none;
  }
  .msg{
    padding: 5px 10px;
    border-radius: 20px;
    background-color: #02CAB0;
    color: #fff;
  }
</style>
