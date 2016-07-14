require('./info.less');

var appFunc = require('../utils/appFunc'),
    commentModule = require('../comment/comment'),
    template = require('./info.tpl.html');

var id;
var infoModule = {
    init: function(query){
        id = query.id;
        appFunc.hideToolbar();

        this.bindEvents();

        // render tweet card
        this.getData();

        // init comment module
        commentModule.init(id,"");
    },
    getData: function(){
        var item = {
            "add_username"  :   "Bob Brown",
            "content"       :   "价值性 <p>小说的价值本质是以时间为序列、以某一人物或几个人物为主线的，非常详细地、全面地反映社会生活中各种角色的价值关系(政治关系、经济关系和文化关系)的产生、发展与消亡过程。非常细致地、综合地展示各种价值关系的相互作用。</p><p> 容量性</p> <p>与其他文学样式相比，小说的容量较大，它可以细致地展现人物性格和人物命运，可以表现错综复杂的矛盾冲突，同时还可以描述人物所处的社会生活环境。小说的优势是可以提供整体的、广阔的社会生活。</p><p> 情节性</p> <p>小说主要是通过故事情节来展现人物性格、表现中心的。故事来源于生活，但它通过整理、提炼和安排，就比现实生活中发生的真实实例更加集中，更加完整，更具有代表性。</p> <p>环境性</p> <p>小说的环境描写和人物的塑造与中心思想有极其重要的关系。在环境描写中，社会环境是重点，它揭示了种种复杂的社会关系，如人物的身份、地位、成长的历史背景等等。自然环境包括人物活动的地点、时间、季节、气候以及景物等等。自然环境描写对表达人物的心情、渲染环境气氛都有不少的作用。</p> <p>发展性</p> <p>小说是随着时代的发展而发展的：魏晋南北朝，文人的笔记小说，是中国古代小说的雏形；唐代传奇的出现，尤其是三大爱情传奇，标志着古典小说的正式形成；宋元两代，随着商品经济和市井文化的发展，出现了话本小说，为小说的成熟奠定了坚实的基础；明清小说是中国古代小说发展的高峰，至今在古典小说领域内，没有可超越者，四大名著皆发于此。</p><p> 纯粹性</p> <p>纯文学中的小说体裁讲究纯粹性。“谎言去尽之谓纯。”(出自墨人钢《就是》创刊题词)便是所谓的“纯”。也就是说，小说在构思及写作的过程中能去尽政治谎言、道德谎言、商业谎言、维护阶级权贵谎言、愚民谎言等谎言，使呈现出来的小说成品具备纯粹的艺术性。小说的纯粹性是阅读者最重要的审美期待之一。随着时代的发展，不光是小说，整个文学的纯粹性逾来逾成为整个世界对文学审美的一个重要核心。</p>",
            "title"         :   "Hello 测试",
            "filename"      :   "http://img003.21cnimg.com/photos/album/20151103/m600/76948B09AE457B980D25309CB914859E.jpeg",
            "create_time"   :   "1404709434"
        };

        var output = appFunc.renderTpl(template, item);
        $$('#infoContent').html(output);
    },
    bindEvents: function(){
        //点击弹出回复
        var bindings = [{
            element: '#commentContent',
            selector: '.comment-item',
            event: 'click',
            handler: commentModule.createActionSheet
        },{
            element: '#infosView .item-comment-btn',
            event: 'click',
            handler: commentModule.commentPopup
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = infoModule;