//Get Window size
var winWidth = 0;
var winHeight = 0;

var IsEnableICCard = false;
function GetIsEnableICCard()
{
    debugger;
    $.ajax({
        type: "POST",
        dataType: 'JSON',
        url: "/Main/GetConfigInfo/",
        success: function (result) {
            debugger;
            if (result.total > 0) {
                var data = result.rows;
                IsEnableICCard = data[0].IsEnableICCard;
                IsEnableICCard = IsEnableICCard == 'True' ? true : false;
            }
        }
    });
}

//browser check
function browserCheck() {
  
    var br = $.util.browser;
    if ($.cookie("BrowserCheck") == undefined) {
        if (br.msie && br.version != "11.0") {
            var sb = "<table id=\"__01\" width=\"532\" height=\"434\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
            sb = sb + "	<tr>";
            sb = sb + "		<td height=\"47\" background=\"/images/Login/images/browser_01.jpg\"><table width=\"532\" border=\"0\" cellspacing=\"2\" cellpadding=\"2\">";
            sb = sb + "          <tr>";
            sb = sb + "            <td width=\"423\">&nbsp;</td>";
            sb = sb + "            <td width=\"95\"><span style=\"color: #FF0000;font-weight: bold;font-size:18px;\"></span></td>";
            sb = sb + "          </tr>";
            sb = sb + "        </table></td>";
            sb = sb + "  </tr>";
            sb = sb + "	<tr>";
            sb = sb + "		<td height=\"299\" background=\"/images/Login/images/browser_02.jpg\">&nbsp;</td>";
            sb = sb + "  </tr>";
            sb = sb + "	<tr>";
            sb = sb + "		<td><table id=\"__\" width=\"532\" height=\"79\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
            sb = sb + "          <tr>";
            sb = sb + "            <td><img src=\"/images/Login/images/browser_down_01.jpg\" width=\"30\" height=\"79\" alt=\"\"></td>";

            /*以下地址为远程下载*/
            //sb = sb + "            <td><a id=\"a1\" href='http://www.google.cn/intl/zh-CN/chrome/browser/'><img border=0  src=\"/images/Login/images/browser_down_02.jpg\" width=\"85\" height=\"79\" alt=\"\"></a></td>";
            //sb = sb + "            <td><a  id=\"a2\" href='http://download.firefox.com.cn/releases/stub/official/zh-CN/Firefox-latest.exe'><img border=0  src=\"/images/Login/images/browser_down_03.jpg\" width=\"103\" height=\"79\" alt=\"\"></a></td>";
            //sb = sb + "            <td><a  id=\"a3\" href='http://www.opera.com/download/get/?id=37106&location=360&nothanks=yes&sub=marine'><img border=0  src=\"/images/Login/images/browser_down_04.jpg\" width=\"89\" height=\"79\" alt=\"\"></a></td>";
            //sb = sb + "            <td><a  id=\"a4\" href='http://go.microsoft.com/fwlink/?LinkId=324629'><img border=0  src=\"/images/Login/images/browser_down_05.jpg\" width=\"93\" height=\"79\" alt=\"\"></a></td>";

            /*以下地址为本地下载*/
            sb = sb + "            <td><a id=\"a1\" href='/DownLoad/browser/Google_1426.exe'><img border=0  src=\"/images/Login/images/browser_down_02.jpg\" width=\"85\" height=\"79\" alt=\"\"></a></td>";
            sb = sb + "            <td><a id=\"a1\" href='/DownLoad/browser/360se7.1.1.586.exe'><img border=0  src=\"/images/Login/images/browser_down_001.jpg\" width=\"85\" height=\"79\" alt=\"\"></a></td>";           
            sb = sb + "            <td><a  id=\"a2\" href='/DownLoad/browser/Firefox.exe'><img border=0  src=\"/images/Login/images/browser_down_03.jpg\" width=\"103\" height=\"79\" alt=\"\"></a></td>";
            sb = sb + "            <td><a  id=\"a3\" href='/DownLoad/browser/Opera_22.0_.exe'><img border=0  src=\"/images/Login/images/browser_down_04.jpg\" width=\"89\" height=\"79\" alt=\"\"></a></td>";
            sb = sb + "            <td><a  id=\"a4\" href='/DownLoad/browser/IE11_WIN764.EXE'><img border=0  src=\"/images/Login/images/browser_down_05.jpg\" width=\"93\" height=\"79\" alt=\"\"></a></td>";
           // sb = sb + "            <td><img  src=\"/images/Login/images/browser_down_06.jpg\" width=\"132\" height=\"79\" alt=\"\"></td>";
            sb = sb + "          </tr>";
            sb = sb + "        </table></td>";
            sb = sb + "	</tr>";
            sb = sb + "	<tr>";
            sb = sb + "		<td>";
            sb = sb + "			<img src=\"/images/Login/images/browser_04.jpg\" width=\"532\" height=\"9\" alt=\"\"></td>";
            sb = sb + "	</tr>";
            sb = sb + "</table>";
           
            var lefter = parseInt((document.documentElement.clientWidth / 2) - (550 / 2));//屏幕居中
            var toper = parseInt((document.documentElement.clientHeight / 2) - (470 / 1.5));           
            $("#MaxPanel").css("display", "none");
            var dg = $.easyui.showDialog({
                title: "系统提示 当前浏览器版本[IE " + br.version + "]",
                //iconCls: $(this).linkbutton('options')['iconCls'],
                width: 550, height: 470, topMost: false,
                minWidth: 400, minHeight: 300,
                top:toper,left:lefter,
                //applyButtonText: "按钮a",
                //closeButtonText: "取消",
                //applyButtonIconCls: "icon-search",
                enableSaveButton: false,
                enableCloseButton:false,
               // saveButtonText: "保存",
                enableApplyButton: false,     
                //maximizable: true, //最大化
                // autoRestore: true,
                autoCloseOnEsc: false,//ESC关闭
                closable:false,
                content: sb,
                onOpen: function () { $.easyui.tooltip.init($("#a1"), { content: "点击下载 谷歌 浏览器！", position: 'top', deltaY: -10, trackMouse: false }); $.easyui.tooltip.init($("#a2"), { content: "点击下载 火狐 浏览器！", position: 'top', deltaY: -10, trackMouse: false }); $.easyui.tooltip.init($("#a3"), { content: "点击下载 欧朋 浏览器！", deltaY: -10, position: 'top', trackMouse: false }); $.easyui.tooltip.init($("#a4"), { content: "点击下载 IE 11.0 浏览器！", deltaY: -10, position: 'top', trackMouse: false }); }
            });
        }
        else
            $("#MaxPanel").css("display", "");       
    }
    else
        $("#MaxPanel").css("display", "");
}

