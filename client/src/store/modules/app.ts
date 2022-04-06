import { Module } from 'vuex';

export interface IAppStore{
    /** 主题色 */
    theme: string;
    /** socket地址 */
    socketUrl: string;
}

const state:IAppStore = {
    theme: '#fd032f',
    socketUrl: ''
}
const app: Module<any,any> = {
    namespaced: true,
    state: Object.assign({},state),
    mutations: {
        SET_THEME(state, theme){
            state.theme = theme
            document.documentElement.setAttribute('style', `--theme: ${state.theme}`)
            localStorage.setItem(`${location.origin}_theme`,state.theme)
        },
        loginIM(state){
            const IM_SERVER_URL = state.socketUrl;
            const loginInfo = {}
            // let loginInfo = { loginUserId: userId, loginToken: userId };
            IMSDK.loginImpl(loginInfo, IM_SERVER_URL, false);
            //收到消息
            IMSDK.callback_showChatMessage = function (p: any) {
                let content: any = {}
                try {
                    content = JSON.parse(p.dataContent);
                } catch (e) {
                    console.error("【非法消息】" + p);
                }

            }
            //登录成功
            IMSDK.callback_afterLoginSucess = function () {
                console.log("【IM服务登录认证成功】");
            };
            //断线重连
            IMSDK.callback_reconnectSucess = function () {
                console.log("【IM服务断线重连成功】");
            };
            //重复登录被踢
            IMSDK.callback_repeatLogin = function () {
                // console.log({message: '您的账号已在别处登录，可能会影响您的使用，请退出后重新登陆！', type: 'error', duration:5000})
            }
        }
    },
    actions: {
        async GET_THEME({commit}){
            const theme = localStorage.getItem(`${location.origin}_theme`) || state.theme
            commit('SET_THEME', theme)
        }
    }
};
export default app;