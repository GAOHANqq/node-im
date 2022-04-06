const socketio = require('socket.io')
const md5 = require('md5-node')


function getUserId(user){
    if( user.userid ){
        return user.userid
    }
    return md5(user.username+user.password)
}
function getUuid(){
    return Math.random().toString(36).slice(2)
}

function getResult(){
    return {
        data: '',
        msg: '请求成功!',
        code: 1
    }
}

function IO(server){
    // 连接次数
    this.connect_count = 0
    // 用户集合
    this.Users = new Map()
    // 消息集合
    this.Message = new Map()
    // io实例
    this.io = null
    // 实例
    this._instance = null

    this.login = function(data){
        this.io.emit('login', data);
        this.sendCount()
    }
    this.logout = function(data){
        this.io.emit('logout', data);
        this.sendCount()
    }
    this.sendCount = function(){
        let result = getResult()
        result.data = this.Users.size
        this.io.emit('change-count', result);
        this.sendUsers()
    }
    this.sendMessage = function(data){
        this.io.emit('message', data);
    }
    this.sendUsers = function(){
        let data = getResult()
        data.data = [...this.Users.values()]
        this.io.emit('change-users', data);
    }

    this._getInstance = function (server){
        if (IO._instance === null) {
            IO._instance = new IO();
        }
        this._initio(server)
        return IO._instance;
    }
    IO.prototype._initio = function (server){
        const self = this;
        self.io = socketio(server,{ cors: true });
        self.io.on('connection',function(socket){
            // 更新用户连接次数
            self.connect_count ++
            // 监听用户登录
            socket.on('login', function(user){
                // 检查在线列表，如果不在里面就加入
                user.userid = getUserId(user)
                if(!self.Users.has(user.userid)) {
                    self.Users.set(user.userid, user);
                }
                delete user.password
                let result = getResult()
                result.data = JSON.stringify(user)
                // //向所有客户端广播用户加入
                self.login(result);
            });
            // 监听用户退出
            socket.on('logout', function(user){
                //将退出的用户从在线列表中删除
                if(self.Users.has(user.userid)) {
                    self.Users.delete(user.userid)
                    let result = getResult()
                    result.data = JSON.stringify(user)
                    self.logout(result);
                }
            });
            // 监听用户发布聊天内容
            socket.on('message', function(data){
                //向所有客户端广播发布的消息
                let result = getResult()
                const {userid,username,message} = data
                const dataItem = {
                    timestamp: Date.now(),
                    message,
                    messageId: getUuid()
                }
                if( self.Message.has(userid) ){
                    self.Message.set(userid,[...self.Message.get(userid),dataItem])
                }else{
                    self.Message.set(userid, [dataItem])
                }
                result.data = JSON.stringify({...dataItem, userid, username})
                self.sendMessage(result);
            });
        });
    }
    return this._getInstance(server)
}

module.exports = (server)=>{
    new IO(server)
}














