var TABLE = {
    T_ACTIVITY          :   'activity',             //活动表
    T_ACTIVITY_DETAILS  :   'activity_details',     //活动详细表
    T_ARTICLE           :   'article',              //文章表
    T_CHAT              :   'chat',                 //聊天表
    T_CHAT_GROUP        :   'chat_group',           //群聊表
    T_CHAT_GROUP_DENY   :   'chat_group_deny',      //消息免打扰表
    T_CHAT_GROUP_MEMBER :   'chat_group_member',    //群会员表
    T_COMMENTS          :   'comments',             //评论表
    T_MEMBER            :   'member',               //会员表
    T_MEMBER_COLLECT    :   'member_collect',       //会员点赞集合表
    T_MEMBER_DENY       :   'member_deny',          //会员拒绝聊天设置表
    T_TALK              :   'talk',                 //说说表
    T_TALK_DENY         :   'talk_deny',            //说说拒绝表
    T_VOTE              :   'vote',                 //投票表
    T_VOTE_DETAILS      :   'vote_details',         //投票详细表
    T_VOTE_MEMBER       :   'vote_member',          //投票人员统计表
    T_DEMO              :   'demo',                  //CURD测试表
    T_CHAT_SETTING      :   'chat_setting'           //2016-9-24 add ,会员设置
};
module.exports = TABLE;

/**
 chat_panel:表结构  1:add_uid:
   2:mark_id  :群或个人ID
   3:type  类型:1:个人,2:群聊
   4:num   聊天数
   5,date  时间
   6,isTop 显否置顶.
    7,status :0 隐藏 .1.显示
 */