//首页初始化
$(function () {           
    try {
        //最大化
        WindowMax();
        //初始化HOME
        GetLoginInfo();
        //加载LOGO
        var html = $("#LogionLogs").html("");
        $.ajax({
            type: "POST",
            url: "/Main/SearchList/?SearchId= SysSearch00000013&TableName=SysLogs&rod=" + Math.floor(Math.random() * 1000),
            success: function (datas) {
                var obj = $.string.toObject(datas);
                if (obj.total > 0) {
                    $.each(obj.rows, function (i, n) {
                        if (i < 20) {
                            var html = $("#LogionLogs").html();
                            $("#LogionLogs").html(html + "<ul class=\"portlet-list\">" + n.SysLOGS_Contents + "时间：[" + n.SysLOGS_CreateDate + "]</ul>")
                        }
                    })
                }
            }
        });
        //初始化首页面
        opsTab = { title: "系统主页", href: '/main/HomePage/?ScreenHeight=' + screen.height, iniframe: true, closable: false, refreshable: true, iconCls: "icon-standard-house", repeatable: true, selected: true };
        window.mainpage.mainTabs.addModule(opsTab);
        //禁止选择文本
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

    }
    catch (e) { }
});

(function ($) {
   
    $.util.namespace("mainpage.nav");
    $.util.namespace("mainpage.mainTabs");
    var homePageTitle = "主页", homePageHref = null, navMenuList = "#navMenu_list",
        navMenuTree = "#navMenu_Tree", mainTabs = "#mainTabs", navTabs = "#navTabs",
        mainLayout = "#mainLayout", northPanel = "#northPanel",
        westLayout = "#westLayout", westCenterLayout = "#westCenterLayout", westFavoLayout = "#westFavoLayout",
        westSouthPanel = "#westSouthPanel", homePanel = "#homePanel",
        btnContact = "#btnContact", btnFullScreen = "#btnFullScreen", btnExit = "#btnExit";

    //  按照指定的根节点菜单 id，加载其相应的子菜单树面板数据；该方法定义如下参数：
    //      id: 表示根节点菜单的 id；
    window.mainpage.loadMenu = function (id) {
        $(navMenuList).find("a").attr("disabled", true);
        $.easyui.loading({ locale: westCenterLayout });
        var t = $(navMenuTree), root = $.extend({}, $.array.first(window.mainpage.navMenusData, function (val) { return val.id == id; }));

        $.get("/Main/GetChildrenMenusAuthorization/?parentId=" + id + "&id=rood=" + Math.floor(Math.random() * 1000), function (menus) {
            root.children = menus;
            debugger;
            t.tree("loadData", [root]);
        }, "json");

    };

    //  将指定的根节点数据集合数据加载至左侧面板中“导航菜单”的 ul 控件中；该方法定义如下参数：
    //      callback:  为一个 Function 对象；表示家在完成菜单数据后调用的回调函数
    window.mainpage.loadNavMenus = function (callback) {
        var ul = $(navMenuList).empty();
        $.get("/Main/GetTopMenuAuthorization/?id=rod=" + Math.floor(Math.random() * 1000), function (menus) {
            $.each(window.mainpage.navMenusData = menus = $.array.filter(menus, function (item) {
                return item.disabled ? false : true;
            }), function (i, item) {
                var li = $("<li></li>").appendTo(ul);
                var pp = $("<div></div>").addClass("panel-header panel-header-noborder").appendTo(li);
                var a = $("<a style='font-size:15px'></a>").attr({ href: "javascript:void(0);", target: "_self", style: "font-size:15px" }).hover(function () {
                    a.addClass("tree-node-selected");
                }, function () {
                    if (!a.hasClass("selected")) { $(this).removeClass("tree-node-selected"); }
                }).click(function () {
                    if (a.is(".tree-node-selected.selected") || a.attr("disabled")) { return; }
                    ul.find("a").removeClass("tree-node-selected selected");
                    a.addClass("tree-node-selected selected");
                    window.mainpage.loadMenu(item.id);
                }).appendTo(pp);
                $.data(a[0], "menu-item", item);
                //var span = $("<span></span>").addClass("nav-menu").appendTo(a);
                //$("<span></span>").addClass("nav-menu-icon" + (item.iconCls ? " " + item.iconCls : "")).text(item.text).appendTo(span);
                $("<span class=\"l-btn-left l-btn-icon-left nav-menu\">" +
                    "<span class=\"l-btn-text\">" + (item.text ? item.text : "无名称区域") + "</span>" +
                    "<span class=\"l-btn-icon" + (item.iconCls ? " " + item.iconCls : "") + "\"></span></span>").appendTo(a);
            });
            var layout = $(westLayout), south = layout.layout("panel", "south"), southOpts = south.panel("options");
            southOpts.minHeight = 5 + Math.min(menus.length, 3) * 31;
            southOpts.maxHeight = 5 + menus.length * 31;
            layout.layout("resize");
            if ($.isFunction(callback)) { callback.call(ul, menus); }
        }, "json");
    };

    window.mainpage.instTreeStatus = function (target) {
        var t = $(target), array = t.tree("getRoots");
    };

    //  初始化 westSouthPanel 位置的“导航菜单”区域子菜单 ul 控件(仅初始化 easyui-tree 对象，不加载数据)。
    window.mainpage.instNavTree = function () {
        var t = $(navMenuTree);
        if (t.isEasyUI("tree")) { return; }
        t.tree({
            lines: true,
            toggleMenu: false,
            contextMenu: false,
            autoBindDblClick: true,
            enableContextMenu: true,
            selectOnContextMenu: true,
            toggleOnClick: true,
            dnd: true,
            onDragEnter: function (target, source) { return false },
            onDragEnter: function (target, source) { return false },
            onClick: function (node) {
                window.mainpage.OpenTypeForTree(node);
            },
            onLoadSuccess: function (node, data) {
                $(navMenuList).find("a").removeAttr("disabled");
                window.mainpage.instTreeStatus(t);
                $.easyui.loaded(westCenterLayout);
            },
            onAfterEdit: function (node) { window.mainpage.nav.rename(node.id, node.text); }
        });
    };

    window.mainpage.OpenType = function (node) {

        var hrefobj, type, href;
        var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);

        if (!attrs.href) {
            if (!node.children) {
                $.easyui.messager.alert('操作提醒', '菜单地址定义出错，请检查！')
                return;
            }
        }
        else {
            if (attrs.href.indexOf("{") > -1) {
                hrefobj = $.string.toObject(node.attributes.href);
                type = !hrefobj.type ? "search" : hrefobj.type;
                href = !hrefobj.href ? "" : hrefobj.href;
            }
            else {
                type = "search";
                href = node.attributes.href;
            }
        }
        if (type == "search") {
            window.mainpage.addModuleTab(node);
        }
        else if (type == "form")
            window.mainpage.ShowDg(node);
        else if (type == "FormEdit")
            window.mainpage.ShowDg(node);
        else {
            window.mainpage.addModuleTab(node);
        }
    }
    window.mainpage.OpenTypeForTree = function (node) {

        var hrefobj, type, href;
        var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);

        if (!attrs.href) {
            if (!node.children) {
                $.easyui.messager.alert('操作提醒', '菜单地址定义出错，请检查！')
                return;
            }
        }
        else {
            if (attrs.href.indexOf("{") > -1) {
                hrefobj = $.string.toObject(node.attributes.href);
                type = !hrefobj.type ? "search" : hrefobj.type;
                href = !hrefobj.href ? "" : hrefobj.href;
            }
            else {
                type = "search";
                href = node.attributes.href;
            }
        }
        debugger;
        type = type.toLowerCase();
        if (type == "search") {
            window.mainpage.addModuleTab(node);
        }
        else if (type == "form")
            window.mainpage.ShowDg(node);
        else if (type == "formedit") {
            var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
            if (!opts.href) { return; };
            var hrefobj = eval("(" + attrs.href + ")");
            var title = node.text;
            var iconCls = node.iconCls;
            var TableName = hrefobj.TableName;
            var FormId = hrefobj.FormId;
            var id = hrefobj.Id;
            var Parses = hrefobj.Parses;
            var href = hrefobj.href;
            var width = hrefobj.width;
            var height = hrefobj.height;
            ShowFormEdit(title, iconCls, TableName, FormId, id, width, height, Parses)
        }
        else if (type == "formadd") {
            var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
            if (!opts.href) { return; };
            var hrefobj = eval("(" + attrs.href + ")");
            var title = node.text;
            var iconCls = node.iconCls;
            var TableName = hrefobj.TableName;
            var FormId = hrefobj.FormId;
           // var id = hrefobj.Id;
            var Parses = hrefobj.Parses;
            var href = hrefobj.href;
            var width = hrefobj.width;
            var height = hrefobj.height;
            ShowFormAdd(title, iconCls, FormId, width, height, Parses);
        }
        else if (type == "formtotab") {
            var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
            if (!opts.href) { return; };
            var hrefobj = eval("(" + attrs.href + ")");
            var title = node.text;
            var iconCls = node.iconCls;
            var TableName = hrefobj.TableName;
            var FormId = hrefobj.FormId;
           // var id = hrefobj.Id;
            var Parses = hrefobj.Parses;
            var href = hrefobj.href;
            var width = hrefobj.width;
            var height = hrefobj.height;
            window.mainpage.mainTabs.addModule(title, '/Main/AddFormTest/?FormId=' + FormId, iconCls, false);
        }
        else if (type == "gridtreetotab") {
            var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
            if (!opts.href) { return; };
            var hrefobj = eval("(" + attrs.href + ")");
            var title = node.text;
            var iconCls = node.iconCls;
            var TableName = hrefobj.TableName;
            var FormId = hrefobj.FormId;
           // var id = hrefobj.Id;
            var Parses = hrefobj.Parses;
            var href = hrefobj.href;
            var width = hrefobj.width;
            var height = hrefobj.height;
            window.mainpage.mainTabs.addModule(title, '/Main/AddGridTree/?FormId=' + FormId, iconCls, false);
        }
        else if (type == "js") {
            var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
            if (!opts.href) { return; };
            debugger;
            var hrefobj = eval("(" + attrs.href + ")");
            var script =  hrefobj.script;    
            var Parses ="parses";          
            eval(script);           
        }
        else {
            window.mainpage.addModuleTab(node);
        }
    }

    //  初始化应用程序主界面左侧面板中“导航菜单”的数据，并加载特定的子菜单树数据。
    window.mainpage.instMainMenus = function () {
        window.mainpage.loadNavMenus(function () {
            window.mainpage.instNavTree();
            var selectId = 11;
            if (window.mainpage.navMenusData.length) {
                var list = $(navMenuList).find("a");
                if (!list.length) { return; }
                var menu = list.filter(function () { var item = $.data(this, "menu-item"); return item && item.id == selectId; }),
                    target = menu.length ? menu : list.eq(0);
                target.click();
            }
        });
    };

    window.mainpage.bindToolbarButtonEvent = function () {
        //var searchOpts = $("#topSearchbox").searchbox("options"), searcher = searchOpts.searcher;
        //searchOpts.searcher = function (value, name) {
        //    if ($.isFunction(searcher)) { searcher.apply(this, arguments); }
        //    window.mainpage.search(name, value);
        //};
        $("#btnHideNorth").click(function () { window.mainpage.hideNorth(); });
        var btnShow = $("#btnShowNorth").click(function () { window.mainpage.showNorth(); });
        var l = $(mainLayout), north = l.layout("panel", "north"), panel = north.panel("panel"),
            toolbar = $("#toolbar"), topbar = $("#topbar");
        opts = north.panel("options"), onCollapse = opts.onCollapse, onExpand = opts.onExpand;
        opts.onCollapse = function () {
            if ($.isFunction(onCollapse)) { onCollapse.apply(this, arguments); }
            btnShow.show();
            toolbar.insertBefore(panel).addClass("top-toolbar-topmost");
        };
        opts.onExpand = function () {
            if ($.isFunction(onExpand)) { onExpand.apply(this, arguments); }
            btnShow.hide();
            toolbar.insertAfter(topbar).removeClass("top-toolbar-topmost");
        };


        $(btnFullScreen).click(function () {
            if ($.util.supportsFullScreen) {
                if ($.util.isFullScreen()) {
                    $.util.cancelFullScreen();
                } else {
                    $.util.requestFullScreen();
                }
            } else {
                $.easyui.messager.show("当前浏览器不支持全屏 API，请更换至最新的 Chrome/Firefox/Safari 浏览器或通过 F11 快捷键进行操作。");
            }
        });

        $(btnExit).click(function () {
            UserExit();
        });
    };

    window.mainpage.search = function (value, name) { $.easyui.messager.show($.string.format("您设置的主题为：value: {0}, name: {1}", value, name)); };

    window.mainpage.bindMainTabsButtonEvent = function () {
        $("#mainTabs_jumpHome").click(function () { window.mainpage.mainTabs.jumpHome(); });
        $("#mainTabs_toggleAll").click(function () { window.mainpage.togglePanels(); });
        $("#mainTabs_jumpTab").click(function () { window.mainpage.mainTabs.jumpTab(); });
        $("#mainTabs_closeTab").click(function () { window.mainpage.mainTabs.closeCurrentTab(); });
        $("#mainTabs_closeOther").click(function () { window.mainpage.mainTabs.closeOtherTabs(); });
        $("#mainTabs_closeLeft").click(function () { window.mainpage.mainTabs.closeLeftTabs(); });
        $("#mainTabs_closeRight").click(function () { window.mainpage.mainTabs.closeRightTabs(); });
        $("#mainTabs_closeAll").click(function () { window.mainpage.mainTabs.closeAllTabs(); });
    };

    window.mainpage.bindNavTabsButtonEvent = function () {
        $("#navMenu_refresh").click(function () { window.mainpage.refreshNavTab(); });
        $("#navMenu_Favo").click(function () { window.mainpage.nav.addFavo(); });
        $("#navMenu_Rename").click(function () { window.mainpage.nav.rename(); });
        $("#navMenu_expand").click(function () { window.mainpage.nav.expand(); });
        $("#navMenu_collapse").click(function () { window.mainpage.nav.collapse(); });
        $("#navMenu_collapseCurrentAll").click(function () { window.mainpage.nav.expandCurrentAll(); });
        $("#navMenu_expandCurrentAll").click(function () { window.mainpage.nav.collapseCurrentAll(); });
        $("#navMenu_collapseAll").click(function () { window.mainpage.nav.expandAll(); });
        $("#navMenu_expandAll").click(function () { window.mainpage.nav.collapseAll(); });
    };

    window.mainpage.hideNorth = function () { $(mainLayout).layout("collapse", "north"); };

    window.mainpage.showNorth = function () { $(mainLayout).layout("expand", "north"); };

    window.mainpage.togglePanels = function () { $(mainLayout).layout("toggleAll", "collapse"); };

    //菜单打开窗口中
    window.mainpage.ShowDg = function (node) {

        var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
        if (!opts.href) { return; };

        var hrefobj = eval("(" + attrs.href + ")");
        var href = hrefobj.href;
        var width = hrefobj.width;
        var height = hrefobj.height;

        var dg = $.easyui.showDialog({
            title: opts.text,
            iconCls: opts.iconCls,
            width: hrefobj.width, height: hrefobj.height, topMost: false,
            minWidth: 400, minHeight: 300,
            href: hrefobj.href + "&rod=" + Math.floor(Math.random() * 1000),//动态加载表单
            closeButtonText: "取消",
            enableSaveButton: false,
            saveButtonText: "保存",
            enableApplyButton: false,
            autoCloseOnEsc: true,//ESC关闭
            buttons: [{
                text: "保存表单", iconCls: "icon-save", handler: function (d) { }
            }]
        })

    };

    window.mainpage.ShowDgForStr = function (title, iconCls, href, width, height) {

        var title = title != "" ? title : "";
        var iconCls = iconCls != "" ? iconCls : "";
        var href = href != "" ? href : "";
        var width = width != "" ? parseInt(width) : 600;
        var height = height != "" ? parseInt(height) : 400;

        var dg = $.easyui.showDialog({
            title: title,
            iconCls: iconCls,
            width: width, height: height, topMost: false,
            minWidth: 400, minHeight: 300,
            href: href + "&rod=" + Math.floor(Math.random() * 1000),//动态加载表单
            closeButtonText: "取消",
            enableSaveButton: false,
            saveButtonText: "保存",
            enableApplyButton: false,
            autoCloseOnEsc: true,//ESC关闭
            buttons: [{
                text: "保存表单", iconCls: "icon-save", handler: function (d) { }
            }]
        })

    };

    window.mainpage.addModuleTab = function (node) {
        var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
        if (!opts.href) { return; }

        window.mainpage.mainTabs.addModule(opts);
    };

    //  判断指定的选项卡是否存在于当前主页面的选项卡组中；
    //  返回值：返回的值可能是以下几种：
    //      0:  表示不存在于当前选项卡组中；
    //      1:  表示仅 title 值存在于当前选项卡组中；
    //      2:  表示 title 和 href 都存在于当前选项卡组中；
    window.mainpage.mainTabs.isExists = function (title, href) {
        var t = $(mainTabs), tabs = t.tabs("tabs"), array = $.array.map(tabs, function (val) { return val.panel("options"); }),
            list = $.array.filter(array, function (val) { return val.title == title; }), ret = list.length ? 1 : 0;
        if (ret && $.array.some(list, function (val) { return val.href == href; })) { ret = 2; }
        return ret;
    };

    window.mainpage.mainTabs.tabDefaultOption = {
        title: "新建选项卡", href: "", iniframe: true, closable: true, refreshable: true, iconCls: "icon-standard-application-form", repeatable: true, selected: true
    };
    window.mainpage.mainTabs.parseCreateTabArgs = function (args) {
        var ret = {};
        if (!args || !args.length) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption);
        } else if (args.length == 1) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, typeof args[0] == "object" ? args[0] : { href: args[0] });
        } else if (args.length == 2) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { title: args[0], href: args[1] });
        } else if (args.length == 3) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { title: args[0], href: args[1], iconCls: args[2] });
        } else if (args.length == 4) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { title: args[0], href: args[1], iconCls: args[2], iniframe: args[3] });
        } else if (args.length == 5) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { title: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4] });
        } else if (args.length == 6) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { title: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4], refreshable: args[5] });
        } else if (args.length >= 7) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { title: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4], refreshable: args[5], selected: args[6] });
        }
        return ret;
    };

    window.mainpage.mainTabs.createTab = function (title, href, iconCls, iniframe, closable, refreshable, selected) {

        var t = $(mainTabs), i = 0, opts = window.mainpage.mainTabs.parseCreateTabArgs(arguments);
        while (t.tabs("getTab", opts.title + (i ? String(i) : ""))) { i++; }
        t.tabs("add", opts);
    };

    //  添加一个新的模块选项卡；该方法重载方式如下：
    //      function (tabOption)
    //      function (href)
    //      function (title, href)
    //      function (title, href, iconCls)
    //      function (title, href, iconCls, iniframe)
    //      function (title, href, iconCls, iniframe, closable)
    //      function (title, href, iconCls, iniframe, closable, refreshable)
    //      function (title, href, iconCls, iniframe, closable, refreshable, selected)
    window.mainpage.mainTabs.addModule = function (title, href, iconCls, iniframe, closable, refreshable, selected) {
        var opts = window.mainpage.mainTabs.parseCreateTabArgs(arguments), isExists = window.mainpage.mainTabs.isExists(opts.title, opts.href);
        // if (opts.title == "集中抄表") { opts.iniframe = false; opts.closable = true; opts.href = '/main/SearchPage/?SearchId=SysSearch00000076&TableName=Meter&FormId=asdf' }
        switch (isExists) {
            case 0: window.mainpage.mainTabs.createTab(opts); break;
            case 1: { window.mainpage.mainTabs.closeTab(opts.title); window.mainpage.mainTabs.createTab(opts); break; }//window.mainpage.mainTabs.createTab(opts); break;
            case 2: { window.mainpage.mainTabs.closeTab(opts.title); window.mainpage.mainTabs.createTab(opts); break; }
            default: break;
        }
    };

    window.mainpage.mainTabs.jumeTab = function (which) { $(mainTabs).tabs("select", which); };
    window.mainpage.mainTabs.jumpHome = function () {
        var t = $(mainTabs), tabs = t.tabs("tabs"), panel = $.array.first(tabs, function (val) {
            var opts = val.panel("options");
            return opts.title == homePageTitle && opts.href == homePageHref;
        });
        if (panel && panel.length) {
            var index = t.tabs("getTabIndex", panel);
            t.tabs("select", index);
        }
    }

    window.mainpage.mainTabs.jumpTab = function (which) { $(mainTabs).tabs("jumpTab", which); };
    window.mainpage.mainTabs.closeTab = function (which) { $(mainTabs).tabs("close", which); };
    window.mainpage.mainTabs.closeCurrentTab = function () {
        var t = $(mainTabs), index = t.tabs("getSelectedIndex");
        return t.tabs("closeClosable", index);
    };

    window.mainpage.mainTabs.closeOtherTabs = function (index) {
        var t = $(mainTabs);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeOtherClosable", index);
    };

    window.mainpage.mainTabs.closeLeftTabs = function (index) {
        var t = $(mainTabs);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeLeftClosable", index);
    };

    window.mainpage.mainTabs.closeRightTabs = function (index) {
        var t = $(mainTabs);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeRightClosable", index);
    };

    window.mainpage.mainTabs.closeAllTabs = function () {
        return $(mainTabs).tabs("closeAllClosable");
    };


    window.mainpage.refreshNavTab = function (index) {

        window.mainpage.nav.refreshTree();
    };

    window.mainpage.nav.refreshNav = function () { window.mainpage.instMainMenus(); };

    window.mainpage.nav.refreshTree = function () {
        var menu = $(navMenuList).find("a.tree-node-selected.selected"), item = $.data(menu[0], "menu-item");
        if (item && item.id) { window.mainpage.loadMenu(item.id); }
    };

    window.mainpage.nav.addFavo = function (id) {
        var t = $(navMenuTree), node = arguments.length ? t.tree("find", id) : t.tree("getSelected");
        if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
    };

    window.mainpage.nav.rename = function (id, text) {
        var t = $(navMenuTree), node;
        if (!arguments.length) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
            t.tree("beginEdit", node.target);
        } else { }
    };

    window.mainpage.nav.expand = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expand", node.target);
    };

    window.mainpage.nav.collapse = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapse", node.target);
    };

    window.mainpage.nav.expandCurrentAll = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expandAll", node.target);
    };

    window.mainpage.nav.collapseCurrentAll = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapseAll", node.target);
    };
    window.mainpage.nav.expandAll = function () { $(navMenuTree).tree("expandAll"); };
    window.mainpage.nav.collapseAll = function () { $(navMenuTree).tree("collapseAll"); };

})(jQuery);