//BrowserScreen
function BrowserScreen() {
    var size;
    if ((screen.width >=1290) && (screen.height >=1080))
        size = "1920 x 1080";
    if ((screen.width == 640) && (screen.height == 480))
        size = "640 x 480";
    else if ((screen.width == 800) && (screen.height == 600))
        size = "800 x 600";
    else if ((screen.width == 1024) && (screen.height == 768))
        size = "1024 x 768";
    else {
        size = "the default 640 x 480";
    }

    alert("经系统检测，你的屏幕分辨率为 " + screen.width + " x "+screen.height);
}

//set style for browser screen
function BrowserScreenSetCss() {
    var EasyuiCss = document.getElementById("EasyuiCss");
    var UserCss = document.getElementById("UserCss");
    var FontSize="12px";
    if ((screen.width >= 1920) && (screen.height >= 1080)) {
        EasyuiCss.setAttribute("href", "/Scripts/jquery-easyui-theme/default/easyui_13.css");
        UserCss.setAttribute("href", "/UserStyle/UserStyle_14.css");
        FontSize="14px"
    }
    else  if ((screen.width > 1280) && (screen.height > 1024)) {
        EasyuiCss.setAttribute("href", "/Scripts/jquery-easyui-theme/default/easyui_13.css");
        UserCss.setAttribute("href", "/UserStyle/UserStyle_13.css");
        FontSize = "13px"
    }
    else if ((screen.width == 640) && (screen.height == 480)) {
        EasyuiCss.setAttribute("href", "/Scripts/jquery-easyui-theme/default/easyui.css");
        UserCss.setAttribute("href", "/UserStyle/UserStyle.css");
        FontSize = "12px"
    }
    else if ((screen.width == 800) && (screen.height == 600)) {
        EasyuiCss.setAttribute("href", "/Scripts/jquery-easyui-theme/default/easyui.css");
        UserCss.setAttribute("href", "/UserStyle/UserStyle.css");
    }
    else if ((screen.width == 1024) && (screen.height == 768)) {
        EasyuiCss.setAttribute("href", "/Scripts/jquery-easyui-theme/default/easyui.css");
        UserCss.setAttribute("href", "/UserStyle/UserStyle.css");
    }
    else {
        EasyuiCss.setAttribute("href", "/Scripts/jquery-easyui-theme/default/easyui.css");
        UserCss.setAttribute("href", "/UserStyle/UserStyle.css");
    }
}


//open window check
function testOpenWin(schtext) {
    if (!schtext == '') {
        var toolswin = window.open(schtext, "", "");
        if (toolswin == null) {
            window.alert("您的浏览器启用弹出窗口过滤功能！");
        }
    }
}

function FindDimensions() 
{
     var scrollHight= document.body.scrollTop;//scroll height
    //width
    if (window.innerWidth)
    winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
    winWidth = document.body.clientWidth;
    //height
    if (window.innerHeight)
    winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
     winHeight = document.body.clientHeight;
    //window size
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
    winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
    }

	var divMask =$("#divMask");
	divMask.css('top',"0");
	divMask.css('left',"0");
	divMask.css('width',winWidth);
	divMask.css('height',winHeight+scrollHight);	
}


