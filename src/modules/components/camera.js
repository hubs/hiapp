var appFunc = require('../utils/appFunc'),
    networkStatus = require('./networkStatus');

var camera = {
    getPicture: function(){

        if(!appFunc.isPhonegap()){
            hiApp.alert(i18n.error.phonegap_only);
            return false;
        }

        var $this = $$(this);

        var netStatus = networkStatus.checkConnection();

        var quality, sourceType;
        if(netStatus === 'WIFI'){
            quality = 80;
        }else{
            quality = 50;
        }

        if(!$this.hasClass('camera')){
            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        }else{
            sourceType = Camera.PictureSourceType.CAMERA;
        }

        var cameraOptions = {
            quality: quality,
            allowEdit: false,
            sourceType : sourceType,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 1280,
            targetHeight: 1920
        };

        navigator.camera.getPicture(camera.cameraSuccess,camera.cameraError,cameraOptions);

    },

    cameraSuccess: function(fileUrl){
        console.log("log image count = "+$$('#uploadPicPreview>img').length);
        if($$('#uploadPicPreview>img').length>9){
            appFunc.hiAlert("最多可上传9张图片.");
            return false;
        }
        $$('#uploadPicPreview').append('<img src="'+fileUrl+'">');
        $$('#uploadPicPreview').show();

    },

    cameraError: function(message){
        setTimeout(function(){
            if(message !== 'no image selected'){
                hiApp.alert(message);
            }
        },500);
    },

    clearCache: function(){
        navigator.camera.cleanup();
    }
};

module.exports = camera;