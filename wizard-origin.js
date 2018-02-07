

(function(factory,global,$){
    
    if(!$ || $ instanceof global.jQuery !== true)return;

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory($,global) : 
    typeof define === 'function' && define.amd ? define(['jquery'],factory) : 
    (global.wizardOrigin = factory($,global));
    console.log(global.wizardOrigin);
})(function($,global){

var defults = {
    onNext:null,
    onProgress:null,
    onPrev:null,
    headActiveClass:'',
    onError:null,
    el:null
}

function WizardOrigin(option){
    if(this instanceof wizardOrigin !== true){
        return new wizardOrigin(option);
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
console.log($);
WizardOrigin.prototype = {
    init:function(){
        this.wizardChange(0,0);
        this.initButton();
    },
    wizardChange:function(index,toIndex){
        toIndex = toIndex !=null && toIndex || index<this.len ? index+1 : index;
        var headActiveClass = this.option.headActiveClass;
        if(toIndex!=index){
            this.$panels[index].hide();
            headActiveClass && this.$heads[index].hasClass(headActiveClass) && this.$heads[index].removeClass(headActiveClass);
        }
        this.$panels[toIndex].show();
        headActiveClass && !this.$heads[toIndex].hasClass(headActiveClass) && this.$heads[toIndex].addClass(headActiveClass);
        return;
    },
    initButton:function(){
        var that = this;
        var nextFn = this.option.onNext;
        var prevFn = this.option.onPrev;
        this.$next.on('click',function(e){
            var event = e || window.event;
            var next = that.move(true);
            if(nextFn){
                nextFn.call(that,this,event,curIndex,that.len,next);
            }else{
                next();
            }
        });
        this.$prev.on('click',function(e){
            var event = e || window.event;
            var prev = that.move(false);
            if(prevFn){
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
                toIndex = curIndex++;
                that.wizardChange(curIndex,toIndex);
            }else{
                toIndex = curIndex--;
                that.wizardChange(curIndex,toIndex);
            }
            onProgress && onProgress.apply(this,index,toIndex,that.len);
            return;
        }
    }
}

$.fn.WizardOrigin = function(option){
    return this.each(function(){
        option.el = this;
        console.log(WizardOrigin(option));
    })
}

$.WizardOrigin = function(option){
    WizardOrigin(option);
}

return WizardOrigin;

},window||this,window.jQuery)