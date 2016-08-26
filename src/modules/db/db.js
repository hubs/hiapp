var Datastore   = require('nedb');
var appFunc     = require('../utils/appFunc');

//NND web sql默认路径:/home/hubs/.config/chromium/Default/databases/http_localhost_3000
db = {};
var _baseDir  = '';
var nedbDb={
    init:function(){
        db.activity             = new Datastore({filename : _baseDir+'activity'});  //活动表
        db.activity_details     = new Datastore({filename : _baseDir+'activity_details'});//增加活动数据表
        db.article              = new Datastore({filename : _baseDir+'article'});//新闻表
        db.chat                 = new Datastore({filename : _baseDir+'chat'});//聊天表
        db.chat_group           = new Datastore({filename : _baseDir+'chat_group'});//群聊表
        db.chat_group_deny      = new Datastore({filename : _baseDir+'chat_group_deny'});//消息免打扰表
        db.chat_group_member    = new Datastore({filename : _baseDir+'chat_group_member'});//群会员表
        db.comments             = new Datastore({filename : _baseDir+'comments'});//评论表
        db.member               = new Datastore({filename : _baseDir+'member'});//会员表
        db.member_collect       = new Datastore({filename : _baseDir+'member_collect'});//会员点赞集合表
        db.member_deny          = new Datastore({filename : _baseDir+'member_deny'});//会员拒绝聊天设置表
        db.talk                 = new Datastore({filename : _baseDir+'talk'});//说说表
        db.talk_deny            = new Datastore({filename : _baseDir+'talk_deny'});//说说拒绝表
        db.vote                 = new Datastore({filename : _baseDir+'vote'});//投票表
        db.vote_details         = new Datastore({filename : _baseDir+'vote_details'});//投票详细表
        db.vote_member          = new Datastore({filename : _baseDir+'vote_member'});//投票人员统计表
        db.demo                 = new Datastore({filename : _baseDir+'demo'});//CURD测试表

        db.activity.loadDatabase();
        db.activity_details.loadDatabase();
        db.article.loadDatabase();
        db.chat.loadDatabase();
        db.chat_group.loadDatabase();
        db.chat_group_deny.loadDatabase();
        db.chat_group_member.loadDatabase();
        db.comments.loadDatabase();
        db.member.loadDatabase();
        db.member_collect.loadDatabase();
        db.member_deny.loadDatabase();
        db.talk.loadDatabase();
        db.talk_deny.loadDatabase();
        db.vote.loadDatabase();
        db.vote_details.loadDatabase();
        db.vote_member.loadDatabase();
        db.demo.loadDatabase();
    },
    _getDbTable:function(table){
        return eval("db."+table);
    },
    returnComm:function(err,docs){
        if(err){
            return appFunc.error(err);
        }
        return appFunc.success(docs);
    },

    dbInsert:function(table,data,fn){
        return this._getDbTable(table).insert(data,fn);
    },
    /**
     * where eg:
     *   {system:'a'}          => where system='a'
     *   {system:/a/}          => where system like '%a%'
     *   {system:'a','ok':'b'} =>  多条件查询
     *   {"p.c":2}             =>  用于文档类型查询(data = {p:{c:3}})
     *   {"p.c.name":2}        =>  data = ( p:{c:[{name:1},{name:2}]})
     *   {p:{c:2}}             =>  data 如上
     *   {"p.c.0.name":2}      =>  data  如上
     *   {}                    =>  获取所有的数据
     *
     *   $lt,$lte,$gt,$gte,$in,$nin,$ne,$exists,$regex:操作符,语法{field:{$op:value}}
     *   eg: https://github.com/louischatriot/nedb#inserting-documents
     *      {system:{$in:[a,b,c]}}      => where system in (xxx)
     *      {system:/ar/,$nin:[a,b]}    => where system like "%ar%" and not in (a,b)
     *
     *   $or $and :语法 {$op:[query1,query2...]}
     *   $not 语法:{$not:query}
     *   $where 语法:{$where:function(){...}}
     *   EG:
     *      {$or:[{a:'a',b:'b'}]}  => where a='a' or b='b'
     *      {$not:{ a:'a'}}        => where a not 'a' ??
     *      {$or:[{a:'a',b:'b'}],c:'c'} =>where c='c' and (a='a' or b='b')
     *
     *   sort,skip,limit,exec 排序与分页
     *   EG:
     *      find().sort({a,1}).skip(1).limit(2).exec(function(err,docs))
     *      注释:sort:排序,1:升,-1:降
     *          skip:从0开始
     *
     *   field返回字段(find的第二个参数,1:表示显示,0:表示隐藏)
     *      find({where},{a:1,b:1,_id:0}) =>  select a,b from xx where  (默认会显示ID)
     *      注意这里如果where={a:1},则field不能设置 {a:0}
     *
     */
    dbFind:function(table,where,fn,field,sort,skip,limit){
        field   =   field||{_id: 0};
        sort    =   sort||{id:-1};
        limit   =   limit||20;
        skip    =   skip||0;
        return this._getDbTable(table).find(where,field).sort(sort).skip(skip).limit(limit).exec(fn);
    },

    dbFindOne:function(table,where,fn){
        return this._getDbTable(table).findOne(where,fn);
    },

    /**
     * 获取最后一条数据
     */
    dbGetLastDoc:function(table,where,fn){
        return this.dbFind(table,where,fn,'','',0,1);
    },


    /**
     * EG
     *  db.dbCountFn(TABLE_DEMO,{key:"hello 2"},function(err,count){
     *    console.log(db._returnComm(err,count));
     *  });
     */
    dbCount:function(table,where,fn){
        return this._getDbTable(table).count(where,fn);
    },

    /**
     * db.update(query, update, options, callback)
     * query:where语句
     * update:需要更新的数据
     *  $set:更改值
     *  $unset:删除值
     *  $inc:+1
     *  $max/$min:更新字段
     *  $push,$pop,$addToSet,$pull,$each,$slice to Array
     * options:
     *  multi:如果设置为true,则同时更新多个(默认 false)
     *  upsert (false):如果设置为true,当query没有查询到数据时则写入
     *  returnUpdatedDocs:如果设置为true,则返回修改好的文档
     */
    dbUpdate:function(table,where,update,fn){
        return this._getDbTable(table).update(where,{$set:update},{multi:true},fn);
    },

    /**
     * db.remove(query, options, callback)
     */
    dbDel:function(table,where,fn){
        return this._getDbTable(table).remove(where,{multi:true},fn);
    }

};
module.exports = nedbDb;


