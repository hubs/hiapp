var xhr         = require('../utils/xhr');
var table       = require("../db/table"),
    db          = require("../db/db"),
    appFunc     = require("../utils/appFunc")
;
module.exports = {
    getAnswers: function(callback) {
        xhr.simpleCall({
            func: 'answers'
        }, function (res) {
            callback(res.data);
        });
    },
    //获取聊天数据
    /**
     *  params = {
     *   type: 1:个人,2:群
     *   from_uid: 发起人
     *   to_mark_id:接收人
     * }
     */
    getMessages: function(params,callback){
        var _where  =   { $or: [{ from_uid: params.from_uid,to_mark_id:params.to_mark_id }, { from_uid: params.to_mark_id,to_mark_id:params.from_uid }] , status:1,type:params.type};
        console.log(_where);
        db.dbFind(table.T_CHAT,_where,function(err,doc){
            return callback(db.returnComm(err,doc));
        },'','',{id:1});
    },
    getFaces:function(callback){
        var _faces  =   [];

        _faces.push({img:"/img/face/微笑.gif",name:"[:微笑]"});
        _faces.push({img:"/img/face/撇嘴.gif",name:"[:撇嘴]"});
        _faces.push({img:"/img/face/色.gif",name:"[:色]"});
        _faces.push({img:"/img/face/发呆.gif",name:"[:发呆]"});
        _faces.push({img:"/img/face/得意.gif",name:"[:得意]"});
        _faces.push({img:"/img/face/流泪.gif",name:"[:流泪]"});
        _faces.push({img:"/img/face/害羞.gif",name:"[:害羞]"});
        _faces.push({img:"/img/face/闭嘴.gif",name:"[:闭嘴]"});
        _faces.push({img:"/img/face/睡.gif",name:"[:睡]"});
        _faces.push({img:"/img/face/大哭.gif",name:"[:大哭]"});

        _faces.push({img:"/img/face/尴尬.gif",name:"[:尴尬]"});
        _faces.push({img:"/img/face/发怒.gif",name:"[:发怒]"});
        _faces.push({img:"/img/face/调皮.gif",name:"[:调皮]"});
        _faces.push({img:"/img/face/呲牙.gif",name:"[:呲牙]"});
        _faces.push({img:"/img/face/惊讶.gif",name:"[:惊讶]"});
        _faces.push({img:"/img/face/难过.gif",name:"[:难过]"});
        _faces.push({img:"/img/face/酷.gif",name:"[:酷]"});
        _faces.push({img:"/img/face/冷汗.gif",name:"[:冷汗]"});
        _faces.push({img:"/img/face/抓狂.gif",name:"[:抓狂]"});
        _faces.push({img:"/img/face/吐.gif",name:"[:吐]"});

        _faces.push({img:"/img/face/偷笑.gif",name:"[:偷笑]"});
        _faces.push({img:"/img/face/可爱.gif",name:"[:可爱]"});
        _faces.push({img:"/img/face/白眼.gif",name:"[:白眼]"});
        _faces.push({img:"/img/face/傲慢.gif",name:"[:傲慢]"});
        _faces.push({img:"/img/face/饥饿.gif",name:"[:饥饿]"});
        _faces.push({img:"/img/face/困.gif",name:"[:困]"});
        _faces.push({img:"/img/face/惊恐.gif",name:"[:惊恐]"});
        _faces.push({img:"/img/face/流汗.gif",name:"[:流汗]"});
        _faces.push({img:"/img/face/憨笑.gif",name:"[:憨笑]"});
        _faces.push({img:"/img/face/大兵.gif",name:"[:大兵]"});

        _faces.push({img:"/img/face/奋斗.gif",name:"[:奋斗]"});
        _faces.push({img:"/img/face/咒骂.gif",name:"[:咒骂]"});
        _faces.push({img:"/img/face/疑问.gif",name:"[:疑问]"});
        _faces.push({img:"/img/face/嘘.gif",name:"[:嘘]"});
        _faces.push({img:"/img/face/晕.gif",name:"[:晕]"});
        _faces.push({img:"/img/face/折磨.gif",name:"[:折磨]"});
        _faces.push({img:"/img/face/衰.gif",name:"[:衰]"});
        _faces.push({img:"/img/face/骷髅.gif",name:"[:骷髅]"});
        _faces.push({img:"/img/face/敲打.gif",name:"[:敲打]"});
        _faces.push({img:"/img/face/再见.gif",name:"[:再见]"});

        _faces.push({img:"/img/face/擦汗.gif",name:"[:擦汗]"});
        _faces.push({img:"/img/face/抠鼻.gif",name:"[:抠鼻]"});
        _faces.push({img:"/img/face/鼓掌.gif",name:"[:鼓掌]"});
        _faces.push({img:"/img/face/糗大了.gif",name:"[:糗大了]"});
        _faces.push({img:"/img/face/坏笑.gif",name:"[:坏笑]"});
        _faces.push({img:"/img/face/左哼哼.gif",name:"[:左哼哼]"});
        _faces.push({img:"/img/face/右哼哼.gif",name:"[:右哼哼]"});
        _faces.push({img:"/img/face/哈欠.gif",name:"[:哈欠]"});
        _faces.push({img:"/img/face/鄙视.gif",name:"[:鄙视]"});
        _faces.push({img:"/img/face/委屈.gif",name:"[:委屈]"});

        _faces.push({img:"/img/face/快哭了.gif",name:"[:快哭了]"});
        _faces.push({img:"/img/face/阴险.gif",name:"[:阴险]"});
        _faces.push({img:"/img/face/亲亲.gif",name:"[:亲亲]"});
        _faces.push({img:"/img/face/吓.gif",name:"[:吓]"});
        _faces.push({img:"/img/face/可怜.gif",name:"[:可怜]"});
        _faces.push({img:"/img/face/菜刀.gif",name:"[:菜刀]"});
        _faces.push({img:"/img/face/西瓜.gif",name:"[:西瓜]"});
        _faces.push({img:"/img/face/啤酒.gif",name:"[:啤酒]"});
        _faces.push({img:"/img/face/篮球.gif",name:"[:篮球]"});
        _faces.push({img:"/img/face/乒乓.gif",name:"[:乒乓]"});

        _faces.push({img:"/img/face/咖啡.gif",name:"[:咖啡]"});
        _faces.push({img:"/img/face/饭.gif",name:"[:饭]"});
        _faces.push({img:"/img/face/猪头.gif",name:"[:猪头]"});
        _faces.push({img:"/img/face/玫瑰.gif",name:"[:玫瑰]"});
        _faces.push({img:"/img/face/凋谢.gif",name:"[:凋谢]"});
        _faces.push({img:"/img/face/示爱.gif",name:"[:示爱]"});
        _faces.push({img:"/img/face/爱心.gif",name:"[:爱心]"});
        _faces.push({img:"/img/face/心碎.gif",name:"[:心碎]"});
        _faces.push({img:"/img/face/蛋糕.gif",name:"[:蛋糕]"});
        _faces.push({img:"/img/face/闪电.gif",name:"[:闪电]"});

        _faces.push({img:"/img/face/炸弹.gif",name:"[:炸弹]"});
        _faces.push({img:"/img/face/刀.gif",name:"[:刀]"});
        _faces.push({img:"/img/face/足球.gif",name:"[:足球]"});
        _faces.push({img:"/img/face/瓢虫.gif",name:"[:瓢虫]"});
        _faces.push({img:"/img/face/便便.gif",name:"[:便便]"});
        _faces.push({img:"/img/face/月亮.gif",name:"[:月亮]"});
        _faces.push({img:"/img/face/太阳.gif",name:"[:太阳]"});
        _faces.push({img:"/img/face/礼物.gif",name:"[:礼物]"});
        _faces.push({img:"/img/face/拥抱.gif",name:"[:拥抱]"});
        _faces.push({img:"/img/face/强.gif",name:"[:强]"});
        _faces.push({img:"/img/face/弱.gif",name:"[:弱]"});

        _faces.push({img:"/img/face/握手.gif",name:"[:握手]"});
        _faces.push({img:"/img/face/胜利.gif",name:"[:胜利]"});
        _faces.push({img:"/img/face/抱拳.gif",name:"[:抱拳]"});
        _faces.push({img:"/img/face/勾引.gif",name:"[:勾引]"});
        _faces.push({img:"/img/face/拳头.gif",name:"[:拳头]"});
        _faces.push({img:"/img/face/差劲.gif",name:"[:差劲]"});
        _faces.push({img:"/img/face/爱你.gif",name:"[:爱你]"});
        _faces.push({img:"/img/face/NO.gif",name:"[:NO]"});
        _faces.push({img:"/img/face/OK.gif",name:"[:OK]"});
        callback(_faces)
    }
};