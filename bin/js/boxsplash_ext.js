Ext.namespace("Boxsplash");Boxsplash.ApplicationFacade=Ext.extend(Puremvc.patterns.Facade,{constructor:function(){Boxsplash.ApplicationFacade.superclass.constructor.call(this);
},initializeController:function(){Boxsplash.ApplicationFacade.superclass.initializeController.call(this);
this.registerCommand(Boxsplash.ApplicationFacade.STARTUP,Boxsplash.controller.StartupCommand);
this.registerCommand(Boxsplash.ApplicationFacade.RETRIEVE_CONFIG_OPTION,Boxsplash.controller.RetrieveConfigOptionCommand);
},startup:function(viewComponent){this.sendNotification(Boxsplash.ApplicationFacade.STARTUP,viewComponent);
}});Ext.apply(Boxsplash.ApplicationFacade,{STARTUP:"Startup",RETRIEVE_CONFIG_OPTION:"retrieveConfigOption",TOGGLE_START_STOP:"toggleStartStop",ANIMATION_STATE_CHANGED:"animationStateChanged",getInstance:function(){if(Puremvc.patterns.Facade._instance===null){Puremvc.patterns.Facade._instance=new Boxsplash.ApplicationFacade();
}return Puremvc.patterns.Facade._instance;}});Ext.namespace("Boxsplash.controller");
Boxsplash.controller.RetrieveConfigOptionCommand=Ext.extend(Puremvc.patterns.SimpleCommand,{constructor:function(){Boxsplash.controller.RetrieveConfigOptionCommand.superclass.constructor.call(this);
},execute:function(notification){var configOptionNum=notification.getBody();var configProxy=this.facade.retrieveProxy(Boxsplash.model.ConfigProxy.NAME);
configProxy.retrieveConfigOption(configOptionNum);}});Ext.namespace("Boxsplash.controller");
Boxsplash.controller.ModelPrepCommand=Ext.extend(Puremvc.patterns.SimpleCommand,{constructor:function(){Boxsplash.controller.ModelPrepCommand.superclass.constructor.call(this);
},execute:function(notification){this.facade.registerProxy(new Boxsplash.model.ConfigProxy());
}});Ext.namespace("Boxsplash.controller");Boxsplash.controller.ViewPrepCommand=Ext.extend(Puremvc.patterns.SimpleCommand,{constructor:function(){Boxsplash.controller.ViewPrepCommand.superclass.constructor.call(this);
},execute:function(notification){var shell=notification.getBody();this.facade.registerMediator(new Boxsplash.view.ShellMediator(shell));
}});Ext.namespace("Boxsplash.controller");Boxsplash.controller.StartupCommand=Ext.extend(Puremvc.patterns.MacroCommand,{constructor:function(){Boxsplash.controller.StartupCommand.superclass.constructor.call(this);
},initializeMacroCommand:function(){this.addSubCommand(Boxsplash.controller.ModelPrepCommand);
this.addSubCommand(Boxsplash.controller.ViewPrepCommand);}});Ext.namespace("Boxsplash.model.vo");
Boxsplash.model.vo.BoxConfigVO=function(id,numBoxes,boxSize,focalLength,color){this.id=id;
this.numBoxes=numBoxes;this.boxSize=boxSize;this.focalLength=focalLength;this.color=color;
};Ext.namespace("Boxsplash.model");Boxsplash.model.ConfigProxy=Ext.extend(Puremvc.patterns.Proxy,{constructor:function(){var configOptions=[new Boxsplash.model.vo.BoxConfigVO("Light",20,50,500,"#FF0000"),new Boxsplash.model.vo.BoxConfigVO("Medium-light",40,30,400,"#00FF00"),new Boxsplash.model.vo.BoxConfigVO("Medium",80,20,300,"#0000FF"),new Boxsplash.model.vo.BoxConfigVO("Heavy-medium",160,10,200,"#FF00FF"),new Boxsplash.model.vo.BoxConfigVO("Heavy (IE Killer)",320,5,200,"#00FFFF")];
Boxsplash.model.ConfigProxy.superclass.constructor.call(this,Boxsplash.model.ConfigProxy.NAME,configOptions);
},retrieveConfigOption:function(optionNum){this.sendNotification(Boxsplash.model.ConfigProxy.CONFIG_OPTION_RETRIEVED,this.data[optionNum]);
}});Ext.apply(Boxsplash.model.ConfigProxy,{NAME:"ConfigProxy",CONFIG_OPTION_RETRIEVED:"configOptionRetrieved"});
Ext.namespace("Boxsplash.view.components.core");Boxsplash.view.components.core.UIComponent=Ext.extend(Ext.util.Observable,{initialized:false,element:null,constructor:function(element,config,styles){if(element){this.element=Boxsplash.view.components.core.UIComponent.buildElement(element,styles);
}if(config){if(config.events){this.addEvents(config.events);}if(config.listeners){this.listeners=config.listeners;
}Boxsplash.view.components.core.UIComponent.superclass.constructor.call(this,config);
}else{Boxsplash.view.components.core.UIComponent.superclass.constructor.call(this);
}},initializeChildren:function(){},childrenInitialized:function(){},initializationComplete:function(){this.initialized=true;
},addChild:function(child){this.element.appendChild(child.element);child.initializeChildren();
child.childrenInitialized();child.initializationComplete();return this;}});Ext.apply(Boxsplash.view.components.core.UIComponent,{buildElement:function(element,styles){var el=null;
if(element){if(Ext.isString(element)||Ext.isElement(element)){el=Ext.get(element);
if(el){el=new Ext.Element(el,true);}}else{if(Ext.isObject(element)){el=new Ext.Element(Ext.DomHelper.createDom(element));
}}if(styles){if(Ext.isObject(styles)){Ext.DomHelper.applyStyles(el.dom,styles);}}}return el;
},buildComponent:function(element,styles){var el=Boxsplash.view.components.core.UIComponent.buildElement(element,styles);
var component=new Boxsplash.view.components.core.UIComponent(el);return component;
}});Ext.namespace("Boxsplash.view.components");Boxsplash.view.components.Box=Ext.extend(Boxsplash.view.components.core.UIComponent,{constructor:function(unscaledWidth,unscaledHeight){this.unscaledWidth=unscaledWidth;
this.unscaledHeight=unscaledHeight;Boxsplash.view.components.Box.superclass.constructor.call(this,{tag:"div"},null,{"position":"absolute","width":this.unscaledWidth+"px","height":this.unscaledHeight+"px"});
},posX:0,posY:0,posZ:0,unscaledWidth:0,unscaledHeight:0});Ext.namespace("Boxsplash.view.components");
Boxsplash.view.components.ControlPanel=Ext.extend(Boxsplash.view.components.core.UIComponent,{constructor:function(){Boxsplash.view.components.ControlPanel.superclass.constructor.call(this,"control-panel",{events:{loadConfig:true,toggleStartStop:true}});
this.button_clickHandler=this.button_clickHandler.createDelegate(this);this.startStop_clickHandler=this.startStop_clickHandler.createDelegate(this);
},headerLabel:null,availableConfigsLabel:null,currentConfigLabel:null,configButtons:[],stopStartButton:null,initializeChildren:function(){this.headerLabel=new Boxsplash.view.components.core.UIComponent({tag:"h1",id:"header-label",html:"Control Panel"});
this.addChild(this.headerLabel);this.availableConfigsLabel=new Boxsplash.view.components.core.UIComponent({tag:"p",id:"available-configs-label",html:"Available Configurations:"});
this.addChild(this.availableConfigsLabel);this.currentConfigLabel=new Boxsplash.view.components.core.UIComponent({tag:"p",id:"current-config-label",html:"Now Displaying:"});
this.addChild(this.currentConfigLabel);this.stopStartButton=new Boxsplash.view.components.core.UIComponent({tag:"button",id:"startButton",html:"Start"},null,{position:"absolute"});
this.addChild(this.stopStartButton);},childrenInitialized:function(){this.stopStartButton.element.addListener("click",this.startStop_clickHandler);
},initializationComplete:function(){Boxsplash.view.components.ControlPanel.superclass.initializationComplete.call(this);
},setConfigurationButtons:function(value){var button=null;while(this.configButtons.length>0){button=this.configButtons.pop();
Ext.removeNode(button.element);}this.configButtons=[];var posY=50;var len=value.length;
for(i=0;i<len;i++){var boxConfigVO=value[i];var buttonId="_button"+(i+1);button=new Boxsplash.view.components.core.UIComponent({tag:"button",id:buttonId,html:boxConfigVO.id},null,{position:"absolute",top:posY,left:5,width:150});
button.element.dom["__index"]=i;button.element.addListener("click",this.button_clickHandler);
this.configButtons.push(button);this.addChild(button);posY+=button.element.getHeight();
}Ext.DomHelper.applyStyles(this.currentConfigLabel.element.dom,{top:posY.toString()+"px"});
posY+=this.currentConfigLabel.element.getHeight()+10;Ext.DomHelper.applyStyles(this.stopStartButton.element.dom,{top:(posY+10).toString()+"px"});
},setConfigurationLabel:function(value){Ext.fly("current-config-label").update("Now Displaying: "+value);
},animationStateChanged:function(inTween){var wrapper=Ext.fly("startButton");if(inTween){wrapper.update("Stop");
}else{wrapper.update("Start");}},button_clickHandler:function(event,target){var buttonElement=target;
var index=buttonElement["__index"];this.fireEvent("loadConfig",index);},startStop_clickHandler:function(event,target){this.fireEvent("toggleStartStop");
}});Ext.namespace("Boxsplash.view.components");Boxsplash.view.components.WorldSpace=Ext.extend(Boxsplash.view.components.core.UIComponent,{constructor:function(){Boxsplash.view.components.WorldSpace.superclass.constructor.call(this,"world-space",{events:{animationStateChanged:true}});
this.mouseMoveHandler=this.mouseMoveHandler.createDelegate(this);this.tick=this.tick.createDelegate(this);
this.startAnimation=this.startAnimation.createDelegate(this);this.stopAnimation=this.stopAnimation.createDelegate(this);
},inTween:false,boxes:[],focalLength:0,angle:0,vp:{x:0,y:0},currentConfig:null,setConfiguration:function(value){if(this.currentConfig!=value){this.currentConfig=value;
this.stopAnimation();this.removeAllBoxes();this.createWorldFromConfig();this.startAnimation();
}},toggleStartStop:function(){if(this.inTween){this.stopAnimation();}else{this.startAnimation();
}return this.inTween;},task:{run:null,interval:10},removeAllBoxes:function(){while(this.boxes.length){Ext.removeNode(this.boxes.pop().element.dom);
}},createWorldFromConfig:function(){if(this.currentConfig){this.focalLength=this.currentConfig.focalLength;
var numBoxes=this.currentConfig.numBoxes;var color=this.currentConfig.color;var boxSize=this.currentConfig.boxSize;
while(numBoxes--){var box=new Boxsplash.view.components.Box(boxSize,boxSize);box.posX=Math.random()*250-125;
box.posY=Math.random()*250-125;box.posZ=Math.random()*this.focalLength-(this.focalLength/2);
box.element.setStyle({"background":color,border:"1px solid #FFF"});this.boxes.push(box);
this.addChild(box);}}},startAnimation:function(){if(!this.inTween){var worldSpace=this.element;
this.vp.x=worldSpace.getWidth()/2;this.vp.y=worldSpace.getHeight()/2;if(this.boxes.length){this.element.addListener("mousemove",this.mouseMoveHandler);
this.task.run=this.tick;Ext.TaskMgr.start(this.task);this.inTween=true;this.fireEvent("animationStateChanged",this.inTween);
}}},stopAnimation:function(){if(this.inTween){this.element.removeListener("mousemove",this.mouseMoveHandler);
Ext.TaskMgr.stop(this.task);this.task.run=this.tick;this.angle=0;this.inTween=false;
this.fireEvent("animationStateChanged",this.inTween);}},tick:function(){var i=this.boxes.length;
var rads=(this.angle*Math.PI)/180;var cos=Math.cos(rads);var sin=Math.sin(rads);while(i--){var box=this.boxes[i];
var x1=(box.posX*cos)-(box.posZ*sin);var z1=(box.posZ*cos)+(box.posX*sin);var scale=this.focalLength/(this.focalLength+box.posZ);
var progress=(z1>0)?z1/(this.focalLength/2):0;var bgColor=this.interpolateColor(this.currentConfig.color,"#222222",progress);
var borderColor=this.interpolateColor("#FFFFFF","#010101",progress);box.posX=x1;box.posZ=z1;
box.element.setStyle({left:this.vp.x+(box.posX*scale),top:this.vp.y+(box.posY*scale),width:box.unscaledWidth*scale,height:box.unscaledHeight*scale,"background-color":bgColor,"border-color":borderColor});
}this.sortZ();},sortZ:function(){var copy=this.boxes.concat();copy.sort(function(a,b){var retVal=(b.posZ==a.posZ?0:((b.posZ>a.posZ?1:-1)));
return retVal;});var count=copy.length;for(var i=0;i<count;i++){var zIndex=count-i;
var box=copy[zIndex-1];box.element.setStyle("z-index",zIndex);}},interpolateColor:function(originalColorHex,newColorHex,progress){var originalColor=parseInt(originalColorHex.replace("#","0x"));
var newColor=parseInt(newColorHex.replace("#","0x"));var origRed=(originalColor&16711680)>>16;
var origGreen=(originalColor&65280)>>8;var origBlue=originalColor&255;var newRed=(newColor&16711680)>>16;
var newGreen=(newColor&65280)>>8;var newBlue=newColor&255;var diffRed=newRed-origRed;
var diffGreen=newGreen-origGreen;var diffBlue=newBlue-origBlue;var interpolatedRed=origRed+(diffRed*progress);
var interpolatedGreen=origGreen+(diffGreen*progress);var interpolatedBlue=origBlue+(diffBlue*progress);
var payload=Math.abs((interpolatedRed<<16)|(interpolatedGreen<<8)|interpolatedBlue);
return"#"+this.rgbToHex([((payload&16711680)>>16),(payload&65280)>>8,payload&255]);
},mouseMoveHandler:function(event,target){event.preventDefault();var newAngle=(event.getXY()[0]-this.element.getX()-this.vp.x)*0.01;
this.angle=newAngle;},rgbToHex:function(value){function _toHex(N){if(N==null){return"00";
}N=parseInt(N);if(N==0||isNaN(N)){return"00";}N=Math.max(0,N);N=Math.min(N,255);N=Math.round(N);
return"0123456789ABCDEF".charAt((N-N%16)/16)+"0123456789ABCDEF".charAt(N%16);}var R=value[0],G=value[1],B=value[2];
return _toHex(R)+_toHex(G)+_toHex(B);}});Ext.namespace("Boxsplash.view.components");
Boxsplash.view.components.Shell=Ext.extend(Boxsplash.view.components.core.UIComponent,{constructor:function(){Boxsplash.view.components.Shell.superclass.constructor.call(this,"shell");
},controlPanel:null,worldSpace:null,initializeChildren:function(){this.controlPanel=new Boxsplash.view.components.ControlPanel();
this.addChild(this.controlPanel);this.worldSpace=new Boxsplash.view.components.WorldSpace();
this.addChild(this.worldSpace);}});Ext.namespace("Boxsplash.view");Boxsplash.view.ControlPanelMediator=Ext.extend(Puremvc.patterns.Mediator,{constructor:function(viewComponent){Boxsplash.view.ControlPanelMediator.superclass.constructor.call(this,Boxsplash.view.ControlPanelMediator.NAME,viewComponent);
this.controlPanel=this.getViewComponent();this.configProxy=this.facade.retrieveProxy(Boxsplash.model.ConfigProxy.NAME);
this.loadConfigHandler=this.loadConfigHandler.createDelegate(this);this.toggleStartStopHandler=this.toggleStartStopHandler.createDelegate(this);
},controlPanel:null,configProxy:null,listNotificationInterests:function(){return[Boxsplash.model.ConfigProxy.CONFIG_OPTION_RETRIEVED,Boxsplash.ApplicationFacade.ANIMATION_STATE_CHANGED];
},handleNotification:function(notification){switch(notification.getName()){case Boxsplash.model.ConfigProxy.CONFIG_OPTION_RETRIEVED:var boxConfigVO=notification.getBody();
this.controlPanel.setConfigurationLabel(boxConfigVO.id);break;case Boxsplash.ApplicationFacade.ANIMATION_STATE_CHANGED:this.controlPanel.animationStateChanged(notification.getBody());
break;}},onRegister:function(){Boxsplash.view.ControlPanelMediator.superclass.onRegister.call(this);
this.controlPanel.addListener("loadConfig",this.loadConfigHandler);this.controlPanel.addListener("toggleStartStop",this.toggleStartStopHandler);
this.controlPanel.setConfigurationButtons(this.configProxy.data);},onRemove:function(){Boxsplash.view.ControlPanelMediator.superclass.onRemove.call(this);
this.controlPanel.removeListener("loadConfig",this.loadConfigHandler);this.controlPanel.removeListener("toggleStartStop",this.toggleStartStopHandler);
},loadConfigHandler:function(index){this.sendNotification(Boxsplash.ApplicationFacade.RETRIEVE_CONFIG_OPTION,index);
},toggleStartStopHandler:function(){this.sendNotification(Boxsplash.ApplicationFacade.TOGGLE_START_STOP);
}});Ext.apply(Boxsplash.view.ControlPanelMediator,{NAME:"ControlPanelMediator"});
Ext.namespace("Boxsplash.view");Boxsplash.view.WorldSpaceMediator=Ext.extend(Puremvc.patterns.Mediator,{constructor:function(viewComponent){Boxsplash.view.WorldSpaceMediator.superclass.constructor.call(this,Boxsplash.view.WorldSpaceMediator.NAME,viewComponent);
this.worldSpace=this.getViewComponent();this.animationStateChangedHandler=this.animationStateChangedHandler.createDelegate(this);
},worldSpace:null,onRegister:function(){Boxsplash.view.WorldSpaceMediator.superclass.onRegister.call(this);
this.worldSpace.addListener("animationStateChanged",this.animationStateChangedHandler);
},onRemove:function(){Boxsplash.view.WorldSpaceMediator.superclass.onRemove.call(this);
this.worldSpace.removeListener("animationStateChanged",this.animationStateChangedHandler);
},listNotificationInterests:function(){return[Boxsplash.model.ConfigProxy.CONFIG_OPTION_RETRIEVED,Boxsplash.ApplicationFacade.TOGGLE_START_STOP];
},handleNotification:function(notification){switch(notification.getName()){case Boxsplash.model.ConfigProxy.CONFIG_OPTION_RETRIEVED:this.worldSpace.setConfiguration(notification.getBody());
break;case Boxsplash.ApplicationFacade.TOGGLE_START_STOP:this.worldSpace.toggleStartStop();
break;}},animationStateChangedHandler:function(inTween){this.sendNotification(Boxsplash.ApplicationFacade.ANIMATION_STATE_CHANGED,inTween);
}});Ext.apply(Boxsplash.view.WorldSpaceMediator,{NAME:"WorldSpaceMediator"});Ext.namespace("Boxsplash.view");
Boxsplash.view.ShellMediator=Ext.extend(Puremvc.patterns.Mediator,{shell:null,constructor:function(viewComponent){Boxsplash.view.ShellMediator.superclass.constructor.call(this,Boxsplash.view.ShellMediator.NAME,viewComponent);
this.shell=this.getViewComponent();},onRegister:function(){Boxsplash.view.ShellMediator.superclass.onRegister.call(this);
this.facade.registerMediator(new Boxsplash.view.WorldSpaceMediator(this.shell.worldSpace));
this.facade.registerMediator(new Boxsplash.view.ControlPanelMediator(this.shell.controlPanel));
}});Ext.apply(Boxsplash.view.ShellMediator,{NAME:"ShellMediator"});