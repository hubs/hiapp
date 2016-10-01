var CONTENT = {
    SERVER_URL      :   'ws://localhost:9998',//连接的服务器地址

    IMAGE_URL       :   "http://7xvucw.com1.z0.glb.clouddn.com/",

    //methods
    METHOD_POST     :   'post',
    METHOD_GET      :   'get',

    //Socket EVENT
    //base
    EVENT_BASE_REGISTER          :   "base_register",        //注册
    EVENT_BASE_LOGIN             :   "base_login",           //登录
    EVENT_BASE_LOGOUT            :   "base_logout",         //退出
    EVENT_BASE_OFFLINE_MSG       :   "base_getOfflineMsg",  //获取离线消息
    EVENT_BASE_CLIENT_RECEIVE    :   "base_receive",         //客户端接收消息
    EVENT_BASE_GET_PASS          :   "base_password",        //找回密码
    EVENT_BASE_EDIT_PASSWORD     :   "base_edit_password",   //修改密码

    //资讯
    EVENT_INFO_GET_INFO          :   "info_get_comment",      //点击资讯详情获取资讯评论与点赞数
    EVENT_INFO_GET_VOTE          :   "info_get_vote",         //获取最新的投票数
    EVENT_INFO_GET_ACTIVITY      :   "info_get_activity",     //获取最新的参数报名人数
    EVENT_INFO_COMMENT           :   "info_comment",         //评论
    EVENT_INFO_COLLECT           :   "info_collect",         //赞和收藏
    EVENT_INFO_VOTE              :   "info_vote",            //投票
    EVENT_INFO_ACTIVITY          :   "info_activity",        //参加活动

    EVENT_NEWS_INFO              :   "news_info",            //新的资讯

    //聊天
    EVENT_CHAT                   :   "chat",                 //会话事件
    EVENT_CHAT_CREATE_GROUP      :   "chat_createGroup",     //创建群事件
    EVENT_CHAT_USER              :   "chat_user",            ////A->B,这里是推荐给B,B收到后返回一个ack
    EVENT_CHAT_GROUP             :   "chat_group",           //A->G(群),推荐给所有在线的群友
    EVENT_CHAT_GROUP_INVITE      :   "chat_group_invite",    //群邀请
    EVENT_CHAT_GROUP_RENAME      :   "chat_group_rename",    //群名更改
    EVENT_CHAT_GROUP_INGORE      :   "chat_group_ignore",    //群免打扰
    EVENT_CHAT_GET_MEMBER        :   "chat_get_member_info", //点击会员进入详情，此时加载会员最新信息



    //说说
    EVENT_TALK                   :   "talk",     //发表说说

    //系统与更新用户信息
    EVENT_SYS_EDIT_MEMBER        :   "sys_editMember",   //会员修改信息
    EVENT_SYS_FEEDBACK           :   "sys_feedback",     //反馈
    EVENT_SYS_EDIT_IMG           :   "sys_editImg",       //会员修改头像或背景图


    //状态常量
    SEND_ERROR      :  0 ,//错误
    SEND_SUCCESS    :  1 ,//成功
    SEND_INFO       :  2 ,//消息
    SEND_DENY       :  3 ,//被限定
    SEND_REPLY      :  4 ,//需要重新登录
    SEND_NONE       :  5 ,//直接忽略的信息


    //客户端接收服务端的信息
    EVENT_TYPE_GROUP            :   1,//创建群消息
    EVENT_TYPE_TALK             :   2,//创建了新的说说
    EVENT_TYPE_NEW_COMMENT      :   3,//有新的评论，通知发布者
    EVENT_TYPE_NEW_COOL         :   4,//有新的赞
    EVENT_TYPE_GROUP_INVATE     :   5,//群邀请
    EVENT_TYPE_GROUP_ADD_INFO   :   6,//群邀请发送 xx邀请xx
    EVENT_TYPE_NEW_INFO         :   7,//新的资讯
    EVENT_TYPE_MEMBER           :   8,//新的会员


    //收藏点赞
    COLLECT_INFO                :   1,//资讯收藏
    COLLECT_INFO_COOL           :   2,//资讯点赞
    COLLECT_TALK                :   3,//说说收藏
    COLLECT_TALK_COOL           :   4,//说说点赞


    //评论类型 1:资讯评论，2:说说评论
    COMMENT_TYPE_INFO           :  1,//资讯评论
    COMMENT_TYPE_TALK           :  2,//说说评论

    CHAT_TYPE_PERSON            :  1,//个人
    CHAT_TYPE_GROUP             :  2,//群


    //徽章
    BADGE_TALK       : 'badge_talk',
    BADGE_INFO       : 'badge_info',
    BADGE_CHAT       : 'badge_chat',
    BADGE_MEMBER     : 'badge_member'


};

module.exports = CONTENT;