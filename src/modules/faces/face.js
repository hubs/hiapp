require('./face.less');

var appFunc         = require('../utils/appFunc'),
    service         = require('../message/service'),
    faceTemplate    = require("./face.tpl.html")
    ;

var pack = {
    _renderFaces:function(){
        service.getFaces(function(res){
            var _width  =   $$(".theme-cyan").width();
            var _chunk  =   0;
            if(_width>600){
                _chunk  =   42;
            }else{
                _chunk  =   18;
            }
            var i,j,temparray=[];
            for (i=0,j=res.length; i<j; i+=_chunk) {
                temparray.push(res.slice(i,i+_chunk));
            }

            var renderData = {
                faces: temparray
            };
            var output = appFunc.renderTpl(faceTemplate, renderData);
            $$('.swiper-container').html(output);

            //笑脸切换
            hiApp.swiper('.swiper', {
                pagination:'.swiper .swiper-pagination',
                spaceBetween: 5
            });

            pack.bindEvents();
        });
    },

    renderFace:function(){
        if($$(".swiper-container").hasClass("swiper-container-horizontal")){
            var _bar_actions  =     $$(".bar-actions");
            if(_bar_actions.hasClass("hide")){
                _bar_actions.removeClass("hide").addClass("show");
            }else{
                _bar_actions.removeClass("show").addClass("hide");
            }
        }else{
            pack._renderFaces();
        }
    },

    //增加笑脸图片
    addImgFace: function(){
        console.log("add Img Face = "+$$(this).data("name"));
        appFunc.insertText(document.getElementById('contentText'),$$(this).data("name"));
    },


    bindEvents: function(){
        var bindings = [{
            element: '.bar-aface img',
            event:'click',
            handler:this.addImgFace
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;