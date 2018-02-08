

(function(factory,global,$){
    if(!$ || $ !== global.jQuery)return;

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory($,global) : 
    typeof define === 'function' && define.amd ? define(['jquery'],factory) : 
    (global.WizardOrigin = factory($,global));
}(function($,global){

var defaults = {
    onNext:null,
    onProgress:null,
    onPrev:null,
    headActiveClass:'wizard-head-active',
    onError:null,
    el:null
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
    init:function(){
        this.wizardChange(0,0);
        this.initButton();
    },
    wizardChange:function(index,toIndex){
        toIndex = toIndex == null && index<this.len ? index+1 : toIndex;
        var that = this;
        console.log(toIndex,index);
        var headActiveClass = this.option.headActiveClass;
        this.$heads.each(function(i,elem){
            var self = $(elem);
            if(i>toIndex){
                !!headActiveClass && self.hasClass(headActiveClass) && self.removeClass(headActiveClass);
            }else{
                !!headActiveClass && !self.hasClass(headActiveClass) && self.addClass(headActiveClass);
            }
        });
        if(index != toIndex){
            this.$panels[index].style.display = 'none';
        }
        this.$panels[toIndex].style.display = 'block';
        return;
    },
    initButton:function(){
        var that = this;
        var nextFn = this.option.onNext;
        var prevFn = this.option.onPrev;
        this.$next.on('click',function(e){
            var event = e || window.event;
            var next = that.move(true);
            if(nextFn&&next){
                nextFn.call(that,this,event,curIndex,that.len,next);
            }else{
                next();
            }
        });
        this.$prev.on('click',function(e){
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
                if(index+1>that.len-1)return false;
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