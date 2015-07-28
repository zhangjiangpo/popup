/**
 * Created by Administrator on 2015/7/28.
 */
;(function ($,wind) {
  var backTccPrivate={
    eventBind: function (backTcc) {
      backTcc.on('touchstart touchmove touchend',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
      });
    }
  }
  var backTccYYDefault={//YY是阴影偶别想多了。。哈哈
    container:''
  }
  var backTccYY = function (opt) {
    this.setting= $.extend(backTccYYDefault,opt);
    if($(this.setting.container).find('.back-tcc').length){
      this.back=$(this.setting.container).find('.back-tcc');
    }else{
      this.back=$('<div class="back-tcc"></div>').appendTo($(this.setting.container));
    }
    backTccPrivate.eventBind(this.back);
  }
  backTccYY.prototype={
    show: function (con) {
      this.back.css({top:document.body.scrollTop+'px'}).show();
    },
    hide: function (con) {
      this.back.hide().css({top:'0px'});
    }
  }
  wind['backTcc']=function(opt){//遮罩层
    return new backTccYY(opt);
  }
  var tccPrivate={
    init: function (thisObj) {
      var uuid=Math.floor(Math.random()*1000)+'-'+new Date().getMilliseconds();
      var tccHtml='<div class="tcc-container '+uuid+'">'+
        '<div class="tcc-con-con">'+
        '<p class="close-icon-con"><i class="tcc-close-icon"></i></p>'+
        '<div class="tcc-title-con">'+(thisObj.setting.titleIcon?'<i></i>':'')+
        '</div><div class="tcc-content-con"><div class="tcc-content"></div></div>'+
        '</div></div>';
      $(thisObj.setting.container).append($(tccHtml));
      var _this=this;
      var inter=setInterval(function () {
        if($('.'+uuid).length){//动态插入dom 所以要不断去取知道取到为止
          clearInterval(inter);
          _this.contentInit(uuid,thisObj);
          _this.eventBind(uuid,thisObj);
          if(thisObj.setting.compeleteShow)thisObj.show(uuid);
        }
      },100);
      return uuid;
    },
    contentInit: function (uuid,thisObj) {
      var $con=$('.'+uuid);
      thisObj.setting.width?$con.width(thisObj.setting.width):'';
      thisObj.setting.height?$con.height(thisObj.setting.height):'';
      thisObj.setting.left?$con.css({left:thisObj.setting.left}):'';
      thisObj.setting.top?$con.css({top:thisObj.setting.top}):'';
      var $title=$con.find('.tcc-title-con');
      $title.html($title.html()+thisObj.setting.title);
      $title.children('i').css({
        background:"url('"+thisObj.setting.titleIcon+"') no-repeat",
        'background-size':'cover'
      });
      thisObj.setting.titleSpacing?$title.css({'letter-spacing':thisObj.setting.titleSpacing}):'';
      $con.find('.tcc-content').html(thisObj.setting.content);
      thisObj.setting.contentPadding?$con.find('.tcc-content').css({padding:thisObj.setting.contentPadding}):'';
    },
    eventBind: function (uuid,thisObj) {
      var $con=$('.'+uuid);
      var _this=thisObj;
      if(_this.setting.clickClose){
        $con.on('touchend', function () {
          _this.hide(_this.uuid);
          _this.backTcc.hide(_this.setting.container);
          _this.setting.closeFn(uuid);
        })
      }
      $con.find('.close-icon-con').on('touchend', function () {
        _this.hide(_this.uuid);
        _this.backTcc.hide(_this.setting.container);
        _this.setting.closeFn(uuid);
      })
      $con.on('touchstart touchmove touchend', function (e) {
        e.stopPropagation();
      });
      $(window).on('resize', function () {
        $con.find('.tcc-content-con').height($con.height()-$con.find('.tcc-title-con').height()-parseInt($con.find('.tcc-con-con').css('padding-top'))-parseInt($con.find('.tcc-con-con').css('padding-bottom'))-30);
      })
    }
  }
  function tcc(option){
    var defaultOpt={
      container:document.body,//弹出层所属容器 多页面（单页面应用）可能存在translate位移
      content:'',//弹出层内容
      width:'',
      height:'',
      left:'',
      top:'',
      contentPadding:'',//内容padding
      overflow:true,
      title:'',//标题
      titleSpacing:'',//标题字符间距
      titleIcon:'',//标题图标
      clickClose:true,//是否点击关闭
      compeleteShow: false,//是否初始化完成后就显示
      closeFn:function(){}//close事件回调
    }
    this.setting= $.extend(defaultOpt,option);
    this.backTcc=backTcc({"container":this.setting.container});
    this.uuid=tccPrivate.init(this);
  }
  tcc.prototype={
    show: function (uuid) {
      this.backTcc.show(this.setting.container);
      $(document.body).css({'overflow':'hidden'});
      var $con=$('.'+uuid);
      $con.show();
      $con.css({top:(parseInt($con.css('top'))+document.body.scrollTop)+'px'});
      $con.find('.tcc-content-con').height($con.height()-$con.find('.tcc-title-con').height()-parseInt($con.find('.tcc-con-con').css('padding-top'))-parseInt($con.find('.tcc-con-con').css('padding-bottom'))-30);
    },
    hide: function (uuid) {
      $('.'+uuid).hide().css({top:(parseInt($('.'+uuid).css('top'))-document.body.scrollTop)+'px'});
      $(document.body).css({'overflow':'auto'});
      this.backTcc.hide(this.setting.container);
    }
  }
  wind['tccPop']= function (opt) {
    return new tcc(opt);
  }
})(Zepto,window)