function DoWait(){
     MaskWaitDivBond();
     FindDimensions();
   	 DoCenter($("#divWait"));
}

//bond Mask
function MaskWaitDivBond(){
  var scrollHight= document.body.scrollTop;//滚动条高度
  var MaskDiv="<div id='divMask'  style='display:none;z-index:99;width:"+winWidth+";height:"+winHeight+scrollHight+";filter:alpha(opacity=40);position:absolute;background-color:black'></div>";
  var MaskIframe="<iframe id='MaskIframe'  width='100%' height='100%' style='z-index:-1; filter:alpha(opacity=0); position:absolute; TOP:0px;Left:0;border-style:none;'> </iframe>";
  var WaitDiv="<div id='divWait' style='display:none;z-index:99;   position:absolute;border: 0px solid #999999;margin-left: auto;	margin-right: auto;'></div>"
  
  if(document.getElementById("divMask")!="undefined")
  $(MaskDiv).appendTo("body");
  if(document.getElementById("MaskIframe")!="undefined")
  $(MaskIframe).appendTo($("#divMask"));
  if(document.getElementById("WaitDiv")!="undefined")
  $(WaitDiv).appendTo($("body"));
 
}

//set window to center
function DoCenter(obj)
{
    var scrollHight= document.body.scrollTop;//滚动条高度

    var width=obj.attr('offsetWidth');
	var height=obj.attr('offsetHeight');

	var lefter=winWidth/2-width/2;
	var toper=winHeight/2-height/2+scrollHight ;
	obj.css('left',lefter);
	obj.css('top',toper);	 
}
function doThis(obj)
{
    var scrollHight= document.body.scrollTop;//滚动条高度

    var width=obj.attr('offsetWidth');
	var height=obj.attr('offsetHeight');

	var lefter=winWidth/2-width/2;
	var toper=winHeight/2-height/2+scrollHight;
	obj.css('left',lefter);
	obj.css('top',toper);	   
}

 //get url 
 function QueryString(qs){
    var s = location.href;
    s = s.replace("?","?&").split("&");
    var re = "";
    for(i=1;i<s.length;i++)
        if(s[i].indexOf(qs+"=")==0)
            re = s[i].replace(qs+"=","");
    return re;
}

//clear value
function ClearVal()
{
     $("input,select").val("");  
}

//Name:Format date
//Author:Ybf
//Date:2008/11/07
function FormatDateAndTime(str)
{
     var v; 
      if(typeof str == 'string'){
            var dt=null;
            if(typeof str == 'string'){   
            var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);   
            if(results && results.length>3)   
              dt = new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]));    
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);   
            if(results && results.length>6)   
              dt = new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]),parseInt(results[6]));    
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);   
            if(results && results.length>7)   
              dt= new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]),parseInt(results[6]),parseInt(results[7]));    
             } 
             else
             {
             dt=null;  
             } 
             v=dt
      }   
      if(v instanceof Date){   
        var y = v.getFullYear();   
        var m = v.getMonth() + 1;   
        var d = v.getDate();   
        var h = v.getHours();   
        var i = v.getMinutes();   
        var s = v.getSeconds();   
        var ms = v.getMilliseconds();      

        if(m<10 && m.toString().length<2)m="0"+m;
        if(d<10 && d.toString().length<2)d="0"+d;
        if(h<10 && h.toString().length<2)h="0"+h;
        if(i<10 && i.toString().length<2)i="0"+i;
        if(s<10 && s.toString().length<2)s="0"+s;
        if(ms>0) return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s + '.' + ms;   
        if(h>0 || i>0 || s>0) return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;   

        return y + '-' + m + '-' + d;   
      }   
      return '';   

}

//format date
function FormatDate(str){
     var v; 
      if(typeof str == 'string')
      {
            var dt=null;
            if(typeof str == 'string'){   
            var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);   
            if(results && results.length>3)   
              dt = new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]));    
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);   
            if(results && results.length>6)   
              dt = new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]),parseInt(results[6]));    
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);   
            if(results && results.length>7)   
              dt= new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]),parseInt(results[6]),parseInt(results[7]));    
             } 
             else
             {
             dt=null;  
             } 
             v=dt
      }   
      if(v instanceof Date){   
        var y = v.getFullYear();   
        var m = v.getMonth() + 1;   
        var d = v.getDate();   
        if(m<10 && m.toString().length<2)m="0"+m;
        if(d<10 && d.toString().length<2)d="0"+d;
        return y + '-' + m + '-' + d;   
      }   
      return '';   

}

//Get url params
function QueryString(qs){
    var s = location.href;
    s = s.replace("?","?&").split("&");
    var re = "";
    for(i=1;i<s.length;i++)
        if(s[i].indexOf(qs+"=")==0)
            re = s[i].replace(qs+"=","");
    return re;
}

