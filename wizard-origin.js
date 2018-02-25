

(function(factory,global,$){
    if(!$ || $ !== global.jQuery)return;

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory($,global) : 
    typeof define === 'function' && define.amd ? define(['jquery'],factory) : 
    (global.WizardOrigin = factory($,global));
}(function($,global){

var defaults = {
    onNext:null,        //监听下一步按钮的函数
    onProgress:null,    //监听执行步骤的函数
    onPrev:null,        //监听上一步按钮的函数
    onFinish:null,      //监听执行完成的函数
    headActiveClass:'wizard-head-active',   //已执行步骤的激活类
    onError:null,       //监听执行过程报错的函数
    el:null,                
    isHeadClick:false   //步骤标题是否可点击
}

function WizardOrigin(option){
    if(this instanceof WizardOrigin !== true){
        return new WizardOrigin(option);
    }
    this.option = $.extend({},defaults,option);
    this.$el = this.option.el || $('[wizard-origin]');
    this.$heads = this.$el.find('[wizard-origin-head]');
    this.$panels = this.$el.find('[wizard-origin-panel]');
    this.$next = this.$el.find('[wizard-origin-next]');
    this.$prev = this.$el.find('[wizard-origin-prev]');
    this.curIndex = 0;
    this.len = this.$heads.length;
    this.init();
}

WizardOrigin.prototype = {
    //初始化函数
    init:function(){
        this.$heads.width((100/this.len)+'%');
        this.wizardChange(0,0);
        this.initButton();
        this.option.isHeadClick && this.headClick();
    },
    //标题和步骤内容变化的函数
    wizardChange:function(index,toIndex){
        toIndex = toIndex == null && index<this.len ? index+1 : toIndex;
        var that = this;
        var headActiveClass = this.option.headActiveClass;
        this.$heads.each(function(i,elem){
            var self = $(elem);
            if(i>toIndex){
                !!headActiveClass && self.hasClass(headActiveClass) && self.removeClass(headActiveClass);
            }else{
                !!headActiveClass && !self.hasClass(headActiveClass) && self.addClass(headActiveClass);
            }
            that.$panels[i].style.display = i!=toIndex?'none':'block';
        });
        return;
    },
    //初始化上一步按钮以及下一步按钮的函数
    initButton:function(){
        var that = this;
        var nextFn = this.option.onNext;
        var prevFn = this.option.onPrev;
        this.$next.length && this.$next.on('click',function(e){
            var event = e || window.event;
            var next = that.move(true);
            if(nextFn&&next){
                nextFn.call(that,this,event,curIndex,that.len,next);
            }else{
                next();
            }
        });
        this.$prev.length && this.$prev.on('click',function(e){
            var event = e || window.event;
            var prev = that.move(false);
            if(prevFn&&next){
                prevFn.call(that,this,event,curIndex,that.len,prev);
            }else{
                prev();
            }
        });
        return;
    },
    //初始化标题点击函数
    headClick:function(){
        var that = this;
        this.$heads.each(function(i){
            var self = $(this);
            self.on('click',function(){
                if(i<=that.curIndex){
                    that.$panels[i].style.display = 'block';
                    $(that.$panels[i]).siblings('[wizard-origin-panel]').hide();
                }
            })
        });
    },
    //步骤移动函数
    move:function(isNext){
        var that = this;
        var onProgress = this.option.onProgress;
        return function(error){
            var index = that.curIndex;
            var toIndex = 0;
            if(error){
                that.option.onError && that.option.onError.call(that,error);
                return;
            };
            if(isNext){
                if(index+1>that.len-1){
                    that.option.onFinish && that.option.onFinish.call(that,index);
                    return false;
                }
                toIndex = index+1;
                that.wizardChange(index,toIndex);
            }else{
                if(index-1<0)return false;
                toIndex = index-1;
                that.wizardChange(index,toIndex);
            }
            onProgress && onProgress.apply(this,index,toIndex,that.len);
            that.curIndex = toIndex;
            return;
        }
    }
}

$.fn.WizardOrigin = function(option){
    return this.each(function(){
        option.el = this;
        WizardOrigin(option);
    })
}

$.WizardOrigin = function(option){
    WizardOrigin(option);
}

return WizardOrigin;

},window||this,window.jQuery))