//North部分  用户信息显示
function GetLoginInfo() {
        $.ajax({
            type: "POST",
            url: "/Users/GetUserLogin",
            success: function (datas) {
                $("#userinfo").html(datas);
            }
        });
}

//左边导航菜单显示
function LeftMenuShow() {
    if ($("#UserName").val() == "" || $("#PassWord").val() == "" || $("#UserType").val() == "") {
        $.messager.alert('提示', "用户类型、用户名、密码不能为空！");
    }
    else {
        $.ajax({
            type: "POST",
            url: "/Users/UserLogin",
            data: "username=" + $("#UserName").val() + "&PassWord=" + $("#PassWord").val() + "&UserType=" + $("#UserType").val() + "&anticache=" + Math.floor(Math.random() * 1000),
            beforeSend: function (XMLHttpRequest) { $.messager.progress(); },
            // dataType: 'json',
            success: function (datas) {
                var obj = eval('(' + datas + ')');

                if (obj.totalProperty > 0) {
                    closeWindow();
                    OpenwinFull('/main/home');
                }
                else {
                    $.messager.progress('close');
                    $.messager.alert('登录失败', "用户名或密码错误！");
                }
            },
            complete: function (XMLHttpRequest, textStatus) { $.messager.progress('close'); },
            error: function (datas) {
                str = '发生异常，请联系管理员！';//（调试时查看）+result.responseText;
                $.messager.alert('提示', str);
            }
        });
    }
}