//open window
function OpenWindow(width,height,url){ 
        var width = width;   
        var height = height;   
        var left = parseInt((screen.availWidth/2) - (width/2));//屏幕居中   
        var top = parseInt((screen.availHeight/2) - (height/2));   
        var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,scrollbars,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top; 
        window.open(url,"", windowFeatures);    
} 


//window full
function OpenwinFull(url) {
    var scrWidth=screen.availWidth;
    var scrHeight=screen.availHeight;
    var d, s = "";           //Declare variables.
   d = new Date();                           //Create Date object.
   s += (d.getMonth() + 1);            //Get month
   s += d.getDate() ;                   //Get day
   s += d.getYear();
   s += d.getHours();
   s += d.getMinutes();
   s += d.getSeconds(); 
   window.open(url,"PowerBOS"+s,"resizable=1");
}

function WindowMax() {
    if (window.screen) {  
        var myw = screen.availWidth;  
        var myh = screen.availHeight;   
        window.moveTo(0, 0);          
        window.resizeTo(myw, myh);     
    }
}

//Maximum window 
function OpenWindow2(width,height,url)
{ 
      var left = parseInt((screen.availWidth/2) - (width/2));
      var top = parseInt((screen.availHeight/2) - (height/2));   
      return  window.open(url,'','toolbar=0,scrollbars=1,menubar=0,status=0,resizable=0,height='+height+',width='+width+',left=' + left + ',top=' + top+',screenX='+left+',screenY='+top); 
} 

//Maximum window 
var newOpen3=null;
function OpenWindow3(width,height,url,name)
{ 
      var left = parseInt((screen.availWidth/2) - (width/2));
      var top = parseInt((screen.availHeight/2) - (height/2));   

      newOpen3 =  window.open(url,name,'toolbar=0,scrollbars=1,menubar=0,status=0,resizable=0,height='+height+',width='+width+',left=' + left + ',top=' + top+',screenX='+left+',screenY='+top); 
      newOpen3.focus(); 

} 

//Trim
String.prototype.Trim = function() { return this.replace(/(^\s*)|(\s*$)/g, ""); } 
String.prototype.LTrim = function() { return this.replace(/(^\s*)/g, ""); } 
String.prototype.RTrim = function() { return this.replace(/(\s*$)/g, ""); } 

//Fill form value
function SetFormVal(datas, formname) {

    var parses = FormType(formname);
    var object = parses.toString().split('&');     
    for (key in datas[0]) {
        for (var m = 0; m < object.length; m++) {
            if (cTrim(object[m].split('=')[0].toLowerCase(), 0) == key.toLowerCase()) {
                var datab = "#" + cTrim(object[m].split('=')[0], 0);
                switch (cTrim(object[m].split('=')[1].toLowerCase(), 0)) {
                    case "text":
                        {
                            var oobj = $(datab);

                            if (oobj.attr("class") == "combo") {

                                var vals = datas[0][key]
                               SetComboValueForobj(oobj,vals)

                            }
                            else  if(oobj.attr("class") == "upfile") {                   
                                var vals = datas[0][key]
                               var filename=vals.substring(vals.lastIndexOf('/')+1,vals.length);
                               var path=vals;
                                if(path!="")
                                {
                                         if(typeof( $("#div_"+$(datab).attr("id"))).attr("id")=="undefined")
                                           $(datab).after("　<a href='../.."+path+"' target='_blank' title='"+filename+"'>文件下载</a>");
                                        else
                                           $("#div_"+$(datab).attr("id")).append("<div style='padding-top:5px;float:left'><a href='../.."+path+"' target='_blank' title='"+filename+"'>文件下载</a></div>")
                                 
                                }
                                $(datab).val(filename);     
                                 $("#"+$(datab).attr("id")).attr("path",vals);        
                            }
                            else  if(oobj.attr("class") == "upimage") {                   
                               var vals = datas[0][key]
                               var filename=vals.substring(vals.lastIndexOf('/')+1,vals.length);
                               var path=vals;
                               if(path!=""){
                                 if(typeof( $("#div_"+$(datab).attr("id"))).attr("id")=="undefined"){
                                   $(datab).after(PreviewImag(filename,path));
                                 }
                                 else
                                    $("#div_"+$(datab).attr("id")).append("<div style='padding-top:5px;float:left'>"+PreviewImag(filename,path)+"</div>")
                                 }
                                $(datab).val(filename);          
                                 $("#"+$(datab).attr("id")).attr("path",vals);
                            }
                           else if (oobj.attr("class") == "date") {
                                var vals = datas[0][key]
                                vals = ReplaceAllStr(vals, "/", "-");
                                if (datas[0][key].indexOf(" 0:00:00") > 0) {
                                    $(datab).val(vals.substring(0, datas[0][key].indexOf(" 0:00:00")));
                                }
                                else {
                                    $(datab).val(vals);
                                }
                            }
                            else if (oobj.attr("class") == "datetime") {
                                var vals = datas[0][key]
                                vals = ReplaceAllStr(vals, "/", "-");                               
                                $(datab).val(vals);

                            }
                           else {                              
                               $(datab).val(datas[0][key]);                               
                            }
                            break;
                        }
                    case "checkbox":
                        {
                            if (datas[0][key] == $(datab).val()) {
                                $(datab).attr("checked", true);
                            }
                            break;
                        }
                    case "hidden":
                        {
                            $(datab).val(datas[0][key]);
                            break;
                        }
                    case "textarea":
                        {
                            $(datab).val(datas[0][key]);
                            break;
                        }
                }
            }
        }
    }

}

