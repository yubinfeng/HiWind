(function ($) {
    var hash = window.location.hash, start = new Date();
    $(function () {
        window.mainpage.instMainMenus();
        window.mainpage.bindNavTabsButtonEvent();
        window.mainpage.bindToolbarButtonEvent();//启用左上按钮
        window.mainpage.bindMainTabsButtonEvent();
        var portal = $("#portal"), layout = $("#mainLayout"), navTabs = $("#navTabs");
        $.util.exec(function () {
            layout.removeClass("hidden").layout("resize");
            $("#maskContainer").remove();
            var size = $.util.windowSize();
            //  判断当浏览器窗口宽度小于像素 1280 时，右侧 region-panel 自动收缩
            if (size.width < 1280) { layout.layout("collapse", "east"); }
            var stop = new Date();
        });  
    });   

})(jQuery);