//即时通讯
function SignalRJs(MyId) {
    var chat = $.connection.chatHuba;
    var fist = "";
    try {
        //收到此请求，向当前客户端用户发送服务结果 , 如成功显示，则更新消息状态
        chat.client.showMessage = function (MessageType, RceiveUser, SendUser, Info, MsgMessageType, MsgRceiveUser, MsgInfo, MsgId) {

            //$.messager.alert("我的消息 [来自用户:" + SendUser + "],接收对象：[全体在线成员]", MsgInfo, "info");
            if (MsgRceiveUser == "*") {
                if (fist != MsgInfo) {
                    chat.server.updateMessageState(MsgId);
                    if ($("#ContenMsg")[0] == undefined)
                        ShowFormAdd('即时通信', 'icon-hamburg-contact', 'SysForm00000085', 770, 479, "{info:'" + MsgInfo + "'}");
                    else {
                        var oldmsg = $("#ContenMsg").panel('options')["content"];
                        $("#ContenMsg").panel({ content: oldmsg + "：<br><span style='color:#CC0000'>" + MsgInfo + "</span>" });
                    }
                }
                //更新接收情况
                fist = MsgInfo;
            }
            else if (MsgRceiveUser == MyId) {

                //更新接收情况
                if (fist != MsgInfo) {
                    chat.server.updateMessageState(MsgId);
                    if ($("#ContenMsg")[0] == undefined)
                        ShowFormAdd('即时通信', 'icon-hamburg-contact', 'SysForm00000085', 770, 479, "{info:'" + MsgInfo + "'}");
                    else {
                        var oldmsg = $("#ContenMsg").panel('options')["content"];
                        $("#ContenMsg").panel({ content: oldmsg + "：<br><span style='color:#CC0000'>" + MsgInfo + "</span>" });
                    }
                }
                fist = MsgInfo;
            }
        };

        //用户发送短消息时，向服务器提交广播申请
        chat.client.MessageToServer = function () {
            chat.server.sendUser();
        };

        //开启通讯后向服务器报送ID
        // Start Hub
        $.connection.hub.start().done(function () {
            chat.server.getUser(MyId);
        });

        $.connection.hub.start();
    } catch (e) { }
}