//get string len
function len(s) 
{ 
    var l = 0; 
    var a = s.split(""); 
    for (var i=0;i<a.length;i++)
    { 
        if (a[i].charCodeAt(0)<299) { 
            l++; 
        } else { 
    
        } 
    } 
    return l; 
} 

//cut string
function CutStr(str,len)
{
    var strlen = 0; 
    var s = "";
    for(var i = 0;i < str.length;i++)
    {
            if(str.charCodeAt(i) > 128)
             strlen += 2;
            else 
            strlen++;
            s += str.charAt(i);
            if(strlen > len) 
            return s + "..";
    }
    return s;
}

//off  
function Offset(e)
{
   var t = e.offsetTop;
   var l = e.offsetLeft;
   var w = e.offsetWidth;
   var h = e.offsetHeight-2;
   while(e=e.offsetParent)
   {
     t+=e.offsetTop;
     l+=e.offsetLeft;
   }
   return {
     top : t,
     left : l,
     width : w,
     height : h
   }
}
 
 //replace string
 function ReplaceAllStr(str, sptr, sptr1) {
     while (str.indexOf(sptr) >= 0) {
         str = str.replace(sptr, sptr1);
     }
     return str;
 }
 

//sInputString  
function cTrim(sInputString,iType)  {   
 var sTmpStr = ' '  
  var i = -1 
     
       if(iType == 0 || iType == 1) 
       {  
        while(sTmpStr == ' ') 
        { 
         ++i  
          sTmpStr = sInputString.substr(i,1)  
          }  
           sInputString = sInputString.substring(i) 
            }  
             if(iType == 0 || iType == 2) 
              {  
              sTmpStr = ' ' 
               i = sInputString.length 
                while(sTmpStr == ' ') 
                 {  
                  --i  
                   sTmpStr = sInputString.substr(i,1)  
                    }
                     sInputString = sInputString.substring(0,i+1)
                 } 
                       return sInputString
}


