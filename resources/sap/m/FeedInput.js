/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.m.FeedInput");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.FeedInput",{metadata:{library:"sap.m",properties:{"enabled":{type:"boolean",group:"Behavior",defaultValue:true},"maxLength":{type:"int",group:"Behavior",defaultValue:0},"placeholder":{type:"string",group:"Appearance",defaultValue:null},"value":{type:"string",group:"Data",defaultValue:null},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"icon":{type:"sap.ui.core.URI",group:"Data",defaultValue:null},"showIcon":{type:"boolean",group:"Behavior",defaultValue:true},"iconDensityAware":{type:"boolean",group:"Appearance",defaultValue:true}},events:{"post":{}}}});sap.m.FeedInput.M_EVENTS={'post':'post'};jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("sap.ui.core.HTML");
sap.m.FeedInput.prototype.init=function(){var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");this.setProperty("placeholder",b.getText("FEEDINPUT_PLACEHOLDER"),true)};
sap.m.FeedInput.prototype.exit=function(){if(this._oTextArea){this._oTextArea.destroy()}if(this._oButton){this._oButton.destroy()}if(this._oImageControl){this._oImageControl.destroy()}};
sap.m.FeedInput.prototype.setMaxLength=function(m){this.setProperty("maxLength",m,true);this._getTextArea().setMaxLength(m);return this};
sap.m.FeedInput.prototype.setValue=function(v){this.setProperty("value",v,true);this._getTextArea().setValue(v);this._enablePostButton();return this};
sap.m.FeedInput.prototype.setPlaceholder=function(v){this.setProperty("placeholder",v,true);this._getTextArea().setPlaceholder(v);return this};
sap.m.FeedInput.prototype.setEnabled=function(e){this.setProperty("enabled",e,true);this._getTextArea().setEnabled(e);this._enablePostButton();return this};
sap.m.FeedInput.prototype._getTextArea=function(){if(!this._oTextArea){this._oTextArea=new sap.m.TextArea(this.getId()+"-textArea",{rows:1,value:null,maxLength:this.getMaxLength(),placeholder:this.getPlaceholder(),liveChange:jQuery.proxy(function(e){var v=e.getParameter("value");this.setProperty("value",v,true);this._enablePostButton()},this)});this._oTextArea.setParent(this)}return this._oTextArea};
sap.m.FeedInput.prototype._getPostButton=function(){if(!this._oButton){this._oButton=new sap.m.Button(this.getId()+"-button",{enabled:false,type:sap.m.ButtonType.Default,icon:"sap-icon://feeder-arrow",press:jQuery.proxy(function(e){this.firePost({value:this.getValue()});this.setValue(null);this._oTextArea.focus()},this)});this._oButton.setParent(this)}return this._oButton};
sap.m.FeedInput.prototype._enablePostButton=function(){var v=this.getProperty("value");var i=this.getProperty("enabled");var p=(i&&!!v&&v.trim().length>0);var b=this._getPostButton();if(b.getEnabled()!==p){b.setEnabled(p)}};
sap.m.FeedInput.prototype._getImageControl=function(){var i=this.getIcon()||sap.ui.core.IconPool.getIconURI("person-placeholder"),I=this.getId()+'-icon',p={src:i,densityAware:this.getIconDensityAware()},c=['sapMFeedInImage'];this._oImageControl=sap.m.ImageHelper.getImageControl(I,this._oImageControl,this,p,c);return this._oImageControl};
