/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.layout.Splitter");jQuery.sap.require("sap.ui.layout.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.layout.Splitter",{metadata:{library:"sap.ui.layout",properties:{"orientation":{type:"sap.ui.core.Orientation",group:"Behavior",defaultValue:sap.ui.core.Orientation.Horizontal},"width":{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'100%'},"height":{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'100%'}},defaultAggregation:"contentAreas",aggregations:{"contentAreas":{type:"sap.ui.core.Control",multiple:true,singularName:"contentArea"}},events:{"resize":{}}}});sap.ui.layout.Splitter.M_EVENTS={'resize':'resize'};(function(w,u){"use strict";var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.layout");sap.ui.layout.Splitter.prototype.init=function(){this._needsInvalidation=false;this._liveResize=true;this._keyboardEnabled=true;this._bHorizontal=true;this._calculatedSizes=[];this._move={};this._resizeTimeout=null;this._resizeCallback=this._delayedResize.bind(this);this._resizeHandlerId=null;this._autoResize=true;this.enableAutoResize();this._boundBarMoveEnd=this._onBarMoveEnd.bind(this);this._boundBarMove=this._onBarMove.bind(this);this._switchOrientation();this._keyListeners={increase:this._onKeyboardResize.bind(this,"inc"),decrease:this._onKeyboardResize.bind(this,"dec"),increaseMore:this._onKeyboardResize.bind(this,"incMore"),decreaseMore:this._onKeyboardResize.bind(this,"decMore"),max:this._onKeyboardResize.bind(this,"max"),min:this._onKeyboardResize.bind(this,"min")};this._enableKeyboardListeners()};sap.ui.layout.Splitter.prototype.exit=function(){this.disableAutoResize();delete this._resizeCallback;delete this._boundBarMoveEnd;delete this._boundBarMove;delete this._$SplitterOverlay;delete this._$SplitterOverlayBar};sap.ui.layout.Splitter.prototype.triggerResize=function(f){if(f){this._resize()}else{this._delayedResize()}};sap.ui.layout.Splitter.prototype.getCalculatedSizes=function(){return this._calculatedSizes};sap.ui.layout.Splitter.prototype.enableAutoResize=function(t){if(t&&!this._autoResize){return}this._autoResize=true;var c=this;sap.ui.getCore().attachInit(function(){c._resizeHandlerId=sap.ui.core.ResizeHandler.register(c,c._resizeCallback)});this._delayedResize()};sap.ui.layout.Splitter.prototype.disableAutoResize=function(t){sap.ui.core.ResizeHandler.deregister(this._resizeHandlerId);if(!t){this._autoResize=false}};sap.ui.layout.Splitter.prototype.enableLiveResize=function(){this._liveResize=true;this.$().toggleClass("sapUiLoSplitterAnimated",false)};sap.ui.layout.Splitter.prototype.disableLiveResize=function(){this._liveResize=false;this.$().toggleClass("sapUiLoSplitterAnimated",true)};sap.ui.layout.Splitter.prototype.enableKeyboardSupport=function(){var B=this.$().find(".sapUiLoSplitterBar");B.attr("tabindex","0");this._enableKeyboardListeners()};sap.ui.layout.Splitter.prototype.disableKeyboardSupport=function(){var B=this.$().find(".sapUiLoSplitterBar");B.attr("tabindex","-1");this._disableKeyboardListeners()};sap.ui.layout.Splitter.prototype.onBeforeRendering=function(){this._switchOrientation()};sap.ui.layout.Splitter.prototype.onAfterRendering=function(){this._$SplitterOverlay=this.$("overlay");this._$SplitterOverlayBar=this.$("overlayBar");this._$SplitterOverlay.detach();this._resize()};sap.ui.layout.Splitter.prototype.onLayoutDataChange=function(){this._delayedResize()};sap.ui.layout.Splitter.prototype.ontouchstart=function(j){if(this._ignoreTouch){return}var i=this.getId();if(!j.target.id||j.target.id.indexOf(i+"-splitbar")!=0){return}if(!j.changedTouches||!j.changedTouches[0]){return}this._ignoreMouse=true;this._onBarMoveStart(j.changedTouches[0],true)};sap.ui.layout.Splitter.prototype.onmousedown=function(j){if(this._ignoreMouse){return}var i=this.getId();if(!j.target.id||j.target.id.indexOf(i+"-splitbar")!=0){return}this._ignoreTouch=true;this._onBarMoveStart(j)};sap.ui.layout.Splitter.prototype._onBarMoveStart=function(j,t){var I=this.getId();this.disableAutoResize(true);var p=j[this._moveCord];var B=parseInt(j.target.id.substr((I+"-splitbar-").length),10);var $=jQuery(j.target);var c=this.getCalculatedSizes();var d=this._bHorizontal?$.innerWidth():$.innerHeight();var C=this.getContentAreas();var l=C[B].getLayoutData();var L=C[B+1].getLayoutData();if(!l.getResizable()||!L.getResizable()){a(t);return}var R=0-d;for(var i=0;i<=B;++i){R+=c[i]+d}this._move={start:p,relStart:R,barNum:B,bar:jQuery(j.target),c1Size:c[B],c1MinSize:l?parseInt(l.getMinSize(),10):0,c2Size:c[B+1],c2MinSize:L?parseInt(L.getMinSize(),10):0};if(t){document.addEventListener("touchend",this._boundBarMoveEnd);document.addEventListener("touchmove",this._boundBarMove)}else{document.addEventListener("mouseup",this._boundBarMoveEnd);document.addEventListener("mousemove",this._boundBarMove)}this._$SplitterOverlay.css("display","block");this._$SplitterOverlay.appendTo(this.getDomRef());this._$SplitterOverlayBar.css(this._sizeDirNot,"");this._move["bar"].css("visibility","hidden");this._onBarMove(j)};sap.ui.layout.Splitter.prototype._onBarMove=function(j){if(j.preventDefault){j.preventDefault()}var e=j;if(j.changedTouches&&j.changedTouches[0]){e=j.changedTouches[0]}var p=e[this._moveCord];var d=(p-this._move.start);var c=this._move.c1Size+d;var f=this._move.c2Size-d;var i=(c>=0&&f>=0&&c>=this._move.c1MinSize&&f>=this._move.c2MinSize);if(i){this._$SplitterOverlayBar.css(this._sizeDir,this._move.relStart+d);if(this._liveResize){this._resizeContents(this._move["barNum"],0-(this._move["start"]-e[this._moveCord]),false)}}};sap.ui.layout.Splitter.prototype._onBarMoveEnd=function(j){this._ignoreMouse=false;this._ignoreTouch=false;var e=j;if(j.changedTouches&&j.changedTouches[0]){e=j.changedTouches[0]}var p=e[this._moveCord];this._resizeContents(this._move["barNum"],0-(this._move["start"]-p),true);this._move["bar"].css("visibility","");this._$SplitterOverlay.css("display","");this._$SplitterOverlay.detach();document.removeEventListener("mouseup",this._boundBarMoveEnd);document.removeEventListener("mousemove",this._boundBarMove);document.removeEventListener("touchend",this._boundBarMoveEnd);document.removeEventListener("touchmove",this._boundBarMove);this.disableAutoResize(true);jQuery.sap.focus(this._move.bar)};sap.ui.layout.Splitter.prototype._resizeContents=function(l,p,f){if(isNaN(p)){jQuery.sap.log.warning("Splitter: Received invalid resizing values - resize aborted.");return}var c=this.getContentAreas();var L=c[l].getLayoutData();var o=c[l+1].getLayoutData();var s=L.getSize();var S=o.getSize();var C=this.$("content-"+l);var $=this.$("content-"+(l+1));var n=this._move.c1Size+p;var N=this._move.c2Size-p;var m=parseInt(L.getMinSize(),10);var M=parseInt(o.getMinSize(),10);var d;if(n<m){d=m-n;p+=d;n=m;N-=d}else if(N<M){d=M-N;p-=d;N=M;n-=d}if(f){if(s==="auto"&&S!=="auto"){o.setSize(N+"px")}else if(s!=="auto"&&S==="auto"){L.setSize(n+"px")}else{L.setSize(n+"px");o.setSize(N+"px")}}else{C.css(this._sizeType,n+"px");$.css(this._sizeType,N+"px")}};sap.ui.layout.Splitter.prototype._delayedResize=function(d){if(d===u){d=0}if(this.getDomRef()){jQuery.sap.clearDelayedCall(this._resizeTimeout);this._resizeTimeout=jQuery.sap.delayedCall(d,this,this._resize,[])}};sap.ui.layout.Splitter.prototype._resize=function(){var i=0,B;var c=this.getContentAreas();var $=this.$();for(i=0;i<c.length-1;++i){B=this.$("splitbar-"+i);B.css(this._sizeTypeNot,"")}for(i=0;i<c.length-1;++i){B=this.$("splitbar-"+i);var s=this._bHorizontal?$.height():$.width();B.css(this._sizeType,"");B.css(this._sizeTypeNot,s+"px")}var o=this.getCalculatedSizes();this._recalculateSizes();var n=this.getCalculatedSizes();var S=false;for(i=0;i<n.length;++i){if(n[i]!==0){S=true;break}}if(!S){this._delayedResize(100);return}var l=true;for(i=0;i<c.length;++i){var C=this.$("content-"+i);var d=c[i];C.css(this._sizeType,n[i]+"px");C.css(this._sizeTypeNot,"");var L=d.getLayoutData();var e=L&&L.getResizable();if(i>0){var R=e&&l;B=this.$("splitbar-"+(i-1));B.toggleClass("sapUiLoSplitterNoResize",!R);B.attr("tabindex",R&&this._keyboardEnabled?"0":"-1");B.attr("title",R?this._getText("SPLITTER_MOVE"):"")}l=e}if(_(o,n)){this.fireResize({oldSizes:o,newSizes:n})}};sap.ui.layout.Splitter.prototype._calculateAvailableContentSize=function(s){var i=0;var S=this.$();var f=this._bHorizontal?S.innerWidth():S.innerHeight();var A=0;var h=false;for(i=0;i<s.length;++i){var c=s[i];if(c.indexOf("%")>-1){A++}if(s[i]=="auto"){h=true}}A+=h?1:0;f-=A;var d=s.length-1;var e=0;for(i=0;i<d;++i){e+=this._bHorizontal?this.$("splitbar-"+i).innerWidth():this.$("splitbar-"+i).innerHeight()}return f-e};sap.ui.layout.Splitter.prototype._recalculateSizes=function(){var i,s,l,c,d;var S=[];var C=this.getContentAreas();for(i=0;i<C.length;++i){l=C[i].getLayoutData();s=l?l.getSize():"auto";S.push(s)}this._calculatedSizes=[];var A=this._calculateAvailableContentSize(S);var e=[];var f=[];var p=[];for(i=0;i<S.length;++i){s=S[i];var g;if(s.indexOf("px")>-1){g=parseInt(s);A-=g;this._calculatedSizes[i]=g}else if(s.indexOf("%")>-1){p.push(i)}else if(S[i]=="auto"){l=C[i].getLayoutData();if(l&&parseInt(l.getMinSize(),10)!=0){f.push(i)}else{e.push(i)}}else{jQuery.sap.log.error("Illegal size value: "+S[i])}}var W=false;if(A<0){W=true;A=0}var R=A;var P=p.length;for(i=0;i<P;++i){d=p[i];c=parseFloat(S[d])/100*A;A-=Math.ceil(c);this._calculatedSizes[d]=Math.floor(c);R-=Math.ceil(c)}A=R;if(A<0){W=true;A=0}c=Math.floor(A/(f.length+e.length),0);var h=f.length;for(i=0;i<h;++i){d=f[i];var m=parseInt(C[d].getLayoutData().getMinSize(),10);if(m>c){this._calculatedSizes[d]=m;A-=m}else{this._calculatedSizes[d]=c;A-=c}}if(A<0){W=true;A=0}R=A;var j=e.length;c=Math.floor(A/j,0);for(i=0;i<j;++i){d=e[i];this._calculatedSizes[d]=c;R-=c;if(i==j-1&&R!=0){this._calculatedSizes[d]+=R}}if(W){jQuery.sap.log.info("[Splitter] The set sizes and minimal sizes of the splitter contents are bigger "+"than the available space in the UI.")}};sap.ui.layout.Splitter.prototype._switchOrientation=function(){this._bHorizontal=this.getOrientation()===sap.ui.core.Orientation.Horizontal;if(this._bHorizontal){this._moveCord="pageX";this._sizeType="width";this._sizeTypeNot="height";this._sizeDir="left";this._sizeDirNot="top"}else{this._moveCord="pageY";this._sizeType="height";this._sizeTypeNot="width";this._sizeDir="top";this._sizeDirNot="left"}var t=this.$();t.toggleClass("sapUiLoSplitterH",this._bHorizontal);t.toggleClass("sapUiLoSplitterV",!this._bHorizontal)};sap.ui.layout.Splitter.prototype._onKeyboardResize=function(t,e){var B=this.getId()+"-splitbar-";if(!e||!e.target||!e.target.id||e.target.id.indexOf(B)!==0){return}var s=20;var i=999999;var c=parseInt(e.target.id.substr(B.length));var C=this.getCalculatedSizes();this._move.c1Size=C[c];this._move.c2Size=C[c+1];var S=0;switch(t){case"inc":S=s;break;case"incMore":S=s*10;break;case"dec":S=0-s;break;case"decMore":S=0-s*10;break;case"max":S=i;break;case"min":S=0-i;break;default:jQuery.sap.log.warn("[Splitter] Invalid keyboard resize type");break}this._resizeContents(c,S,true)};sap.ui.layout.Splitter.prototype._enableKeyboardListeners=function(){this.onsapright=this._keyListeners.increase;this.onsapdown=this._keyListeners.increase;this.onsapleft=this._keyListeners.decrease;this.onsapup=this._keyListeners.decrease;this.onsappageup=this._keyListeners.decreaseMore;this.onsappagedown=this._keyListeners.increaseMore;this.onsapend=this._keyListeners.max;this.onsaphome=this._keyListeners.min;this._keyboardEnabled=true};sap.ui.layout.Splitter.prototype._disableKeyboardListeners=function(){delete this.onsapincreasemodifiers;delete this.onsapdecreasemodifiers;delete this.onsapendmodifiers;delete this.onsaphomemodifiers;this._keyboardEnabled=false};sap.ui.layout.Splitter.prototype._getText=function(k,A){return(r?r.getText(k,A):k)};function _(s,S){if(s===S){return false}if(!s||!S||s.length===u||S.length===u){return true}if(s.length!=S.length){return true}for(var i=0;i<s.length;++i){if(s[i]!==S[i]){return true}}return false}function a(t){var p=function(e){e.preventDefault()};var A=null;A=function(){document.removeEventListener("touchend",A);document.removeEventListener("touchmove",p);document.removeEventListener("mouseup",A);document.removeEventListener("mousemove",p)};if(t){this._ignoreMouse=true;document.addEventListener("touchend",A);document.addEventListener("touchmove",p)}else{document.addEventListener("mouseup",A);document.addEventListener("mousemove",p)}}function b(c){var l=c.getLayoutData();if(l&&(!l.getResizable||!l.getSize||!l.getMinSize)){jQuery.sap.log.warning("Content \""+c.getId()+"\" for the Splitter contained wrong LayoutData. "+"The LayoutData has been replaced with default values.");l=null}if(!l){c.setLayoutData(new sap.ui.layout.SplitterLayoutData())}}sap.ui.layout.Splitter.prototype.invalidate=function(o){var f=(o&&this.indexOfContentArea(o)!=-1)||(o&&o instanceof sap.ui.core.CustomData&&o.getWriteToDom())||(o===u);if(f||this._needsInvalidation){this._needsInvalidation=false;sap.ui.core.Control.prototype.invalidate.apply(this,arguments)}};sap.ui.layout.Splitter.prototype.setOrientation=function(o){var R=this.setProperty("orientation",o,true);this._switchOrientation();this._delayedResize();return R};sap.ui.layout.Splitter.prototype.setWidth=function(W){this.setProperty("width",W,true);this.$().css("width",this.getProperty("width"));return this};sap.ui.layout.Splitter.prototype.setHeight=function(h){this.setProperty("height",h,true);this.$().css("height",this.getProperty("height"));return this};sap.ui.layout.Splitter.prototype.addContentArea=function(c){this._needsInvalidation=true;b(c);return this.addAggregation("contentAreas",c)};sap.ui.layout.Splitter.prototype.removeContentArea=function(c){this._needsInvalidation=true;return this.removeAggregation("contentAreas",c)};sap.ui.layout.Splitter.prototype.removeAllContentArea=function(){this._needsInvalidation=true;return this.destroyAllAggregation("contentAreas")};sap.ui.layout.Splitter.prototype.destroyContentArea=function(){this._needsInvalidation=true;return this.destroyAggregation("contentAreas")};sap.ui.layout.Splitter.prototype.insertContentArea=function(c,i){this._needsInvalidation=true;b(c);return this.insertAggregation("contentAreas",c,i)}})(window);