// close window for IE6,IE7，IE8
function closeWindow() {

    try{
        var _version = $.browser.version;
        if (_version == 6.0) {

            window.opener = null;
            window.close();
        
        } else {             
            try{
                obj = new Object();
                obj.id = "WebBrowser";
                obj.classid = "CLSID:8856F961-340A-11D0-A96B-00C04FD705A2";           
                document.appendChild(obj)
                document.all.WebBrowser.ExecWB(45, 1);
            }
            catch(ex){
                window.opener = null;
                window.open('', '_self');
                window.close();
            }
        }
    }
    catch (ex) {
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
}


// close window for Esc
function EscClose()
{

var  keycode=window.event.keyCode;
var  keyChar=String.fromCharCode(keycode);
if (keycode == 27) {
        window.opener = null;
        window.close();
}
}

//string to date
function ToDate(str){
   if(str!=""){
     var date=new Date(str.split('-')[0],str.split('-')[1],str.split('-')[2])
     return date;
   }
   else{
    return null;
   }
}
//Delete last 
function DelLastStr(str){
   if(str.lastIndexOf(",")>=0)
      return str.substring(0,str.lastIndexOf(","));
   else
      return str;
}
//Delete last 
function DelLastStrFH(str){
   if(str.lastIndexOf(";")>=0)
      return str.substring(0,str.lastIndexOf(";"));
   else
      return str;
}

//data to escape
function DataToEscape(obj) {

    for (var o in obj) {
        obj[o] = escape(obj[o]);
    }

    return obj;
}

//data to encodeURIComponent  
function DataToURIComponent(obj) {

    for (var o in obj) {
        obj[o] = encodeURIComponent(obj[o]);
    }

    return obj;
}

//Grid
function MoveUp(gridid) {
    var row = $("#" + gridid).datagrid('getSelected');
    var index = $("#" + gridid).datagrid('getRowIndex', row);
    mysort(index, 'up', gridid);
}
//move down
function MoveDown(gridid) {
    var row = $("#" + gridid).datagrid('getSelected');
    var index = $("#" + gridid).datagrid('getRowIndex', row);
    mysort(index, 'down', 'gridid');
}
//sort
function mysort(index, type, gridname) {
    if ("up" == type) {
        if (index != 0) {
            var toup = $('#' + gridname).datagrid('getData').rows[index];
            var todown = $('#' + gridname).datagrid('getData').rows[index - 1];
            $('#' + gridname).datagrid('getData').rows[index] = todown;
            $('#' + gridname).datagrid('getData').rows[index - 1] = toup;
            $('#' + gridname).datagrid('refreshRow', index);
            $('#' + gridname).datagrid('refreshRow', index - 1);
            $('#' + gridname).datagrid('selectRow', index - 1);
        }
    } else if ("down" == type) {
        var rows = $('#' + gridname).datagrid('getRows').length;
        if (index != rows - 1) {
            var todown = $('#' + gridname).datagrid('getData').rows[index];
            var toup = $('#' + gridname).datagrid('getData').rows[index + 1];
            $('#' + gridname).datagrid('getData').rows[index + 1] = todown;
            $('#' + gridname).datagrid('getData').rows[index] = toup;
            $('#' + gridname).datagrid('refreshRow', index);
            $('#' + gridname).datagrid('refreshRow', index + 1);
            $('#' + gridname).datagrid('selectRow', index + 1);
        }
    }

}
//tree move up
function TreeGridUpMove(gridid)
{
    var row = $("#" + gridid).treegrid('getSelected');
    $("#" + gridid).treegrid('shiftRow', { id: row["Id"], point: 'up' });
    
}
function TreeGridDownMove(gridid) {
    var row = $("#" + gridid).treegrid('getSelected');
}

function treeLoad()
{
    var treeObj = $.util.parent.navMenu_Tree;
    $("#"+treeObj.id).tree('load', { rod: Math.random() });
}

//Search Menus
function SearchMenus() {

}


/**************************************************Search page -trig **************************************************/
//Close
function Clone() {
    $.messager.alert("……");
}
//Delete
function Delte() {
    $.messager.alert("……");
}
/**************************************************search page -trig **************************************************/

//test search
function searchAll() {
    var data = $("#dg").datagrid("getData");
    if (data.length > 0) {
        $.each(data, function (i, rowData) {
            if ($("#SysSearch_ColumnStr").text() != "") {
                var va = $("#SysSearch_ColumnStr").text() + "," + rowData.field;
                $("#SysSearch_ColumnStr").text(va);
            }
            else {
                var va = rowData.field;
                $("#SysSearch_ColumnStr").text(va);
            }
            if ($("#SysSearch_ColumnTitle").text() != "") {
                if (rowData.notes == "" || rowData == null) {
                    var va = $("#SysSearch_ColumnTitle").text() + "," + rowData.field;
                    $("#SysSearch_ColumnTitle").text(va);
                }
                else {
                    var va = $("#SysSearch_ColumnTitle").text() + "," + rowData.notes;
                    $("#SysSearch_ColumnTitle").text(va);
                }
            }
            else {
                if (rowData.notes == "" || rowData == null) {
                    var va = rowData.field;
                    $("#SysSearch_ColumnTitle").text(va);
                }
                else {
                    var va = rowData.notes;
                    $("#SysSearch_ColumnTitle").text(va);
                }
            }
        })
    }

}


/**************************************************Tran-start**************************************************/
//1.open add form window
function TranAdd(width,height,formid)
{
    //alert(1)
    $.easyui.showDialog({
        title: $(this).linkbutton('options')['text'],
        iconCls: $(this).linkbutton('options')['iconCls'],
        width: 900, height: 600, topMost: false,
        minWidth: 400, minHeight: 300,
        href: "/Main/AddFormTest/FormId=" + formid + "&anticache=" + Math.floor(Math.random() * 1000),//动态加载表单
        //applyButtonText: "按钮a",
        closeButtonText: "取消",
        //applyButtonIconCls: "icon-search",
        enableSaveButton: false,
        saveButtonText: "保存",
        enableApplyButton: false,
        //maximizable: true, 
        // autoRestore: true,
        autoCloseOnEsc: true
    });
}

/**************************************************Tran-end**************************************************/


//open update form window
/*
title:open update form window
iconCls：窗口图标
TableName：主表名
FormId：表单编号
width：宽度（int）
height:高度(int)
Parses:参数（Json）
*/
function ShowFormAdd(title, iconCls, FormId, width, height, Parses) {
    debugger;
    if (typeof Parses == "object")
        Parses = JSON.stringify(Parses);
    $.ajax({
        type: "GET",
        url: "/Main/ShowFormAddEval/",
        data: "FormId=" + FormId + "&title=" + title + "&iconCls=" + iconCls + "&width=" + width + "&height=" + height + "&Type=Add&Parses=" + Parses + "&anticache=" + Math.floor(Math.random() * 1000),
        success: function (msg) {
            debugger;
            try {
                eval(msg);
            }
            catch (exception) {
                eval(msg);
            }


        }
    });
};


//open update form window
/*
title:open update form window
iconCls：窗口图标
TableName：主表名
FormId：表单编号
id：数据编号
width：宽度（int）
height:高度(int)
Parses:参数（Json）
*/
function ShowFormEdit(title, iconCls, TableName, FormId, id, width, height, Parses) {
    if (typeof Parses == "object")
        Parses = JSON.stringify(Parses);

    $.ajax({
        type: "GET",
        url: "/Main/ShowFormEditEval/",
        data: "TableName=" + TableName + "&FormId=" + FormId + "&title=" + title + "&iconCls=" + iconCls + "&width=" + width + "&height=" + height + "&id=" + id + "&Type=Edit&&Parses=" + Parses + "&anticache=" + Math.floor(Math.random() * 1000),
        success: function (msg) {
            debugger;
            try {
                eval(msg);
            }
            catch (exception) {
                eval(msg);
            }


        }
    });
};

//Open add form to tab
function AddFormToWindow(title, iconCls, FormId, width, height, Params) {
    debugger;
    if (typeof Params == "object")
        Params = JSON.stringify(Params);
    ShowFormAdd(title, iconCls, FormId, width, height, Params);
}

//Open update form to tab
function UpdateFormToWindow(title, iconCls, TableName, FormId, id, width, height, Params) {
    debugger;
    if (typeof Params == "object")
        Params = JSON.stringify(Params);
    ShowFormEdit(title, iconCls, TableName, FormId, id, width, height, Params);
}

//Open show form to tab
function ShowFormToWindow(title, iconCls, TableName, FormId, id, width, height, Params) {
    debugger;
    if (typeof Params == "object") {
        Params = JSON.stringify(Params);
        Params=""
    }
    ShowFormEdit(title, iconCls, TableName, FormId, id, width, height, Params);
}

//Open Add Form to tab
function AddFormToTab(title, iconCls, FormId, Params) {
    debugger;
    if (typeof Params == "object") {
        Params = JSON.stringify(Params);
        //Params=""
    }
   window.mainpage.mainTabs.addModule(title,"/Main/Form/?FormId=" + FormId + "&Type=Add&Parses=" + Params);
}
//Open Update Form to tab
function UpdateFormToTab(title, iconCls, FormId, TableName, Id, Params) {
    debugger;
    if (typeof Params == "object") {
        Params = JSON.stringify(Params);
        Params=""
    }
    window.mainpage.mainTabs.addModule(title,"/Main/Form/?TableName=" + TableName + "&FormId=" + FormId + "&id=" + id + "&Type=Edit&&Parses=" + Params);
}
//Open Show Form to tab
function ShowFormToTab(title, iconCls, FormId,TableName, Id, Params) {
    debugger;
    if (typeof Params == "object") {
        Params = JSON.stringify(Params);
        Params=""
    }
    window.mainpage.mainTabs.addModule(title,"/Main/Form/?FormId=" + FormId+ "&id=" + Id + "&Type=Edit&&Parses=" + Params,iconCls, true, true, true, true);
}

//Open Search to Window
function SearchToWindow(title,iconCls,searchId,width,height,Params)
{ debugger;
     if (typeof Params == "object")
        Params = JSON.stringify(Params);
    $.ajax({
        type: "GET",
        url: "/Main/ShowFormEditEval/",
        data: "TableName=" + TableName + "&FormId=" + FormId + "&title=" + title + "&iconCls=" + iconCls + "&width=" + width + "&height=" + height + "&id=" + id + "&Type=Edit&&Parses=" + Params + "&anticache=" + Math.floor(Math.random() * 1000),
        success: function (msg) {
            debugger;
            try {
                eval(msg);
            }
            catch (exception) {
                eval(msg);
            }
        }
    });
}
//Open Search to Tab
function SearchToTab(title, iconCls, searchId,params)
{
     if (typeof Parses == "object")
         Parses = JSON.stringify(Parses);
     debugger;
    window.mainpage.mainTabs.addModule(title, "/Main/Search/?SearchId="+searchId, iconCls, true, true, true, true)
}

//Open Page to Window
function PageToWindow(title,iconCls,pageType,pageId,width,height,params)
{ debugger;
     if (typeof Parses == "object")
        Parses = JSON.stringify(Parses);  
}
//Open Page to Tab
function PageToTab(title, iconCls,pageType, pageId,params)
{
    window.mainpage.mainTabs.addModule(title, '/Main/Page/?pageId=' + pageId, iconCls, true, true, true, true)
}

function GridEditShowText(gridname, editIndex) {

    var grid = $('#' + gridname);
    var columns = grid.datagrid('options')["columns"][0];
    $.each(columns, function (i, n) {
        debugger;
        var field = n["field"];
        var ed = grid.datagrid('getEditor', { index: editIndex, field: field });
        var type = ed.type;

        switch (type) {
            case "combobox":
                var textfield = $(ed.target).combobox('getText');
                grid.datagrid('getRows')[editIndex][field] = textfield;
                break;
            case "comboselector":
                var textfield = $(ed.target).comboselector('getText');
                grid.datagrid('getRows')[editIndex][field] = textfield;
            default:
                break;
        }

    });         
}

//drap
function DropReadMeters_onDragLeave(e, source){}
function DropReadMeters_onDrop(e, source) {}
function DropReadMeters_onDragEnter(e, source) {}
function DropReadMeters_onDragLeave(e, source) {}

//utf16 to utf8
function utf16to8(str) { 
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

//Print 
function Print(templateId, searchId) {
    //get print data
    var printData;
    var Id = "";
    grid = "#SearchGrid" + searchId;
    var obj = $(grid).datagrid("getSelections");
    if (obj.length < 1) {
        $.messager.alert("操作提醒", "请选择一条记录，再进行操作！", "warning");
        return false;
    }
    else if (obj.length > 1) {
        $.messager.alert("操作提醒", "只能请选择一条记录，进行操作！", "warning");
        return false;
    }
    else {
        Id = eval("obj[0]." + $(grid).datagrid("options").columns[0][0].field);
        printData = obj[0];
    }
    $.messager.confirm("操作提示", "您确定要打印吗？", function (n) {
        if (n) {            
            $.ajax({
                url: "/HiWind/LodopPrint",
                type: 'POST',
                dataType: 'text',
                data: { templateId: templateId , data: JSON.stringify(printData)},
                error: function (ex) { debugger;},
                success: function (result) {                    
                    if (result != "" && result != null) {                        
                        eval(result);         
                    }
                }
            });
        }  
    });
}
//add print record
function AddPrintRecord(templateId,printData,printCount) {
    $.ajax({
        url: "/HiWind/AddPrintRecord",
        type: 'POST',
        dataType: 'JSON',
        data: { templateId: templateId, dataId: printData.VehicleQualification_Id, data: JSON.stringify(printData) ,type:'证照',printCount:printCount},
        error: function () {
            $.messager.alert("操作提醒", "打印失败！", "warning");
        },
        success: function (result) {
            if (result != "" && result != null) {
                //debugger;
                $.messager.alert("操作提醒", "打印成功！", "warning");
            }
            else {
                $.messager.alert("操作提醒", "打印失败！", "warning");
            }
        }
    });

}

//get grid data
function GetGridData(searchId) {
    var Id = "";
    grid = "#SearchGrid" + searchId;
    var obj = $(grid).datagrid("getSelections");
    if (obj.length < 1) {
        $.messager.alert("操作提醒", "请选择一条记录，再进行操作！", "warning");
        return false;
    }
    else if (obj.length > 1) {
        $.messager.alert("操作提醒", "只能请选择一条记录，进行操作！", "warning");
        return false;
    }
    else {
        Id = eval("obj[0]." + $(grid).datagrid("options").columns[0][0].field);
        return obj[0];
    }

}
//Print Design
function PrintDesign() {
    LODOP=getLodop(); 
    PrintSet();
    eval(document.getElementById('SysPrintTemplate_Model').value);
    if (LODOP.CVERSION) CLODOP.On_Return = function (TaskID, Value) { document.getElementById('SysPrintTemplate_Model').value = Value; };
    document.getElementById('SysPrintTemplate_Model').value = LODOP.PRINT_DESIGN();
}
//Print Setup
function PrintSetup() {
    LODOP = getLodop();
    PrintSet();
    eval(document.getElementById('SysPrintTemplate_Model').value);
    LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM", true);
	LODOP.SET_SHOW_MODE("HIDE_TOOLS_DESIGN",1); //隐藏整个工具栏
	LODOP.SET_SHOW_MODE("HIDE_GROUND_LOCK",1);  //隐藏纸钉按钮
    if (LODOP.CVERSION) CLODOP.On_Return = function (TaskID, Value) { document.getElementById('SysPrintTemplate_Model').value = Value; };
    document.getElementById('SysPrintTemplate_Model').value = LODOP.PRINT_SETUP();
}
	
//PrintSet
function PrintSet() {   
    var sourcestr = $("#SysPrintTemplate_Model").val();
    //find template name 
    var inita = "LODOP.PRINT_INITA(0,0," + $("#SysPrintTemplate_PageWidth").val() + "," + $("#SysPrintTemplate_PageHeight").val() + ",'" + $("#SysPrintTemplate_Name").val() + "');";
    sourcestr = PrintReplace("LODOP.PRINT_INITA", sourcestr, inita);
    //find background
    var bg = "LODOP.ADD_PRINT_SETUP_BKIMG(\"<img border='0' src='" + $("#SysPrintTemplate_BackgroundImage").euploadify("getValue") + "'>\");";
    sourcestr = PrintReplace("LODOP.ADD_PRINT_SETUP_BKIMG", sourcestr, bg);   
    $("#SysPrintTemplate_Model").val(sourcestr);    
}

//Print replace 
function PrintReplace(regExp,sourcestr,newstr)
{
    var newstring = sourcestr;
    var reg=new RegExp(regExp+"\\(.*?\\);","g");    
    if (reg.test(sourcestr))
        newstring = sourcestr.replace(reg, newstr);
    else
        newstring += newstr;
    return newstring;
}