/*Disclaimer: partial extensions from cjw0511 */
/*
* jQuery EasyUI Generic Plugins Basic Library 1.0 beta
* jQuery EasyUI 通用插件基础库
* jeasyui.extensions.js
* 依赖项：jquery.jdirk.js v1.0 beta late
*/
(function ($, undefined) {

    $.util.namespace("$.easyui");


    $.easyui.getTopEasyuiMessager = function () {
        if ($.util.isUtilTop) { return $.messager; }
        return $.util.$ && $.util.$.messager ? $.util.$.messager : $.messager;
    };
    $.easyui.messager = $.easyui.getTopEasyuiMessager();


    $.easyui.getTopEasyuiTooltip = function () {
        if ($.util.isUtilTop) { return $.fn.tooltip; }
        return $.util.$ && $.util.$.fn && $.util.$.fn.tooltip ? $.util.$.fn.tooltip : $.fn.tooltip;
    };
    $.easyui.tooltip = $.fn.tooltip;

    //  对某个元素设置 easyui-tooltip 属性；该函数定义如下参数：
    //      target:     表示要设置 easyui-tooltip 的元素，可以是一个 jQuery 选择器字符串，也可以是一个 DOM 对象或者 jQuery 对象。
    //      options:    表示初始化 easyui-tooltip 的参数信息，为一个 JSON-Object；
    //  备注：通过该方法设置的 easyui-tooltip 属性，在触发 mouseover 事件时，加载 easyui-tooltip，在 tooltip-tip 隐藏时，easyui-tooltip 自动调用 destroy 销毁；
    $.easyui.tooltip.init = function (target, options) {
        var t = $(target);
        t.mouseover(function () {
            t.tooltip($.extend({ trackMouse: true }, options, {
                onHide: function () {
                    if ($.isFunction(options.onHide)) { options.onHide.apply(this, arguments); }
                    t.tooltip("destroy");
                }
            })).tooltip("show");
        });
    };




    var icons = { "error": "messager-error", "info": "messager-info", "question": "messager-question", "warning": "messager-warning" },
        _show = $.messager.show, _alert = $.messager.alert, _confirm = $.messager.confirm, _prompt = $.messager.prompt,
        defaults = { title: "操作提醒", confirm: "您确认要进行该操作？", prompt: "请输入相应内容：", icon: "info", loading: "正在加载，请稍等..." };

    //  重写 $.messager.show 方法，使其支持图标以及默认的单个字符串参数的重载；该方法定义如下参数：
    //      options:    表示需要弹出消息的内容、图标和方式等信息，该参数类型可以为如下：
    //          JSON Object: 兼容 $.messager.show 官方默认 API 的所有属性，并在此基础上增加如下参数：
    //              icon: 表示弹出消息的图标，为一个 String 类型值，该值可选的内容与 $.messager.alert 方法的第三个参数可选内容相同；
    //                  包括："error", "info", "question", "warning"；
    //                  具体内容参见 $.messager.alert 该方法的官方默认 API 中第三个参数可选内容。
    //              position: 表示弹出消息的位置，为一个 String 类型值，该值可选的内容定义如下：
    //                  topLeft: 屏幕左上角, topCenter: 屏幕上方中间，topRight: 屏幕右上角
    //                  centerLeft: 屏幕左侧中间，center: 屏幕正中间，centerRight: 屏幕右侧中间
    //                  bottomLeft: 屏幕左下角，bottomCenter: 屏幕下方中间，bottomRight: 屏幕右下角
    //          String: 以 icon: "info"、title: "操作提醒"、msg: options 为默认的方式调用上一重载。
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.show = function (options) {
        var isString = $.util.isString(options) || $.util.isBoolean(options) || $.isNumeric(options);
        if (isString) {
            return arguments.length == 1 ? $.messager.show({ msg: String(options) }) : $.messager.show({ title: options, msg: arguments[1], icon: arguments[2], position: arguments[3] });
        }
        var opts = $.extend({}, $.messager.defaults, { title: "操作提醒", timeout: 4000, showType: "slide" }, options),
            position = {
                topLeft: { showType: "show", right: "", left: 0, top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
                topCenter: { showType: "slide", right: "", top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
                topRight: { showType: "show", left: "", right: 0, top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
                centerLeft: { showType: "fade", left: 0, right: "", bottom: "" },
                center: { showType: "fade", right: "", bottom: "" },
                centerRight: { showType: "fade", left: "", right: 0, bottom: "" },
                bottomLeft: { showType: "show", left: 0, right: "", top: "", bottom: -document.body.scrollTop - document.documentElement.scrollTop },
                bottomCenter: { showType: "slide", right: "", top: "", bottom: -document.body.scrollTop - document.documentElement.scrollTop },
                bottomRight: { showType: "show", left: "", right: 0, top: "", bottom: -document.body.scrollTop - document.documentElement.scrollTop }
            };
        opts.style = (opts.position && position[opts.position]) ? position[opts.position] : position.topCenter;
        if (opts.style.showType) {
            opts.showType = opts.style.showType;
        }
        var iconCls = (opts.icon && icons[opts.icon]) ? icons[opts.icon] : icons.info;
        opts.msg = "<div class='messager-icon " + iconCls + "'></div>" + "<div>" + opts.msg + "</div>";
        return _show(opts);
    };
    $.union($.messager.show, _show);

    //  重写 $.messager.alert 方法，使其支持如下的多种重载方式：
    //      function (message)
    //      function (message, callback)
    //      function (title, message, callback)
    //      function (title, message, icon)
    //      function (title, message, icon, callback)
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.alert = function (title, msg, icon, fn) {
        if (arguments.length == 1) { return _alert(defaults.title, arguments[0], defaults.icon); }
        if (arguments.length == 2) {
            if ($.isFunction(arguments[1])) { return _alert(defaults.title, arguments[0], defaults.icon, arguments[1]); }
            if (arguments[1] in icons) { return _alert(defaults.title, arguments[0], arguments[1]); }
            return _alert.apply(this, arguments);
        }
        if (arguments.length == 3) {
            if ($.isFunction(arguments[2])) {
                return (arguments[1] in icons) ? _alert(defaults.title, arguments[0], arguments[1], arguments[2])
                    : _alert(arguments[0], arguments[1], defaults.icon, arguments[2]);
            }
            return _alert.apply(this, arguments);
        }
        return _alert.apply(this, arguments);
    };

    //  重写 $.messager.confirm 方法，使其支持如下的多种重载方式：
    //      function (message)
    //      function (callback)
    //      function (message, callback)
    //      function (title, message)
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.confirm = function (title, msg, fn) {
        if (arguments.length == 1) {
            return $.isFunction(arguments[0]) ? _confirm(defaults.title, defaults.confirm, arguments[0]) : _confirm(defaults.title, arguments[0]);
        }
        if (arguments.length == 2) {
            return $.isFunction(arguments[1]) ? _confirm(defaults.title, arguments[0], arguments[1]) : _confirm(arguments[0], arguments[1]);
        }
        return _confirm.apply(this, arguments);
    };

    //  增加 $.messager.solicit 方法，该方法弹出一个包含三个按钮("是"、"否" 和 "取消")的对话框，点击任意按钮或者关闭对话框时，执行指定的回调函数；
    //      该函数提供如下重载方式：
    //      function (param: object)
    //      function (callback: function)
    //      function (message: string, callback: function)
    //      function (title: string, message: string, callback: function)
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.solicit = function (title, msg, fn) {
        var args = arguments, type = $.type(args[0]),
            opts = $.extend({}, $.messager.solicit.defaults,
                type == "object" ? args[0] : (
                    type == "function" ? { callback: args[0] } : (
                        args.length == 2 ? { message: args[0], callback: args[1] } : { title: args[0], message: args[1], callback: args[2] }
                    )
                )
            ),
            ret = $.messager.confirm(opts.title, opts.message, opts.callback),
            options = ret.window("options"), onClose = options.onClose;
        options.onClose = function () {
            if ($.isFunction(onClose)) { onClose.apply(this, arguments); }
            if ($.isFunction(opts.callback)) { opts.callback.call(this, undefined); }
        };
        var buttons = ret.find(">div.messager-button").empty();
        $("<a class=\"messager-solicit messager-solicit-yes\"></a>").appendTo(buttons).linkbutton({
            text: opts.yesText,
            onClick: function () {
                options.onClose = onClose; ret.window("close");
                if ($.isFunction(opts.callback)) { opts.callback.call(this, true); }
            }
        });
        $("<a class=\"messager-solicit messager-solicit-no\"></a>").appendTo(buttons).linkbutton({
            text: opts.noText,
            onClick: function () {
                options.onClose = onClose; ret.window("close");
                if ($.isFunction(opts.callback)) { opts.callback.call(this, false); }
            }
        });
        $("<a class=\"messager-solicit messager-solicit-cancel\"></a>").appendTo(buttons).linkbutton({
            text: opts.cancelText,
            onClick: function () {
                options.onClose = onClose; ret.window("close");
                if ($.isFunction(opts.callback)) { opts.callback.call(this, undefined); }
            }
        });
        return ret;
    };

    $.messager.solicit.defaults = { title: "操作提醒", message: null, callback: null, yesText: "是", noText: "否", cancelText: "取消" };


    //  重写 $.messager.prompt 方法，使其支持如下的多种重载方式：
    //      function (callback)
    //      function (message, callback)
    //      function (title, message)
    //      function (title, message, callback)
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.prompt = function (title, msg, fn) {
        if (arguments.length == 1) {
            return $.isFunction(arguments[0]) ? _prompt(defaults.title, defaults.prompt, arguments[0]) : _prompt(defaults.title, defaults.prompt);
        }
        if (arguments.length == 2) {
            return $.isFunction(arguments[1]) ? _prompt(defaults.title, arguments[0], arguments[1]) : _prompt(arguments[0], arguments[1]);
        }
        return _prompt.apply(this, arguments);
    };




    //  显示类似于 easyui-datagrid 在加载远程数据时显示的 mask 状态层；该函数定义如下重载方式：
    //      function ()
    //      function (options)，其中 options 为一个格式为 { msg, locale, topMost } 的 JSON-Object；
    //  上述参数中：
    //      msg 表示加载显示的消息文本内容，默认为 "正在加载，请稍等..."；
    //      locale 表示加载的区域，可以是一个 jQuery 对象选择器字符串，也可以是一个 jQuery 对象或者 HTML-DOM 对象；默认为字符串 "body"。
    //      topMost 为一个布尔类型参数，默认为 false，表示是否在顶级页面加载此 mask 状态层。
    //  返回值：返回表示弹出的数据加载框和层的 jQuery 对象。
    $.easyui.loading = function (options) {
        var opts = $.extend({ msg: defaults.loading, locale: "body", topMost: false }, options || {}),
            jq = opts.topMost ? $.util.$ : $,
            locale = jq(opts.locale),
            array = locale.children().map(function () {
                var zindex = $(this).css("z-index");
                return $.isNumeric(zindex) ? parseInt(zindex) : 0;
            }),
            zindex = $.array.max(array.length ? array : [1]);
        if (!locale.is("body")) {
            locale.addClass("mask-container");
        }
        var mask = jq("<div></div>").addClass("datagrid-mask").css({ display: "block", "z-index": zindex += 100 }).appendTo(locale);
        var msg = jq("<div></div>").addClass("datagrid-mask-msg").css({ display: "block", left: "50%", "z-index": ++zindex }).html(opts.msg).appendTo(locale);
        msg.css("marginLeft", -msg.outerWidth() / 2);
        return mask.add(msg);
    };

    //  关闭由 $.easyui.loading 方法显示的 "正在加载..." 状态层；该函数定义如下重载方式：
    //      function ()
    //      function (locale)
    //      function (locale, topMost)
    //      function (topMost, locale)
    //      function (options)，其中 options 为一个格式为 { locale, topMost } 的 JSON-Object
    $.easyui.loaded = function (locale, topMost) {
        var opts = { locale: "body", topMost: false };
        if (arguments.length == 1) {
            if ($.isPlainObject(arguments[0])) {
                $.extend(opts, arguments[0]);
            } else if ($.util.isBoolean(arguments[0])) {
                opts.topMost = arguments[0];
            } else {
                opts.locale = arguments[0];
            }
        }
        if (arguments.length == 2) {
            if ($.util.isBoolean(arguments[0])) {
                $.extend(opts, { locale: arguments[1], topMost: arguments[0] });
            } else {
                $.extend(opts, { locale: arguments[0], topMost: arguments[1] });
            }
        }
        var jq = opts.topMost ? $.util.$ : $, locale = jq(opts.locale);
        locale.removeClass("mask-container");
        locale.children("div.datagrid-mask-msg,div.datagrid-mask").remove();
    };


    //  备注： $.messager 表示当前页面的 easyui-messager 对象；
    //         $.easyui.messager 表示可控顶级页面的 easyui-messager 对象；


    //  更改 jQuery EasyUI 中部分控件的国际化语言显示。
    $.extend($.fn.panel.defaults, { loadingMessage: defaults.loading });
    $.extend($.fn.window.defaults, { loadingMessage: defaults.loading });
    $.extend($.fn.dialog.defaults, { loadingMessage: defaults.loading });

    //  更改 jeasyui-combo 组件的非空验证提醒消息语言。
    $.extend($.fn.combo.defaults, { missingMessage: $.fn.validatebox.defaults.missingMessage });



    //  基于当前页面 document 触发，当前页面嵌套的所有子级和父级页面均执行一个签名为 function (win, e) 事件触发函数；该方法提供如下参数：
    //      eventName:
    //      eventNamespace:
    //      plugin:
    //      callback: 一个签名为 function (win, e) 的函数，其中 win 表示所在 iframe 执行函数传入的 window 对象，e 表示最初触发该循环函数调用的事件对象。
    $.easyui.bindPageNestedFunc = function (eventName, eventNamespace, plugin, callback) {
        if (arguments.length == 3) { callback = plugin; plugin = "jquery"; }
        if (arguments.length == 4 && !plugin) { plugin = "jquery"; }
        $(document).unbind("." + eventNamespace).bind(eventName + "." + eventNamespace, function (e) {
            var doCall = function (win) { callback.call(win, win, e); },
                doCallUp = function (win) {
                    var p = win.parent;
                    try {
                        if (win != p && p.jQuery && p.jQuery.parser && p.jQuery.parser.plugins && p.jQuery.fn && p.jQuery.fn[plugin]) {
                            doCall(p);
                            doCallUp(p);
                        }
                    } catch (ex) { }
                },
                doCallDown = function (win) {
                    var jq = win.jQuery;
                    jq("iframe,iframe").each(function () {
                        try {
                            if (this.contentWindow && jq.util.isObject(this.contentWindow.document) && this.contentWindow.jQuery && this.contentWindow.jQuery.parser && this.contentWindow.jQuery.parser.plugins && this.contentWindow.jQuery.fn && this.contentWindow.jQuery.fn[plugin]) {
                                doCall(this.contentWindow);
                                doCallDown(this.contentWindow);
                            }
                        } catch (ex) { }
                    });
                },
                doCallAll = function (win) {
                    doCall(win);
                    doCallUp(win);
                    doCallDown(win);
                };
            doCallAll(window);
        });
    };



    //  获取或更改 jQuery EasyUI 部分组件的通用错误提示函数；该方法定义如下重载方式：
    //      function():         获取 jQuery EasyUI 部分组件的通用错误提示函数；
    //      function(callback): 更改 jQuery EasyUI 部分组件的通用错误提示函数；
    //  备注：该方法会设置如下组件的 onLoadError 事件；
    //          easyui-form
    //          easyui-combobox
    //          easyui-combotree
    //          easyui-combogrid
    //          easyui-datagrid
    //          easyui-propertygrid
    //          easyui-tree
    //          easyui-treegrid
    //      同时还会设置 jQuery-ajax 的通用错误事件 error。
    $.easyui.ajaxError = function (callback) {
        if (!arguments.length) { return $.fn.form.defaults.onLoadError; }
        $.fn.form.defaults.onLoadError = callback;
        $.fn.panel.defaults.onLoadError = callback;
        $.fn.combobox.defaults.onLoadError = callback;
        $.fn.combotree.defaults.onLoadError = callback;
        $.fn.combogrid.defaults.onLoadError = callback;
        $.fn.datagrid.defaults.onLoadError = callback;
        $.fn.propertygrid.defaults.onLoadError = callback;
        $.fn.tree.defaults.onLoadError = callback;
        $.fn.treegrid.defaults.onLoadError = callback;
        $.ajaxSetup({ error: callback });
    };

    var onLoadError = function (XMLHttpRequest, textStatus, errorThrown) {
        $.messager.progress("close");
        if ($.easyui.messager != $.messager) { $.easyui.messager.progress("close"); }
        if (XMLHttpRequest.status != 404 ) {
            //var msg = (XMLHttpRequest && !$.string.isNullOrWhiteSpace(XMLHttpRequest.responseText) ?
            //        "如果该问题重复出现，请联系您的系统管理员并反馈该故障。<br />" +
            //        "错误号：" + XMLHttpRequest.status + "(" + XMLHttpRequest.statusText + ")；<hr />" + XMLHttpRequest.responseText :
            //        "系统出现了一个未指明的错误，如果该问题重复出现，请联系您的系统管理员并反馈该故障。");

            //var win = $.easyui.messager.alert("错误提醒", msg, "error"),
            //    opts = win.window("options"), panel = win.window("panel"), width = panel.outerWidth(), height = panel.outerHeight();
            //if (width > 800 || height > 800) { win.window("resize", { width: width > 800 ? 800 : width, height: height > 800 ? 800 : height }); }
            //win.window("center");
        }
    };



    //  备份 jquery ajax 方法的默认参数。
    $.easyui.ajaxDefaults = $.extend({}, $.ajaxSettings);

    //  更改 jQuery EasyUI 部分组件的通用错误提示。
    $.easyui.ajaxError(onLoadError);

    //  更改 jQuery.ajax 函数的部分默认属性。
    $.ajaxSetup({
        dataFilter: function (data, type) {
            return String(type).toLowerCase(type) == "json" ? $.string.toJSONString(data) : data;
        }
        //,beforeSend: function (XMLHttpRequest) {
        //    $.easyui.loading({ msg: "正在将请求数据发送至服务器..." });
        //}
        //,complete: function (XMLHttpRequest, textStatus) {
        //    $.easyui.loaded();
        //}
    });





    $.extend({

        //  判断当前 jQuery 对象是否是指定名称的已经初始化好的 easyui 插件；该方法定义如下参数：
        //      selector:   jQuery 对象选择器，或者 DOM 对象，或者 jQuery 对象均可；
        //      pluginName：要判断的插件名称，例如 "panel"、"dialog"、"datagrid" 等；
        //  返回值：如果 selector 所表示的 jQuery 对象中的第一个 DOM 元素为 pluginName 参数所示的 easyui 插件且已经被初始化，则返回 true，否则返回 false。
        isEasyUI: function (selector, pluginName) {
            if (!$.array.contains($.parser.plugins, pluginName)) { $.error($.string.format("传入的参数 pluginName: {0} 不是 easyui 插件名。")); }
            var t = $(selector);
            if (!t.length) { return false; }
            var state = $.data(t[0], pluginName);
            return state && state.options ? true : false;
        }
    });


    $.fn.extend({

        //  判断当前 jQuery 对象是否是指定名称的已经初始化好的 easyui 插件；该方法定义如下参数：
        //      pluginName：要判断的插件名称，例如 "panel"、"dialog"、"datagrid" 等；
        //  返回值：如果当前 jQuery 对象中的第一个 DOM 元素为 pluginName 参数所示的 easyui 插件且已经被初始化，则返回 true，否则返回 false。
        isEasyUI: function (pluginName) {
            return $.isEasyUI(this, pluginName);
        },


        currentPagination: function () {
            var p = this.closest(".pagination");
            while (p.length && !$.data(p[0], "pagination")) { p = p.parent().closest(".pagination"); }
            return p;
        },

        currentProgressbar: function () {
            var p = this.closest(".progressbar");
            while (p.length && !$.data(p[0], "progressbar")) { p = p.parent().closest(".progressbar"); }
            return p;
        },

        currentPanel: function () {
            var p = this.closest(".panel-body");
            while (p.length && !$.data(p[0], "panel")) { p = p.parent().closest(".panel-body"); }
            return p;
        },

        currentTabPanel: function () {
            var p = this.closest(".panel-body"), panel = p.parent(), panels = panel.parent(), container = panels.parent();
            while (p.length && !($.data(p[0], "panel") && panel.hasClass("panel") && panels.hasClass("tabs-panels") && container.hasClass("tabs-container"))) {
                p = p.parent().closest(".panel-body");
                panel = p.parent();
                panels = panel.parent();
                container = panels.parent();
            }
            return p;
        },

        currentTabIndex: function () {
            var panel = this.currentTabPanel();
            return panel.length ? panel.panel("panel").index() : -1;
        },

        currentTabs: function () {
            var p = this.closest(".tabs-container");
            while (p.length && !$.data(p[0], "tabs")) { p = p.parent().closest(".tabs-container"); }
            return p;
        },

        currentAccordion: function () {
            var p = this.closest(".accordion");
            while (p.length && !$.data(p[0], "accordion")) { p = p.parent().closest(".accordion"); }
            return p;
        },

        currentAccPanel: function () {
            var p = this.closest(".panel-body"), panel = p.parent(), container = panels.parent();
            while (p.length && !($.data(p[0], "panel") && panel.hasClass("panel") && container.hasClass("accordion") && $.data(container[0], "accordion"))) {
                p = p.parent().closest(".panel-body");
                panel = p.parent();
                container = panels.parent();
            }
            return p;
        },

        currentLayout: function () {
            var layout = this.closest(".layout");
            while (layout.length && !$.data(layout[0], "layout")) { layout = layout.closest(".layout"); }
            return layout;
        },

        currentRegion: function () {
            var p = this.closest(".panel.layout-panel"), layout = p.parent(), body = p.children(".panel-body");
            while (p.length && !(layout.hasClass("layout") && $.data(body[0], "panel"))) {
                p = p.parent().closest(".panel.layout-panel");
                layout = p.parent();
                body = p.children(".panel-body");
            }
            return body;
        },

        currentLinkbutton: function () {
            var btn = this.closest(".l-btn");
            while (btn.length && !$.data(btn[0], "linkbutton")) { btn = btn.parent().closest(".layout"); }
            return btn;
        },

        currentCalendar: function () {
            var c = this.closest(".calendar");
            while (c.length && !$.data(c[0], "calendar")) { c = c.parent().closest(".calendar"); }
            return c;
        },

        currentWindow: function () {
            var p = this.closest(".panel-body.window-body");
            while (p.length && !$.data(p[0], "window")) { p = p.parent().closest(".panel-body.window-body"); }
            return p;
        },

        currentDialog: function () {
            var p = this.closest(".panel-body.window-body");
            while (p.length && !$.data(p[0], "dialog")) { p = p.parent().closest(".panel-body.window-body"); }
            return p;
        },

        currentDatagrid: function () {
            var p = this.closest(".datagrid-wrap.panel-body"), dg = p.find(">.datagrid-view>:eq(2)");
            while (p.length && !$.data(dg[0], "datagrid")) {
                p = p.parent().closest(".datagrid-wrap.panel-body");
                dg = p.find(">.datagrid-view>:eq(2)");
            }
            return dg;
        },

        currentPropertygrid: function () {
            var p = this.closest(".datagrid-wrap.panel-body"), pg = p.find(">.datagrid-view>:eq(2)");
            while (p.length && !$.data(pg[0], "propertygrid")) {
                p = p.parent().closest(".datagrid-wrap.panel-body");
                pg = p.find(">.datagrid-view>:eq(2)");
            }
            return pg;
        },

        currentTree: function () {
            var t = this.closest(".tree");
            while (t.length && !$.data(t[0], "tree")) { t = t.parent().closest(".tree"); }
            return t;
        },

        currentTreegrid: function () {
            var p = this.closest(".datagrid-wrap.panel-body"), tg = p.find(">.datagrid-view>:eq(2)");
            while (p.length && !$.data(tg[0], "treegrid")) {
                p = p.parent().closest(".datagrid-wrap.panel-body");
                tg = p.find(">.datagrid-view>:eq(2)");
            }
            return tg;
        }
    });

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.progressbar.js" />
/*
* jQuery EasyUI progressbar Extensions 1.0 beta
* jQuery EasyUI progressbar 组件扩展
* jeasyui.extensions.progressbar.js
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($, undefined) {

    $.fn.progressbar.extensions = {};

    function setText(target, text) {
        var t = $(target), opts = t.progressbar("options");
        t.find(".progressbar-text").text(opts.text = text);
    };
    
    var defaults = $.fn.progressbar.extensions.defaults = {};

    var methods = $.fn.progressbar.extensions.methods = {

        //  扩展 easyui-progressbar 的自定义扩展方法；设置当前 easyui-progressbar 控件的 text 值；该方法的参数 text 表示将被设置的 text 值；
        //  返回值：返回表示当前 easyui-progressbar 的 jQuery 链式对象。
        setText: function (jq, text) { return jq.each(function () { setText(this, text); }); }
    };


    $.extend($.fn.progressbar.defaults, defaults);
    $.extend($.fn.progressbar.methods, methods);

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.slider.js" />
/**
* jQuery EasyUI slider Extensions 1.0 beta
* jQuery EasyUI slider 组件扩展
* jeasyui.extensions.slider.js
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($, undefined) {

    $.fn.slider.extensions = {};


    function initialize(target) {
        var t = $(target), state = $.data(target, "slider"), opts = state.options;
        if (!opts._initialized) {
            buildSliderRepair(target);
            opts._initialized = true;
        }
    };

    function buildSliderRepair(target) {
        var t = $(target), state = $.data(target, "slider"), opts = state.options, slider = state.slider;

        slider.find('div.slider-inner').unbind('.slider').bind('mousedown.slider', function (e) {
            if (state.isDragging || opts.disabled) { return; }
            var pos = $(this).offset();
            var value = pos2value(target, (opts.mode == 'h' ? (e.pageX - pos.left) : (e.pageY - pos.top)));
            adjustValue(value);
            opts.onComplete.call(target, opts.value);
        });

        function adjustValue(value) {
            var s = Math.abs(value % opts.step);
            if (s < opts.step / 2) {
                value -= s;
            } else {
                value = value - s + opts.step;
            }
            t.slider("setValue", value);
            //setValue(target, value);
        }

        function pos2value(target, pos) {
            var size = opts.mode == 'h' ? slider.width() : slider.height(),
                value = opts.converter.toValue.call(target, opts.mode == 'h' ? (opts.reversed ? (size - pos) : pos) : (size - pos), size);
            return value.toFixed(0);
        }
    };


    var _enable = $.fn.slider.methods.enable;
    function enable(target) {
        var t = $(target);
        _enable.call(t, t);
        buildSliderRepair(target);
    };

    var _disable = $.fn.slider.methods.disable;
    function disable(target) {
        var t = $(target);
        _disable.call(t, t);
        buildSliderRepair(target);
    };



    var _slider = $.fn.slider;
    $.fn.slider = function (options, param) {
        if (typeof options == "string") {
            return _slider.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "slider") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.slider.parseOptions(this), options);
            _slider.call(jq, opts);
            initialize(this);
        });
    };
    $.union($.fn.slider, _slider);


    var methods = $.fn.slider.extensions.methods = {

        enable: function (jq) { return jq.each(function () { enable(this); }); },

        disable: function (jq) { return jq.each(function () { disable(this); }); }
    };
    var defaults = $.fn.slider.extensions.defaults = {
    };

    $.extend($.fn.slider.defaults, defaults);
    $.extend($.fn.slider.methods, methods);

    //if ($.fn.form && $.isArray($.fn.form.otherList)) {
    //    $.fn.form.otherList.push("slider");
    //    //$.array.insert($.fn.form.otherList, 0, "searchbox");
    //}


    $.extend($.fn.datagrid.defaults.editors, {
        slider: {
            init: function (container, options) {
                return $("<div class=\"datagrid-editable-slider\"></div>").appendTo(container).slider(options);;
            },
            destroy: function (target) {
                $(target).slider("destroy");
            },
            getValue: function (target) {
                return $(target).slider("getValue");
            },
            setValue: function (target, value) {
                $(target).slider("setValue", value);
            },
            resize: function (target, width) {
                $(target).slider("resize", { width: width });
            }
        }
    });


})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.linkbutton.js" />
/**
* jQuery EasyUI linkbutton Extensions 1.0 beta
* jQuery EasyUI linkbutton 组件扩展
* jeasyui.extensions.linkbutton.js
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($, undefined) {

    $.fn.linkbutton.extensions = {};

    function initialize(target) {
        var t = $(target), opts = t.linkbutton("options"),
            exts = opts.extensions ? opts.extensions : opts.extensions = {};
        if (!exts._initialized) {
            setStyle(target, opts.style);
            setTooltip(target, opts.tooltip);
            exts._initialized = true;
        }
    };

    function setIcon(target, iconCls) {
        var t = $(target), opts = t.linkbutton("options"), icon = t.find("span.l-btn-icon");
        if (iconCls) {
            if (icon.length) {
                icon.removeClass(opts.iconCls).addClass(iconCls);
            } else {
                t.find("span.l-btn-text").after("<span class=\"l-btn-icon " + iconCls + "\">&nbsp;</span>");
            }
        } else {
            icon.remove();
        }
        opts.iconCls = iconCls;
    };

    function setText(target, text) {
        var t = $(target), opts = t.linkbutton("options"), textSpan = t.find("span.l-btn-text");
        if (text) {
            textSpan.removeClass("l-btn-empty").text(text);
        } else {
            textSpan.addClass("l-btn-empty").html("&nbsp;");
        }
        opts.text = text;
    };

    function setIconAlign(target, iconAlign) {
        var t = $(target), opts = t.linkbutton("options"), span = t.find(">span");
        span.removeClass("l-btn-icon-left l-btn-icon-right l-btn-icon-top l-btn-icon-bottom").addClass("l-btn-icon-" + iconAlign);
        opts.iconAlign = iconAlign;
    }

    function setStyle(target, style) {
        if (style) {
            $(target).css(style);
        }
    };

    function setTooltip(target, tooltip) {
        var t = $(target), opts = t.linkbutton("options"), isFunc = $.isFunction(tooltip);
        opts.tooltip = tooltip;
        if (opts.tooltip) {
            var topts = { content: !isFunc ? tooltip : null };
            if (isFunc) {
                $.extend(topts, {
                    onShow: function (e) {
                        $(this).tooltip("update", tooltip.call(target, e));
                    }
                });
            }
            t.tooltip(topts);
        }
        if (opts.tooltip == false) {
            t.tooltip("destroy");
        }
    };

    function setPlain(target, plain) {
        var t = $(target), opts = t.linkbutton("options");
        t[(opts.plain = plain ? true : false) ? "addClass" : "removeClass"]("l-btn-plain");
    };

    function setSize(target, size) {
        var t = $(target), opts = t.linkbutton("options");
        t.removeClass("l-btn-small l-btn-large").addClass("l-btn-" + size);
        opts.size = size;
    };



    var _linkbutton = $.fn.linkbutton;
    $.fn.linkbutton = function (options, param) {
        if (typeof options == "string") {
            return _linkbutton.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "linkbutton") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.linkbutton.parseOptions(this), $.parser.parseOptions(this, [
                    "tooltip"
                ]), options);
            _linkbutton.call(jq, opts);
            initialize(this);
        });
    };
    $.union($.fn.linkbutton, _linkbutton);


    var defaults = $.fn.linkbutton.extensions.defaults = {
        //  增加 easyui-linkbutton 控件的自定义属性；表示 linkbutton 按钮的自定义样式。
        style: null,

        //  增加 easyui-linkbutton 控件的自定义属性；表示 linkbutton 按钮鼠标放置提示。
        //      String 类型或 Function 类型，
        tooltip: null
    };

    var methods = $.fn.linkbutton.extensions.methods = {
        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的图标；该方法定义如下参数：
        //      iconCls:    String 类型值，表示要设置的新的图标样式
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setIcon: function (jq, iconCls) { return jq.each(function () { setIcon(this, iconCls); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的文字；该方法定义如下参数：
        //      text:   String 类型值，表示要设置的新的按钮文本内容
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setText: function (jq, text) { return jq.each(function () { setText(this, text); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的图标位置；该方法定义如下参数：
        //      iconAlign:   String 类型值，表示要设置的按钮的图标位置；该参数限定取值 "left"、"right"、"top"、"bottom"
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setIconAlign: function (jq, iconAlign) { return jq.each(function () { setIconAlign(this, iconAlign); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的自定义样式；该方法定义如下参数：
        //      style:   JSON-Object 类型，表示要设置的按钮的样式
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setStyle: function (jq, style) { return jq.each(function () { setStyle(this, style); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的 plain 属性；该方法定义如下参数：
        //      plain:   Boolean 类型，表示要设置的按钮的 plain 属性值
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setPlain: function (jq, plain) { return jq.each(function () { setPlain(this, plain); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的 size 属性；该方法定义如下参数：
        //      size:   String 类型，表示要设置的按钮的 size 属性值；该参数限定取值 'small','large'
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setSize: function (jq, size) { return jq.each(function () { setSize(this, size); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的 tooltip 属性；该方法定义如下参数：
        //      tooltip: String 类型或 Function 类型，表示要设置的按钮的 prompt 属性值；如果该参数值为 false，则表示销毁该按钮的 easyui-tooltip 效果；
        setTooltip: function (jq, tooltip) { return jq.each(function () { setTooltip(this, tooltip); }) }
    };

    $.extend($.fn.linkbutton.defaults, defaults);
    $.extend($.fn.linkbutton.methods, methods);

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.form.js" />
/**
* jQuery EasyUI form Extensions 1.0 beta
* jQuery EasyUI form 组件扩展
* jeasyui.extensions.form.js

*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.validatebox.js v1.0 beta late
*/
(function ($, undefined) {


    $.fn.form.extensions = {};


    function getData(target, param) {
        if (!param) {
            var t = $(target), state = $.data(target, "form"), opts = state ? state.options : $.fn.form.defaults;
            param = opts.serializer;
        }
        return $(target).serializeObject(param);
    };


    var _submit = $.fn.form.methods.submit;
    function submit(target, options) {
        var t = $(target), state = $.data(target, "form"),
            isForm = (/^(?:form)$/i.test(target.nodeName) && state) ? true : false,
            opts = $.extend(
                {}, (state ? state.options : $.fn.form.defaults), (typeof options == "string") ? { url: options } : ($.isFunction(options) ? { success: options } : options || {})
            ),
            loading = function () {
                if (opts.showLoading) {
                    $.easyui.loading({ msg: opts.loadingMessage, locale: opts.loadingLocale });
                }
            },
            loaded = function () {
                if (opts.showLoading) {
                    if (opts.loadedDelay) {
                        $.util.exec(function () { $.easyui.loaded(opts.loadingLocale); }, opts.loadedDelay);
                    } else {
                        $.easyui.loaded(opts.loadingLocale);
                    }
                }
            };

        if (!opts.url) { opts.url = window.location.href; }
        if (isForm) { return _submit.call(t, t, opts); }

        var param = t.form("getData");
        if ($.isFunction(opts.onSubmit) && opts.onSubmit.call(target, param) == false) { return loaded(); }
        var beforeSend = $.ajaxSettings.beforeSend, complete = $.ajaxSettings.complete;
        $.ajax({
            url: opts.url, type: opts.method, data: param,
            success: function (data) {
                if ($.isFunction(opts.success)) { return opts.success.call(target, data); }
            },
            beforeSend: function () {
                var ret = $.isFunction(beforeSend) ? beforeSend.apply(this, arguments) : undefined;
                loading();
                return ret;
            },
            complete: function () {
                var ret = $.isFunction(complete) ? complete.apply(this, arguments) : undefined;
                loaded();
                return ret;
            }
        });

        //$[opts.method](opts.url, param, function (data) { opts.success(data); });
    };

    function load(target, data) {     
        if (!$.data(target, 'form')) {
            $.data(target, 'form', {
                options: $.extend({}, $.fn.form.defaults)
            });
        }
        var t = $(target), opts = $.data(target, 'form').options;

        if (typeof data == 'string') {
            var param = {};
            if (opts.onBeforeLoad.call(target, param) == false) { return; }
            $.ajax({
                url: data, data: param, dataType: 'json', type: opts.method,
                success: function (data) { _load(data); },
                error: function () { opts.onLoadError.apply(target, arguments); }
            });
        } else {
            _load(data);
        }

        function _load(data) {
            for (var name in data) {
                var val = data[name];
                var rr = _checkField(name, val);
                if (!rr.length) {
                    var count = _loadOther(name, val);
                    if (!count) {
                        $.each($.fn.form.valueMarkList, function (i, mark) {
                            $(mark + '[name="' + name + '"]', t).val(val);
                        });
                        $.each($.fn.form.textMarkList, function (i, mark) {
                            $(mark + '[name="' + name + '"]', t).text(val);
                        });
                    }
                }
                _loadCombo(name, val);
            }
            opts.onLoadSuccess.call(target, data);
            t.form("validate");
        }

        /**
		 * check the checkbox and radio fields
		 */
        function _checkField(name, val) {
            var rr = t.find('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]');
            rr._propAttr('checked', false);
            rr.each(function () {
                var f = $(this);
                if (f.val() == String(val) || $.inArray(f.val(), $.isArray(val) ? val : [val]) >= 0) {
                    f._propAttr('checked', true);
                }
            });
            return rr;
        }

        function _loadOther(name, val) {
            var count = 0;
            var pp = $.fn.form.otherList;
            for (var i = 0; i < pp.length; i++) {
                var p = pp[i];
                var f = t.find('[' + p + 'Name="' + name + '"]');
                if (f.length) {
                    f[p]('setValue', val);
                    count += f.length;
                }
            }
            return count;
        }

        function _loadCombo(name, val) {
         
            var cc = $.fn.form.comboList;
            var c = t.find('[comboName="' + name + '"]');
            if (c.length) {
                for (var i = cc.length - 1; i >= 0; i--) {
                    //for (var i = 0; i < cc.length; i++) {
                    var type = cc[i];
                    if (c.hasClass(type + '-f')) {
                        if (c[type]('options').multiple) {
                            /*
                            Author:ybf
                            Data:2015/04/29
                            格式化数据支持combobox multiple                            
                            */                          
                            val= (!$.array.isArray(val)) ? val.split(",").filter(function(t){return t!=""}):val;                            
                            c[type]('setValues', val);
                        } else {
                            c[type]('setValue', val);
                        }
                        return;
                    }
                }
            }
        }
    };


    function clear(target) {
        $($.fn.form.valueMarkList.join(","), target).each(function () {
            var t = this.type, tag = this.tagName.toLowerCase();
            if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea') {
                this.value = '';
            } else if (t == 'file') {
                var file = $(this), newfile = file.clone().insertAfter(file).val('');
                if (file.data('validatebox')) {
                    file.validatebox('destroy');
                    newfile.validatebox();
                } else {
                    file.remove();
                }
            } else if (t == 'checkbox' || t == 'radio') {
                this.checked = false;
            } else if (tag == 'select') {
                this.selectedIndex = -1;
            }
        });

        var t = $(target),
            plugins = $.array.distinct($.array.merge([], $.fn.form.otherList, $.fn.form.spinnerList, $.fn.form.comboList));
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i],
                r = t.find('.' + plugin + '-f');
            if (r.length && $.fn[plugin] && $.fn[plugin]["methods"]) {
                $.util.tryExec(function () {
                    r[plugin]("clear");
                });
            }
        }
        t.form("validate");
    };

    function reset(target) {
        var t = $(target), state = $.data(target, "form"), isForm = /^(?:form)$/i.test(target.nodeName) && state ? true : false;
        if (isForm) {
            target.reset();
        }
        var plugins = $.array.distinct($.array.merge([], $.fn.form.otherList, $.fn.form.spinnerList, $.fn.form.comboList));
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            var r = t.find('.' + plugin + '-f');
            if (r.length && $.fn[plugin] && $.fn[plugin]["methods"]) {
                $.util.tryExec(function () {
                    r[plugin]("reset");
                });
            }
        }
        t.form("validate");
    };


    function validate(target) {
        var t = $(target);

        if ($.fn.validatebox) {
            t.find('.validatebox-text:not(:disabled)').validatebox('validate');
            var invalidbox = t.find('.validatebox-invalid');
            invalidbox.filter(':not(:disabled):first').focus();
            if (invalidbox.length) {
                return false;
            }
        }

        var plugins = $.array.distinct($.array.merge([], $.fn.form.otherList, $.fn.form.spinnerList, $.fn.form.comboList));
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            var r = t.find('.' + plugin + '-f');
            if (r.length && $.fn[plugin] && $.fn[plugin]["methods"]) {
                if ($.util.tryExec(function () { return r[plugin]("isValid"); }) === false) {
                    $.util.tryExec({
                        code: function () { r[plugin]("focus"); },
                        error: function () { r[plugin]("textbox").focus(); },
                        tryError: true
                    });
                    return false;
                }
            }
        }

        return true;
    }

    function setValidation(target, novalidate) {
        var t = $(target);
        t.find('.validatebox-text:not(:disabled)').validatebox(novalidate ? 'disableValidation' : 'enableValidation');

        var plugins = $.array.distinct($.array.merge([], $.fn.form.otherList, $.fn.form.spinnerList, $.fn.form.comboList));
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            var r = t.find('.' + plugin + '-f');
            if (r.length && $.fn[plugin] && $.fn[plugin]["methods"]) {
                $.util.tryExec(function () {
                    r[plugin](novalidate ? 'disableValidation' : 'enableValidation');
                });
            }
        }
    };

    function setFormDisabled(target, disabled, withButton) {
        var t = $(target), state = $.data(target, "form");
        disabled = disabled ? true : false;

        if (state && state.options) { state.disabled = disabled; }
        var cc = withButton ? t.find("input, select, textarea") : t.find("input, select, textarea, button, a.l-btn, .m-btn, .s-btn");
        if (withButton) {
            $.each(cc, function (i, elem) {
                var item = $(elem);
                if (item.is(".s-btn")) {
                    item.splitbutton(disabled ? "disable" : "enable");
                } else if (item.is(".m-btn")) {
                    item.menubutton(disabled ? "disable" : "enable");
                } else if (item.is("a.l-btn")) {
                    item.linkbutton(disabled ? "disable" : "enable");
                } else {
                    disabled ? item.attr("disabled", true) : item.removeAttr("disabled");
                }
            });
        }

        if ($.fn.validatebox) {
            t.find('.validatebox-text').validatebox(disabled ? "disable" : "enable");
        }
        var plugins = $.array.distinct($.array.merge([], $.fn.form.otherList, $.fn.form.spinnerList, $.fn.form.comboList));
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            var r = t.find('.' + plugin + '-f');
            if (r.length && $.fn[plugin] && $.fn[plugin]["methods"]) {
                $.util.tryExec(function () {
                    r[plugin](disabled ? "disable" : "enable");
                });
            }
        }
    };



    var methods = $.fn.form.extensions.methods = {
        //  获取 easyui-form 控件容器内所有表单控件的 JSON 序列化数据；该方法的参数 param 可以定义为如下格式：
        //      1、JSON-Object  ：该对象定义如下属性：
        //          onlyEnabled:    表示返回的结果数据中是否仅包含启用(disabled == false)的 HTML 表单控件；Boolean 类型值，默认为 false。
        //          transcript :    表示当范围内存在重名(name 相同时)的 DOM 元素时，对重复元素的取值规则；
        ///                 这是一个 String 类型值，可选的值限定在以下范围：
        //              cover  :    覆盖方式，只取后面元素 的值，丢弃前面元素的值；默认值；
        //              discard:    丢弃后面元素的值，只取前面元素的值；
        //              overlay:    将所有元素的值进行叠加；
        //          overtype   :    元素叠加方式，当 transcript 的值定义为 "overlay" 时，此属性方有效；
        //                  这是一个 String 类型值，可选的值限定在以下范围：
        //              array  :    将所有重复的元素叠加为一个数组；
        //              append :    将所有的重复元素叠加为一个字符串；默认值；
        //          separator  :    元素叠加的分隔符，定义将所有重名元素叠加为一个字符串时用于拼接字符串的分隔符；
        //                  这是一个 String 类型值，默认为 ","；当 transcript 的值定义为 "overlay" 且 overtype 的值定义为 "append" 时，此属性方有效。
        //      2、String 类型值:   表示当范围内存在重名(name 相同时)的 DOM 元素时，对重复元素的取值规则；
        //              其取值范围和当参数格式为 JSON-Object 时的属性 transcript 一样。
        //  返回值：该方法返回一个 JSON Object，返回对象中的每个数据都表示一个表单控件值。
        getData: function (jq, param) { return getData(jq[0], param); },

        //  重写 easyui-form 控件的 submit 方法，使之除了支持 form 标签提交外，还支持 div 等其他容器标签的提交。
        //      该方法中的参数 options 可以同 easyui-form 的原生方法 submit 参数格式一样；
        //      也可以是一个 String 类型值表示提交的服务器端 url 地址；
        //      也可以是一个 function 回调函数表示 ajax 提交成功后的回调函数；
        submit: function (jq, options) { return jq.each(function () { submit(this, options); }); },

        //  重写 easyui-form 控件的 clear 方法，使其支持扩展的 easyui 插件操作；
        clear: function (jq) { return jq.each(function () { clear(this); }); },

        //  重写 easyui-form 控件的 reset 方法，使其支持扩展的 easyui 插件操作；
        reset: function (jq) { return jq.each(function () { reset(this); }); },

        //  重写 easyui-form 控件的 validate 方法，使其支持扩展的 easyui 插件操作；
        validate: function (jq) { return validate(jq[0]); },

        //  重写 easyui-form 控件的 enableValidation 方法，使其支持扩展的 easyui 插件操作；
        enableValidation: function (jq) { return jq.each(function () { setValidation(this, false); }); },

        //  重写 easyui-form 控件的 disableValidation 方法，使其支持扩展的 easyui 插件操作；
        disableValidation: function (jq) { return jq.each(function () { setValidation(this, true); }); },

        //  增加 easyui-form 控件的自定义方法；启用该表单 DOM 所有子级节点的输入效果(移除所有子级可输入控件的 disabled 效果)
        //  该方法的参数 withButton 表示是否连同表单中的按钮控件(html-button、html-input-button、easyui-menu|linkbutton|menubutton|splitbutton)一并启用；
        enable: function (jq, withButton) { return jq.each(function () { setFormDisabled(this, false, withButton); }); },

        //  增加 easyui-form 控件的自定义方法；禁用该表单 DOM 所有子级节点的输入效果(给所有子级可输入控件增加 disabled 效果)
        //  该方法的参数 withButton 表示是否连同表单中的按钮控件(html-button、html-input-button、easyui-menu|linkbutton|menubutton|splitbutton)一并禁用；
        disable: function (jq, withButton) { return jq.each(function () { setFormDisabled(this, true, withButton); }); },

        //  重写 easyui-form 控件的 load 方法。
        load: function (jq, data) { return jq.each(function () { load(this, data); }); }
    };
    var defaults = $.fn.form.extensions.defaults = {

        method: "post",

        showLoading: true, 
        
        loadingLocale: "body",
        
        loadingMessage: "正在将数据发送至服务器...", 
        
        loadedDelay: 300,

        serializer: { onlyEnabled: true, transcript: "overlay", overtype: "append", separator: "," }
    };

    $.extend($.fn.form.defaults, defaults);
    $.extend($.fn.form.methods, methods);

    $.fn.form.comboList = ['combo', 'datebox', 'datetimebox', 'combogrid', 'combotree', 'combobox'];
    //$.fn.form.comboList = ['combobox', 'combotree', 'combogrid', 'datetimebox', 'datebox', 'combo'];
    $.fn.form.spinnerList = ['timespinner', 'numberspinner', 'spinner'];
    $.fn.form.valueMarkList = ["input", "textarea", "select"];
    $.fn.form.textMarkList = ["span", "label", "div", "p"];
    $.fn.form.otherList = ["numberbox", "slider"];

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.validatebox.js" />
/**
* jQuery EasyUI validatebox Extensions 1.0 beta
* jQuery EasyUI validatebox 组件扩展
* jeasyui.extensions.validatebox.js
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($, undefined) {


    $.fn.validatebox.extensions = {};


    var rules = {
        //  只允许输入英文字母或数字
        engNum: {
            validator: function (value) {
                return /^[0-9a-zA-Z]*$/.test(value);
            },
            message: '请输入英文字母或数字'
        },
        //  只允许汉字、英文字母或数字
        chsEngNum: {
            validator: function (value, param) {
                return /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/.test(value);
            },
            message: '只允许汉字、英文字母或数字。'
        },
        //  只允许汉字、英文字母、数字及下划线
        code: {
            validator: function (value, param) {
                return /^[\u0391-\uFFE5\w]+$/.test(value);
            },
            message: '只允许汉字、英文字母、数字及下划线.'
        },
        //  验证是否为合法的用户名
        name: {
            validator: function (value) { return value.isUserName(); },
            message: "用户名不合法(字母开头，允许6-16字节，允许字母数字下划线)"
        },
        //  指定字符最小长度
        minLength: {
            validator: function (value, param) { return $.string.trim(value).length >= param[0]; },
            message: "最少输入 {0} 个字符."
        },
        //  指定字符最大长度
        maxLength: {
            validator: function (value, param) { return $.string.trim(value).length <= param[0]; },
            message: "最多输入 {0} 个字符."
        },
        //  必须包含指定的内容
        contains: {
            validator: function (value, param) { return $.string.contains(value, param[0]); },
            message: "输入的内容必须包含 {0}."
        },
        //  以指定的字符开头
        startsWith: {
            validator: function (value, param) { return $.string.startsWith(value, param[0]); },
            message: "输入的内容必须以 {0} 作为起始字符."
        },
        //  以指定的字符结束
        endsWith: {
            validator: function (value, param) { return $.string.endsWith(value, param[0]); },
            message: "输入的内容必须以 {0} 作为起始字符."
        },
        //  长日期时间(yyyy-MM-dd hh:mm:ss)格式
        longDate: {
            validator: function (value) { return $.string.isLongDate(value); },
            message: "输入的内容必须是长日期时间(yyyy-MM-dd hh:mm:ss)格式."
        },
        //  短日期(yyyy-MM-dd)格式
        shortDate: {
            validator: function (value) { return $.string.isShortDate(value); },
            message: "输入的内容必须是短日期(yyyy-MM-dd)格式."
        },
        //  长日期时间(yyyy-MM-dd hh:mm:ss)或短日期(yyyy-MM-dd)格式
        date: {
            validator: function (value) { return $.string.isDate(value); },
            message: "输入的内容必须是长日期时间(yyyy-MM-dd hh:mm:ss)或短日期(yyyy-MM-dd)格式."
        },
        //  电话号码(中国)格式
        tel: {
            validator: function (value) { return $.string.isTel(value); },
            message: "输入的内容必须是电话号码(中国)格式."
        },
        //  移动电话号码(中国)格式
        mobile: {
            validator: function (value) { return $.string.isMobile(value); },
            message: "输入的内容必须是移动电话号码(中国)格式."
        },
        //  电话号码(中国)或移动电话号码(中国)格式
        telOrMobile: {
            validator: function (value) { return $.string.isTelOrMobile(value); },
            message: "输入的内容必须是电话号码(中国)或移动电话号码(中国)格式."
        },
        //  传真号码(中国)格式
        fax: {
            validator: function (value) { return $.string.isFax(value); },
            message: "输入的内容必须是传真号码(中国)格式."
        },
        //  邮政编码(中国)格式
        zipCode: {
            validator: function (value) { return $.string.isZipCode(value); },
            message: "输入的内容必须是邮政编码(中国)格式."
        },
        //  必须包含中文汉字
        existChinese: {
            validator: function (value) { return $.string.existChinese(value); },
            message: "输入的内容必须是包含中文汉字."
        },
        //  必须是纯中文汉字
        chinese: {
            validator: function (value) { return $.string.isChinese(value); },
            message: "输入的内容必须是纯中文汉字."
        },
        //  必须是纯英文字母
        english: {
            validator: function (value) { return $.string.isEnglish(value); },
            message: "输入的内容必须是纯英文字母."
        },
        //  必须是合法的文件名(不能包含字符 \\/:*?\"<>|)
        fileName: {
            validator: function (value) { return $.string.isFileName(value); },
            message: "输入的内容必须是合法的文件名(不能包含字符 \\/:*?\"<>|)."
        },
        //  必须是正确的 IP地址v4 格式
        ip: {
            validator: function (value) { return $.string.isIPv4(value); },
            message: "输入的内容必须是正确的 IP地址v4 格式."
        },
        //  必须是正确的 url 格式
        url: {
            validator: function (value) { return $.string.isUrl(value); },
            message: "输入的内容必须是正确的 url 格式."
        },
        //  必须是正确的 IP地址v4 或 url 格式
        ipurl: {
            validator: function (value) { return $.string.isUrlOrIPv4(value); },
            message: "输入的内容必须是正确的 IP地址v4 或 url 格式."
        },
        //  必须是正确的货币金额(阿拉伯数字表示法)格式
        currency: {
            validator: function (value) { return $.string.isCurrency(value); },
            message: "输入的内容必须是正确的货币金额(阿拉伯数字表示法)格式."
        },
        //  必须是正确 QQ 号码格式
        qq: {
            validator: function (value) { return $.string.isQQ(value); },
            message: "输入的内容必须是正确 QQ 号码格式."
        },
        //  必须是正确 MSN 账户名格式
        msn: {
            validator: function (value) { return $.string.isMSN(value); },
            message: "输入的内容必须是正确 MSN 账户名格式."
        },
        unNormal: {
            validator: function (value) { return $.string.isUnNormal(value); },
            message: "输入的内容必须是不包含空格和非法字符Z."
        },
        //  必须是合法的汽车车牌号码格式
        carNo: {
            validator: function (value) { return $.string.isCarNo(value); },
            message: "输入的内容必须是合法的汽车车牌号码格式."
        },
        //  必须是合法的汽车发动机序列号格式
        carEngineNo: {
            validator: function (value) { return $.string.isCarEngineNo(value); },
            message: "输入的内容必须是合法的汽车发动机序列号格式."
        },
        //  必须是合法的身份证号码(中国)格式
        idCard: {
            validator: function (value) { return $.string.isIDCard(value); },
            message: "输入的内容必须是合法的身份证号码(中国)格式."
        },
        //  必须是合法的整数格式
        integer: {
            validator: function (value) { return $.string.isInteger(value); },
            message: "输入的内容必须是合法的整数格式."
        },
        //  必须是合法的整数格式且值介于 {0} 与 {1} 之间
        integerRange: {
            validator: function (value, param) {
                return $.string.isInteger(value) && ((param[0] || value >= param[0]) && (param[1] || value <= param[1]));
            },
            message: "输入的内容必须是合法的整数格式且值介于 {0} 与 {1} 之间."
        },
        //  必须是指定类型的数字格式
        numeric: {
            validator: function (value, param) { return $.string.isNumeric(value, param ? param[0] : undefined); },
            message: "输入的内容必须是指定类型的数字格式."
        },
        //  必须是指定类型的数字格式且介于 {0} 与 {1} 之间
        numericRange: {
            validator: function (value, param) {
                return $.string.isNumeric(value, param ? param[2] : undefined) && ((param[0] || value >= param[0]) && (param[1] || value <= param[1]));
            },
            message: "输入的内容必须是指定类型的数字格式且介于 {0} 与 {1} 之间."
        },
        //  必须是正确的 颜色(#FFFFFF形式) 格式
        color: {
            validator: function (value) { return $.string.isColor(value); },
            message: "输入的内容必须是正确的 颜色(#FFFFFF形式) 格式."
        },
        //  必须是安全的密码字符(由字符和数字组成，至少 6 位)格式
        password: {
            validator: function (value) { return $.string.isSafePassword(value); },
            message: "输入的内容必须是安全的密码字符(由字符和数字组成，至少 6 位)格式."
        },
        //  输入的字符必须是指定的内容相同
        equals: {
            validator: function (value, param) {
                var val = param[0], type = param[1];
                if (type) {
                    switch (String(type).toLowerCase()) {
                        case "jquery":
                        case "dom":
                            val = $(val).val();
                            break;
                        case "id":
                            val = $("#" + val).val();
                            break;
                        case "string":
                        default:
                            break;
                    }
                }
                return value === val;
            },
            message: "输入的内容不匹配."
        },
        /*以下为异步校验*/
        remote: {
            validator: function (value, url) {
                debugger;
                var BuildID=$("#House_BuildID").comboselector("getValue");
                var Hunit = $("#House_Hunit").val();
                var Doorplate = $("#House_Doorplate").val();
                url = url + "House_BuildID=" + BuildID + "&House_Hunit=" + Hunit + "&House_Doorplate=" + Doorplate;
                $.post(url + "", { name: value }, function (data) {
                    if (data == "1") {
                        flag = true;
                        $.data(document.body, "flag", flag);
                    } else if (data == "0") {
                        flag = false;
                        $.data(document.body, "flag", flag);
                    }
                });
                return $.data(document.body, "flag");
            },
            message: "当前楼层单元已存在相同的门牌号码，门牌号不能重复!"
        }
    };
    $.extend($.fn.validatebox.defaults.rules, rules);




    function initialize(target) {
        var t = $(target);
        var opts = t.validatebox("options");
        if (!opts._initialized) {
            t.addClass("validatebox-f").change(function () {
                opts.value = $(this).val();
                if ($.isFunction(opts.onChange)) {
                    opts.onChange.call(target, opts.value);
                }
            });
            opts.originalValue = opts.value;
            if (opts.value) {
                setValue(target, opts.value);
            }
            if (opts.width && !t.parent().is("span.combo,span.spinner,span.searchbox")) {
                resize(target, opts.width);
            }
            setPrompt(target, opts.prompt, opts);
            if (opts.autoFocus) {
                $.util.exec(function () { t.focus(); });
            }
            if (!opts.autovalidate) {
                t.validatebox("disableValidation").validatebox("enableValidation");
            }
            setDisabled(target, opts.disabled);
            opts._initialized = true;
        }
    };

    function setPrompt(target, prompt, opts) {
        var t = $(target);
        opts = opts || t.validatebox("options");
        opts.prompt = prompt;
        if ($.html5.testProp("placeholder", t[0].nodeName)) {
            t.attr("placeholder", prompt);
        } else {
            if (!$.isFunction(opts.promptFocus)) {
                opts.promptFocus = function () {
                    if (t.hasClass("validatebox-prompt")) {
                        t.removeClass("validatebox-prompt");
                        if (t.val() == opts.prompt) { t.val(""); }
                    }
                };
                t.focus(opts.promptFocus);
            }
            if (!$.isFunction(opts.promptBlur)) {
                opts.promptBlur = function () {
                    if ($.string.isNullOrEmpty(t.val())) { t.addClass("validatebox-prompt").val(opts.prompt); }
                }
                t.blur(opts.promptBlur);
            }
            if ($.string.isNullOrEmpty(t.val()) && !$.string.isNullOrEmpty(opts.prompt)) {
                $.util.exec(function () {
                    t.addClass("validatebox-prompt").val(opts.prompt);
                });
            }
        }
    }

    var _validate = $.fn.validatebox.methods.isValid;
    function validate(target) {
        var t = $(target);
        if (t.hasClass("validatebox-prompt")) {
            t.removeClass("validatebox-prompt").val("");
        }
        return _validate.call(t, t);
    };


    function setValue(target, value) {
        var t = $(target), opts = t.validatebox("options"), val = t.val();
        if (val != value) {
            t.val(opts.value = (value ? value : ""));
        }
        validate(target);
    };

    function getValue(target) {
        return $(target).val();
    };

    function clear(target) {
        var t = $(target), opts = t.validatebox("options");
        t.validatebox("setValue", "");
    };

    function reset(target) {
        var t = $(target), opts = t.validatebox("options");
        t.validatebox("setValue", opts.originalValue ? opts.originalValue : "");
    };

    function resize(target, width) {
        var t = $(target), opts = t.validatebox("options");
        t._outerWidth(opts.width = width);
    };

    function setDisabled(target, disabled) {
        var t = $(target), state = $.data(target, "validatebox");
        if (disabled) {
            if (state && state.options) { state.options.disabled = true; }
            t.attr("disabled", true);
        } else {
            if (state && state.options) { state.options.disabled = false; }
            t.removeAttr("disabled");
        }
    };


    var _validatebox = $.fn.validatebox;
    $.fn.validatebox = function (options, param) {
        if (typeof options == "string") {
            return _validatebox.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "validatebox") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.validatebox.parseOptions(this), $.parser.parseOptions(this, [
                    "prompt", { autoFocus: "boolean" }
                ]), options);
            opts.value = opts.value || jq.val();
            _validatebox.call(jq, opts);
            initialize(this);
        });
    };
    $.union($.fn.validatebox, _validatebox);


    var methods = $.fn.validatebox.extensions.methods = {
        //  扩展 easyui-validatebox 的自定义扩展方法；设置当前 easyui-validatebox 控件的 prompt 值；该方法的参数 prompt 表示将被设置的 prompt 值；
        //  返回值：返回表示当前 easyui-validatebox 的 jQuery 链式对象。
        setPrompt: function (jq, prompt) { return jq.each(function () { setPrompt(this, prompt); }); },

        //  重写 easyui-validatebox 的原生方法；以支持相应扩展功能或属性。
        //  返回值：返回表示当前 easyui-validatebox 的 jQuery 链式对象。
        validate: function (jq) { return jq.each(function () { validate(this); }) },

        //  重写 easyui-validatebox 的原生方法；以支持相应扩展功能或属性。
        isValid: function (jq) { return validate(jq[0]); },

        setValue: function (jq, value) { return jq.each(function () { setValue(this, value); }); },

        getValue: function (jq) { return getValue(jq[0]); },

        clear: function (jq) { return jq.each(function () { clear(this); }); },

        reset: function (jq) { return jq.each(function () { reset(this); }); },

        resize: function (jq, width) { return jq.each(function () { resize(this, width); }); },

        enable: function (jq) { return jq.each(function () { setDisabled(this, false); }); },

        disable: function (jq) { return jq.each(function () { setDisabled(this, true); }); }
    };
    var defaults = $.fn.validatebox.extensions.defaults = {
        //  增加 easyui-validatebox 的扩展属性 prompt，该属性功能类似于 easyui-searchbox 的 prompt 属性。
        //  表示该验证输入框的提示文本；String 类型值，默认为 null。
        prompt: null,

        //  增加 easyui-validatebox 的扩展属性 autoFocus，该属性表示在当前页面加载完成后，该 easyui-validatebox 控件是否自动获得焦点。
        //  Boolean 类型值，默认为 false。
        autoFocus: false,

        //  增加 easyui-validatebox 的扩展属性 value，表示其初始化时的值
        value: null,

        //  增加 easyui-validatebox 的扩展属性 width，表示其初始化时的宽度值
        width: null,

        //  增加 easyui-validatebox 的扩展属性 autovalidate，表示是否在该控件初始化完成后立即进行一次验证；默认为 true。
        autovalidate: true,

        //  增加 easyui-validatebox 的扩展属性 disabled，表示该控件在初始化完成后是否设置其为禁用状态(disabled)；默认为 false。
        disabled: false,

        //  增加 easyui-validatebox 的扩展事件 onChange，表示输入框在值改变时所触发的事件
        onChange: function (value) { }
    };

    $.extend($.fn.validatebox.defaults, defaults);
    $.extend($.fn.validatebox.methods, methods);


    if ($.fn.form && $.isArray($.fn.form.otherList)) {
        $.fn.form.otherList.push("validatebox");
        //$.array.insert($.fn.form.otherList, 0, "validatebox");
    }



    //  修改 jQuery 本身的成员方法 val；使之支持 easyui-validatebox 的扩展属性 prompt。
    var core_val = $.fn.val;
    $.fn.val = function (value) {
        if (this.length > 0 && this.is(".validatebox-text.validatebox-prompt") && !$.html5.testProp("placeholder", this[0].nodeName)) {
            var val, opts = this.validatebox("options");
            if (arguments.length == 0) {
                val = core_val.apply(this, arguments);
                return val == opts.prompt ? "" : val;
            }
            if (value && value != opts.prompt) {
                this.removeClass("validatebox-prompt");
            }
        }
        return core_val.apply(this, arguments);
    };


})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.combo.js" />
/**
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($, undefined) {

    $.fn.combo.extensions = {};

    function setPrompt(target, prompt) {
        var t = $(target), opts = t.combo("options"), textbox = t.combo("textbox");
        opts.prompt = prompt;
        textbox.validatebox("setPrompt", prompt);
    };

    function setIcon(target, iconCls) {
        var t = $(target), state = $.data(target, "combo"), combo = state.combo;
        var arrow = combo.find("span.combo-arrow").removeAttr("class").addClass("combo-arrow");
        if (iconCls) { arrow.addClass(iconCls); }
        t.combo("options").iconCls = iconCls;
    }

    function setRequired(target, required) {
        var t = $(target), opts = t.combo("options"), textbox = t.combo("textbox");
        opts.required = textbox.validatebox("options").required = required;
    };

    var _destroy = $.fn.combo.methods.destroy;
    function destroy(target) {
        var t = $(target), opts = t.combo("options");
        if ($.isFunction(opts.onBeforeDestroy) && opts.onBeforeDestroy.call(target) == false) { return; }
        _destroy.call(target, t);
        if ($.isFunction(opts.onDestroy)) { opts.onDestroy.call(target); }
    };

    function getCombo(target) {
        return $.data(target, "combo").combo;
    };


    var _setValues = $.fn.combo.methods.setValues;
    function setValues(target, values) {
        var t = $(target), opts = t.combo("options");
        if (!opts.nullable && $.array.isNullOrEmpty(values)) {
            values = [null];
        }
        return _setValues.call(t, t, values);
    };

    function clear(target) {
        var state = $.data(target, "combo"), opts = state.options, combo = state.combo;
        if (opts.multiple) {
            combo.find("input.combo-value" + (opts.nullable ? "" : ":gt(0)")).remove();
        }
        combo.find("input.combo-value,input.combo-text").val("");
    };




    function initialize(target) {
        var t = $(target), state = $.data(target, "combo"),
            opts = t.combo("options"), panel = state.panel,
            combo = state.combo, //arrow = combo.find(".combo-arrow"),
            exts = opts.extensions ? opts.extensions : opts.extensions = {};
        if (!exts._initialized) {
            t.combo("textbox").focus(function () {
                if (opts.autoShowPanel && panel.is(":hidden")) { t.combo("showPanel"); }
            });
            if (opts.iconCls) { t.combo("setIcon", opts.iconCls); }
            //combo判断是空值时，赋值 ybf 2014-5-29
            if (!opts.nullable && $.array.isNullOrEmpty(opts.value)){t.combo("setValues", [null]);}
            //end
            if ($.util.browser.msie && combo._outerWidth() != opts.width) {
                $.util.exec(function () { t.combo("resize", opts.width); });
            }
            exts._initialized = true;
        }
    }


    var _combo = $.fn.combo;
    $.fn.combo = function (options, param) {
        if (typeof options == "string") {
            return _combo.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "combo") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.combo.parseOptions(this), $.parser.parseOptions(this, [
                    "iconCls", { autoShowPanel: "boolean" }
                ]), options);
            _combo.call(jq, opts);
            initialize(this);
        });
    };
    $.union($.fn.combo, _combo);


    var defaults = $.fn.combo.extensions.defaults = {
        //  增加 easyui-combo 的自定义扩展属性；表示该 combo 组件的 iconCls 图标样式类；
        //  String 类型值，默认为 null。
        iconCls: null,

        //  增加 easyui-combo 的自定义扩展属性；表示该 combox 组件是否在 textbox 文本显示框获取焦点时自动执行 showPanel 方法显示下拉 panel 面板；
        //  Boolean 类型值，默认为 true。
        autoShowPanel: true,

        //  增加 easyui-combo 的自定义扩展属性；表示该 combox 组件是否允许值为 Null。
        //  注意：nullable 值为 true 时，表示当该 combo 组件没有值(例如执行 clear 方法后，或者 setValue/setValues 设置为的值为 null/undefined/空数组 后)时，
        //      该组件内的所有 input:hidden.combo-value DOM标签将会被清空。
        //      而当 nullable 的值设置为 false 时，在该 combo 组件没有值时，也会保留一个值为空字符串("")的 input:hidden.combo-value DOM标签。
        //  Boolean 类型值，默认为 true。
        nullable: true,

        onBeforeDestroy: function () { },

        onDestroy: function () { }
    };

    var methods = $.fn.combo.extensions.methods = {
        //  扩展 easyui-combo 组件的自定义方法；用于设置 easyui-combo 控件的右侧显示图标，该方法定义如下参数：
        //      iconCls:    String 类型的值，表示需要设置的图标的 css 类样式名，例如 "icon-ok", "icon-save"
        //  返回值：返回表示当前 easyui-combo 控件的 jQuery 链式对象。
        setIcon: function (jq, iconCls) { return jq.each(function () { setIcon(this, iconCls); }); },

        //  扩展 easyui-combo 组件的自定义方法；用于设置启用或者禁用 easyui-combo 控件的表单验证功能，该方法定义如下参数：
        //      required:   Boolean 类型的值，表示启用或者禁用 easyui-combo 控件的表单验证功能。
        //  返回值：返回表示当前 easyui-combo 控件的 jQuery 链式对象。
        setRequired: function (jq, required) { return jq.each(function () { setRequired(this, required); }); },

        //  扩展 easyui-combo 组件的自定义方法；用于设置该 combo 的 textbox 输入框的 prompt(输入提示文字) 值；该方法定义如下参数：
        //      prompt: String 类型值，表示要被设置的 prompt 值；
        //  返回值：返回表示当前 easyui-combo 控件的 jQuery 链式对象。
        setPrompt: function (jq, prompt) { return jq.each(function () { setPrompt(this, prompt); }); },

        destroy: function (jq) { return jq.each(function () { destroy(this); }); },

        combo: function (jq) { return getCombo(jq[0]); },

        //  重写 easyui-combo 组件的 setValues 方法，以支持相应扩展功能。
        setValues: function (jq, values) { return jq.each(function () { setValues(this, values); }); },

        //  重写 easyui-combo 组件的 setValues 方法，以支持相应扩展功能。
        clear: function (jq) { return jq.each(function () { clear(this); }); }
    };
    $.extend($.fn.combo.defaults, defaults);
    $.extend($.fn.combo.methods, methods);





    //  下面这段代码实现即使在跨 IFRAME 的情况下，一个 WEB-PAGE 中也只能同时显示一个 easyui-combo panel 控件。
    $.easyui.bindPageNestedFunc("mousedown", "jdirkCombo", "combo", function (win, e) {
        var jq = win.jQuery, p = jq(e.target).closest("span.combo,div.combo-p");
        if (p.length) {
            jq(p).find(".combo-f").each(function () {
                var panel = jq(this).combo("panel");
                if (panel.is(":visible")) {
                    panel.panel("close");
                }
            });
            if (e.target && e.target.ownerDocument == win.document) {
                return;
            }
        }
        jq("body>div.combo-p>div.combo-panel:visible").panel("close");
    });


})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.combobox.js" />
/**
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.combo.js v1.0 beta late
*/
(function ($, undefined) {


    $.fn.combobox.extensions = {};


    function getItem(target) {
        var t = $(target), opts = t.combobox("options"),
            value = t.combobox("getValue"), data = t.combobox("getData");
        return $.array.first(data, function (val) { return val[opts.valueField] == value; });
    };

    function getItems(target) {
        var t = $(target), opts = t.combobox("options"),
            values = t.combobox("getValues"), data = t.combobox("getData");
        return $.array.filter(data, function (val) {
            return $.array.contains(values, val[opts.valueField]);
        });
    };





    var loader = function (param, success, error) {
        var opts = $(this).combobox('options');
        if (!opts.url) return false;
        if (opts.queryParams) {
            var p = $.util.parseMapFunction(opts.queryParams);
            param = $.extend({}, param, p);
        }
        $.ajax({
            type: opts.method,
            url: opts.url,
            data: param,
            dataType: 'json',
            success: function (data) {
                success(data);
            },
            error: function () {
                error.apply(this, arguments);
            }
        });
    };

    function load(target, param) {
        var t = $(target);
        if (!param) { return; }
        if (typeof param === "string") { return t.combobox("reload", param); }
        var opts = t.combobox("options");
        opts.queryParams = param;
        t.combobox("reload");
    }

    var defaults = $.fn.combobox.extensions.defaults = {

        //  增加 easyui-combobox 控件默认参数 queryParams；该参数表示从远程服务器调取数据时发送的额外查询参数；该参数应该定义为一个 JSON 对象。
        //  默认为 null。
        queryParams: null,

        //  重新定义 easyui-combobox 控件的默认属性 loader，使之能处理 queryParams 参数。
        loader: loader
    };

    var methods = $.fn.combobox.extensions.methods = {

        //  增加 easyui-combobox 控件的 load 方法；该方法用于以指定的参数查询重新加载远程数据；该方法定义如下参数：
        //      param:  可选；参数类型可以如下：
        //          String: 
        //          JSON Object: 表示要发送至远程服务器查询数据的参数。
        load: function (jq, param) { return jq.each(function () { load(this, param); }); },

        //  扩展 easyui-combobox 的自定义方法；该方法用于获取当前选择了的项；
        //  返回值：返回一个 JSON-Object，该 JSON-Object 为当前 easyui-combobox 数据源中的一个子项，包含 idField 和 textField 的值；
        //      如果当前 easyui-combobox 没有选中任何值，则返回 null。
        getItem: function (jq) { return getItem(jq[0]); },

        //  扩展 easyui-combobox 的自定义方法；该方法用于获取当前选择了的所有项集合；
        //  返回值：返回一个 Array，数组中的每个元素都是一个 JSON-Object 为当前 easyui-combobox 数据源中的一个子项，包含 idField 和 textField 的值；
        //      如果当前 easyui-combobox 没有选中任何值，则返回一个空数组。
        getItems: function (jq) { return getItems(jq[0]); }
    };

    $.extend($.fn.combobox.defaults, defaults);
    $.extend($.fn.combobox.methods, methods);

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.menu.js" />
/**
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($, undefined) {

    /**
    * initialize the target menu, the function can be invoked only once
    */
    function init(target) {
        var t = $(target).appendTo('body').addClass('menu-top');

        //$(document).unbind('.menu').bind('mousedown.menu', function (e) {
        //    //			var allMenu = $('body>div.menu:visible');
        //    //			var m = $(e.target).closest('div.menu', allMenu);
        //    var m = $(e.target).closest('div.menu,div.combo-p');
        //    if (m.length) { return }
        //    $('body>div.menu-top:visible').menu('hide');
        //});

        var menus = splitMenu(t);
        for (var i = 0; i < menus.length; i++) {
            createMenu(menus[i]);
        }

        function splitMenu(menu) {
            var menus = [];
            menu.addClass('menu');
            menus.push(menu);
            if (!menu.hasClass('menu-content')) {
                menu.children('div').each(function () {
                    var submenu = $(this).children('div');
                    if (submenu.length) {
                        submenu.insertAfter(target);
                        this.submenu = submenu; 	// point to the sub menu
                        var mm = splitMenu(submenu);
                        menus = menus.concat(mm);
                    }
                });
            }
            return menus;
        }

        function createMenu(menu) {
            var wh = $.parser.parseOptions(menu[0], ['width', 'height']);
            menu[0].originalHeight = wh.height || 0;
            if (menu.hasClass('menu-content')) {
                menu[0].originalWidth = wh.width || menu._outerWidth();
            } else {
                menu[0].originalWidth = wh.width || 0;
                menu.children('div').each(function () {
                    var item = $(this);
                    //var itemOpts = $.extend({}, $.parser.parseOptions(this, ['name', 'iconCls', 'href', { separator: 'boolean' }]), {
                    //    disabled: (item.attr('disabled') ? true : undefined)
                    //});
                    //  注释掉上三行代码，并添加了下三行代码，以实现获取 menu-item 的属性 hideOnClick，该参数表示是否在点击菜单项后菜单自动隐藏
                    var itemOpts = $.extend({ hideOnClick: true }, $.parser.parseOptions(this, ['name', 'iconCls', 'href', { hideOnClick: 'boolean', separator: 'boolean' }]), {
                        disabled: (item.attr('disabled') ? true : undefined)
                    });
                    if (itemOpts.separator) {
                        item.addClass('menu-sep');
                    }
                    if (!item.hasClass('menu-sep')) {
                        item[0].itemName = itemOpts.name || '';
                        item[0].itemHref = itemOpts.href || '';

                        //  添加了下一行代码，以实现将 menu-item 的 hideOnClick 绑定到菜单项上
                        item[0].hideOnClick = (itemOpts.hideOnClick == undefined || itemOpts.hideOnClick == null ? true : itemOpts.hideOnClick);

                        var text = item.addClass('menu-item').html();
                        item.empty().append($('<div class="menu-text"></div>').html(text));
                        if (itemOpts.iconCls) {
                            $('<div class="menu-icon"></div>').addClass(itemOpts.iconCls).appendTo(item);
                        }
                        if (itemOpts.disabled) {
                            setDisabled(target, item[0], true);
                        }
                        if (item[0].submenu) {
                            $('<div class="menu-rightarrow"></div>').appendTo(item); // has sub menu
                        }

                        bindMenuItemEvent(target, item);
                    }
                });
                $('<div class="menu-line"></div>').prependTo(menu);
            }
            setMenuWidth(target, menu);
            menu.hide();

            bindMenuEvent(target, menu);
        }
    }

    function setMenuWidth(target, menu) {
        var opts = $.data(target, 'menu').options;
        var style = menu.attr('style') || '';
        menu.css({
            display: 'block',
            left: -10000,
            height: 'auto',
            overflow: 'hidden'
        });

        var el = menu[0];
        var width = el.originalWidth || 0;
        if (!width) {
            width = 0;
            menu.find('div.menu-text').each(function () {
                if (width < $(this)._outerWidth()) {
                    width = $(this)._outerWidth();
                }
                $(this).closest('div.menu-item')._outerHeight($(this)._outerHeight() + 2);
            });
            width += 40;
        }

        width = Math.max(width, opts.minWidth);
        var height = el.originalHeight || menu.outerHeight();
        var lineHeight = Math.max(el.originalHeight, menu.outerHeight()) - 2;
        menu._outerWidth(width)._outerHeight(height);
        menu.children('div.menu-line')._outerHeight(lineHeight);

        //		menu._outerWidth(Math.max((menu[0].originalWidth || 0), width, opts.minWidth));
        //		
        //		menu.children('div.menu-line')._outerHeight(menu.outerHeight());

        style += ';width:' + el.style.width + ';height:' + el.style.height;

        menu.attr('style', style);
    }

    /**
    * bind menu event
    */
    function bindMenuEvent(target, menu) {
        var state = $.data(target, 'menu');
        menu.unbind('.menu').bind('mouseenter.menu', function () {
            if (state.timer) {
                clearTimeout(state.timer);
                state.timer = null;
            }
        }).bind('mouseleave.menu', function () {
            if (state.options.hideOnUnhover) {
                state.timer = setTimeout(function () {
                    hideAll(target);
                }, 100);
            }
        });
    }

    /**
    * bind menu item event
    */
    function bindMenuItemEvent(target, item) {
        if (!item.hasClass('menu-item')) { return }
        item.unbind('.menu');
        item.bind('click.menu', function () {
            var t = $(this);
            if (t.hasClass('menu-item-disabled')) {
                return;
            }
            // only the sub menu clicked can hide all menus
            if (!this.submenu) {
                //hideAll(target);
                //  注释掉上面一行代码，并添加下面一行代码，以实现当 menu-item 的属性 hideOnClick 为 false 的情况下，点击菜单项不自动隐藏菜单控件。
                if (this.hideOnClick) { hideAll(target); }

                var href = t.attr('href');
                if (href) {
                    location.href = href;
                }
            }
            var item = $(target).menu('getItem', this);
            $.data(target, 'menu').options.onClick.call(target, item);
        }).bind('mouseenter.menu', function (e) {
            // hide other menu
            item.siblings().each(function () {
                if (this.submenu) {
                    hideMenu(this.submenu);
                }
                $(this).removeClass('menu-active');
            });
            // show this menu
            item.addClass('menu-active');

            if ($(this).hasClass('menu-item-disabled')) {
                item.addClass('menu-active-disabled');
                return;
            }

            var submenu = item[0].submenu;
            if (submenu) {
                $(target).menu('show', {
                    menu: submenu,
                    parent: item
                });
            }
        }).bind('mouseleave.menu', function (e) {
            item.removeClass('menu-active menu-active-disabled');
            var submenu = item[0].submenu;
            if (submenu) {
                if (e.pageX >= parseInt(submenu.css('left'))) {
                    item.addClass('menu-active');
                } else {
                    hideMenu(submenu);
                }

            } else {
                item.removeClass('menu-active');
            }
        });
    }

    /**
    * hide top menu and it's all sub menus
    */
    function hideAll(target) {
        var state = $.data(target, 'menu');
        if (state) {
            if ($(target).is(':visible')) {
                hideMenu($(target));
                state.options.onHide.call(target);
            }
        }
        return false;
    }

    /**
    * show the menu, the 'param' object has one or more properties:
    * left: the left position to display
    * top: the top position to display
    * menu: the menu to display, if not defined, the 'target menu' is used
    * parent: the parent menu item to align to
    * alignTo: the element object to align to
    */
    function showMenu(target, param) {
        var left, top;
        param = param || {};
        var menu = $(param.menu || target);
        if (menu.hasClass('menu-top')) {
            var opts = $.data(target, 'menu').options;
            $.extend(opts, param);
            left = opts.left;
            top = opts.top;
            if (opts.alignTo) {
                var at = $(opts.alignTo);
                left = at.offset().left;
                top = at.offset().top + at._outerHeight();
                if (opts.align == 'right') {
                    left += at.outerWidth() - menu.outerWidth();
                }
            }
            if (left + menu.outerWidth() > $(window)._outerWidth() + $(document)._scrollLeft()) {
                left = $(window)._outerWidth() + $(document).scrollLeft() - menu.outerWidth() - 5;
            }
            if (left < 0) { left = 0; }
            if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
                top = $(window)._outerHeight() + $(document).scrollTop() - menu.outerHeight() - 5;
            }
        } else {
            var parent = param.parent;	// the parent menu item
            left = parent.offset().left + parent.outerWidth() - 2;
            if (left + menu.outerWidth() + 5 > $(window)._outerWidth() + $(document).scrollLeft()) {
                left = parent.offset().left - menu.outerWidth() + 2;
            }
            var top = parent.offset().top - 3;
            if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
                top = $(window)._outerHeight() + $(document).scrollTop() - menu.outerHeight() - 5;
            }
        }
        menu.css({ left: left, top: top });
        menu.show(0, function () {
            if (!menu[0].shadow) {
                menu[0].shadow = $('<div class="menu-shadow"></div>').insertAfter(menu);
            }
            menu[0].shadow.css({
                display: 'block',
                zIndex: $.fn.menu.defaults.zIndex++,
                left: menu.css('left'),
                top: menu.css('top'),
                width: menu.outerWidth(),
                height: menu.outerHeight()
            });
            menu.css('z-index', $.fn.menu.defaults.zIndex++);
            if (menu.hasClass('menu-top')) {
                $.data(menu[0], 'menu').options.onShow.call(menu[0]);
            }
        });
    }

    function hideMenu(menu) {
        if (!menu) return;

        hideit(menu);
        menu.find('div.menu-item').each(function () {
            if (this.submenu) {
                hideMenu(this.submenu);
            }
            $(this).removeClass('menu-active');
        });

        function hideit(m) {
            m.stop(true, true);
            if (m[0].shadow) {
                m[0].shadow.hide();
            }
            m.hide();
        }
    }

    function findItem(target, text) {
        var result = null;
        var tmp = $('<div></div>');
        function find(menu) {
            menu.children('div.menu-item').each(function () {
                var item = $(target).menu('getItem', this);
                var s = tmp.empty().html(item.text).text();
                if (text == $.trim(s)) {
                    result = item;
                } else if (this.submenu && !result) {
                    find(this.submenu);
                }
            });
        }
        find($(target));
        tmp.remove();
        return result;
    }

    function setDisabled(target, itemEl, disabled) {
        var t = $(itemEl);
        if (!t.hasClass('menu-item')) { return }

        if (disabled) {
            t.addClass('menu-item-disabled');
            if (itemEl.onclick) {
                itemEl.onclick1 = itemEl.onclick;
                itemEl.onclick = null;
            }
        } else {
            t.removeClass('menu-item-disabled');
            if (itemEl.onclick1) {
                itemEl.onclick = itemEl.onclick1;
                itemEl.onclick1 = null;
            }
        }
    }

    function appendItem(target, param) {
        var menu = $(target);
        if (param.parent) {
            if (!param.parent.submenu) {
                var submenu = $('<div class="menu"><div class="menu-line"></div></div>').appendTo('body');
                submenu.hide();
                param.parent.submenu = submenu;
                $('<div class="menu-rightarrow"></div>').appendTo(param.parent);
            }
            menu = param.parent.submenu;
        }
        if (param.separator) {
            var item = $('<div class="menu-sep"></div>').appendTo(menu);
        } else {
            var item = $('<div class="menu-item"></div>').appendTo(menu);
            $('<div class="menu-text"></div>').html(param.text).appendTo(item);
        }
        if (param.iconCls) $('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(item);
        if (param.id) item.attr('id', param.id);
        if (param.name) { item[0].itemName = param.name }
        if (param.href) { item[0].itemHref = param.href }
        if (param.onclick) {
            if (typeof param.onclick == 'string') {
                item.attr('onclick', param.onclick);
            } else {
                item[0].onclick = eval(param.onclick);
            }
        }
        if (param.handler) { item[0].onclick = eval(param.handler) }
        if (param.disabled) { setDisabled(target, item[0], true) }

        bindMenuItemEvent(target, item);
        bindMenuEvent(target, menu);
        setMenuWidth(target, menu);
    }

    function removeItem(target, itemEl) {
        function removeit(el) {
            if (el.submenu) {
                el.submenu.children('div.menu-item').each(function () {
                    removeit(this);
                });
                var shadow = el.submenu[0].shadow;
                if (shadow) shadow.remove();
                el.submenu.remove();
            }
            $(el).remove();
        }
        removeit(itemEl);
    }

    function destroyMenu(target) {
        $(target).children('div.menu-item').each(function () {
            removeItem(target, this);
        });
        if (target.shadow) target.shadow.remove();
        $(target).remove();
    }

    $.fn.menu = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.menu.methods[options](this, param);
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'menu');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'menu', {
                    options: $.extend({}, $.fn.menu.defaults, $.fn.menu.parseOptions(this), options)
                });
                init(this);
            }
            $(this).css({
                left: state.options.left,
                top: state.options.top
            });
        });
    };

    $.fn.menu.methods = {
        options: function (jq) {
            return $.data(jq[0], 'menu').options;
        },
        show: function (jq, pos) {
            return jq.each(function () {
                showMenu(this, pos);
            });
        },
        hide: function (jq) {
            return jq.each(function () {
                hideAll(this);
            });
        },
        destroy: function (jq) {
            return jq.each(function () {
                destroyMenu(this);
            });
        },
        /**
		 * set the menu item text
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	text: string, the new text
		 * }
		 */
        setText: function (jq, param) {
            return jq.each(function () {
                $(param.target).children('div.menu-text').html(param.text);
            });
        },
        /**
		 * set the menu icon class
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	iconCls: the menu item icon class
		 * }
		 */
        setIcon: function (jq, param) {
            return jq.each(function () {
                $(param.target).children('div.menu-icon').remove();
                if (param.iconCls) {
                    $('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(param.target);
                }
            });
        },
        /**
		 * get the menu item data that contains the following property:
		 * {
		 * 	target: DOM object, the menu item
		 *  id: the menu id
		 * 	text: the menu item text
		 * 	iconCls: the icon class
		 *  href: a remote address to redirect to
		 *  onclick: a function to be called when the item is clicked
		 * }
		 */
        getItem: function (jq, itemEl) {
            var t = $(itemEl);
            var item = {
                target: itemEl,
                id: t.attr('id'),
                text: $.trim(t.children('div.menu-text').html()),
                disabled: t.hasClass('menu-item-disabled'),
                //				href: t.attr('href'),
                //				name: t.attr('name'),
                name: itemEl.itemName,
                href: itemEl.itemHref,
                //  增加下面一行代码，使得通过 getItem 方法返回的 menu-item 中包含其 hideOnClick 属性
                hideOnClick: itemEl.hideOnClick,
                onclick: itemEl.onclick
            }
            var icon = t.children('div.menu-icon');
            if (icon.length) {
                var cc = [];
                var aa = icon.attr('class').split(' ');
                for (var i = 0; i < aa.length; i++) {
                    if (aa[i] != 'menu-icon') {
                        cc.push(aa[i]);
                    }
                }
                item.iconCls = cc.join(' ');
            }
            return item;
        },
        findItem: function (jq, text) {
            return findItem(jq[0], text);
        },
        /**
		 * append menu item, the param contains following properties:
		 * parent,id,text,iconCls,href,onclick
		 * when parent property is assigned, append menu item to it
		 */
        appendItem: function (jq, param) {
            return jq.each(function () {
                appendItem(this, param);
            });
        },
        removeItem: function (jq, itemEl) {
            return jq.each(function () {
                removeItem(this, itemEl);
            });
        },
        enableItem: function (jq, itemEl) {
            return jq.each(function () {
                setDisabled(this, itemEl, false);
            });
        },
        disableItem: function (jq, itemEl) {
            return jq.each(function () {
                setDisabled(this, itemEl, true);
            });
        }
    };

    $.fn.menu.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, ['left', 'top', { minWidth: 'number', hideOnUnhover: "boolean" }]));
    };

    $.fn.menu.defaults = {
        zIndex: 110000,
        left: 0,
        top: 0,
        alignTo: null,
        align: 'left',
        minWidth: 120,
        hideOnUnhover: true,	// Automatically hides the menu when mouse exits it
        onShow: function () { },
        onHide: function () { },
        onClick: function (item) { }
    };









    //  下面这段代码实现即使在跨 IFRAME 的情况下，一个 WEB-PAGE 中也只能同时显示一个 easyui-menu 控件。
    $.easyui.bindPageNestedFunc("mousedown", "jdirkMenu", "menu", function (win, e) {
        var jq = win.jQuery,
            allMenu = jq("body>div.menu:visible"),
            m = jq(e.target).closest('div.menu', allMenu);
        if (m.length) { return }
        jq('body>div.menu-top:visible').menu('hide');
    });




    var buildMenu = function (options) {
        var menu = $("<div></div>").appendTo("body"),
            opts = $.extend({}, $.fn.menu.defaults, {
                left: window.event ? window.event.clientX : 0,
                top: window.event ? window.event.clientY : 0,
                hideOnUnhover: false,
                slideOut: false, autoDestroy: true,
                items: null, hideDisabledMenu: false, minWidth: 140
            }, options || {});
        opts.items = $.util.likeArrayNotString(opts.items) ? opts.items : [];
        if (opts.id) { menu.attr("id", opts.id); }
        if (opts.name) { menu.attr("name", opts.name); }
        if (!opts.items.length) { opts.items.push({ text: "当前无菜单项", disabled: true }); }
        $.each(opts.items, function (i, item) {
            if (opts.hideDisabledMenu && item.disabled) { return; } appendItemToMenu(menu, item, menu);
        });
        return { menu: menu, options: opts };
    };

    var appendItemToMenu = function (menu, item, menus) {
        if ($.util.isString(item) && $.array.contains(["-", "—", "|"], $.trim(item))) {
            $("<div></div>").addClass("menu-sep").appendTo(menu);
            return;
        }
        item = $.extend({
            id: null, text: null, iconCls: null, href: null, disabled: false,
            onclick: null, handler: null, bold: false, style: null,
            children: null, hideDisabledMenu: false, hideOnClick: true
        }, item || {});
        var onclick = item.onclick, handler = item.handler;
        item.onclick = undefined; item.handler = undefined;
        item = $.util.parseMapFunction(item);
        item.onclick = onclick; item.handler = handler;
        if (item.hideDisabledMenu && item.disabled) { return; }
        var itemEle = $("<div></div>").attr({
            iconCls: item.iconCls, href: item.href, disabled: item.disabled, hideOnClick: item.hideOnClick
        }).appendTo(menu);
        if (item.id) { itemEle.attr("id", item.id); }
        if (item.style) { itemEle.css(item.style); }
        if ($.isFunction(item.handler)) {
            var handler = item.handler;
            item.onclick = function (e, item, menus) { handler.call(this, e, item, menus); };
        }
        if ($.isFunction(item.onclick)) {
            itemEle.click(function (e) {
                if (itemEle.hasClass("menu-item-disabled")) { return; }
                item.onclick.call(this, e, item, menus);
            });
        }
        var hasChild = item.children && item.children.length ? true : false, span = $("<span></span>").appendTo(itemEle);
        if (item.text) { span.text(item.text); }
        if (item.bold) { span.css("font-weight", "bold"); }
        if (hasChild) {
            var itemNode = $("<div></div>").appendTo(itemEle);
            $.each(item.children, function (i, n) {
                var val = $.util.isString(n) && $.array.contains(["-", "—", "|"], $.trim(n)) ? n
                    : $.extend({ hideDisabledMenu: item.hideDisabledMenu }, n);
                appendItemToMenu(itemNode, val, menus);
            });
        }
    };



    $.extend($.easyui, {

        //  根据指定的属性创建 easyui-menu 对象；该方法定义如下参数：
        //      options: JSON 对象类型，参数属性继承 easyui-menu 控件的所有属性和事件（参考官方 API 文档），并在此基础上增加了如下参数：
        //          id: 一个 String 对象，表示创建的菜单对象的 ID 属性。
        //          name: 一个 String 对象，表示创建的菜单对象的 name 属性。
        //          hideOnUnhover: 这是官方 API 中原有属性，此处调整其默认值为 false；
        //          hideDisabledMenu: 一个 Boolean 值，默认为 false；该属性表示当菜单项的 disabled: true，是否自动隐藏该菜单项；
        //          items: 一个 Array 对象，该数组对象中的每一个元素都是一个 JSON 格式对象用于表示一个 menu item （关于 menu item 对象属性，参考官方 API）；
        //                  该数组中每个元素的属性，除 easyui-menu 中 menu item 官方 API 定义的属性外，还增加了如下属性：
        //              hideDisabledMenu: 该属性表示在当前子菜单级别下当菜单项的 disabled: true，是否自动隐藏该菜单项；一个 Boolean 值，取上一级的 hideDisabledMenu 值；
        //              handler: 一个回调函数，表示点击菜单项时触发的事件；
        //                  回调函数 handler 和回调函数 onclick 的签名都为 function(e, item, menu)，其中：
        //                      e:  表示动作事件；
        //                      item:   表示当前点击的菜单项的 options 选项；
        //                      menu:   表示整个菜单控件的 jQuery 对象。
        //                      函数中 this 指向触发事件的对象本身
        //                  另，如果同时定义了 onclick 和 handler，则只处理 handler 而不处理 onclick，所以请不要两个回调函数属性同时使用。
        //              children: 同上一级对象的 items 属性，为一个 Array 对象；
        //          slideOut:   一个 Boolean 类型值，表示菜单是否以滑动方式显示出来；默认为 false；
        //          autoDestroy: Boolean 类型值，表示菜单是否在隐藏时自动销毁，默认为 true；
        //  返回值：返回一个 JSON 格式对象，该返回的对象中具有如下属性：
        //      menu: 依据于传入参数 options 构建出的菜单 DOM 元素对象，这是一个 jQuery 对象，该对象未初始化为 easyui-menu 控件，而只是具有该控件的 DOM 结构；
        //      options: 传入参数 options 解析后的结果，该结果尚未用于但可用于初始化 menu 元素。
        createMenu: buildMenu,

        //  根据指定的属性创建 easyui-menu 对象并立即显示出来；该方法定义的参数和本插件文件中的插件方法 createMenu 相同：
        //  注意：本方法与 createMenu 方法不同之处在于：
        //      createMenu: 仅根据传入的 options 参数创建出符合 easyui-menu DOM 结构要求的 jQuery DOM 对象，但是该对象并未初始化为 easyui-menu 控件；
        //      showMenu: 该方法在 createMenu 方法的基础上，对创建出来的 jQuery DOM 对象立即进行 easyui-menu 结构初始化，并显示出来。
        //  返回值：返回一个 jQuery 对象，该对象表示创建并显示出的 easyui-menu 元素，该返回的元素已经被初始化为 easyui-menu 控件。
        showMenu: function (options) {
            var ret = buildMenu(options), mm = ret.menu, opts = mm.menu(ret.options).menu("options"), onHide = opts.onHide;
            opts.onHide = function () {
                var m = $(this);
                if ($.isFunction(onHide)) { onHide.apply(this, arguments); }
                if (opts.autoDestroy) {
                    $.util.exec(function () { m.menu("destroy"); });
                }
            };
            mm.menu("show", { left: opts.left, top: opts.top });
            if (opts.slideOut) {
                mm.hide().slideDown(200);
                if (mm[0] && mm[0].shadow) { mm[0].shadow.hide().slideDown(200); }
            }
            return mm;
        }
    });

    //  另，增加 easyui-menu 控件中 menu-item 的如下自定义扩展属性:
    //      hideOnClick:    Boolean 类型值，默认为 true；表示点击该菜单项后整个菜单是否会自动隐藏；
    //      bold:           Boolean 类型值，默认为 false；表示该菜单项是否字体加粗；
    //      style:          JSON-Object 类型值，默认为 null；表示要附加到该菜单项的样式；
    //  备注：上述增加的 menu-item 的自定义扩展属性，只有通过 $.easyui.createMenu 或者 $.easyui.showMenu 生成菜单时，才有效。

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.searchbox.js" />
/**
* jQuery EasyUI searchbox Extensions 1.0 beta
* jQuery EasyUI searchbox 组件扩展
* jeasyui.extensions.searchbox.js

* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.linkbutton.js v1.0 beta late
*/
(function ($, undefined) {

    $.fn.searchbox.extensions = {};


    function initialize(target) {
        var state = $.data(target, "searchbox"), opts = state.options;
        if (!opts._initialized) {
            state.searchbox.find("input.searchbox-text").validatebox(opts);
            opts._initialized = true;
        }
    };



    var _destroy = $.fn.searchbox.methods.destroy;
    function destroy(target) {
        var t = $(target), textbox = t.searchbox("textbox");
        textbox.validatebox("destroy");
        _destroy.call(t, t);
    };



    var _searchbox = $.fn.searchbox;
    $.fn.searchbox = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.searchbox.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.each(function () {
                    $(this).searchbox("textbox").validatebox(options, param);
                });
            }
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "searchbox") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.validatebox.parseOptions(this), options);
            _searchbox.call(jq, opts);
            initialize(this);
        });
    };
    $.union($.fn.searchbox, _searchbox);


    var methods = $.fn.searchbox.extensions.methods = {

        destroy: function (jq) { return jq.each(function () { destroy(this); }); }
    };
    var defaults = $.fn.searchbox.extensions.defaults = {
    };

    $.extend($.fn.searchbox.defaults, defaults);
    $.extend($.fn.searchbox.methods, methods);

    if ($.fn.form && $.isArray($.fn.form.otherList)) {
        $.fn.form.otherList.push("searchbox");
        //$.array.insert($.fn.form.otherList, 0, "searchbox");
    }


    $.extend($.fn.datagrid.defaults.editors, {
        searchbox: {
            init: function (container, options) {
                var box = $("<input type=\"text\"></input>").appendTo(container).searchbox(options);
                box.searchbox("textbox").addClass("datagrid-editable-input");
                return box;
            },
            destroy: function (target) {
                $(target).searchbox("destroy");
            },
            getValue: function (target) {
                return $(target).searchbox("getValue");
            },
            setValue: function (target, value) {
                $(target).searchbox("setValue", value);
            },
            resize: function (target, width) {
                $(target).searchbox("resize", width);
            },
            setFocus: function (target) {
                $(target).searchbox("textbox").focus();
            }
        }
    });


})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.panel.js" />
/**
* jQuery EasyUI panel Extensions 1.0 beta
* jQuery EasyUI panel 组件扩展
* jeasyui.extensions.panel.js
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($, undefined) {


    $.fn.panel.extensions = {};


    //  easyui-panel、easyui-window、easyui-dialog 卸载时回收内存，主要用于 layout、panel(及其继承组件) 使用 iframe 嵌入网页时的内存泄漏问题
    var onBeforeDestroy = function () {
        $("iframe,frame", this).each(function () {
            try {
                if (this.contentWindow && this.contentWindow.document && this.contentWindow.close) {
                    this.contentWindow.document.write("");
                    this.contentWindow.close();
                }
                if ($.isFunction(window.CollectGarbage)) { window.CollectGarbage(); }
            } catch (ex) { }
        }).remove();
    };
    $.fn.panel.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.window.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.dialog.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.datagrid.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.propertygrid.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.treegrid.defaults.onBeforeDestroy = onBeforeDestroy;


    var _onResize = {
        panel: $.fn.panel.defaults.onResize,
        window: $.fn.window.defaults.onResize,
        dialog: $.fn.dialog.defaults.onResize
    };
    var onResize = function (width, height) {
        var p = $(this), isWin = p.panel("isWindow"), isDia = p.panel("isDialog"),
            plugin = isDia ? "dialog" : (isWin ? "window" : "panel"),
            _onResizeFn = _onResize[plugin];
        if ($.isFunction(_onResizeFn)) { _onResizeFn.apply(this, arguments); }
        if (!p.panel("inLayout")) {
            var opts = p.panel("options"),
                minWidth = $.isNumeric(opts.minWidth) ? opts.minWidth : defaults.minHeight,
                maxWidth = $.isNumeric(opts.maxWidth) ? opts.maxWidth : defaults.maxWidth,
                minHeight = $.isNumeric(opts.minHeight) ? opts.minHeight : defaults.minHeight,
                maxHeight = $.isNumeric(opts.maxHeight) ? opts.maxHeight : defaults.maxHeight;
            var resizable = false;
            if (width > maxWidth) { width = maxWidth; resizable = true; }
            if (width < minWidth) { width = minWidth; resizable = true; }
            if (height > maxHeight) { height = maxHeight; resizable = true; }
            if (height < minHeight) { height = minHeight; resizable = true; }
            if (resizable && !opts.fit) {
                p[plugin]("resize", { width: width, height: height });
            }
        }
    };

    var _onMove = {
        panel: $.fn.panel.defaults.onMove,
        window: $.fn.window.defaults.onMove,
        dialog: $.fn.dialog.defaults.onMove
    };
    var onMove = function (left, top) {
        var p = $(this), isWin = p.panel("isWindow"), isDia = p.panel("isDialog"),
            plugin = isDia ? "dialog" : (isWin ? "window" : "panel"),
            _onMoveFn = _onMove[plugin], opts = p.panel("options");
        if ($.isFunction(_onMoveFn)) { _onMoveFn.apply(this, arguments); }
        if (opts.maximized) { return p[plugin]("restore"); }
        if (!opts.inContainer) { return; }
        var panel = p.panel("panel"), parent = panel.parent(), isRoot = parent.is("body"),
            scope = $.extend({}, isRoot ? $.util.windowSize() : { width: parent.innerWidth(), height: parent.innerHeight() }),
            width = $.isNumeric(opts.width) ? opts.width : panel.outerWidth(),
            height = $.isNumeric(opts.height) ? opts.height : panel.outerHeight(),
            moveable = false;
        if (left < 0) { left = 0; moveable = true; }
        if (top < 0) { top = 0; moveable = true; }
        if (moveable) { return p[plugin]("move", { left: left, top: top }); }
        if (left + width > scope.width && left > 0) { left = scope.width - width; moveable = true; }
        if (top + height > scope.height && top > 0) { top = scope.height - height; moveable = true; }
        if (moveable) { return p[plugin]("move", { left: left, top: top }); }
    };



    var inLayout = function (target) {
        var t = $(target), body = t.panel("body"), panel = t.panel("panel");
        return body.hasClass("layout-body") && panel.hasClass("layout-panel");
    };

    var inTabs = function (target) {
        var t = $(target), panel = t.panel("panel"), panels = panel.parent(), container = panels.parent();
        return panels.hasClass("tabs-panels") && container.hasClass("tabs-container");
    };

    var inAccordion = function (target) {
        var t = $(target), body = t.panel("body"), panel = t.panel("panel"), container = panel.parent();
        return (body.hasClass("accordion-body") && container.hasClass("accordion") && $.data(container[0], "accordion")) ? true : false;
    };

    var isWindow = function (target) {
        var t = $(target), body = t.panel("body");
        return body.hasClass("window-body") && body.parent().hasClass("window");
    };

    var isDialog = function (target) {
        var t = $(target), body = t.panel("body");
        return isWindow(target) && (body.children("div.panel").children("div.panel-body.dialog-content").length ? true : false);
    };





    function parseExtensionsBegin(opts) {
        opts._extensionsPanel = { href: opts.href, content: opts.content };
        if (opts.iniframe) {
            opts.href = null;
            opts.content = null;
        }


    };
    function parseExtensionsEnd(target) {
        var panel = $(target), opts = panel.panel("options"),
            exts = opts._extensionsPanel ? opts._extensionsPanel : opts._extensionsPanel = { href: opts.href, content: opts.content };
        opts.href = exts.href; opts.content = exts.content;
        if (opts.bodyStyle) {
            panel.panel("body").css(opts.bodyStyle);
        }
        if (opts.iniframe) {
            refresh(target);
        }
    };

    var _panel = $.fn.panel;
    $.fn.panel = function (options, param) {
        if (typeof options == "string") {
            return _panel.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "panel") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.panel.parseOptions(this), $.parser.parseOptions(this, [
                    { minWidth: "number", maxWidth: "number", minHeight: "number", maxHeight: "number" },
                    { iniframe: "boolean", inContainer: "boolean", keepTitle: "boolean" }
                ]), options);
            parseExtensionsBegin(opts);
            _panel.call(jq, opts);
            parseExtensionsEnd(this);
        });
    };
    $.union($.fn.panel, _panel);






    function loadPanel(target) {
        var t = $(target), state = $.data(target, "panel"), opts = state.options;
        if (opts.href) {
            if (!state.isLoaded || !opts.cache) {
                var params = $.extend({}, opts.queryParams);
                if (opts.onBeforeLoad.call(target, params) == false) {
                    return;
                }
                state.isLoaded = false;
                destroyContent(target);
                if (opts.loadingMessage) {
                    t.html($("<div class=\"panel-loading\"></div>").html(opts.loadingMessage));
                }
                opts.loader.call(target, params, function (data) {
                    loadContent(opts.extractor.call(target, data));
                    opts.onLoad.apply(target, arguments);
                    state.isLoaded = true;
                }, function () {
                    opts.onLoadError.apply(target, arguments);
                });
            }
        } else {
            if (opts.content) {
                if (!state.isLoaded) {
                    destroyContent(target);
                    loadContent(opts.content);
                    state.isLoaded = true;
                }
            }
        }
        function loadContent(content) {
            t.html(content);
            $.parser.parse(t);
        };
    };
    function destroyContent(target) {
        var t = $(target);
        t.find(".combo-f").each(function () {
            $(this).combo("destroy");
        });
        t.find(".m-btn").each(function () {
            $(this).menubutton("destroy");
        });
        t.find(".s-btn").each(function () {
            $(this).splitbutton("destroy");
        });
        t.find(".tooltip-f").each(function () {
            $(this).tooltip("destroy");
        });
        t.children("div").each(function () {
            $(this)._fit(false);
        });
    };





    function refresh(target, href) {
        var state = $.data(target, "panel"), opts = state.options;
        state.isLoaded = false;
        if (href) {
            if (typeof href == "string") {
                opts.href = href;
            } else {
                opts.queryParams = href;
            }
        }
        if (opts.iniframe) {
            var exts = opts._extensionsPanel ? opts._extensionsPanel : opts._extensionsPanel = { href: opts.href, content: opts.content };
            exts.href = opts.href; exts.content = opts.content;
            opts.href = null;
            opts.content = "<iframe class=\"panel-iframe\" frameborder=\"0\" width=\"100%\" height=\"100%\" marginwidth=\"0px\" marginheight=\"0px\" scrolling=\"auto\"></iframe>";
            loadPanel(target);
            opts.href = exts.href; opts.content = exts.content;
            getIframe(target).bind({
                load: function () {
                    if ($.isFunction(opts.onLoad)) { opts.onLoad.apply(target, arguments); }
                },
                error: function () {
                    if ($.isFunction(opts.onLoadError)) { opts.onLoadError.apply(target, arguments); }
                }
            }).attr("src", opts.href || "");
        } else {
            loadPanel(target);
        }
    };



    function getIframe(target) {
        var p = $(target), body = p.panel("body");
        return body.children("iframe.panel-iframe");
    };

    var _header = $.fn.panel.methods.header;
    function getHeader(target) {
        var t = $(target);
        if (!inTabs(target)) { return _header.call(t, t); }
        var panel = t.panel("panel"), index = panel.index(), tabs = panel.closest(".tabs-container");
        return tabs.find(">div.tabs-header>div.tabs-wrap>ul.tabs>li").eq(index);
    };

    var _setTitle = $.fn.panel.methods.setTitle;
    function setTitle(target, title) {
        var t = $(target);
        if (!inTabs(target)) { return _setTitle.call(t, t, title); }
        if (!title) { return; }
        var opts = t.panel("options"), header = t.panel("header");
        opts.title = title;
        header.find(">a.tabs-inner>span.tabs-title").text(title);
    };


    var methods = $.fn.panel.extensions.methods = {
        //  判断当前 easyui-panel 是否为 easyui-layout 的 panel 部件；
        //  返回值：如果当前 easyui-panel 是 easyui-layout 的 panel 部件，则返回 true，否则返回 false。
        inLayout: function (jq) { return inLayout(jq[0]); },

        //  判断当前 easyui-panel 是否为 easyui-tabs 的选项卡。
        inTabs: function (jq) { return inTabs(jq[0]); },

        //  判断当前 easyui-panel 是否为 easyui-accordion 中的一个折叠面板。
        inAccordion: function (jq) { return inAccordion(jq[0]); },

        //  判断当前 easyui-panel 是否为 easyui-window 组件；
        isWindow: function (jq) { return isWindow(jq[0]); },

        //  判断当前 easyui-panel 是否为 easyui-dialog 组件；
        isDialog: function (jq) { return isDialog(jq[0]); },

        //  增加 easyui-panel 控件的扩展方法；该方法用于获取当前在 iniframe: true 时当前 panel 控件中的 iframe 容器对象；
        //  备注：如果 inirame: false，则该方法返回一个空的 jQuery 对象。
        iframe: function (jq) { return getIframe(jq[0]); },

        //  重写 easyui-panel 控件的 refresh 方法，用于支持 iniframe 属性。
        refresh: function (jq, href) { return jq.each(function () { refresh(this, href); }); },

        //  重写 easyui-panel 控件的 header 方法，支持位于 easyui-tabs 中的 tab-panel 部件获取 header 对象；
        //  备注：如果该 panel 位于 easyui-tabs 中，则该方法返回 easyui-tabs 的 div.tabs-header div.tabs-wrap ul.tabs 中对应该 tab-panel 的 li 对象。
        header: function (jq) { return getHeader(jq[0]); },

        //  重写 easyui-panel 控件的 setTitle 方法，支持位于 easyui-tabs 中的 tab-panel 部件设置 title 操作；
        //  返回值：返回当前选项卡控件 easyui-panel 的 jQuery 链式对象。
        setTitle: function (jq, title) { return jq.each(function () { setTitle(this, title); }); }
    };
    var defaults = $.fn.panel.extensions.defaults = {

        //  增加 easyui-panel 控件的自定义属性，该属性表示 href 加载的远程页面是否装载在一个 iframe 中。
        iniframe: false,

        //  增加 easyui-panel 控件的自定义属性，表示 easyui-panel 面板的最小宽度。
        minWidth: 10,

        //  增加 easyui-panel 控件的自定义属性，表示 easyui-panel 面板的最大宽度。
        maxWidth: 10000,

        //  增加 easyui-panel 控件的自定义属性，表示 easyui-panel 面板的最小高度。
        minHeight: 10,

        //  增加 easyui-panel 控件的自定义属性，表示 easyui-panel 面板的最大高度。
        maxHeight: 10000,

        //  增加 easyui-panel 控件的自定义属性，重新定义的 onResize 事件。用于扩展四个新增属性 minWidth、maxWidth、minHeight、maxHeight 的功能。
        onResize: onResize,

        //  扩展 easyui-panel、easyui-window 以及 easyui-dialog 控件的自定义属性，表示该窗口是否无法移除父级对象边界，默认为 true。
        inContainer: true,

        //  扩展 easyui-panel、easyui-window 以及 easyui-dialog 控件的自定义属性，表示该面板 body 对象的自定义 CSS 样式；
        //  该属性作用于 panel-body 对象；格式请参照 style 属性；
        bodyStyle: null,

        //  重写 easyui-panel、easyui-window 以及 easyui-dialog 控件的原生事件 onMove，以支持相应扩展功能。
        onMove: onMove
    };

    $.extend($.fn.panel.defaults, defaults);
    $.extend($.fn.panel.methods, methods);

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.window.js" />
/**
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.panel.js v1.0 beta late
*/
(function ($, undefined) {


    $.fn.window.extensions = {};


    var initialize = function (target) {
        var t = $(target), state = $.data(target, "window"), opts = t.window("options"), win = t.window("window"), body = t.window("body");
        if (!opts._initialized) {
            t.window("header").on({
                dblclick: function () {
                    var opts = t.window("options");
                    if (opts.autoRestore) { if (opts.maximized) { t.window("restore"); } else if (opts.maximizable) { t.window("maximize"); } }
                },
                contextmenu: function (e) {
                    var opts = t.window("options");
                    if (opts.enableHeaderContextMenu) {
                        e.preventDefault();
                        var items = [
                            { text: "最大化", iconCls: "panel-tool-max", disabled: !opts.maximized && opts.maximizable ? false : true, onclick: function () { t.window("maximize"); } },
                            { text: "恢复", iconCls: "panel-tool-restore", disabled: opts.maximized ? false : true, onclick: function () { t.window("restore"); } },
                            "-",
                            { text: "关闭", iconCls: "panel-tool-close", disabled: !opts.closable, onclick: function () { t.window("close"); } }
                        ];
                        var headerContextMenu = $.array.likeArray(opts.headerContextMenu) ? opts.headerContextMenu : [];
                        if (headerContextMenu.length) { $.array.insertRange(items, 0, $.util.merge([], headerContextMenu, "-")); }
                        items = parseContextMenuMap(e, items, t);
                        $.easyui.showMenu({ items: items, left: e.pageX, top: e.pageY });
                    }
                }
            });
            if (opts.bodyCls) { body.addClass(opts.bodyCls); }

            if (opts.draggable) {
                var dragOpts = state.window.draggable("options"), cursor = dragOpts.cursor,
                    onBeforeDrag = dragOpts.onBeforeDrag, onStartDrag = dragOpts.onStartDrag, onStopDrag = dragOpts.onStopDrag, onDrag = dragOpts.onDrag;
                dragOpts.cursor = "default";
                dragOpts.onBeforeDrag = function (e) {
                    var ret = onBeforeDrag.apply(this, arguments);
                    if (ret == false || e.which != 1 || t.window("options").maximized) { return false; }
                    dragOpts.cursor = cursor;
                };
                dragOpts.onStartDrag = function () {
                    onStartDrag.apply(this, arguments);
                    t.window("body").addClass("window-body-hidden").children().addClass("window-body-hidden-proxy");
                };
                dragOpts.onStopDrag = function () {
                    onStopDrag.apply(this, arguments);
                    t.window("body").removeClass("window-body-hidden").children().removeClass("window-body-hidden-proxy");
                    dragOpts.cursor = "default";
                };
                dragOpts.onDrag = function (e) {
                    if (!opts.inContainer) { return onDrag.apply(this, arguments); }
                    var left = e.data.left, top = e.data.top,
                        p = win.parent(), root = p.is("body"),
                        scope = $.extend({}, root ? $.util.windowSize() : { width: p.innerWidth(), height: p.innerHeight() }),
                        width = $.isNumeric(opts.width) ? opts.width : win.outerWidth(),
                        height = $.isNumeric(opts.height) ? opts.height : win.outerHeight();
                    if (left < 0) { left = 0; }
                    if (top < 0) { top = 0; }
                    if (left + width > scope.width && left > 0) { left = scope.width - width; b = true; }
                    if (top + height > scope.height && top > 0) { top = scope.height - height; b = true; }
                    state.proxy.css({
                        display: 'block',
                        left: left,
                        top: top
                    });
                    return false;
                };
            }
            if (opts.resizable) {
                var resizableOpts = state.window.resizable("options"),
                    _onResize = resizableOpts.onResize, _onStopResize = resizableOpts.onStopResize;
                resizableOpts.onResize = function (e) {
                    if (!opts.minWidth && !opts.maxWidth && !opts.minHeight && !opts.maxHeight) {
                        return _onResize.apply(this, arguments);
                    }
                    state.proxy.css({ left: e.data.left, top: e.data.top });
                    var width = e.data.width, height = e.data.height,
                        minWidth = $.isNumeric(opts.minWidth) ? opts.minWidth : defaults.minHeight,
                        maxWidth = $.isNumeric(opts.maxWidth) ? opts.maxWidth : defaults.maxWidth,
                        minHeight = $.isNumeric(opts.minHeight) ? opts.minHeight : defaults.minHeight,
                        maxHeight = $.isNumeric(opts.maxHeight) ? opts.maxHeight : defaults.maxHeight;
                    if (width > opts.maxWidth) { width = maxWidth; resizable = true; }
                    if (width < opts.minWidth) { width = minWidth; resizable = true; }
                    if (height > opts.maxHeight) { height = maxHeight; resizable = true; }
                    if (height < opts.minHeight) { height = minHeight; resizable = true; }
                    state.proxy._outerWidth(width);
                    state.proxy._outerHeight(height);
                    return false;
                };
                resizableOpts.onStopResize = function (e) {
                    var ret = _onStopResize.apply(this, arguments);
                    if (t.window("options").maximized) {
                        t.window("restore").window("maximize");
                    }
                    return ret;
                };
            }

            opts._initialized = true;
        }
    };

    function parseContextMenuMap(e, menus, win) {
        return $.array.map(menus, function (value, index) {
            if (!value || $.util.isString(value)) { return value; }
            var ret = $.extend({}, value);
            ret.id = $.isFunction(value.id) ? value.id.call(ret, e, win) : value.id;
            ret.text = $.isFunction(value.text) ? value.text.call(ret, e, win) : value.text;
            ret.iconCls = $.isFunction(value.iconCls) ? value.iconCls.call(ret, e, win) : value.iconCls;
            ret.disabled = $.isFunction(value.disabled) ? value.disabled.call(ret, e, win) : value.disabled;
            ret.hideOnClick = $.isFunction(value.hideOnClick) ? value.hideOnClick.call(ret, e, win) : value.hideOnClick;
            ret.onclick = $.isFunction(value.onclick) ? function (e, item, menu) { value.onclick.call(this, e, win, item, menu); } : value.onclick;
            ret.handler = $.isFunction(value.handler) ? function (e, item, menu) { value.handler.call(this, e, win, item, menu); } : value.handler;
            if (ret.children && ret.children.length) { ret.children = parseContextMenuMap(e, ret.children, win); }
            return ret;
        });
    };


    var _window = $.fn.window;
    $.fn.window = function (options, param) {
        if (typeof options == "string") {
            return _window.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "window") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.window.parseOptions(this), $.parser.parseOptions(this, [{
                    autoHCenter: "boolean", autoVCenter: "boolean", autoCloseOnEsc: "boolean",
                    autoRestore: "boolean", enableHeaderContextMenu: "boolean"
                }]), options);
            _window.call(jq, opts);
            initialize(this);
        });
    };
    $.union($.fn.window, _window);



    var methods = $.fn.window.extensions.methods = {};
    var defaults = $.fn.window.extensions.defaults = $.extend({}, $.fn.panel.extensions.defaults, {

        //  扩展 easyui-window 以及 easyui-dialog 控件的自定义属性，表示该窗口对象是否在屏幕大小调整的情况下自动进行左右居中，默认为 true。
        autoHCenter: false,

        //  扩展 easyui-window 以及 easyui-dialog 控件的自定义属性，表示该窗口对象是否在屏幕大小调整的情况下自动进行上下居中，默认为 true。
        autoVCenter: false,

        //  扩展 easyui-window 以及 easyui-dialog 控件的自定义属性，表示该窗口对象是否在按下 ESC，默认为 true。
        autoCloseOnEsc: true,

        //  扩展 easyui-window 以及 easyui-dialog 控件的自定义属性，表示该窗口是否在双击头部时自动最大化。
        autoRestore: true,

        //  扩展 easyui-window 以及 easyui-dialog 控件的自定义属性，表示是否启用该窗口的右键菜单。
        enableHeaderContextMenu: true,

        //  扩展 easyui-window 以及 easyui-dialog 控件的自定义属性，表示该窗口的右键菜单；
        //  这是一个数组格式对象，数组中的每一项都是一个 menu-item 元素；该 menu-item 元素格式定义如下：
        //      id:         表示菜单项的 id；
        //      text:       表示菜单项的显示文本；
        //      iconCls:    表示菜单项的左侧显示图标；
        //      disabled:   表示菜单项是否被禁用(禁用的菜单项点击无效)；
        //      hideOnClick:    表示该菜单项点击后整个右键菜单是否立即自动隐藏；
        //      bold:           Boolean 类型值，默认为 false；表示该菜单项是否字体加粗；
        //      style:          JSON-Object 类型值，默认为 null；表示要附加到该菜单项的样式；
        //      handler:    表示菜单项的点击事件，该事件函数格式为 function(e, win, item, menu)，其中 this 指向菜单项本身
        headerContextMenu: null
    });

    $.extend($.fn.window.defaults, defaults);
    $.extend($.fn.window.methods, methods);

    $(function () {
        //  设置当屏幕大小调整时，所有 easyui-window 或 easyui-dialog 窗口在属性 autoHCenter: true 或 autoVCenter: true 的情况下自动居中。
        $(window).resize(function () {
            $(".panel-body.window-body").each(function () {
                var win = $(this), opts = win.window("options");
                if (opts && opts.draggable) {
                    if (opts.autoHCenter || opts.autoVCenter) {
                        var method = opts.autoHCenter && opts.autoVCenter ? "center" : (opts.autoHCenter ? "hcenter" : "vcenter");
                        win.window(method);
                    } else if (opts.inContainer) { win.window("move"); }
                }
            });
        });

        //  在当前打开 modal:true 的 easyui-window 或者 easyui-dialog 时，按 ESC 键关闭顶层的 easyui-window 或者 easyui-dialog 对象。
        $(document).keydown(function (e) {
            if (e.which == 27) {
                $("div.window-mask:last").prevAll("div.panel.window:first").children(".panel-body.window-body").each(function () {
                    var win = $(this), opts = win.window("options");
                    if (opts && opts.closable && opts.autoCloseOnEsc && !win.window("header").find(".panel-tool a").attr("disabled")) {
                        $.util.exec(function () { win.window("close"); });
                    }
                });
            }
        });

        //  点击模式对话框（例如 easyui-messager、easyui-window、easyui-dialog）的背景遮蔽层使窗口闪动
        $("body").on("click", "div.window-mask:last", function (e) {
            $(this).prevAll("div.panel.window:first").shine();
        });
    });

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.dialog.js" />
/**
* jQuery EasyUI dialog Extensions 1.0 beta
* jQuery EasyUI dialog 组件扩展
* jeasyui.extensions.dialog.js

* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.linkbutton.js v1.0 beta late
*   4、jeasyui.extensions.menu.js v1.0 beta late
*   5、jeasyui.extensions.panel.js v1.0 beta late
*   6、jeasyui.extensions.window.js v1.0 beta late
*/
(function ($, undefined) {


    $.fn.dialog.extensions = {};



    var easyui = $.util.$.easyui ? $.util.$.easyui : $.easyui,
        cache = easyui.frameMapCache ? easyui.frameMapCache : easyui.frameMapCache = [];

    function resetCache(iframe) {
        var array = $.array.filter(cache, function (val) { return val.current == iframe; }), l = array.length;
        while (l--) { $.array.remove(cache, array[l]); };
    };

    var getParent = function () {
        var current = $.util.currentFrame;
        if (!current) { return $.util.top; }
        var p = $.array.first(cache, function (val) { return val.current == current; });
        return (p && p.parent && p.parent.contentWindow) ? p.parent.contentWindow : $.util.parent;
    };
    //  该属性仅可以在通过 $.easyui.showDialog 打开的 easyui-dialog 中的 iframe 中使用；
    //  该属性表示父级页面的 window 对象。
    $.easyui.parent = getParent();

    //  该方法仅可以在通过 $.easyui.showDialog 打开的 easyui-dialog 中的 iframe 中使用；
    //  关闭当前页面所在的 easyui-dialog 窗体。
    $.easyui.parent.closeDialog = $.easyui.closeCurrentDialog = function () {
        if ($.util.isUtilTop) { return; }
        $.easyui.parent.$($.util.currentFrame).closest("div.window-body").dialog("close");
    };

    $.easyui._showDialog = function (opts, currentFrame) {
        if (opts.onApply == null || opts.onApply == undefined) { opts.onApply = opts.onSave; }
        if (opts.onSave == null || opts.onSave == undefined) { opts.onSave = opts.onApply; }

        var _onClose = opts.onClose;
        opts.onClose = function () {
            if ($.isFunction(_onClose)) { _onClose.apply(this, arguments); }
            $.fn.dialog.defaults.onClose.apply(this, arguments);
            if (opts.autoDestroy) {
                $(this).dialog("destroy");
            }
        };

        var _onBeforeDestroy = opts.onBeforeDestroy;
        opts.onBeforeDestroy = function () {
            if (opts.iniframe) {
                var iframe = $(this).dialog("iframe");
                resetCache(iframe[0]);
            }
            var ret;
            if ($.isFunction(_onBeforeDestroy)) {
                ret = _onBeforeDestroy.apply(this, arguments);
            }
            if ($.fn.dialog.defaults.onBeforeDestroy.apply(this, arguments) == false) {
                return false;
            }
            return ret;
        };

        if (opts.locale) { opts.inline = true; }
        var dialog = $("<div></div>").appendTo(opts.locale ? opts.locale : "body");

        if (!$.util.likeArray(opts.toolbar)) { opts.toolbar = []; }
        if ($.isArray(opts.toolbar)) {
            $.each(opts.toolbar, function () {
                var handler = this.handler;
                if ($.isFunction(handler)) { this.handler = function () { handler.call(dialog, dialog); }; }
            });
            if (!opts.toolbar.length) { opts.toolbar = null; }
        }

        var buttons = [
            btnSave = {
                id: "save", text: opts.saveButtonText, iconCls: opts.saveButtonIconCls,
                index: opts.saveButtonIndex, hidden: opts.enableSaveButton ? false : true,
                handler: function (dia) {
                    var isFunc = $.isFunction(opts.onSave);
                    if (!isFunc || isFunc && opts.onSave.call(this, dia) !== false) {
                        $.util.exec(function () { dia.dialog("close"); });
                    }
                }
            },
            btnClose = {
                id: "close", text: opts.closeButtonText, iconCls: opts.closeButtonIconCls,
                index: opts.closeButtonIndex, hidden: opts.enableCloseButton ? false : true,
                handler: function (dia) { dia.dialog("close"); }
            },
            btnApply = {
                id: "apply", text: opts.applyButtonText, iconCls: opts.applyButtonIconCls,
                index: opts.applyButtonIndex, hidden: opts.enableApplyButton ? false : true,
                handler: function (dia) {
                    var isFunc = $.isFunction(opts.onApply);
                    if (!isFunc || isFunc && opts.onApply.call(this, dia) !== false) {
                        dia.applyButton.linkbutton("disable");
                    }
                }
            }
        ];

        if (!$.util.likeArrayNotString(opts.buttons)) { opts.buttons = []; }
        $.array.merge(opts.buttons, buttons);
        opts.buttons = $.array.filter(opts.buttons, function (val) { return $.util.parseFunction(val.hidden, val) ? false : true; });
        $.each(opts.buttons, function (i, btn) {
            var handler = btn.handler;
            if ($.isFunction(handler)) { btn.handler = function () { handler.call(this, dialog); }; }
        });
        $.array.sort(opts.buttons, function (a, b) {
            return ($.isNumeric(a.index) ? a.index : 0) - ($.isNumeric(b.index) ? b.index : 0);
        });


        if (!opts.buttons.length) { opts.buttons = null; }

        opts = dialog.dialog(opts).dialog("options");

        var dialogBody = dialog.dialog("body"),
            buttonbar = dialogBody.children(".dialog-button").each(function () {
                var color = dialog.css("border-bottom-color");
                $(this).addClass("calendar-header").css({ "height": "auto", "border-top-color": color });
            }),
            bottombuttons = buttonbar.children("a");
        if (opts.buttonsPlain) { bottombuttons.linkbutton("setPlain", true); }
        if (!opts.iniframe) {
            if (opts.href) {
                var toolbuttons = dialog.dialog("header").find(".panel-tool a");
                toolbuttons.attr("disabled", "disabled");
                bottombuttons.linkbutton("disable");
                var onLoad = opts.onLoad;
                opts.onLoad = function () {
                    if ($.isFunction(onLoad)) { onLoad.apply(this, arguments); }
                    $.util.exec(function () {
                        toolbuttons.removeAttr("disabled");
                        bottombuttons.linkbutton("enable");
                    });
                };
            }
        }
        var iframe = dialog.dialog("iframe");
        if (iframe.length) { cache.push({ current: iframe[0], parent: currentFrame }); }

        $.extend(dialog, {
            options: opts,
            iframe: iframe,
            buttons: bottombuttons,
            closeButtn: buttonbar.children("#close"),
            saveButton: buttonbar.children("#save"),
            applyButton: buttonbar.children("#apply"),
            save: function () { btnSave.handler(); },
            close: function () { btnClose.handler(); },
            apply: function () { btnApply.handler(); }
        });

        return dialog;
    };

    //  以 easyui-dialog 方法在当前浏览器窗口的顶级(可访问)窗体中弹出对话框窗口；该函数定义如下参数：
    //      options:    一个 JSON Object，具体格式参考 easyui-dialog 官方 api 中的属性列表。
    //          该参数在 easyui-dialog 官方 api 所有原属性列表基础上，增加如下属性：
    //          iniframe:
    //          enableSaveButton:
    //          enableApplyButton:
    //          enableCloseButton:
    //          onSave:
    //          onClose:
    //          saveButtonText:
    //          applyButtonText:
    //          closeButtonText:
    //          saveButtonIconCls:
    //          applyButtonIconCls:
    //          closeButtonIconCls:
    //          buttonsPlain:
    //      另，重写 easyui-dialog 官方 api 的 buttons 属性，使其不支持 String-jQuerySelector 格式
    //  备注：
    //  返回值：返回弹出的 easyui-dialog 的 jQuery 对象。
    $.easyui.showDialog = function (options) {
        var opts = $.extend({}, $.easyui.showDialog.defaults, options);
        if (opts.locale) { opts.topMost = false; }
        var currentFrame = $.util.currentFrame, fn = opts.topMost ? $.util.$.easyui._showDialog : $.easyui._showDialog;
        return fn(opts, currentFrame);
    };



    //  通过调用 $.easyui.showDialog 方法，以 easyui-dialog 的方式显示一个 JSON - Object 对象的所有属性值；该函数定义如下参数：
    //      options:    需要显示的 JSON - Object；
    //      dialogOption:  该参数可选，表示要打开的 easyui-dialog 的 options。
    //  备注：该方法一般用于对象值显示，例如可以用于项目开发过程中的参数显示调试。
    //  返回值：返回弹出的 easyui-dialog 的 jQuery 对象。
    $.easyui.showOption = function (options, dialogOption) {
        options = options || "无数据显示。";
        var opts = $.extend({
            topMost: $.easyui.showDialog.defaults.topMost,
            title: "显示 options 值",
            width: 480,
            height: 260,
            minWidth: 360,
            minHeight: 220,
            autoVCenter: false,
            autoHCenter: false,
            enableSaveButton: false,
            enableApplyButton: false
        }, dialogOption || {}), jq = opts.topMost ? $.util.$ : $;
        var content = jq("<table class=\"dialog-options-body\" ></table>"), type = jq.type(options);
        if ($.array.contains(["array", "object", "function"], type)) {
            for (var key in options) {
                content.append("<tr class=\"dialog-options-row\"><td class=\"dialog-options-cell\">" + key + ":</td><td class=\"dialog-options-cell-content\">" + $.string.toHtmlEncode(options[key]) + "</td></tr>");
            }
        } else {
            content.append("<tr class=\"dialog-options-row\"><td class=\"dialog-options-cell\">options:</td><td class=\"dialog-options-cell-content\">" + $.string.toHtmlEncode(String(options)) + "</td></tr>");
        }
        opts.content = content;
        return $.easyui.showDialog(opts);
    };






    function refresh(target, href) {
        var dia = $(target), opts = dia.dialog("options"), cp = dia.dialog("contentPanel"), coOpts = cp.panel("options");
        if (href) {
            opts.href = href;
        }
        coOpts.iniframe = opts.iniframe;
        cp.panel("refresh", opts.href);
    };

    function getContentPanel(target) {
        var state = $.data(target, "dialog");
        return state ? state.contentPanel : null;
    };

    function getIframe(target) {
        var panel = getContentPanel(target);
        return panel.panel("iframe");
    };

    function parseExtensionsBegin(options) {
        options._extensionsDialog = {
            href: options.href, content: options.content, iniframe: options.iniframe,
            bodyCls: options.bodyCls, bodyStyle: options.bodyStyle
        };
        options.bodyCls = null;
        options.bodyStyle = null;
        if (options.iniframe) {
            options.href = null;
            options.content = null;
            options.iniframe = false;
        }
    };
    function parseExtensionsEnd(target) {
        var d = $(target), opts = d.dialog("options"), cp = getContentPanel(target),
            exts = opts._extensionsDialog ? opts._extensionsDialog : opts._extensionsDialog = { href: opts.href, content: opts.content, iniframe: opts.iniframe };
        opts.href = exts.href; opts.content = exts.content; opts.iniframe = exts.iniframe;
        opts.bodyCls = exts.bodyCls; opts.bodyStyle = exts.bodyStyle;
        if (cp && cp.length) {
            if (opts.bodyCls) { cp.addClass(opts.bodyCls); }
            if (opts.bodyStyle) { cp.css(opts.bodyStyle); }
        }
        if (opts.iniframe) {
            refresh(target);
        }
    };

    var _dialog = $.fn.dialog;
    $.fn.dialog = function (options, param) {
        if (typeof options == "string") {
            return _dialog.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "dialog") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.dialog.parseOptions(this), options);
            parseExtensionsBegin(opts);
            _dialog.call(jq, opts);
            parseExtensionsEnd(this);
        });
    };
    $.union($.fn.dialog, _dialog);


    var methods = $.fn.dialog.extensions.methods = {
        //  修复 easyui-dialog 组件的 options 方法返回的 width 和 height 属性不正确的 BUG
        options: function (jq) {
            var state = $.data(jq[0], "dialog"), opts = state.options,
                pp = jq.panel("options");
            $.extend(opts, {
                closed: pp.closed, collapsed: pp.collapsed, minimized: pp.minimized, maximized: pp.maximized,
                width: pp.width, height: pp.height
            });
            return opts;
        },

        //  扩展 easyui-dialog 控件的自定义方法；获取当前 easyui-dialog 控件的内容面板 panel 对象。
        contentPanel: function (jq) { return getContentPanel(jq[0]); },

        //  重写 easyui-panel 控件的自定义方法 iframe；获取当前 easyui-dialog 控件内容面板 panel 对象中的 iframe 对象。
        //  备注：如果 inirame: false，则该方法返回一个空的 jQuery 对象。
        iframe: function (jq) { return getIframe(jq[0]); },

        //  重写 easyui-dialog 控件的 refresh 方法，用于支持 iniframe 属性。
        refresh: function (jq, href) { return jq.each(function () { refresh(this, href); }); }
    };
    var defaults = $.fn.dialog.extensions.defaults = $.extend({}, $.fn.window.extensions.defaults, {

    });

    $.extend($.fn.dialog.defaults, defaults);
    $.extend($.fn.dialog.methods, methods);



    //  定义 $.easyui.showDialog 方法打开 easyui-dialog 窗体的默认属性。
    //  备注：该默认属性定义仅在方法 $.easyui.showDialog 中被调用。
    $.easyui.showDialog.defaults = {
        title: "新建对话框",
        iconCls: "icon-standard-application-form",
        width: 600,
        height: 360,
        modal: true,
        collapsible: false,
        maximizable: false,
        closable: true,
        draggable: true,
        resizable: true,
        shadow: true,
        minimizable: false,

        href: null,

        //  表示弹出的 easyui-dialog 窗体是否在关闭时自动销毁并释放浏览器资源；
        //  Boolean 类型值，默认为 true。
        autoDestroy: true,

        //  表示将要打开的 easyui-dialog 的父级容器；可以是一个表示 jQuery 元素选择器的表达式字符串，也可以是一个 html-dom 或 jQuery-dom 对象。
        //  注意：如果设置了该参数，则 topMost 属性将自动设置为 false。
        //      如果为 null 或者 undefined 则表示父级容器为 body 标签。
        locale: null,

        //  是否在顶级窗口打开此 easyui-dialog 组件。
        topMost: false,

        //  是否在iframe加载远程 href 页面数据
        iniframe: false,

        //  是否启用保存按钮，保存按钮点击后会关闭模式对话框
        enableSaveButton: true,

        //  是否启用应用按钮
        enableApplyButton: true,

        //  是否启用关闭按钮
        enableCloseButton: true,

        saveButtonIndex: 101,

        closeButtonIndex: 102,

        applyButtonIndex: 103,

        //  点击保存按钮触发的事件，如果该事件范围 false，则点击保存后窗口不关闭。
        onSave: null,

        //  点击应用按钮触发的事件，如果该事件范围 false，则点击应用后该按钮不被自动禁用。
        onApply: null,

        //  关闭窗口时应触发的事件，easyui-dialog本身就有
        onClose: null,

        //  保存按钮的文字内容
        saveButtonText: "确定",

        //  关闭按钮的文字内容
        closeButtonText: "取消",

        //  应用按钮的文字内容
        applyButtonText: "应用",

        //  保存按钮的图标样式
        saveButtonIconCls: "icon-save",

        //  应用按钮的图标样式
        applyButtonIconCls: "icon-ok",

        //  关闭按钮的图标样式
        closeButtonIconCls: "icon-cancel",

        //  底部工具栏的所有按钮是否全部设置 plain: true
        buttonsPlain: false
    };

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.layout.js" />
/**
* jQuery EasyUI layout Extensions 1.0 beta
* jQuery EasyUI layout 组件扩展
* jeasyui.extensions.layout.js
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($, undefined) {

    $.fn.layout.extensions = { resizeDelay: 500 };



    function getPanels(target, withCenter) {
        var l = $(target),
            flag = (withCenter == null || withCenter == undefined) ? true : withCenter,
            regions = flag ? ["north", "west", "east", "center", "south"] : ["north", "west", "east", "south"];
        return $.array.reduce(regions, function (prev, val, index) {
            var p = l.layout("panel", val);
            if (p && p.length) {
                prev.push({ region: val, panel: p });
                prev[val] = p;
            }
            return prev;
        }, []);
    };

    function collapseRegion(l, region) {
        var p = l.layout("panel", region);
        if (p && p.length) {
            var opts = p.panel("options");
            if (!opts.collapsed) { l.layout("collapse", region); }
        }
    };

    function collapseAll(target) {
        var l = $(target), panels = l.layout("panels", false);
        $.each(panels, function (index, item) {
            var opts = item.panel.panel("options");
            if (!opts.collapsed) { l.layout("collapse", item.region); }
        });
        $.util.exec(function () { l.layout("resize"); }, $.fn.layout.extensions.resizeDelay);
    };

    function expandRegion(l, region) {
        var p = l.layout("panel", region);
        if (p && p.length) {
            var opts = p.panel("options");
            if (opts.collapsed) { l.layout("expand", region); }
        }
    };

    function expandAll(target) {
        var l = $(target), panels = l.layout("panels", false);
        $.each(panels, function (index, item) {
            var opts = item.panel.panel("options");
            if (opts.collapsed) { l.layout("expand", item.region); }
        });
        $.util.exec(function () { l.layout("resize"); }, $.fn.layout.extensions.resizeDelay);
    };


    function toggle(target, region) {
        if (!$.array.contains(["north", "west", "east", "center", "south"], region)) { return; }
        var l = $(target), p = l.layout("panel", region);
        if (p && p.length) {
            var opts = p.panel("options");
            if (opts.collapsed) { l.layout("expand", region); } else { l.layout("collapse", region); }
        }
    };

    function toggleAll(target, type) {
        if (!$.array.contains(["collapse", "expand", "toggle"], type)) { type = "toggle"; }
        var l = $(target), regions = ["north", "west", "east", "south"],
            hasCollapsed = $.array.some(regions, function (region) {
                var p = l.layout("panel", region);
                if (p && p.length) { var opts = p.panel("options"); return opts.collapsed ? true : false; } else { return false; }
            }),
            hasExpanded = $.array.some(regions, function (region) {
                var p = l.layout("panel", region);
                if (p && p.length) { var opts = p.panel("options"); return !opts.collapsed ? true : false; } else { return false; }
            });
        switch (type) {
            case "collapse":
                l.layout(hasExpanded ? "collapseAll" : "expandAll");
                break;
            case "expand":
                l.layout(hasCollapsed ? "expandAll" : "collapseAll");
                break;
            case "toggle":
                toggleRegions();
                break;
            default:
                toggleRegions();
                break;
        }
        function toggleRegions() {
            $.each(regions, function (i, region) {
                l.layout("toggle", region);
            });
            $.util.exec(function () { l.layout("resize"); }, $.fn.layout.extensions.resizeDelay);
        };
    };




    var defaults = $.fn.layout.extensions.defaults = {};

    var methods = $.fn.layout.extensions.methods = {

        // 扩展 easyui-layout 组件的自定义方法；获取 easyui-layout 组件的所有 panel 面板；
        // 该方法的参数 withCenter 是一个 boolean 类型值，默认为 true；表示返回的数组中是否包含 center panel。
        // 返回值：该方法返回一个 Array 数组对象；数组中的每个元素都是一个包含如下属性定义的 JSON-Object：
        //      region  : String 类型值，表示该面板所在的位置，可能的值为 "north"、"west"、"east"、"center"、"south"；
        //      panel   : jQuery 对象，表示 easyui-panel 面板对象；
        panels: function (jq, withCenter) { return getPanels(jq[0], withCenter); },

        //  扩展 easyui-layout 组件的自定义方法；用于折叠 easyui-layout 组件除 center 位置外的所有 panel 面板；
        //  返回值：返回表示当前 easyui-combo layout jQuery 链式对象。
        collapseAll: function (jq) { return jq.each(function () { collapseAll(this); }); },

        //  扩展 easyui-layout 组件的自定义方法；用于展开 easyui-layout 组件除 center 位置外的所有 panel 面板；
        //  返回值：返回表示当前 easyui-combo layout jQuery 链式对象。
        expandAll: function (jq) { return jq.each(function () { expandAll(this); }); },

        //  扩展 easyui-layout 组件的自定义方法；用于切换 panel 面板的 折叠/展开 状态；该方法定义如下参数：
        //      region: String 类型值，表示要切换 折叠/展开 状态的面板的位置；
        //  返回值：返回表示当前 easyui-combo layout jQuery 链式对象。
        toggle: function (jq, region) { return jq.each(function () { toggle(this, region); }); },

        //  扩展 easyui-layout 组件的自定义方法；用于切换所有 panel 面板的 折叠/展开 状态；该方法定义如下参数：
        //      type:   String 类型值，表示在进行 折叠/展开 操作时的操作方式；该参数传入的值限定在以下范围内：
        //          "collapse": 当既有展开的面板也有折叠的面板时，对所有面板执行折叠操作；
        //          "expand"  : 当既有展开的面板也有折叠的面板时，对所有面板执行展开操作；
        //          "toggle"  : 当既有展开的面板也有折叠的面板时，对所有面板执行切换 折叠/展开 状态操作；默认值。
        //  返回值：返回表示当前 easyui-combo layout jQuery 链式对象。
        toggleAll: function (jq, type) { return jq.each(function () { toggleAll(this, type); }); }
    };


    $.extend($.fn.layout.defaults, defaults);
    $.extend($.fn.layout.methods, methods);

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.datagrid.js" />
/**
* jQuery EasyUI datagrid Extensions 1.0 beta
* jQuery EasyUI datagrid 组件扩展
* jeasyui.extensions.datagrid.js
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.panel.js v1.0 beta late 和 jeasyui.extensions.window.js v1.0 beta late(可选)
*/
(function ($, undefined) {

    $.fn.datagrid.extensions = {};

    /************************  initExtend Methods Begin  ************************/

    var _updateRow = $.fn.datagrid.methods.updateRow;
    var _appendRow = $.fn.datagrid.methods.appendRow;
    var _insertRow = $.fn.datagrid.methods.insertRow;
    var updateRow = function (target, param) {
        if (!param || !param.row || !$.isNumeric(param.index)) { return; }
        var t = $(target), opts = t.datagrid("options");
        if ($.isFunction(opts.onBeforeUpdateRow) && opts.onBeforeUpdateRow.call(target, param.index, param.row) == false) { return; }
        _updateRow.call(t, t, param);
        initHeaderColumnFilterContainer(t, opts);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, param.index, param.row);
        if ($.isFunction(opts.onUpdateRow)) { opts.onUpdateRow.call(target, param.index, param.row); }
    };
    var appendRow = function (target, row) {
        if (!row) { return; }
        var t = $(target), opts = t.datagrid("options");
        if ($.isFunction(opts.onBeforeAppendRow) && opts.onBeforeAppendRow.call(target, row) == false) { return; }
        _appendRow.call(t, t, row);
        var rows = t.datagrid("getRows"), index = rows.length - 1;
        initHeaderColumnFilterContainer(t, opts);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, index, row);
        if ($.isFunction(opts.onAppendRow)) { opts.onAppendRow.call(target, row); }
    };
    var insertRow = function (target, param) {
        if (!param || !param.row || !$.isNumeric(param.index)) { return; }
        var t = $(target), opts = t.datagrid("options");
        if ($.isFunction(opts.onBeforeInsertRow) && opts.onBeforeInsertRow.call(target, param.index, param.row) == false) { return; }
        _insertRow.call(t, t, param);
        initHeaderColumnFilterContainer(t, opts);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, param.index, param.row);
        if ($.isFunction(opts.onInsertRow)) { opts.onInsertRow.call(target, param.index, param.row); }
    };


    var _beginEdit = $.fn.datagrid.methods.beginEdit;
    var beginEdit = function (target, index) {
        var t = $(target), opts = t.datagrid("options"), ret = _beginEdit.call(t, t, index);
        if (opts.autoFocusField) {
            var editors = t.datagrid("getEditors", index);
            if (editors.length) {
                var editor = $.array.first(editors, function (val) { return val.field == opts.autoFocusField; });
                if (!editor) { editor = editors[0]; }
                if (editor) {
                    $.util.exec(function () {
                        if (editor.actions && $.isFunction(editor.actions.setFocus)) {
                            editor.actions.setFocus(editor.target[0]);
                        } else {
                            editor.target.focus();
                        }
                    });
                }
            }
        }
        return ret;
    };




    var isChecked = function (target, index) {
        var t = $(target), rows = t.datagrid("getChecked"),
            list = $.array.map(rows, function (val) { return t.datagrid("getRowIndex", val); });
        return $.array.contains(list, index);
    };

    var isSelected = function (target, index) {
        var t = $(target), rows = t.datagrid("getSelections"),
            list = $.array.map(rows, function (val) { return t.datagrid("getRowIndex", val); });
        return $.array.contains(list, index);
    };

    var isEditing = function (target, index) {
        var t = $(target), panel = t.datagrid("getPanel");
        return panel.find("div.datagrid-view div.datagrid-body table tr.datagrid-row[datagrid-row-index=" + index + "]").hasClass("datagrid-row-editing");
    };

    var getEditingRowIndex = function (target) {
        var array = getEditingRowIndexs(target);
        return array.length ? array[0] : -1;
    };

    var getEditingRowIndexs = function (target) {
        var t = $(target), panel = t.datagrid("getPanel"),
            rows = panel.find("div.datagrid-view div.datagrid-body table tr.datagrid-row.datagrid-row-editing").map(function () {
                return window.parseInt($(this).attr("datagrid-row-index"));
            }),
            array = $.array.distinct($.array.clone(rows));
        return array;
    };

    var freezeColumn = function (target, field) {
        var t = $(target), fields = t.datagrid("getColumnFields"), frozenFields = t.datagrid("getColumnFields", true);
        if (!frozenFields || !frozenFields.length || !$.array.contains(fields, field) || $.array.contains(frozenFields, field)) { return; }
        t.datagrid("moveColumn", { source: field, target: frozenFields[frozenFields.length - 1], point: "after" });
    };

    var unfreezeColumn = function (target, field) {
        var t = $(target), fields = t.datagrid("getColumnFields"), frozenFields = t.datagrid("getColumnFields", true);
        if (!fields || !fields.length || $.array.contains(fields, field) || !$.array.contains(frozenFields, field)) { return; }
        t.datagrid("moveColumn", { source: field, target: fields[0], point: "before" });
    };

    var moveRow = function (target, param) {
        if (!param || !$.isNumeric(param.source) || !$.isNumeric(param.target) || param.source == param.target || !param.point) { return; }
        if (!$.array.contains(["top", "bottom"], param.point)) { param.point = "top"; }
        var t = $(target), opts = t.datagrid("options"), rows = t.datagrid("getRows"),
            sourceRow = rows[param.source], targetRow = rows[param.target];
        if (!sourceRow || !targetRow) { return; }
        if ($.isFunction(opts.onBeforeDrop) && opts.onBeforeDrop.call(target, targetRow, sourceRow, param.point) == false) { return; }
        var row = t.datagrid("popRow", param.source), index = t.datagrid("getRowIndex", targetRow);
        rows = t.datagrid("getRows");
        switch (param.point) {
            case "top": t.datagrid("insertRow", { index: index, row: row }); break;
            case "bottom":
                if (index++ >= rows.length) {
                    t.datagrid("appendRow", row);
                } else {
                    t.datagrid("insertRow", { index: index, row: row });
                }
                break;
            default: break;
        }
        if (row && $.isFunction(opts.onDrop)) { opts.onDrop.call(target, targetRow, sourceRow, param.point); }
    };

    var shiftRow = function (target, param) {
        if (!param || !$.isNumeric(param.index) || !param.point || !$.array.contains(["up", "down"], param.point)) { return; }
        var t = $(target), opts = t.datagrid("options"), index = param.point == "up" ? param.index - 1 : param.index + 1,
            point = param.point == "up" ? "top" : "bottom";
        t.datagrid("moveRow", { source: param.index, target: index, point: point });
    };

    var getNextRow = function (target, index) {
        var t = $(target), rows = t.datagrid("getRows"), i = index + 1;
        return rows[i] ? rows[i] : null;
    };

    var getPrevRow = function (target, index) {
        var t = $(target), rows = t.datagrid("getRows"), i = index - 1;
        return rows[i] ? rows[i] : null;
    };

    var popRow = function (target, index) {
        var t = $(target), rows = t.datagrid("getRows"), row = rows[index];
        if (!row) { return null; }
        t.datagrid("deleteRow", index);
        return row;
    };

    var enableRowDnd = function (target) {
        var t = $(target), opts = t.datagrid("options");
        t.datagrid("getPanel").find("div.datagrid-view div.datagrid-body table tr.datagrid-row").draggable({
            disabled: false, revert: true, cursor: "default", deltaX: 10, deltaY: 5,
            proxy: function (source) {
                var tr = $(source), index = parseInt(tr.attr("datagrid-row-index")),
                    dom = t.datagrid("getRowDom", index).clone(),
                    temp = $("<tr></tr>").addClass("datagrid-row datagrid-row-selected");
                $("<td><span class='tree-dnd-icon tree-dnd-no' ></span></td>").appendTo(temp);
                var td = dom.find("td").each(function (i) { if (i < 6) { temp.append(this); } });
                if (td.length > 6) { $("<td>...</td>").css("width", "40px").appendTo(temp); }
                return $("<table></table>").addClass("tree-node-proxy").appendTo("body").append(temp).hide();
            }, onBeforeDrag: function (e) {
                var tr = $(this), index = parseInt(tr.attr("datagrid-row-index")), row = t.datagrid("getRowData", index);
                if ($.isFunction(opts.onBeforeDrag) && opts.onBeforeDrag.call(target, index, row) == false) { return false; }
                if (e.which != 1) { return false; }
                if (e.target.type == "checkbox") { return false; }
            }, onStartDrag: function () {
                var tr = $(this), index = parseInt(tr.attr("datagrid-row-index")), row = t.datagrid("getRowData", index);
                tr.draggable("proxy").css({ left: -10000, top: -10000 });
                if ($.isFunction(opts.onBeforeDrag)) { opts.onStartDrag.call(target, index, row); }
            }, onStopDrag: function () {
                var tr = $(this), index = parseInt(tr.attr("datagrid-row-index")), row = t.datagrid("getRowData", index);
                if ($.isFunction(opts.onStopDrag)) { opts.onStopDrag.call(target, index, row); }
            }, onDrag: function (e) {
                var x1 = e.pageX, y1 = e.pageY, x2 = e.data.startX, y2 = e.data.startY;
                var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                if (d > 15) { $(this).draggable("proxy").show(); }
                this.pageY = e.pageY;
            }
        }).droppable({
            accept: "tr.datagrid-row",
            onDragEnter: function (e, source) {
                var droper = $(this), drager = $(source),
                    droperIndex = parseInt(droper.attr("datagrid-row-index")),
                    dragerIndex = parseInt(drager.attr("datagrid-row-index")),
                    droperRow = t.datagrid("getRowData", droperIndex), dragerRow = t.datagrid("getRowData", dragerIndex),
                    droperRowDom = t.datagrid("getRowDom", droperIndex),
                    mark = droperRowDom.find("td");
                var dnd = droper.data("dnd"), data = {
                    droper: droper, drager: drager, droperIndex: droperIndex, dragerIndex: dragerIndex,
                    droperRow: droperRow, dragerRow: dragerRow, droperRowDom: droperRowDom, mark: mark
                };
                if (!dnd) { droper.data("dnd", data); } else { $.extend(dnd, data); }
                if ($.isFunction(opts.onDragEnter) && opts.onDragEnter.call(target, droperRow, dragerRow) == false) {
                    setDroppableStatus(drager, false);
                    mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                    droper.droppable("disable");
                }
            },
            onDragOver: function (e, source) {
                var droper = $(this), dnd = droper.data("dnd"), drager = dnd.drager,
                    droperRow = dnd.droperRow, dragerRow = dnd.dragerRow, mark = dnd.mark;
                if (droper.droppable("options").disabled) { return; }
                var pageY = source.pageY, top = droper.offset().top, height = top + droper.outerHeight();
                setDroppableStatus(drager, true);
                mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                if (pageY > top + (height - top) / 2) {
                    mark.addClass("datagrid-header-cell-bottom");
                } else {
                    mark.addClass("datagrid-header-cell-top");
                }
                if (opts.onDragOver.call(target, droperRow, dragerRow) == false) {
                    setDroppableStatus(drager, false);
                    mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                    droper.droppable("disable");
                }
            },
            onDragLeave: function (e, source) {
                var droper = $(this), dnd = droper.data("dnd"), drager = dnd.drager,
                    droperRow = dnd.droperRow, dragerRow = dnd.dragerRow, mark = dnd.mark;
                setDroppableStatus(drager, false);
                mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                if ($.isFunction(opts.onDragLeave)) { opts.onDragLeave.call(target, droperRow, dragerRow); }
            },
            onDrop: function (e, source) {
                var droper = $(this), dnd = droper.data("dnd"),
                    droperIndex = dnd.droperIndex, dragerIndex = dnd.dragerIndex, mark = dnd.mark,
                    point = mark.hasClass("datagrid-header-cell-top") ? "top" : "bottom";
                t.datagrid("moveRow", { target: droperIndex, source: dragerIndex, point: point });
                mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
            }
        });
        opts.dndRow = true;
        function setDroppableStatus(source, state) {
            var icon = source.draggable("proxy").find("span.tree-dnd-icon");
            icon.removeClass("tree-dnd-yes tree-dnd-no").addClass(state ? "tree-dnd-yes" : "tree-dnd-no");
        };
    };

    var disableRowDnd = function (target) {
        var t = $(target), opts = t.datagrid("options");
        t.datagrid("getPanel").find("div.datagrid-view div.datagrid-body table tr.datagrid-row").draggable("disable");
        opts.dndRow = false;
    };



    var getNextColumn = function (target, field) {
        var t = $(target),
            fields = $.array.merge([], t.datagrid("getColumnFields", true), t.datagrid("getColumnFields", false)),
            index = $.array.indexOf(fields, field);
        if (index == -1 || index + 1 >= fields.length) { return null; }
        return t.datagrid("getColumnOption", fields[index + 1]);
    };

    var getPrevColumn = function (target, field) {
        var t = $(target),
            fields = $.array.merge([], t.datagrid("getColumnFields", true), t.datagrid("getColumnFields", false)),
            index = $.array.indexOf(fields, field);
        if (index < 1) { return null; }
        return t.datagrid("getColumnOption", fields[index - 1]);
    };


    var moveColumn = function (target, param) {
        if (!param || !param.source || !param.target || param.source == param.target || !param.point) { return; };
        if (!$.array.contains(["before", "after"], param.point)) { param.point = "before"; }
        var t = $(target);
        if (t.datagrid("hasMuliRowHeader")) { return; }
        var opts = t.datagrid("options"), sourceFrozen, targetFrozen,
            fields = t.datagrid("getColumnFields"), frozenFields = t.datagrid("getColumnFields", true);
        if ($.array.contains(fields, param.source)) { sourceFrozen = false; }
        if (sourceFrozen == undefined && $.array.contains(frozenFields, param.source)) { sourceFrozen = true; }
        if ($.array.contains(fields, param.target)) { targetFrozen = false; }
        if (targetFrozen == undefined && $.array.contains(frozenFields, param.target)) { targetFrozen = true; }
        if (sourceFrozen == undefined || targetFrozen == undefined) { return; }
        if ($.isFunction(opts.onBeforeMoveColumn) && opts.onBeforeMoveColumn.call(target, param.source, param.target, param.point) == false) { return; }
        var panel = t.datagrid("getPanel"), view = panel.find("div.datagrid-view"),
            view1 = view.find("div.datagrid-view1"), view2 = view.find("div.datagrid-view2"),
            headerRow1 = view1.find("div.datagrid-header table tr.datagrid-header-row"),
            headerRow2 = view2.find("div.datagrid-header table tr.datagrid-header-row"),
            borderRow1 = view1.find("div.datagrid-body table tr.datagrid-row"),
            borderRow2 = view2.find("div.datagrid-body table tr.datagrid-row"),
            sourceHeaderTd = sourceFrozen ? headerRow1.find("td[field=" + param.source + "]") : headerRow2.find("td[field=" + param.source + "]"),
            targetHeaderTd = targetFrozen ? headerRow1.find("td[field=" + param.target + "]") : headerRow2.find("td[field=" + param.target + "]"),
            sourceRow = sourceFrozen ? borderRow1 : borderRow2,
            targetRow = targetFrozen ? borderRow1 : borderRow2;
        if (sourceRow.length != targetRow.length) { return; }
        targetHeaderTd[param.point](sourceHeaderTd);
        targetRow.each(function (i, n) {
            var targetBodyTd = $(this).find("td[field=" + param.target + "]"), sourceBodyTd = $(sourceRow[i]).find("td[field=" + param.source + "]");
            targetBodyTd[param.point](sourceBodyTd);
        });
        var sourceOpts = t.datagrid("getColumnOption", param.source), targetOpts = t.datagrid("getColumnOption", param.target),
            sourceColumns = sourceFrozen ? opts.frozenColumns[0] : opts.columns[0],
            targetColumns = targetFrozen ? opts.frozenColumns[0] : opts.columns[0],
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        $.array.remove(sourceColumns, sourceOpts);
        var index = $.array.indexOf(targetColumns, targetOpts);
        if (index > -1) { $.array.insert(targetColumns, param.point == "before" ? index : index + 1, sourceOpts); }
        t.datagrid("fixColumnSize");
        if (sourceFrozen) {
            if (!targetFrozen) {
                index = $.array.indexOf(exts.fields, param.target);
                $.array.insert(exts.fields, param.point == "before" ? index : index + 1, param.source);
                $.array.insert(exts.fieldOptions, param.point == "before" ? index : index + 1, sourceOpts);
                $.array.insert(exts.fieldOptionsBackup, param.point == "before" ? index : index + 1, $.extend({}, sourceOpts));
            }
        }
        if (!sourceFrozen) {
            index = $.array.indexOf(exts.fields, param.source);
            if (targetFrozen) {
                $.array.removeAt(exts.fields, index);
                $.array.removeAt(exts.fieldOptions, index);
                $.array.removeAt(exts.fieldOptionsBackup, index);
            } else {
                var fieldOpts = exts.fieldOptions[index], fieldOptsBak = exts.fieldOptionsBackup[index];
                $.array.removeAt(exts.fields, index);
                $.array.removeAt(exts.fieldOptions, index);
                $.array.removeAt(exts.fieldOptionsBackup, index);
                index = $.array.indexOf(exts.fields, param.target);
                $.array.insert(exts.fields, param.point == "before" ? index : index + 1, param.source);
                $.array.insert(exts.fieldOptions, param.point == "before" ? index : index + 1, fieldOpts);
                $.array.insert(exts.fieldOptionsBackup, param.point == "before" ? index : index + 1, fieldOptsBak);
            }
        }
        if ($.isFunction(opts.onMoveColumn)) { opts.onMoveColumn.call(target, param.source, param.target, param.point); }
    }

    var shiftColumn = function (target, param) {
        if (!param || !param.field || !param.point) { return; };
        if (!$.array.contains(["before", "after"], param.point)) { param.point = "before"; }
        var t = $(target), fields = t.datagrid("getColumnFields", "all"),
            index = $.array.indexOf(fields, param.field);
        if (index == -1 || (param.point == "before" && index == 0) || (param.point == "after" && index == fields.length - 1)) { return; }
        var target = fields[param.point == "before" ? index - 1 : index + 1];
        t.datagrid("moveColumn", { source: param.field, target: target, point: param.point });
    };


    var deleteColumn = function (target, field) {
        var t = $(target), opts = t.datagrid("options"),
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        if ($.isFunction(opts.onBeforeDeleteColumn) && opts.onBeforeDeleteColumn.call(target, field) == false) { return; }
        removeField(opts, field, exts);
        t.datagrid("getColumnDom", { field: field, header: true }).remove();
        if ($.isFunction(opts.onDeleteColumn)) { opts.onDeleteColumn.call(target, field); }
    };

    var popColumn = function (target, field) {
        var t = $(target), colOpts = t.datagrid("getColumnOption", field);
        if (colOpts) { t.datagrid("deleteColumn", field); }
        return colOpts
    };

    var removeField = $.fn.datagrid.extensions.removeField = function (opts, field, exts) {
        var columns, frozen, i = -1, j = -1;
        if ($.array.likeArray(opts.frozenColumns)) {
            $.each(opts.frozenColumns, function (m, x) {
                if ($.array.likeArray(this)) {
                    $.each(this, function (n, y) {
                        if (y.field == field) { j = n; return false; }
                    });
                } else { if (x.field == field) { j = m; return false; } }
                if (j > -1) { i = m; return false; }
            });
            if (j > -1) { frozen = true; }
        }
        if (frozen == undefined && $.array.likeArray(opts.columns)) {
            $.each(opts.columns, function (m, x) {
                if ($.array.likeArray(this)) {
                    $.each(this, function (n, y) {
                        if (y.field == field) { j = n; return false; }
                    });
                } else { if (x.field == field) { j = m; return false; } }
                if (j > -1) { i = m; return false; }
            });
            if (j > -1) { frozen = false; }
        }
        if (j > -1) {
            columns = (frozen ? opts.frozenColumns : opts.columns);
            columns = i > -1 ? columns[i] : columns;
            $.array.removeAt(columns, j);
            index = $.array.indexOf(exts.fields, field);
            $.array.remove(exts.fields, field);
            $.array.removeAt(exts.fieldOptions, index);
            $.array.removeAt(exts.fieldOptionsBackup, index);
        }
    };






    var hasMuliRowHeader = function (target) {
        var t = $(target), opts = t.datagrid("options");
        return (opts.columns && opts.columns.length > 1 && opts.columns[1].length > 0)
            || (opts.frozenColumns && opts.frozenColumns.length > 1 && opts.frozenColumns[1].length > 0);
    };

    var findRows = function (target, param) {
        var t = $(target), rows = t.datagrid("getRows"), ret;
        if ($.isFunction(param)) {
            ret = $.array.filter(rows, param);
        } else if ($.array.likeArray(param) && !$.util.isString(param)) {
            ret = $.array.map(param, function (val) { return findRow(target, val, t, rows); });
            ret = $.array.filter(ret, function (val) { return val != undefined && val != null; });
        } else {
            ret = [findRow(target, param, t, rows)];
        }
        return ret;
    };

    var findRow = function (target, param, grid, rows) {
        var t = grid || $(target), data = rows || t.datagrid("getRows"), opts = t.datagrid("options");
        return $.array.first(data, $.isFunction(param) ? param : function (val) { return val[opts.idField] == param; });
    };

    var _deleteRow = $.fn.datagrid.methods.deleteRow;
    var deleteRow = function (target, param, doFilter) {
        var t = $(target), opts = t.datagrid("options"), isFunc = $.isFunction(param), index, row;
        if (doFilter == undefined || doFilter == null) { doFilter = true; }
        if (isFunc) {
            var rows = t.datagrid("getRows");
            row = $.array.first(rows, param);
            index = t.datagrid("getRowIndex", row);
        } else {
            //index = $.isNumeric(param) ? param : t.datagrid("getRowIndex", param);
            index = param;
            row = t.datagrid("getRowData", index);
        }
        //if ($.isNumeric(index) && index > -1 && $.isFunction(opts.onBeforeDeleteRow) && opts.onBeforeDeleteRow.call(target, index, row) != false) {
        if ($.isNumeric(index) && index > -1 && $.isFunction(opts.onBeforeDeleteRow) && opts.onBeforeDeleteRow.call(target, index, row) == false) { return; }
        _deleteRow.call(t, t, index);
        if ($.isFunction(opts.onDeleteRow)) { opts.onDeleteRow.call(target, index, row); }
        if (doFilter) {
            initHeaderColumnFilterContainer(t, opts);
        }
    };

    var deleteRows = function (target, param) {
        var t = $(target), opts = t.datagrid("options"), isArray = $.array.likeArrayNoString(param);
        if (isArray = $.array.likeArrayNoString(param)) {
            $.each(param, function (index, val) { deleteRow(target, val, false); });
        } else {
            var t = $(target), rows = t.datagrid("getRows");
            $.each(rows, function (index, row) {
                if (param.call(row, row, index, rows) == true) {
                    var i = t.datagrid("getRowIndex", row);
                    _deleteRow.call(t, t, i);
                }
            });
        }
        initHeaderColumnFilterContainer(t, opts);
    };

    var setColumnTitle = function (target, param) {
        if (param && param.field && param.title) {
            var t = $(target), colOpts = t.datagrid("getColumnOption", param.field),
                field = param.field, title = param.title,
                panel = t.datagrid("getPanel"),
                td = panel.find("div.datagrid-view div.datagrid-header tr.datagrid-header-row td[field=" + field + "]");
            if (td.length) { td.find("div.datagrid-cell span:first").html(title); colOpts.title = title; }
        }
    };

    var setColumnWidth = function (target, param) {
        if (param && param.field && param.width && $.isNumeric(param.width)) {
            var state = $.data(target, "datagrid"),
                t = $(target),
                opts = t.datagrid("options"),
                colOpts = t.datagrid("getColumnOption", param.field),
                field = param.field, width = param.width,
                cell = t.datagrid("getPanel").find("div.datagrid-view div.datagrid-header tr.datagrid-header-row td[field=" + field + "] div.datagrid-cell");
            if (cell.length) {
                var diff = cell._outerWidth() - parseInt(cell[0].style.width);
                cell.css("height", "");
                colOpts.width = width;
                colOpts.boxWidth = width - diff;
                colOpts.auto = undefined;
                cell.width(colOpts.boxWidth);
                t.datagrid("fixColumnSize", field);
                t.datagrid("fitColumns");
                opts.onResizeColumn.call(target, field, width);
            }
        }
    };


    $.fn.datagrid.extensions.parseOffset = function (offset) {
        var o = { enable: offset ? true : false };
        if (o.enable) { $.extend(o, offset); }
        o.width = $.isNumeric(o.width) ? o.width : 0;
        o.height = $.isNumeric(o.height) ? o.height : 0;
        return o;
    };
    var setOffset = function (target, offset) {
        var t = $(target), opts = t.datagrid("options"),
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        opts.offset = exts.offset = $.fn.datagrid.extensions.parseOffset(offset);
        if (exts.offset && exts.offset.enable) {
            if (!$.isFunction(exts.offsetFunction)) {
                exts.offsetFunction = function () {
                    if (!exts.offset.enable) { return; }
                    var size = $.util.windowSize();
                    t.datagrid("resize", { width: size.width + exts.offset.width, height: size.height + exts.offset.height });
                };
                $(window).resize(exts.offsetFunction);
            }
            exts.offsetFunction();
        }
    };

    var getColumnDom = function (target, param) {
        if ($.string.isNullOrEmpty(param)) { return $(); }
        var t = $(target), panel = t.datagrid("getPanel"),
            isObject = !$.string.isString(param),
            field = isObject ? param.field : param,
            header = isObject ? param.header : false,
            dom = panel.find("div.datagrid-view tr.datagrid-row td[field=" + field + "]");
        if (header) { dom = dom.add(panel.find("div.datagrid-view tr.datagrid-header-row td[field=" + field + "]")); }
        return dom;
    };

    var getColumnData = function (target, field) {
        var t = $(target), rows = t.datagrid("getRows");
        return $.array.map(rows, function (val) { return val[field]; });
    };

    var getRowDom = function (target, index) {
        if (!$.isNumeric(index) || index < 0) { return $(); }
        var t = $(target), panel = t.datagrid("getPanel");
        return panel.find("div.datagrid-view div.datagrid-body table tr.datagrid-row[datagrid-row-index=" + index + "]");
    };

    var getRowData = function (target, index) {
        if (!$.isNumeric(index) || index < 0) { return undefined; }
        var t = $(target), rows = t.datagrid("getRows");
        return rows[index];
    };

    var getCellDom = function (target, pos) {
        if (!pos || !pos.field || !$.isNumeric(pos.index) || pos.index < 0) { return $(); }
        var t = $(target), tr = t.datagrid("getRowDom", pos.index);
        return tr.find("td[field=" + pos.field + "] .datagrid-cell");
    };
    var getCellData = function (target, pos) {
        if (!pos || !pos.field || !$.isNumeric(pos.index) || pos.index < 0) { return; }
        var t = $(target), row = t.datagrid("getRowData", pos.index);
        return row[pos.field];
    };
    var getCellDisplay = function (target, pos) {
        var t = $(target), td = t.datagrid("getCellDom", pos);
        return td && td.length ? td.html() : undefined;
    };
    var getCellDisplayText = function (target, pos) {
        var t = $(target), td = t.datagrid("getCellDom", pos);
        return td && td.length ? td.text() : undefined;
    };

    var _getColumnFields = $.fn.datagrid.methods.getColumnFields;
    var getColumnFields = function (target, frozen) {
        var t = $(target);
        if (frozen == null || frozen == undefined || $.util.isBoolean(frozen)) { return _getColumnFields.call(t, t, frozen); }
        if ($.util.isString(frozen)) {
            return $.array.merge([], _getColumnFields.call(t, t, true), _getColumnFields.call(t, t, false));
        }
    };

    var getDistinctRows = function (target, field) {
        var t = $(target), fields = t.datagrid("getColumnFields", "all");
        if (!$.array.contains(fields, field)) { return []; }
        var rows = t.datagrid("getRows"), data = $.array.clone(rows);
        $.array.distinct(data, function (a, b) { return a[field] == b[field]; });
        return data;
    };

    var getDistinctColumnData = function (target, field) {
        var t = $(target), fields = t.datagrid("getColumnFields", "all");
        if (!$.array.contains(fields, field)) { return []; }
        var data = t.datagrid("getColumnData", field);
        $.array.distinct(data, function (a, b) { return a == b; });
        return data;
    };

    var getColumns = function (target, frozen) {
        var t = $(target), fields = getColumnFields(target, frozen);
        return $.array.map(fields, function (val) { return t.datagrid("getColumnOption", val); });
    };

    var getHiddenColumns = function (target, frozen) {
        var cols = getColumns(target, frozen);
        return $.array.filter(cols, function (val) { return val.hidden ? true : false; });
    };

    var getVisibleColumns = function (target, frozen) {
        var cols = getColumns(target, frozen);
        return $.array.filter(cols, function (val) { return !val.hidden ? true : false; });
    };

    var getHiddenColumnFields = function (target, frozen) {
        var cols = getHiddenColumns(target, frozen);
        return $.array.map(cols, function (val) { return val.field; });
    };

    var getVisibleColumnFields = function (target, frozen) {
        var cols = getVisibleColumns(target, frozen);
        return $.array.map(cols, function (val) { return val.field; });
    };

    var showRow = function (target, param, grid, options, data, extensions, refreshable) {
        var t = grid || $(target), rows = data || t.datagrid("getRows"),
            row = $.isFunction(param) ? findRow(target, param, t, rows) : param, index = t.datagrid("getRowIndex", row),
            refreshable = (refreshable == null || refreshable == undefined || refreshable == true) ? true : false;
        if (index > -1) {
            var opts = options || t.datagrid("options"), rowData = t.datagrid("getRowData", index),
                exts = extensions || (opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {}));
            exts.filterData = $.isArray(exts.filterData) ? exts.filterData : exts.filterData = [];
            t.datagrid("getRowDom", index).show();
            $.array.remove(exts.filterData, rowData);
            if (refreshable) { refreshColumnFilterStatus(t, opts, exts, rows); }
        }
    };

    var hideRow = function (target, param, grid, options, data, extensions, refreshable) {
        var t = grid || $(target), rows = data || t.datagrid("getRows"),
            row = $.isFunction(param) ? findRow(target, param, t, rows) : param, index = t.datagrid("getRowIndex", row),
            refreshable = refreshable == null || refreshable == undefined || refreshable == true ? true : false;
        if (index > -1) {
            var opts = options || t.datagrid("options"), rowData = t.datagrid("getRowData", index),
                exts = extensions || (opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {}));
            exts.filterData = $.isArray(exts.filterData) ? exts.filterData : [];
            t.datagrid("unselectRow", index).datagrid("uncheckRow", index).datagrid("getRowDom", index).hide();
            $.array.attach(exts.filterData, rowData);
            if (refreshable) { refreshColumnFilterStatus(t, opts, exts, rows); }
        }
    };

    var showRows = function (target, param) {
        var t = $(target), opts = t.datagrid("options"), rows = t.datagrid("getRows"), array,
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        if (param === true) {
            exts.filterData = [];
            var panel = t.datagrid("getPanel"), icons = panel.find("div.datagrid-header-filter-item-icon");
            panel.find(".datagrid-view .datagrid-body tr.datagrid-row").show();
            setItemIconCls(icons, "tree-checkbox1");
            refreshColumnFilterPagerStatus(t, opts);
        } else if ($.isFunction(param)) {
            array = $.array.filter(rows, param);
        } else if ($.array.likeArray(param) && !$.util.isString(param)) {
            array = param;
        } else { array = [param]; }
        if (array) {
            $.each(array, function (index, val) { showRow(target, val, t, opts, rows, exts, false); });
            refreshColumnFilterStatus(t, opts, exts, rows);
        }
    };

    var hideRows = function (target, param) {
        var t = $(target), opts = t.datagrid("options"), rows = t.datagrid("getRows"), array,
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        if (param === true) {
            t.datagrid("unselectAll").datagrid("uncheckAll");
            exts.filterData = $.array.clone(rows);
            var panel = t.datagrid("getPanel"), icons = panel.find("div.datagrid-header-filter-item-icon");
            panel.find(".datagrid-view .datagrid-body tr.datagrid-row").hide();
            setItemIconCls(icons, "tree-checkbox0");
            refreshColumnFilterPagerStatus(t, opts);
        } else if ($.isFunction(param)) {
            array = $.array.filter(rows, param);
        } else if ($.array.likeArray(param) && !$.util.isString(param)) {
            array = param;
        } else { array = [param]; }
        if (array) {
            $.each(array, function (index, val) { hideRow(target, val, t, opts, rows, exts, false); });
            refreshColumnFilterStatus(t, opts, exts, rows);
        }
    };

    var getHiddenRows = function (target) {
        var t = $(target), opts = t.datagrid("options"),
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        return exts.filterData;
    };

    var getVisibleRows = function (target) {
        var t = $(target), opts = t.datagrid("options"), rows = t.datagrid("getRows"),
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {}),
            filterData = $.isArray(exts.filterData) ? exts.filterData : [];
        return $.array.filter(rows, function (val) { return $.array.contains(filterData, val) ? false : true; });
    };

    var setColumnFilter = function (target, columnFilter) {
        var t = $(target),
            opts = t.datagrid("options"), exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {}),
            panel = t.datagrid("getPanel"),
            selector = "div.datagrid-view div.datagrid-header tr.datagrid-header-row div.datagrid-header-filter-container";
        if (!columnFilter) {
            var headerFields = panel.find(selector),
                length = headerFields.length, i = 0;
            headerFields.slideUp("slow", function () {
                if (++i == length) {
                    clearHeaderColumnFilter(t, opts);
                    opts.columnFilter = columnFilter;
                }
            });
        } else {
            opts.columnFilter = columnFilter;
            initHeaderColumnFilterContainer(t, opts, exts);
            $.util.exec(function () {
                panel.find(selector).hide().slideDown("slow");
            });
        }
    };

    var columnFilterSelect = function (target, param) {
        var t = $(target);
        if ($.util.isBoolean(param)) { t.datagrid(param ? "showRows" : "hideRows", true); return; }
        if (!param || !param.field) { return; }
        var field = param.field, value = param.value, isArray = $.array.likeArray(value) && !$.util.isString(value),
            finder = isArray ? function (val) { return $.array.contains(value, val[field]); } : function (val) { return value == val[field]; },
            rows = t.datagrid("findRows", finder);
        t.datagrid(param.selected ? "showRows" : "hideRows", rows);
    };




    var highlightColumn = function (target, field) {
        var t = $(target);
        var state = $.data(t[0], "datagrid"), opts = state.options;
        if (state.highlightField) {
            t.datagrid("getColumnDom", { field: state.highlightField, header: true }).removeClass("datagrid-row-over");
        }
        t.datagrid("getColumnDom", { field: field, header: true }).filter(function () {
            return !$(this).parent().hasClass("datagrid-row-selected");
        }).addClass("datagrid-row-over");
        state.highlightField = field;
    };

    var livesearch = function (target, param) {
        var t = $(target), panel = t.datagrid("getPanel"), cells, field, value = param, regular = false, ignoreCase = true, regexp;
        if ($.isPlainObject(param)) {
            value = param.value;
            field = param.field;
            regular = param.regular;
            ignoreCase = param.ignoreCase;
            cells = panel.find("div.datagrid-body tr.datagrid-row td[" + (field ? "field=" + field : "field") + "] div.datagrid-cell");
        } else {
            cells = panel.find("div.datagrid-body tr.datagrid-row td[field] div.datagrid-cell");
        }
        regexp = regular ? new RegExp(value, ignoreCase ? "gm" : "igm") : value;
        cells.each(function () {
            var cell = $(this);
            cell.find("span.datagrid-cell-hightlight").replaceWith(function () { return $(this).text(); });
            if (!value) { return; }
            var text = cell.html(); if (!text) { return; }
            cell.html($.string.replaceAll(text, value, "<span class='datagrid-cell-hightlight'>" + value + "</span>"));
        });
    };

    var exportGrid = function (target, isAll) {
        isAll = $.string.toBoolean(isAll);
        alert("导出" + (isAll ? "全部" : "当前页") + "数据");
    };

    /************************  initExtend Methods   End  ************************/


    var initColumnExtendProperties = $.fn.datagrid.extensions.initColumnExtendProperties = function (t, exts) {
        if (exts._initializedExtendProperties) { return; }
        var cols = t.datagrid("getColumns", "all");
        $.each(cols, function (i, n) {
            $.union(n, $.fn.datagrid.extensions.columnOptions);
        });
        exts._initializedExtendProperties = true;
    };

    var initRowDndExtensions = $.fn.datagrid.extensions.initRowDndExtensions = function (t, opts) {
        opts = opts || t.datagrid("options");
        if (opts.dndRow) { t.datagrid("enableRowDnd"); }
    };


    /************************  initExtend ColumnFilter Begin  ************************/
    function initHeaderColumnFilterContainer(t, opts, exts) {
        exts = exts || (opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {}));
        initColumnExtendProperties(t, exts);
        var data = t.datagrid("getData"), oldData = exts.oldData;
        if (data != oldData) { exts.filterData = []; }
        clearHeaderColumnFilter(t, opts);
        refreshColumnFilterPagerStatus(t, opts);
        if (!opts.columnFilter) { return; }
        exts.oldData = data;
        var header = t.datagrid("getPanel").find("div.datagrid-view div.datagrid-header"),
            headerRows = header.find("table.datagrid-htable tr.datagrid-header-row"),
            headerFields = headerRows.find("td[field]").filter(function () {
                var td = $(this), colspan = td.attr("colspan");
                return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
            }),
            columnFilter = opts.columnFilter = $.extend({ panelHeight: 100, position: "top" }, opts.columnFilter),
            position = $.array.contains(["top", "bottom"], columnFilter.position) ? columnFilter.position : "top",
            panelHeight = columnFilter.panelHeight = $.isNumeric(columnFilter.panelHeight) && columnFilter.panelHeight >= 60 ? columnFilter.panelHeight : 60,
            height = header.height(), rows = t.datagrid("getRows");
        headerFields.each(function () {
            var td = $(this).addClass("datagrid-header-filter").removeClass("datagrid-header-filter-top datagrid-header-filter-bottom"),
                cell = td.find("div.datagrid-cell").addClass("datagrid-header-filter-cell"),
                field = td.attr("field"), colOpts = t.datagrid("getColumnOption", field), colWidth = colOpts.width,
                line = $("<hr />").addClass("datagrid-header-filter-line")[position == "top" ? "prependTo" : "appendTo"](this),
                container = $("<div></div>").attr("field", field).addClass("datagrid-header-filter-container").css({
                    height: columnFilter.panelHeight, width: colWidth
                })[position == "top" ? "prependTo" : "appendTo"](this);
            td.addClass(position == "top" ? "datagrid-header-filter-top" : "datagrid-header-filter-bottom");
            if (field) { initColumnFilterField(t, opts, exts, container, colOpts, rows, headerFields); }
        });
        if (exts.filterData && exts.filterData.length) {
            t.datagrid("hideRows", exts.filterData);
        } else {
            refreshColumnFilterStatus(t, opts, exts, rows, headerFields);
        }
    };

    function clearHeaderColumnFilter(t, opts) {
        if (!opts.columnFilter) { return; }
        var headerFields = t.datagrid("getPanel").find("div.datagrid-view div.datagrid-header table.datagrid-htable tr.datagrid-header-row td[field]").filter(function () {
            var td = $(this), colspan = td.attr("colspan");
            return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
        });
        headerFields.removeClass("datagrid-header-filter datagrid-header-filter-top datagrid-header-filter-bottom").find("div.datagrid-cell").removeClass("datagrid-header-filter-cell");
        headerFields.find("hr.datagrid-header-filter-line,div.datagrid-header-filter-container").remove();
        var fields = t.datagrid("getColumnFields", "all");
        t.datagrid("fixColumnSize", fields[fields.length - 1]);
    };

    function initColumnFilterField(t, opts, exts, container, colOpts, rows, headerFields) {
        if (!colOpts.filterable) { return; }
        var field = colOpts.field, distinctVals = t.datagrid("getDistinctColumnData", field),
            filter = $.array.contains(["checkbox", "livebox", "caps", "lower", "none"], colOpts.filter) ? colOpts.filter : "checkbox",
            precision = colOpts.precision, step = colOpts.step;
        switch (filter) {
            case "checkbox": initColumnFilterFieldCheckBox(t, exts, container, field, rows, distinctVals); break;
            case "livebox": initColumnFilterFieldLiveBox(t, container, field, rows); break;
            case "caps":
                initColumnFilerFieldSlider(t, container, field, step, precision, rows, distinctVals, "<=", opts.columnFilter.panelHeight, headerFields);
                break;
            case "lower":
                initColumnFilerFieldSlider(t, container, field, step, precision, rows, distinctVals, ">=", opts.columnFilter.panelHeight, headerFields);
                break;
            case "none": break;
        }
    };

    function initColumnFilterFieldCheckBox(t, exts, container, field, rows, distinctVals) {
        $.each(distinctVals, function (index, text) {
            var item = $("<div></div>").addClass("datagrid-header-filter-item").attr("text", text).appendTo(container),
                itemText = $("<div></div>").addClass("datagrid-header-filter-item-text").text(text).appendTo(item),
                icon = $("<div></div>").addClass("datagrid-header-filter-item-icon").appendTo(item),
                handler = function () {
                    var filterRows = $.array.filter(rows, function (value) { return value[field] == text; }),
                        hiddenRows = $.array.filter(exts.filterData, function (value) { return value[field] == text; });
                    t.datagrid(hiddenRows.length ? "showRows" : "hideRows", filterRows);
                };
            item.click(handler);
        });
    };

    function initColumnFilterFieldLiveBox(t, container, field, rows) {
        $("<div></div>").addClass("datagrid-header-filter-livebox-text").text("模糊过滤：").appendTo(container);
        var input = $("<input />").addClass("datagrid-header-filter-livebox").appendTo(container);
        var btn = $("<a />").linkbutton({ plain: true, iconCls: "icon-search" }).appendTo(container).click(function () {
            t.datagrid("showRows", true);
            var val = input.val();
            if ($.string.isNullOrEmpty(val)) { input.focus(); return; }
            var filterRows = $.array.filter(rows, function (value) { return String(value[field]).indexOf(val) == -1; });
            t.datagrid("hideRows", filterRows);
            input.focus();
        });
        $("<a />").linkbutton({ plain: true, iconCls: "icon-undo" }).appendTo(container).click(function () {
            var val = input.val();
            if (val) { input.val("").focus(); btn.click(); } else { input.focus(); }
        });
        input.keypress(function (e) { if (e.which == 13) { btn.click(); } });
    };

    function initColumnFilerFieldSlider(t, container, field, step, precision, rows, distinctVals, type, panelHeight, headerFileds) {
        var array = $.array.map(distinctVals, function (val) { val = parseFloat(val); return $.isNumeric(val) ? val : 0; }),
            min = array.length ? $.array.min(array) : 0, max = array.length ? $.array.max(array) : 0,
            maxPrecisionVal = array.length ? $.array.max(array, function (a, b) {
                return $.util.compare($.number.precision(a), $.number.precision(b));
            }) : 0,
            maxPrecision = array.length ? $.number.precision(maxPrecisionVal) : 0,
            height = panelHeight - 45,
            itemWrap = $("<div></div>").addClass("datagrid-header-filter-itemwrap").text(type).appendTo(container),
            sliderWrap = $("<div></div>").addClass("datagrid-header-filter-sliderwrap").css({
                height: height + 10
            })[type == "<=" ? "appendTo" : "prependTo"](container),
            input = $("<input />").addClass("datagrid-header-filter-numeric").appendTo(itemWrap),
            slider = $("<input />").addClass("datagrid-header-filter-slider").appendTo(sliderWrap),
            handler = function (newValue, oldValue) {
                changeSliderValue(t, field, rows, newValue, type, input, slider, headerFileds);
            };
        input.numberbox({ value: type == "<=" ? max : min, min: min, max: max, precision: precision, onChange: handler, height: 18 });
        input.keypress(function (e) { if (e.which == 13) { var val = input.val(); input.numberbox("setValue", $.isNumeric(val) ? val : 0); } });
        slider.slider({
            height: height, mode: "v", showTip: true, value: type == "<=" ? max : min,
            min: min, max: max, rule: [min, "|", max], step: step, onComplete: handler,
            tipFormatter: function (val) { return $.number.round(val || 0, maxPrecision); }
        });
    };

    function changeSliderValue(t, field, rows, value, type, input, slider, headerFileds) {
        var headerFields = headerFileds || t.datagrid("getPanel").find("div.datagrid-view div.datagrid-header table.datagrid-htable tr.datagrid-header-row td[field]").filter(function () {
            var td = $(this), colspan = td.attr("colspan");
            return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
        });
        var headerField = headerFields.filter(function () { return $(this).attr("field") == field; });
        input = input ? input : headerField.find(".datagrid-header-filter-numeric");
        slider = slider ? slider : headerField.find(".datagrid-header-filter-slider");
        var filterRows = $.array.filter(rows, function (val) {
            val = parseFloat(val[field]);
            val = $.isNumeric(val) ? val : 0;
            return type == ">=" ? (val < value) : (val > value);
        });
        t.datagrid("showRows", true).datagrid("hideRows", filterRows);
        input.numberbox("setValue", value);
        slider.slider("setValue", value);
    };



    function refreshColumnFilterStatus(t, opts, exts, rows, headerFields) {
        refreshColumnFilterPagerStatus(t, opts);
        if (!opts.columnFilter) { return; }
        headerFields = headerFields || t.datagrid("getPanel").find("div.datagrid-view div.datagrid-header table.datagrid-htable tr.datagrid-header-row td[field]").filter(function () {
            var td = $(this), colspan = td.attr("colspan");
            return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
        });
        headerFields.each(function () {
            var td = $(this), field = td.attr("field");
            refreshColumnFilterCellStatus(t, exts, rows, td, field);
        });
    };

    function refreshColumnFilterPagerStatus(t, opts) {
        if (!opts.pagination) { return; }
        var pager = t.datagrid("getPager");
        if (pager && pager.length) {
            var len = t.datagrid("getVisibleRows").length, total = t.datagrid("getRows").length,
                isShow = len < total ? true : false, visible = pager.find("div.pagination-visiblerows");
            if (opts.showFilterText == false || ((opts.showFilterText == null || opts.showFilterText == undefined) && !isShow)) {
                return visible.remove();
            }
            if (visible.length) {
                visible.html("当前页显示" + len + "/" + total + "行");
            } else {
                pager.find("div.pagination-info").before("<div class=\"pagination-visiblerows\">当前页显示" + len + "/" + total + "行</div>");
            }
        }
    };

    function refreshColumnFilterCellStatus(t, exts, rows, td, field) {
        var colOpts = colOpts = t.datagrid("getColumnOption", field), precision = colOpts.precision,
            filter = $.array.contains(["checkbox", "livebox", "caps", "lower", "none"], colOpts.filter) ? colOpts.filter : "checkbox";
        switch (filter) {
            case "checkbox": refreshColumnFilterCheckbox(t, exts, rows, td, field); break;
            case "livebox": refreshColumnFilterLiveBox(t, exts, rows, td, field); break;
            case "caps": refreshColumnFilterCaps(t, exts, rows, td, field); break;
            case "lower": refreshColumnFilterLower(t, exts, rows, td, field); break;
            case "none": break;
        };
    };


    function refreshColumnFilterCheckbox(t, exts, rows, td, field) {
        td.find("div.datagrid-header-filter-item").each(function () {
            var item = $(this), text = item.attr("text"), icon = item.find("div.datagrid-header-filter-item-icon");
            var length = $.array.sum(rows, function (val) { return val[field] == text ? 1 : 0; }),
                hiddenLength = $.array.sum(exts.filterData, function (val) { return val[field] == text ? 1 : 0; }),
                iconCls = hiddenLength == 0 ? "tree-checkbox1" : (hiddenLength >= length ? "tree-checkbox0" : "tree-checkbox2");
            $.easyui.tooltip.init(item, { content: ($.string.isNullOrEmpty(text) ? "空白" : text) + ": 共" + length + "个元素" });
            setItemIconCls(icon, iconCls);
        });
    };
    function setItemIconCls(icon, iconCls) { icon.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2").addClass(iconCls); };

    //  当过滤器组件进行值筛选操作后，livebox 以及 slider 不更新，所以下面这三个方法未实现。
    function refreshColumnFilterLiveBox(t, exts, rows, td, field) { };
    function refreshColumnFilterCaps(t, exts, rows, td, field) { };
    function refreshColumnFilterLower(t, exts, rows, td, field) { };


    /************************  initExtend ColumnFilter   End  ************************/



    /************************  initExtend initContextMenu & initDblClickRow Begin  ************************/
    function initHeaderContextMenu(t, opts, exts) {
        exts.onHeaderContextMenuBak = opts.onHeaderContextMenu;
        opts.onHeaderContextMenu = function (e, field) {
            if ($.isFunction(exts.onHeaderContextMenuBak)) { exts.onHeaderContextMenuBak.apply(this, arguments); }
            if (!opts.enableHeaderContextMenu) { return; }
            var eventData = $.fn.datagrid.extensions.parseContextMenuEventData(t, opts, e),
                items = parseHeaderContextMenuItems(t, opts, exts, e, field, eventData);
            $.easyui.showMenu({ items: items, left: e.pageX, top: e.pageY, hideDisabledMenu: opts.hideDisabledMenu });
            e.preventDefault();
        };
    };

    function initRowContextMenu(t, opts, exts) {
        exts.onRowContextMenuBak = opts.onRowContextMenu;
        opts.onRowContextMenu = function (e, rowIndex, rowData) {
            if ($.isFunction(exts.onRowContextMenuBak)) { exts.onRowContextMenuBak.apply(this, arguments); }
            if (opts.selectOnRowContextMenu) { t.datagrid("selectRow", rowIndex); }
            if (!opts.enableRowContextMenu) { return; }
            var eventData = $.fn.datagrid.extensions.parseContextMenuEventData(t, opts, e),
                items = parseRowContextMenuItems(t, opts, exts, e, rowIndex, rowData, eventData);
            if (opts.autoBindDblClickRow && opts.dblClickRowMenuIndex >= 0 && $.util.likeArray(opts.rowContextMenu) && !$.util.isString(opts.rowContextMenu)
                && opts.rowContextMenu.length > opts.dblClickRowMenuIndex) {
                items[opts.dblClickRowMenuIndex].bold = true;
            }
            $.easyui.showMenu({ items: items, left: e.pageX, top: e.pageY, hideDisabledMenu: opts.hideDisabledMenu });
            e.preventDefault();
        };
    };

    function initHeaderClickMenu(t, opts, exts) {
        if (!opts.enableHeaderClickMenu) { return; }
        t.datagrid("getPanel").find(".datagrid-view .datagrid-header table.datagrid-htable tr.datagrid-header-row td[field]").filter(function () {
            var td = $(this), colspan = td.attr("colspan");
            return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
        }).find("div.datagrid-cell").each(function () { initHeaderCellClickMenu(t, opts, exts, this); });
    };

    function initHeaderCellClickMenu(t, opts, exts, cell) {
        var arrow = $("<span class='s-btn-downarrow datagrid-header-cell-arrow'>&nbsp;</span>").click(function (e) {
            var span = $(this), offset = span.offset(), height = span.outerHeight(),
                field = span.parent().parent().attr("field"),
                eventData = $.fn.datagrid.extensions.parseContextMenuEventData(t, opts, e),
                items = parseHeaderContextMenuItems(t, opts, exts, e, field, eventData);
            var mm = $.easyui.showMenu({ items: items, left: offset.left, top: offset.top + height }),
                mmOpts = mm.menu("options"), onHide = mmOpts.onHide;
            arrow.hidable = false;
            mmOpts.onHide = function () {
                arrow.hidable = true;
                arrow.removeClass("datagrid-header-cell-arrow-show");
                onHide.apply(this, arguments);
            };
            return false;
        }).prependTo(cell);
        $(cell).off(".hoverArrow").on({
            "mouseenter.hoverArrow": function () {
                arrow.addClass("datagrid-header-cell-arrow-show");
            },
            "mouseleave.hoverArrow": function () {
                if (!$.util.isBoolean(arrow.hidable) || arrow.hidable) {
                    arrow.removeClass("datagrid-header-cell-arrow-show");
                }
            }
        });
    };


    function initDblClickRowEvent(t, opts, exts) {
        exts.onDblClickRowBak = opts.onDblClickRow;
        opts.onDblClickRow = function (rowIndex, rowData) {
            if ($.isFunction(exts.onDblClickRowBak)) { exts.onDblClickRowBak.apply(this, arguments); }
            //  t.datagrid("selectRow", rowIndex);
            var eventData = $.fn.datagrid.extensions.parseContextMenuEventData(t, opts, null);
            items = parseRowContextMenuItems(t, opts, exts, null, rowIndex, rowData, eventData);
            if (opts.autoBindDblClickRow && opts.dblClickRowMenuIndex >= 0 && $.util.likeArray(opts.rowContextMenu)
                && !$.util.isString(opts.rowContextMenu) && opts.rowContextMenu.length > opts.dblClickRowMenuIndex) {
                var item = items[opts.dblClickRowMenuIndex], handler = item.handler || item.onclick;
                if (!item.disabled) {
                    return handler(null, rowIndex, rowData, eventData, t, item, null);
                }
            }
            //if (opts.autoEditing) { t.datagrid("beginEdit", rowIndex); }
        };
    };

    function initAutoEditingEvent(t, opts, exts) {
        exts[opts.autoEditingEvent] = opts[opts.autoEditingEvent];
        opts[opts.autoEditingEvent] = function (rowIndex, rowData) {
            if ($.isFunction(exts[opts.autoEditingEvent])) { exts[opts.autoEditingEvent].apply(this, arguments); }
            if (opts.autoEditing) { t.datagrid("beginEdit", rowIndex); }
        }
    }

    function initFinishEditEvent(t, opts, exts) {
        $(opts.finishEditLocale).click(function (e) {
            if (opts.finishEditOnBlur && $.data(t[0], "datagrid")) {
                var body = t.datagrid("getPanel"), rows = t.datagrid("getEditingRowIndexs");
                if (!$.contains(body[0], e.target)) {
                    $.each(rows, function (ii, i) { t.datagrid(opts.finishEditMethod, i); });
                }
            }
        });
    };


    function parseHeaderContextMenuItems(t, opts, exts, e, field, eventData) {
        var items = [], contextMenu = $.util.likeArray(opts.headerContextMenu) && !$.util.isString(opts.headerContextMenu) ? opts.headerContextMenu : [];
        if (contextMenu.length) { $.array.merge(items, contextMenu); }
        var baseItems = parseHeaderBaseContextMenuItems(t, opts, exts, e, field, eventData);
        if (baseItems.length) { $.array.merge(items, "-", baseItems); }
        items = $.fn.datagrid.extensions.parseHeaderContextMenuMap(e, field, eventData, items, t);
        if (items[0] == "-") { $.array.removeAt(items, 0); }
        return items;
    }

    function parseRowContextMenuItems(t, opts, exts, e, rowIndex, rowData, eventData) {
        var items = [], contextMenu = $.util.likeArray(opts.rowContextMenu) && !$.util.isString(opts.rowContextMenu) ? opts.rowContextMenu : [];
        if (contextMenu.length) { $.array.merge(items, contextMenu); }
        var baseItems = parseRowBaseContextMenuItems(t, opts, exts, e, rowIndex, rowData, eventData);
        if (baseItems.length) { $.array.merge(items, "-", baseItems); }
        items = $.fn.datagrid.extensions.parseRowContextMenuMap(e, rowIndex, rowData, eventData, items, t);
        if (items[0] == "-") { $.array.removeAt(items, 0); }
        return items;
    }



    function parseHeaderBaseContextMenuItems(t, opts, exts, e, field, eventData) {
        var mm = [], exp = opts.exportMenu,
            colOpts = t.datagrid("getColumnOption", field), sortable = colOpts.sortable;
        if (typeof exp == "object") { exp = $.extend({ current: false, all: false, submenu: true }, exp); }
        var m1 = {
            text: "升序", iconCls: "icon-standard-hmenu-asc", disabled: sortable != true,
            handler: function () { return t.datagrid("sort", { sortName: field, sortOrder: "asc" }); }
        };
        var m2 = {
            text: "降序", iconCls: "icon-standard-hmenu-desc", disabled: sortable != true,
            handler: function () { return t.datagrid("sort", { sortName: field, sortOrder: "desc" }); }
        };
        var m3 = {
            text: "显示/隐藏列", iconCls: "icon-standard-application-view-columns", disabled: false, children: [
                {
                    text: "显示全部列", iconCls: function () {
                        var len = exts.fields ? exts.fields.length : 0;
                        var count = $.array.sum(exts.fieldOptions, function (val) { return val.hidden ? 0 : 1; });
                        return count >= len ? "tree-checkbox1" : (count == 0 ? "tree-checkbox0" : "tree-checkbox2");
                    }, hideOnClick: false, handler: function (e, field, eventData, t, item, menu) {
                        $.each(exts.fields, function () { t.datagrid("showColumn", this); });
                        $(this).parent().children("div.menu-item:not(:eq(1))").each(function () {
                            menu.menu("setIcon", { target: this, iconCls: "tree-checkbox1" });
                            menu.menu("enableItem", this);
                        });
                    }
                },
                {
                    text: "还原默认", iconCls: "icon-standard-application-view-tile", hideOnClick: false, handler: function (e, field, eventData, t, item, menu) {
                        $.each(exts.fieldOptionsBackup, function () { t.datagrid(this.hidden == true ? "hideColumn" : "showColumn", this.field); });
                        var mm = $(this).parent();
                        mm.children("div.menu-item:gt(1)").each(function () {
                            var title = $(this).text(), colOpts = $.array.first(exts.fieldOptions, function (val) { return val.title == title; });
                            if (colOpts) { menu.menu("setIcon", { target: this, iconCls: colOpts.hidden ? "tree-checkbox0" : "tree-checkbox1" }); }
                            menu.menu("enableItem", this);
                        });
                        mm.children("div.menu-item:first").each(function () {
                            var len = exts.fields ? exts.fields.length : 0;
                            var count = $.array.sum(exts.fieldOptions, function (val) { return val.hidden ? 0 : 1; });
                            menu.menu("setIcon", { target: this, iconCls: count >= len ? "tree-checkbox1" : (count == 0 ? "tree-checkbox0" : "tree-checkbox2") });
                        });
                    }
                },
                "-"
            ]
        };
        var m4 = { text: "过滤/显示", iconCls: "icon-standard-application-view-list", disabled: !colOpts.filterable, children: [] };
        var m5 = { text: "导出当前页", iconCls: "icon-standard-page-white-put", disabled: !(exp == true || exp.current == true), handler: function () { return t.datagrid("exportExcel", false); } };
        var m6 = { text: "导出全部", iconCls: "icon-standard-page-white-stack", disabled: !(exp == true || exp.all == true), handler: function () { return t.datagrid("exportExcel", true); } };
        $.util.merge(m3.children, parseHeaderColumnsShowHideMenu(t, opts, exts, e, field, eventData));
        if (colOpts.filterable) { $.util.merge(m4.children, parseHeaderRowsShowHideMenu(t, opts, exts, e, field, eventData)); }
        $.util.merge(mm, [m1, m2, "-", m3, m4]);
        var expMenu = [m5, m6];
        if (exp) { $.array.merge(mm, "-", typeof exp == "object" && !exp.submenu ? expMenu : { text: "导出数据", iconCls: "icon-standard-page-save", children: expMenu }); }
        return mm;
    };

    function parseHeaderColumnsShowHideMenu(t, opts, exts, e, field, eventData) {
        return $.array.map(exts.fieldOptions, function (val) {
            var handler = function (e, field, eventData, t, item, menu) {
                var m = $(this),
                    count = m.parent().find(".menu-item:gt(1) .tree-checkbox1").length;
                if ((count == 1 && !val.hidden) || !val.hidable) { return; }
                t.datagrid(val.hidden ? "showColumn" : "hideColumn", val.field);
                menu.menu("setIcon", { target: this, iconCls: val.hidden ? "tree-checkbox0" : "tree-checkbox1" });
                count = $.array.sum(exts.fieldOptions, function (val) { return val.hidden ? 0 : 1; });
                var len = exts.fields ? exts.fields.length : 0;
                menu.menu("setIcon", {
                    target: m.parent().children("div.menu-item:first"),
                    iconCls: count >= len ? "tree-checkbox1" : (count == 0 ? "tree-checkbox0" : "tree-checkbox2")
                });
                var mm = m.parent().find(".menu-item:gt(1)").filter(function () { return $(".tree-checkbox1", this).length ? true : false; });
                mm.each(function () { menu.menu(mm.length > 1 ? "enableItem" : "disableItem", this); });
            };
            return {
                text: val.title || val.field, iconCls: val.hidden ? "tree-checkbox0" : "tree-checkbox1", hideOnClick: false,
                disabled: !val.hidable ? true : false, handler: handler
            };
        });
    };

    function parseHeaderRowsShowHideMenu(t, opts, exts, e, field, eventData) {
        var rows = t.datagrid("getRows"), distinctVals = t.datagrid("getDistinctColumnData", field),
            mm = [
                {
                    text: "全部", hideOnClick: false,
                    iconCls: (!exts.filterData || !exts.filterData.length) ? "tree-checkbox1" : (exts.filterData.length >= rows.length ? "tree-checkbox0" : "tree-checkbox2"),
                    handler: function (e, field, eventData, t, item, menu) {
                        if (exts.filterData && exts.filterData.length) {
                            t.datagrid("showRows", true);
                        } else {
                            t.datagrid("hideRows", true);
                        }
                        $(this).parent().children("div.menu-item[hideOnClick=false]").each(function () {
                            menu.menu("setIcon", { target: this, iconCls: exts.filterData && exts.filterData.length ? "tree-checkbox0" : "tree-checkbox1" });
                        });
                    }
                }, "-"
            ];
        var hasMore = distinctVals.length >= 15,
            data = hasMore ? $.array.left(distinctVals, 10) : distinctVals,
            items = $.array.map(data, function (val) {
                var filterRows = $.array.filter(rows, function (value) { return value[field] == val; }),
                    filterLength = filterRows.length,
                    hiddenLength = $.array.sum(exts.filterData, function (value) { return value[field] == val ? 1 : 0; }),
                    iconCls = !hiddenLength ? "tree-checkbox1" : (hiddenLength >= filterLength ? "tree-checkbox0" : "tree-checkbox2");
                var handler = function (e, field, eventData, t, item, menu) {
                    var hiddenLength = $.array.sum(exts.filterData, function (value) { return value[field] == val ? 1 : 0; });
                    t.datagrid(hiddenLength ? "showRows" : "hideRows", filterRows);
                    menu.menu("setIcon", { target: this, iconCls: hiddenLength ? "tree-checkbox1" : "tree-checkbox0" });
                    $(this).parent().children("div.menu-item:first").each(function () {
                        menu.menu("setIcon", {
                            target: this,
                            iconCls: (!exts.filterData || !exts.filterData.length) ? "tree-checkbox1" : (exts.filterData.length >= rows.length ? "tree-checkbox0" : "tree-checkbox2")
                        });
                    });
                };
                return { text: val, iconCls: iconCls, hideOnClick: false, handler: handler };
            });
        $.array.merge(mm, items);
        if (hasMore) {
            var colOpt = t.datagrid("getColumnOption", field), title = colOpt.title ? colOpt.title : colOpt.field, handler = function () {
                var checkAll = $("<input type=\"button\" value=\"全部选择\" />").click(function () {
                    t.datagrid("showRows", true);
                    $(this).parent().find(":checkbox").each(function () { this.checked = true; });
                });
                var uncheckAll = $("<input type=\"button\" value=\"全部不选\" />").click(function () {
                    t.datagrid("hideRows", true);
                    $(this).parent().find(":checkbox").each(function () { this.checked = false; });
                });
                $("<div></div>").append("<div>列：" + title + "，共" + distinctVals.length + "项</div><hr />").css({
                    padding: "10px"
                }).append(checkAll).append(uncheckAll).append("<hr />").each(function () {
                    var win = $(this), ul = $("<ul></ul>").css({ "list-style-type": "decimal", "padding-left": "40px", "line-height": "18px" }).appendTo(win);
                    $.each(distinctVals, function (index, text) {
                        var id = "itemCheckbox_" + $.util.guid("N"),
                            checked = !$.array.some(exts.filterData, function (val) { return val[field] == text; }),
                            itemWrap = $("<li></li>").appendTo(ul),
                            item = $("<input />").attr({ type: "checkbox", id: id, checked: checked }).appendTo(itemWrap),
                            itemText = $("<label></label>").attr("for", id).text(text).appendTo(itemWrap),
                            handler = function () {
                                var filterRows = $.array.filter(rows, function (val) { return val[field] == text; }),
                                    hiddenLength = $.array.sum(exts.filterData, function (val) { return val[field] == text ? 1 : 0; });
                                t.datagrid(hiddenLength ? "showRows" : "hideRows", filterRows);
                            };
                        item.click(handler);
                    });
                }).dialog({
                    title: "过滤/显示", iconCls: "icon-standard-application-view-detail", height: 260, width: 220, left: e.pageX, top: e.pageY,
                    collapsible: false, minimizable: false, maximizable: false, closable: true, modal: true, resizable: true,
                    onClose: function () { $(this).dialog("destroy"); }
                }).dialog("open");
            };
            $.array.merge(mm, ["-", { text: "处理更多(共" + distinctVals.length + "项)...", iconCls: "icon-standard-application-view-detail", handler: handler }]);
        }
        return mm;
    };



    function parseRowBaseContextMenuItems(t, opts, exts, e, rowIndex, rowData, eventData) {
        var mm = [], paging = opts.pagingMenu, move = opts.moveMenu, exp = opts.exportMenu;
        if (typeof paging == "object") { paging = $.extend({ disabled: false, submenu: true }, paging); }
        if (typeof move == "object") { move = $.extend({ up: false, down: false, submenu: true }, move); }
        if (typeof exp == "object") { exp = $.extend({ current: false, all: false, submenu: true }, exp); }
        var m1 = {
            text: "刷新当前页", iconCls: "pagination-load", disabled: !opts.refreshMenu,
            handler: function () { t.datagrid("reload"); }
        };
        var m2 = {
            text: "首页", iconCls: "pagination-first", disabled: function () { return !opts.pagination || eventData.page <= 1; },
            handler: function () { if (eventData.page > 1) { eventData.pager.pagination("select", 1); } }
        };
        var m3 = {
            text: "上一页", iconCls: "pagination-prev", disabled: function () { return !opts.pagination || eventData.page <= 1; },
            handler: function () { if (eventData.page > 1) { eventData.pager.pagination("select", eventData.page - 1); } }
        };
        var m4 = {
            text: "下一页", iconCls: "pagination-next", disabled: function () { return !opts.pagination || eventData.page >= eventData.pageCount; },
            handler: function () { if (eventData.page < eventData.pageCount) { eventData.pager.pagination("select", eventData.page + 1); } }
        };
        var m5 = {
            text: "末页", iconCls: "pagination-last", disabled: function () { return !opts.pagination || eventData.page >= eventData.pageCount; },
            handler: function () { if (eventData.page < eventData.pageCount) { eventData.pager.pagination("select", eventData.pageCount); } }
        };
        var m6 = { text: "移至最上", iconCls: "icon-standard-arrow-up", disabled: !(move == true || move.top == true), handler: function () { t.datagrid("moveRow", { source: rowIndex, target: 0, point: "top" }); } };
        var m7 = { text: "上移", iconCls: "icon-standard-up", disabled: !(move == true || move.up == true), handler: function () { t.datagrid("shiftRow", { point: "up", index: rowIndex }); } };
        var m8 = { text: "下移", iconCls: "icon-standard-down", disabled: !(move == true || move.down == true), handler: function () { t.datagrid("shiftRow", { point: "down", index: rowIndex }); } };
        var m9 = {
            text: "移至最下", iconCls: "icon-standard-arrow-down", disabled: !(move == true || move.bottom == true), handler: function () {
                var rows = t.datagrid("getRows");
                t.datagrid("moveRow", { source: rowIndex, target: rows.length - 1, point: "bottom" });
            }
        };
        var m10 = { text: "导出当前页", iconCls: "icon-standard-page-white-put", disabled: !(exp == true || exp.current == true), handler: function () { return t.datagrid("exportExcel", false); } };
        var m11 = { text: "导出全部", iconCls: "icon-standard-page-white-stack", disabled: !(exp == true || exp.all == true), handler: function () { return t.datagrid("exportExcel", true); } };
        mm.push(m1);
        var pagingMenu = [m2, m3, m4, m5], moveMenu = [m6, m7, "-", m8, m9], expMenu = [m10, m11];
        if (paging) { $.array.merge(mm, "-", typeof paging == "object" && !paging.submenu ? pagingMenu : { text: "翻页", iconCls: "", disabled: !(paging == true || !paging.disabled), children: pagingMenu }); }
        if (move) { $.array.merge(mm, "-", typeof move == "object" && !move.submenu ? moveMenu : { text: "上/下移动", iconCls: "", disabled: !move, children: moveMenu }); }
        if (exp) { $.array.merge(mm, "-", typeof exp == "object" && !exp.submenu ? expMenu : { text: "导出数据", iconCls: "icon-standard-page-save", disabled: !exp, children: expMenu }); }
        return mm;
    };


    $.fn.datagrid.extensions.parseHeaderContextMenuMap = function (e, field, eventData, contextMenu, t) {
        return $.array.map(contextMenu, function (value, index) {
            if (!value || $.util.isString(value)) { return value; }
            var ret = $.extend({}, value);
            ret.id = $.isFunction(value.id) ? value.id.call(ret, e, field, eventData, t) : value.id;
            ret.text = $.isFunction(value.text) ? value.text.call(ret, e, field, eventData, t) : value.text;
            ret.iconCls = $.isFunction(value.iconCls) ? value.iconCls.call(ret, e, field, eventData, t) : value.iconCls;
            ret.disabled = $.isFunction(value.disabled) ? value.disabled.call(ret, e, field, eventData, t) : value.disabled;
            ret.hideOnClick = $.isFunction(value.hideOnClick) ? value.hideOnClick.call(ret, e, field, eventData, t) : value.hideOnClick;
            ret.onclick = $.isFunction(value.onclick) ? function (e, item, menu) { value.onclick.call(this, e, field, eventData, t, item, menu); } : value.onclick;
            ret.handler = $.isFunction(value.handler) ? function (e, item, menu) { value.handler.call(this, e, field, eventData, t, item, menu); } : value.handler;
            if (ret.children && ret.children.length) { ret.children = $.fn.datagrid.extensions.parseHeaderContextMenuMap(e, field, eventData, ret.children, t); }
            return ret;
        });
    };

    $.fn.datagrid.extensions.parseRowContextMenuMap = function (e, rowIndex, rowData, eventData, contextMenu, t) {
        return $.array.map(contextMenu, function (value, index) {
            if (!value || $.util.isString(value)) { return value; }
            var ret = $.extend({}, value);
            ret.id = $.isFunction(value.id) ? value.id.call(ret, e, rowIndex, rowData, eventData, t) : value.id;
            ret.text = $.isFunction(value.text) ? value.text.call(ret, e, rowIndex, rowData, eventData, t) : value.text;
            ret.iconCls = $.isFunction(value.iconCls) ? value.iconCls.call(ret, e, rowIndex, rowData, eventData, t) : value.iconCls;
            ret.disabled = $.isFunction(value.disabled) ? value.disabled.call(ret, e, rowIndex, rowData, eventData, t) : value.disabled;
            ret.hideOnClick = $.isFunction(value.hideOnClick) ? value.hideOnClick.call(ret, e, rowIndex, rowData, eventData, t) : value.hideOnClick;
            ret.onclick = $.isFunction(value.onclick) ? function (e, item, menu) { value.onclick.call(this, e, rowIndex, rowData, eventData, t, item, menu); } : value.onclick;
            ret.handler = $.isFunction(value.handler) ? function (e, item, menu) { value.handler.call(this, e, rowIndex, rowData, eventData, t, item, menu); } : value.handler;
            if (ret.children && ret.children.length) { ret.children = $.fn.datagrid.extensions.parseRowContextMenuMap(e, rowIndex, rowData, eventData, ret.children, t); }
            return ret;
        });
    };


    $.fn.datagrid.extensions.parseContextMenuEventData = function (t, opts, e) {
        var queryParams = $.fn.datagrid.extensions.parseRemoteQueryParams(opts);
        var pagingParams = $.fn.datagrid.extensions.parsePaginationParams(t, opts);
        return $.extend({}, queryParams, pagingParams, { e: e, grid: t });
    };

    $.fn.datagrid.extensions.parsePaginationParams = function (t, opts) {
        var ret = {};
        if (opts.pagination) {
            var pager = t.datagrid("getPager");
            var pagerOptions = pager.pagination("options");
            var total = pagerOptions.total;
            var pageCount = Math.ceil(parseFloat(total) / parseFloat(pagerOptions.pageSize));
            $.extend(ret, { pager: pager, total: total, pageCount: pageCount });
        }
        return ret;
    };

    $.fn.datagrid.extensions.parseRemoteQueryParams = function (opts) {
        var ret = $.extend({}, opts.queryParams);
        if (opts.pagination) { $.extend(ret, { page: opts.pageNumber, rows: opts.pageSize }); }
        if (opts.sortName) { $.extend(ret, { sort: opts.sortName, order: opts.sortOrder }); }
        ret = $.fn.datagrid.extensions.parsePagingQueryParams(opts, ret);
        return ret;
    };
    /************************  initExtend initContextMenu & initDblClickRow   End  ************************/



    /************************  initExtend initColumnTooltip Begin  ************************/
    var initColumnTooltip = function (t, opts) {
        var rows = t.datagrid("getRows");
        t.datagrid("getPanel").find("div.datagrid-view div.datagrid-body table tr.datagrid-row").each(function () {
            var tr = $(this), index = parseInt(tr.attr("datagrid-row-index")), row = rows[index];
            initColumnRowTooltip(t, opts, index, row, tr);
        });
    };

    var initColumnRowTooltip = function (t, opts, index, row, tr) {
        tr = tr || t.datagrid("getRowDom", index);
        if (opts.rowTooltip) {
            var onShow = function (e) {
                var tt = $(this), text = $.isFunction(opts.rowTooltip) ? opts.rowTooltip.call(tr, index, row) : buildText(row);
                tt.tooltip("update", text);
            };
            tr.each(function () { $.easyui.tooltip.init(this, { onShow: onShow }); });
        } else {
            tr.children("td[field]").each(function () {
                var td = $(this), field = td.attr("field"), colOpts = t.datagrid("getColumnOption", field);
                if (!colOpts || !colOpts.tooltip) { return; }
                var cell = td.find("div.datagrid-cell"), onShow = function (e) {
                    var tt = $(this), text = $.isFunction(colOpts.tooltip) ? colOpts.tooltip.call(cell, row[field], index, row) : row[field];
                    tt.tooltip("update", text);
                };
                $.easyui.tooltip.init(cell, { onShow: onShow });
            });
        }
        function buildText(row) {
            var cols = t.datagrid("getColumns", "all"), content = $("<table></table>").css({ padding: "5px" });;
            $.each(cols, function (i, colOpts) {
                if (!colOpts || !colOpts.field || !colOpts.title) { return; }
                var msg = t.datagrid("getCellDisplay", { field: colOpts.field, index: index });
                content.append("<tr><td style='text-align: right; width: 150px;'>" + colOpts.title + ":</td><td style='width: 250px;'>" + msg + "</td></tr>");
            });
            return content;
        };
    };


    /************************  initExtend initColumnTooltip   End  ************************/
    var initializeRowExtEditor = function (t, opts, index) {
        if (!opts.extEditing) { return; }
        var tr = t.datagrid("getRowDom", index);
        if (!tr.length) { return; }
        var view = t.datagrid("getPanel").find("div.datagrid-view"),
            view1 = view.find("div.datagrid-view1"),
            view2 = view.find("div.datagrid-view2"),
            body = view2.find("div.datagrid-body").css("position", "relative"),
            width = view1.outerWidth(), height = tr.outerHeight(), pos = tr.position(),
            top = pos.top + height + body.scrollTop() - view2.find("div.datagrid-header").outerHeight();
        var p = $("<div class=\"dialog-button datagrid-rowediting-panel\"></div>").appendTo(body).css("top", top).attr("datagrid-row-index", index);
        $("<a></a>").appendTo(p).linkbutton({ plain: false, iconCls: "icon-ok", text: "保存" }).click(function () {
            t.datagrid("endEdit", index);
            disposeRowExtEditor(t, opts, index);
        });
        $("<a></a>").appendTo(p).linkbutton({ plain: false, iconCls: "icon-cancel", text: "取消" }).click(function () {
            t.datagrid("cancelEdit", index);
            disposeRowExtEditor(t, opts, index);
        });
        var diff = (opts.width - p.outerWidth()) / 2 - width, left = diff > 0 ? diff : 0;
        p.css("left", left);
    };

    var removeRowExtEditor = function (t, body, index) {
        body = body || t.datagrid("getPanel").find("div.datagrid-view div.datagrid-view2 div.datagrid-body");
        body.find("div.datagrid-rowediting-panel[datagrid-row-index=" + index + "]").remove();
    };

    var disposeRowExtEditor = function (t, opts, index) {
        if (!opts.extEditing) { return; }
        body = t.datagrid("getPanel").find("div.datagrid-view div.datagrid-view2 div.datagrid-body");
        removeRowExtEditor(t, body, index);
    };

    var initSingleEditing = function (t, opts, index) {
        var exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        if (opts.singleEditing) { t.datagrid("endEdit", exts.lastEditingIndex); }
        exts.lastEditingIndex = index;
    };
    /************************  initExtend ExtEditor Begin  ************************/


    /************************  initExtend ExtEditor   End  ************************/




    /************************  initExtend Base Begin  ************************/
    var initExtensions = $.fn.datagrid.extensions.initExtensions = function (t, opts) {
        var exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        if (exts._initialized) { return; }

        var fields = t.datagrid("getColumnFields", false);
        exts.fields = $.array.filter(fields, function (val) { return t.datagrid("getColumnOption", val).title ? true : false; });
        exts.fieldOptions = $.array.map(exts.fields, function (val) { return t.datagrid("getColumnOption", val); });
        exts.fieldOptionsBackup = $.array.map(exts.fieldOptions, function (val) { return $.extend({}, val); });
        exts.filterData = [];

        initColumnExtensions();
        initOffset();
        initContextMenu();
        initDblClickRow();
        initAutoEditing();
        initFinishEdit();
        function initColumnExtensions() { initColumnExtendProperties(t, exts); };
        function initOffset() { t.datagrid("setOffset", opts.offset); };
        function initContextMenu() { initHeaderContextMenu(t, opts, exts); initRowContextMenu(t, opts, exts); initHeaderClickMenu(t, opts, exts); };
        function initDblClickRow() { initDblClickRowEvent(t, opts, exts); };
        function initAutoEditing() { initAutoEditingEvent(t, opts, exts); };
        function initFinishEdit() { initFinishEditEvent(t, opts, exts); };

        var rows = t.datagrid("getRows");
        if (!rows || !rows.length) { initHeaderColumnFilterContainer(t, opts, exts); }

        exts._initialized = true;
    };

    $.fn.datagrid.extensions.parseOrderbyParams = function (sortName, sortOrder) {
        sortName = $.string.isNullOrWhiteSpace(sortName) ? "" : $.trim(sortName);
        sortOrder = $.string.isNullOrWhiteSpace(sortOrder) ? "" : $.trim(sortOrder);
        sortOrder = sortOrder.toLowerCase();
        if (sortOrder != "asc" && sortOrder != "desc") { sortOrder = "asc"; }
        return $.trim(sortName + " " + sortOrder);
    };

    $.fn.datagrid.extensions.parsePagingQueryParams = function (opts, param) {
        var ret = $.util.parseMapFunction(param);
        if (opts.pagination) {
            ret.pageNumber = ret.page;
            ret.pageSize = ret.rows;
            ret.pageIndex = ret.pageNumber - 1;
        }
        ret.orderby = $.fn.datagrid.extensions.parseOrderbyParams(ret.sort, ret.order);
        return ret;
    };

    var loader = $.fn.datagrid.extensions.loader = function (param, success, error) {
        var t = $(this), opts = t.datagrid("options");
        initExtensions(t, opts);
        if (!opts.url) { return false; }
        param = $.fn.datagrid.extensions.parsePagingQueryParams(opts, param);
        $.ajax({
            type: opts.method, url: opts.url, data: param, dataType: "json",
            success: function (data) { success(data); },
            error: function () { error.apply(this, arguments); }
        });
    };

    var loadFilter = function (data) {
        return data ? ($.isArray(data) ? { total: data.length, rows: data } : data) : { total: 0, rows: [] };
    };

    var _onLoadSuccess = $.fn.datagrid.defaults.onLoadSuccess;
    var onLoadSuccess = $.fn.datagrid.extensions.onLoadSuccess = function (data) {
        if ($.isFunction(_onLoadSuccess)) { _onLoadSuccess.apply(this, arguments); }
        var t = $(this), opts = t.datagrid("options"),
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        initHeaderColumnFilterContainer(t, opts, exts);
        initRowDndExtensions(t, opts);
        initColumnTooltip(t, opts);
    };

    var _onResizeColumn = $.fn.datagrid.defaults.onResizeColumn;
    var onResizeColumn = $.fn.datagrid.extensions.onResizeColumn = function (field, width) {
        if ($.isFunction(_onResizeColumn)) { _onResizeColumn.apply(this, arguments); }
        var t = $(this), opts = t.datagrid("options");
        if (opts.columnFilter) {
            var panel = t.datagrid("getPanel"), colOpts = t.datagrid("getColumnOption", field),
                container = panel.find("div.datagrid-header-filter-container[field=" + field + "]");
            container.width(colOpts.width);
        }
    };

    var _onBeforeEdit = $.fn.datagrid.defaults.onBeforeEdit;
    var onBeforeEdit = $.fn.datagrid.extensions.onBeforeEdit = function (index, row) {
        if ($.isFunction(_onBeforeEdit)) { _onBeforeEdit.apply(this, arguments); }
        var t = $(this), opts = t.datagrid("options");
        initializeRowExtEditor(t, opts, index);
        initSingleEditing(t, opts, index);
        t.datagrid("getPanel").find("div.datagrid-view div.datagrid-body table tr.datagrid-row").draggable("disable");
    }

    var _onAfterEdit = $.fn.datagrid.defaults.onAfterEdit;
    var onAfterEdit = $.fn.datagrid.extensions.onAfterEdit = function (index, row, changes) {
        if ($.isFunction(_onAfterEdit)) { _onAfterEdit.apply(this, arguments); }
        var t = $(this), opts = t.datagrid("options"),
            exts = opts._extensionsDatagrid ? opts._extensionsDatagrid : (opts._extensionsDatagrid = {});
        disposeRowExtEditor(t, opts, index);
        initHeaderColumnFilterContainer(t, opts, exts);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, index, row);
    }

    var _onCancelEdit = $.fn.datagrid.defaults.onCancelEdit;
    var onCancelEdit = $.fn.datagrid.extensions.onCancelEdit = function (index, row) {
        if ($.isFunction(_onCancelEdit)) { _onCancelEdit.apply(this, arguments); }
        var t = $(this), opts = t.datagrid("options");
        disposeRowExtEditor(t, opts, index);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, index, row);
    };


    /************************  initExtend Base   End  ************************/





    var methods = $.fn.datagrid.extensions.methods = {

        //  覆盖 easyui-datagrid 的原生方法，以支持相应属性、事件和扩展功能；
        updateRow: function (jq, param) { return jq.each(function () { updateRow(this, param); }); },

        //  覆盖 easyui-datagrid 的原生方法，以支持相应属性、事件和扩展功能；
        appendRow: function (jq, row) { return jq.each(function () { appendRow(this, row); }); },

        //  覆盖 easyui-datagrid 的原生方法，以支持相应属性、事件和扩展功能；
        insertRow: function (jq, param) { return jq.each(function () { insertRow(this, param); }); },

        //  覆盖 easyui-datagrid 的原生方法，以支持相应属性、事件和扩展功能；
        beginEdit: function (jq, index) { return jq.each(function () { beginEdit(this, index); }); },

        //  扩展 easyui-datagrid 的自定义方法；判断指定的 data-row(数据行) 是否被 check；该方法的参数 index 表示要判断的行的索引号，从 0 开始计数；
        //  返回值：如果参数 index 所表示的 data-row(数据行) 被 check，则返回 true，否则返回 false。
        isChecked: function (jq, index) { return isChecked(jq[0], index); },

        //  扩展 easyui-datagrid 的自定义方法；判断指定的 data-row(数据行) 是否被 select；该方法的参数 index 表示要判断的行的索引号，从 0 开始计数；
        //  返回值：如果参数 index 所表示的 data-row(数据行) 被 select，则返回 true，否则返回 false。
        isSelected: function (jq, index) { return isSelected(jq[0], index); },

        //  扩展 easyui-datagrid 的自定义方法；判断指定的 data-row(数据行) 是否开启行编辑状态；该方法的参数 index 表示要判断的行的索引号，从 0 开始计数；
        //  返回值：如果参数 index 所表示的 data-row(数据行) 正开启行编辑状态，则返回 true，否则返回 false。
        isEditing: function (jq, index) { return isEditing(jq[0], index); },

        //  扩展 easyui-datagrid 的自定义方法；获取当前表格中第一个开启了编辑状态的数据行的索引号(从 0 开始计数)；
        //  返回值：如果当前表格中存在开启了行编辑状态的行，则返回第一个编辑行的行索引号(从 0 开始计数)；否则返回 -1。
        getEditingRowIndex: function (jq) { return getEditingRowIndex(jq[0]); },

        //  扩展 easyui-datagrid 的自定义方法；获取当前表格中所有开启了行编辑状态的行的索引号(从 0 开始计数)
        //  返回值：返回一个数组，数组中包含当前表格中所有已经开启了行编辑状态的行的索引号(从 0 开始计数)。
        getEditingRowIndexs: function (jq) { return getEditingRowIndexs(jq[0]); },

        //  扩展 easyui-datagrid 的自定义方法；冻结指定的列；该方法的参数 field 表示要冻结的列的 field 值。
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        //  注意：此方法在多行表头情况下无效。
        //      当前表格在执行此方法前必须存在至少一个冻结列，否则此方法无效；
        freezeColumn: function (jq, field) { return jq.each(function () { freezeColumn(this, field); }); },

        //  扩展 easyui-datagrid 的自定义方法；取消冻结指定的列；该方法的参数 field 表示要取消冻结的列的 field 值。
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        //  注意：此方法在多行表头情况下无效。
        //      当前表格在执行此方法前必须存在至少一个非冻结列，否则此方法无效；
        unfreezeColumn: function (jq, field) { return jq.each(function () { unfreezeColumn(this, field); }); },

        //  扩展 easyui-datagrid 的自定义方法；移动 easyui-datagrid 中的指定 data-row(数据行) ；该方法的参数 param 为 JSON-Object 类型，包含如下属性定义：
        //      target: 表示目标位置的 data-row(数据行) 索引号(从 0 开始计数)；
        //      source: 表示要移动的 data-row(数据行) 索引号(从 0 开始计数)；
        //      point:  表示移动到目标节点 target 的位置，String 类型，可能的值包括：
        //          "top":      表示移动到目标位置 target 的上一格位置；
        //          "bottom":   表示追加为目标位置 target 的下一格位置；
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        //  备注：该方法会触发移动行数据的相应事件；
        moveRow: function (jq, param) { return jq.each(function () { moveRow(this, param); }); },

        //  扩展 easyui-datagrid 的自定义方法；移动 easyui-datagrid 中的指定 data-row(数据行) 一行位置；该方法的参数 param 为 JSON-Object 类型，包含如下属性定义：
        //      index: 表示要移动的 data-row(数据行) 索引号(从 0 开始计数)；
        //      point:  表示移动到目标节点 target 的位置，String 类型，可能的值包括：
        //          "up":      表示移动到目标位置 target 的上一格位置；
        //          "down":   表示追加为目标位置 target 的下一格位置；
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        //  备注：该方法会触发移动行数据的相应事件；
        shiftRow: function (jq, param) { return jq.each(function () { shiftRow(this, param); }); },

        //  扩展 easyui-datagrid 的自定义方法；获取指定行的下一行数据；该方法的参数 index 表示指定行的行号(从 0 开始)；
        //  返回值：返回指定行的下一行数据，返回值是一个 JSON-Object 对象；
        //      如果指定的行没有下一行数据 (例如该行为最后一行的情况下)，则返回 null。
        nextRow: function (jq, index) { return getNextRow(jq[0], index); },

        //  扩展 easyui-datagrid 的自定义方法；获取指定行的上一行数据；该方法的参数 index 表示指定行的行号(从 0 开始)；
        //  返回值：返回指定行的上一行数据，返回值是一个 JSON-Object 对象；
        //      如果指定的行没有上一行数据 (例如该行为第一行的情况下)，则返回 null。
        prevRow: function (jq, index) { return getPrevRow(jq[0], index); },

        //  扩展 easyui-datagrid 的自定义方法；从 easyui-datagrid 当前页中删除指定的行，并返回该行数据；
        //  该方法的参数 index 表示指定行的行号(从 0 开始)；
        //  返回值：返回 index 所表示的行的数据，返回值是一个 JSON-Object 对象；
        //      如果不存在指定的行(例如 easyui-datagrid 当前页没有数据或者 index 超出范围)，则返回 null。
        popRow: function (jq, index) { return popRow(jq[0], index); },


        //  扩展 easyui-datagrid 的自定义方法；启用当前表格的行拖动功能；该方法无参数；
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        enableRowDnd: function (jq) { return jq.each(function () { enableRowDnd(this); }); },

        //  扩展 easyui-datagrid 的自定义方法；禁用当前表格的行拖动功能；该方法无参数；
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        disableRowDnd: function (jq) { return jq.each(function () { disableRowDnd(this); }); },

        //  扩展 easyui-datagrid 的自定义方法；移动指定的列到另一位置；该方法的参数 param 为一个 JSON-Object，定义包含如下属性：
        //      target: 表示目标位置列的 field 值；
        //      source: 表示要移动的列的 field 值；
        //      point:  表示移动到目标列的位置，String 类型，可选的值包括：
        //          before: 表示将 source 列移动至 target 列的左侧；
        //          after:  表示将 source 列移动值 target 列的右侧；
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        //  注意：此方法在多行表头情况下无效。
        moveColumn: function (jq, param) { return jq.each(function () { moveColumn(this, param); }); },

        //  扩展 easyui-datagrid 的自定义方法；移动指定的列挪动一格位置；该方法的参数 param 为一个 JSON-Object，定义包含如下属性：
        //      field:  表示要挪动的列的 field 值；
        //      porint: 表示挪动 field 列的方式，String 类型，可选的值包括：
        //          before: 表示将该列向左挪动一格；
        //          after:  表示将该列向右挪动一格；
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        //  注意：此方法在多行表头情况下无效。
        shiftColumn: function (jq, param) { return jq.each(function () { shiftColumn(this, param); }); },

        //  扩展 easyui-datagrid 的自定义方法；获取指定列的下一格位置列的 列属性(columnOption) 信息；该方法的参数 field 表示指定列的 field 值。
        //  返回值：当前指定列的下一格位置的列的 列属性(columnOption) 信息。
        //      如果不存在指定的列，或者指定列的下一格位置没有其他列，则返回 null。
        nextColumn: function (jq, field) { return getNextColumn(jq[0], field); },

        //  扩展 easyui-datagrid 的自定义方法；获取指定列的上一格位置列的 列属性(columnOption) 信息；该方法的参数 field 表示指定列的 field 值。
        //  返回值：当前指定列的上一格位置的列的 列属性(columnOption) 信息。
        //      如果不存在指定的列，或者指定列的上一格位置没有其他列，则返回 null。
        prevColumn: function (jq, field) { return getPrevColumn(jq[0], field); },

        //  扩展 easyui-datagrid 的自定义方法；删除指定的列；该方法的参数 field 表示要删除的列的 field 值；
        //  返回值：返回表示当前 easyui-datagrid 的 jQuery 链式对象。
        deleteColumn: function (jq, field) { return jq.each(function () { deleteColumn(this, field); }); },

        //  扩展 easyui-datagrid 的自定义方法；删除指定的列并返回该列的 ColumnOption 值；该方法的参数 field 表示要删除的列的 field 值；
        //  返回值：返回参数 field 值所表示的列的 ColumnOption 值。如果当前 easyui-datagrid 不存在该列，则返回 null。
        popColumn: function (jq, field) { return popColumn(jq[0], param); },


        //  获取 easyui-datagrid 中当前页指定列的 DOM-jQuery 元素对象；该函数定义如下参数：
        //      param: 该参数可以定位以下类型：
        //          String 类型：表示要获取的 DOM-jQuery 元素所在的列的 field 名；
        //          JSON-Object 类型：如果定义为该类型，则该参数定义如下属性：
        //              field:  表示要获取的 DOM-jQuery 元素所在的列的 field 名；
        //              header: Boolean 类型值，默认为 false，表示返回的 DOM-jQuery 对象中是否包含 field 表示的列的表头；
        //  返回值：如果当前页存在 field 值指定的列，则返回该列中指定行的 DOM-jQuery 对象，该对象中包含的 DOM 节点级别为一个 td[field=field] 对象；
        //          否则返回一个空的 jQuery 对象。
        //          如果 param 参数定义为 JSON-Object 类型，且 param.header = true，则返回的 DOM-jQuery 对象中将会包含列的表头元素；
        //          如果 param 参数定义为 String 类型或者即使定义为 JSON-Object 类型但 param.header = false，则返回的 DOM-jQuery 对象中不包含列的表头元素。
        getColumnDom: function (jq, param) { return getColumnDom(jq[0], param); },

        //  获取 easyui-datagrid 中当前也指定列所有行的单元格数据所构成的一个数组；该函数定义如下参数：
        //      field: 要获取的数据的列的 field 名；
        //  返回值：返回一个数组，数组中每一个元素都是其数据行的该列的值，数组的长度等于 grid.datagrid("getRows") 的长度；
        //          如果传入的列名不存在，则返回数组的长度同样等于 grid.datagrid("getRows") 的长度，只是每个元素的值都为 undefined.
        getColumnData: function (jq, field) { return getColumnData(jq[0], field); },

        //  获取 easyui-datagrid 中当前页指定行的 DOM-jQuery 对象元素集合；该函数定义如下参数：
        //      index: 表示要获取的 DOM-Jquery 对象元素集合所在当前页的行索引号；
        //  返回值：如果当前页存在 index 指示的行，则返回该行的 DOM-jQuery 对象集合，该集合中包含的 DOM 节点级别为一组 tr class="datagrid-row" 对象；
        //          否则返回一个空的 jQuery 对象。
        getRowDom: function (jq, index) { return getRowDom(jq[0], index); },

        //  获取 easyui-datagrid 中当前页指定行的 rowData；该函数定义如下参数：
        //      index: 表示要获取的 rowData 所在当前页的行索引号，从 0 开始；
        //  返回值：如果当前页存在 index 指示的行，则返回该行的行数据对象（JSON Object 格式）；否则返回 undefined。
        getRowData: function (jq, index) { return getRowData(jq[0], index); },

        //  获取 easyui-datagrid 中当前页指定单元格的 Dom-jQuery 对象元素；该函数定义如下参数：
        //      pos：表示单元格的位置，为一个 JSON-Object 对象，该 JSON 定义如下属性：
        //          field:  表示要获取的单元格位于哪个列；
        //          index:  表示要获取的单元格位于哪个行的行索引号，从 0 开始；
        //  返回值：如果当前页存在指定列的指定行，则返回该列中指定行的 DOM-jQuery 对象，该对象中包含的 DOM 节点级别为一个 div class="datagrid-cell" 对象；
        //          否则返回一个空的 jQuery 对象。
        getCellDom: function (jq, pos) { return getCellDom(jq[0], pos); },

        //  获取 easyui-datagrid 中当前页指定单元格的数据；该函数定义如下参数：
        //  pos：表示单元格的位置，为一个 JSON-Object 对象，该 JSON 定义如下属性：
        //          field:  表示要获取的单元格位于哪个列；
        //          index:  表示要获取的单元格位于哪个行的行索引号，从 0 开始；
        //  返回值：如果当前页存在指定列的指定行，则返回该列中指定行及指定列的单元格数据；否则返回 undefined。
        getCellData: function (jq, pos) { return getCellData(jq[0], pos); },

        //  获取 easyui-datagrid 中当前页指定单元格的显示数据(经过 formatter 格式化后的显示数据)；该函数定义如下参数：
        //  pos：表示单元格的位置，为一个 JSON-Object 对象，该 JSON 定义如下属性：
        //          field:  表示要获取的单元格位于哪个列；
        //          index:  表示要获取的单元格位于哪个行的行索引号，从 0 开始；
        //  返回值：如果当前页存在指定列的指定行，则返回该列中指定行的单元格的显示数据(经过 formatter 格式化后的显示数据)；否则返回 undefined。
        getCellDisplay: function (jq, pos) { return getCellDisplay(jq[0], pos); },

        //  获取 easyui-datagrid 中当前页指定单元格的显示文本(经过 formatter 格式化后的显示文本)；该函数定义如下参数：
        //  pos：表示单元格的位置，为一个 JSON-Object 对象，该 JSON 定义如下属性：
        //          field:  表示要获取的单元格位于哪个列；
        //          index:  表示要获取的单元格位于哪个行的行索引号，从 0 开始；
        //  返回值：如果当前页存在指定列的指定行，则返回该列中指定行的单元格的显示文本(经过 formatter 格式化后的显示文本)；否则返回 undefined。
        getCellDisplayText: function (jq, pos) { return getCellDisplayText(jq[0], pos); },

        //  获取 easyui-datagrid 所有列的 field 所组成的一个数组集合；参数 frozen 可以定义为如下格式：
        //      Boolean 类型值：如果是 true，则表示返回的结果集中包含 frozen(冻结)列，如果是 false 则表示返回的结果集中不包含 frozen(冻结)列；
        //      String 类型值：如果该参数定义为任意 String 类型值，则返回所有列信息(包括 frozen 冻结列和非冻结列)；
        //  返回值：如果 frozen 参数定义为 Boolean 且为 true，则返回所有 frozen(冻结) 列的 field 所构成的一个 Array 数组对象；
        //      如果 frozen 参数定义为 false，则返回所有非 frozen(非冻结) 列的 field 所构成的一个 Array 数组对象；
        //      如果 frozen 定义为任意的 String 类型值，则返回所有列的 field 所构成的一个 Array 数组对象。
        getColumnFields: function (jq, frozen) { return getColumnFields(jq[0], frozen); },

        //  获取 easyui-datagrid 按指定列的去重复项后的行数据集合；该函数定义如下参数：
        //      field:  要获取的数据的列的 field 名；
        //  返回值：返回一个数组，数组中每一个元素都表示一个行数据；
        //      其结果相当于当前 easyui-datagrid 控件调用 getRows 返回后并经过对指定列去重复项后的结果；
        //      如果传入的列名不存在，则返回一个长度为 0 的数组对象.
        getDistinctRows: function (jq, field) { return getDistinctRows(jq[0], field); },

        //  获取 easyui-datagrid 指定列的值去重复项后的数据集合；该函数定义如下参数；
        //      field:  要获取的数据的列的 field 名；
        //  返回值：返回一个数组，数组中的每一个元素都表示某一行的相应 field 属性的值；
        //      其结果相当于当前 easyui-datagrid 控件调用 getColumnData 返回后并经过对指定列去重复项后的结果；
        //      如果传入的列名不存在，则返回一个长度为 0 的数组对象.
        getDistinctColumnData: function (jq, field) { return getDistinctColumnData(jq[0], field); },

        //  获取 easyui-datagrid 所有列的 columnOption 所组成的一个数组集合；参数 frozen 可以定义为如下格式：
        //      Boolean 类型值：如果是 true，则表示返回的结果集中包含 frozen(冻结)列，如果是 false 则表示返回的结果集中不包含 frozen(冻结)列；
        //      String 类型值：如果该参数定义为任意 String 类型值，则返回所有列信息(包括 frozen 冻结列和非冻结列)；
        //  返回值：如果 frozen 参数定义为 Boolean 且为 true，则返回所有 frozen(冻结) 列的 columnOption 所构成的一个 Array 数组对象；
        //      如果 frozen 参数定义为 false，则返回所有非 frozen(非冻结) 列的 columnOption 所构成的一个 Array 数组对象；
        //      如果 frozen 定义为任意的 String 类型值，则返回所有列的 columnOption 所构成的一个 Array 数组对象。
        getColumns: function (jq, frozen) { return getColumns(jq[0], frozen); },

        //  同 getColumns 方法，但是仅返回列的 columnOption.hidden 值为 true 的列。
        getHiddenColumns: function (jq, frozen) { return getHiddenColumns(jq[0], frozen); },

        //  同 getColumns 方法，但是仅返回列的 columnOption.hidden 值为 false 的列。
        getVisibleColumns: function (jq, frozen) { return getVisibleColumns(jq[0], frozen); },

        //  同 getColumnFields 方法，但是仅返回列的 columnOption.hidden 值为 true 的列。
        getHiddenColumnFields: function (jq, frozen) { return getHiddenColumnFields(jq[0], frozen); },

        //  同 getColumnFields 方法，但是仅返回列的 columnOption.hidden 值为 false 的列。
        getVisibleColumnFields: function (jq, frozen) { return getVisibleColumnFields(jq[0], frozen); },

        //  显示当前 easyui-datagrid 当前页数据中指定行的数据；该方法的参数 param 可以是以下两种类型：
        //      待查找的行数据的 idField(主键) 字段值；
        //      function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-datagrid 调用 getRows 返回的结果集；
        //          如果 param 参数为 function 类型，则 findRow 方法会对当前 easyui-datagrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示找到需要查找的结果，立即停止循环调用并显示该行数据；
        //          如果回调函数始终未返回 true，则该回调函数会一直遍历 rows 直到最后。
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        showRow: function (jq, param) { return jq.each(function () { showRow(this, param); }); },

        //  隐藏当前 easyui-datagrid 当前页数据中指定行的数据；该方法的参数 param 可以是以下两种类型：
        //      待查找的行数据的 idField(主键) 字段值；
        //      function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-datagrid 调用 getRows 返回的结果集；
        //          如果 param 参数为 function 类型，则 findRow 方法会对当前 easyui-datagrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示找到需要查找的结果，立即停止循环调用并隐藏该行数据；
        //          如果回调函数始终未返回 true，则该回调函数会一直遍历 rows 直到最后。
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        hideRow: function (jq, param) { return jq.each(function () { hideRow(this, param); }); },

        //  显示当前 easyui-datagrid 当前页数据中指定多行的数据；该方法的参数 param 可以是以下三种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-datagrid 调用 getRows 返回的结果集；
        //          如果 param 参数为 Function 类型，则 showRows 方法会对当前 easyui-datagrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则该行数据将会被显示；
        //      Array 类型，数组中的每一项都可以定义为如下类型：
        //          待查找的行数据的 idField(主键) 字段值；
        //          Function 类型；具体回调函数签名参考 showRow 方法中 param 参数为 function 类型时的定义；
        //          当 param 参数定义为 Array 类型时，则 showRows 方法会对数组中的每一项循环调用 showRow 方法；
        //      Boolean 类型且为 true：则 showRows 将会显示 easyui-datagrid 当前页的所有数据。
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        showRows: function (jq, param) { return jq.each(function () { showRows(this, param); }); },

        //  隐藏当前 easyui-datagrid 当前页数据中指定多行的数据；该方法的参数 param 可以是以下三种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-datagrid 调用 getRows 返回的结果集；
        //          如果 param 参数为 Function 类型，则 hideRows 方法会对当前 easyui-datagrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则该行数据将会被隐藏；
        //      Array 类型，数组中的每一项都可以定义为如下类型：
        //          待查找的行数据的 idField(主键) 字段值；
        //          Function 类型；具体回调函数签名参考 hideRow 方法中 param 参数为 function 类型时的定义；
        //          当 param 参数定义为 Array 类型时，则 hideRows 方法会对数组中的每一项循环调用 hideRow 方法；
        //      Boolean 类型且为 true：则 hideRows 将会隐藏 easyui-datagrid 当前页的所有数据。
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        hideRows: function (jq, param) { return jq.each(function () { hideRows(this, param); }); },

        //  获取当前 easyui-datagrid 当前页所有隐藏的行数据所构成的一个 Array 对象。
        getHiddenRows: function (jq) { return getHiddenRows(jq[0]); },

        //  获取当前 easyui-datagrid 当前页所有显示的行数据所构成的一个 Array 对象。
        getVisibleRows: function (jq) { return getVisibleRows(jq[0]); },

        //  使当前 easyui-datagrid 中指定的列 DOM 对象高亮显示；该函数定义如下参数：
        //      field: 要高亮显示的列的 field 名；
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        highlightColumn: function (jq, field) { return jq.each(function () { highlightColumn(this, field); }); },

        //  对当前 easyui-datagrid 中进行高亮关键词查询；该方法的 param 可以定义为如下两种类型：
        //      1、String 类型值：表示要对所有列进行的高亮查询关键词；
        //      2、JSON-Object：表示对特定列进行高亮查询的参数，该对象类型参数包含如下属性：
        //          field:      表示要进行高亮查询的列；
        //          value:      表示要进行高亮查询的关键词；
        //          regular:    Boolean 类型值，默认为 false；指示该关键词是否为正则表达式；
        //          ignoreCase: Boolean 类型值，默认为 true；指示高亮查询时是否忽略大小写。
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        livesearch: function (jq, param) { return jq.each(function () { livesearch(this, param); }); },

        //  检测当前 easyui-datagrid 控件是否存在多行表头；
        //  返回值：如果当前 easyui-datagrid 控件设置了多行表头，则返回 true，否则返回 false。
        hasMuliRowHeader: function (jq) { return hasMuliRowHeader(jq[0]); },

        //  查找当前数据页上的行数据，返回的是一个 JSON 对象；参数 param 表示查找的内容；该方法的参数 param 可以是以下两种类型：
        //      待查找的行数据的 idField(主键) 字段值；
        //      function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-datagrid 调用 getRows 返回的结果集；
        //          如果 param 参数为 function 类型，则 findRow 方法会对当前 easyui-datagrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示找到需要查找的结果，立即停止循环调用并返回该行数据；
        //          如果回调函数始终未返回 true，则该回调函数会一直遍历 rows 直到最后并返回 null。
        //  返回值：返回一个 JSON-Object，表示一个行数据对象；如果未找到相应数据，则返回 null。
        findRow: function (jq, param) { return findRow(jq[0], param); },

        //  查找当前数据页上的行数据；该方法的参数 param 可以是以下两种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-datagrid 调用 getRows 返回的结果集；
        //          如果 param 参数为 Function 类型，则 findRows 方法会对当前 easyui-datagrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则返回的结果集中将会包含该行数据；
        //          如果该回调函数始终未返回 true，则该方法最终返回一个长度为 0 的数组对象。
        //      Array 类型，数组中的每一项都可以定义为如下类型：
        //          待查找的行数据的 idField(主键) 字段值；
        //          Function 类型；具体回调函数签名参考 findRow 方法中 param 参数为 function 类型时的定义；
        //          当 param 参数定义为 Array 类型时，则 findRows 方法会对数组中的每一项循环调用 findRow 方法，并过滤掉 findRow 方法返回 null 的结果行；
        //  返回值：返回一个 Array 数组对象；数组中的每一项都是 JSON-Object 类型，表示一个行数据对象；如果未找到相应数据，则返回一个长度为 0 的数组对象。
        findRows: function (jq, param) { return findRows(jq[0], param); },

        //  删除一行数据，重写 easyui-datagrid 本身的 deleteRow 方法；参数 param 表示要删除的内容；该参数可以是以下三种类型：
        //      Number 类型，表示要删除的行索引号；
        //      //表示要删除的行数据的 idField(主键) 字段值，或者行数据对象；
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-datagrid 调用 getRows 返回的结果集；
        //          如果 param 参数为 Function 类型，则 deleteRow 方法会对当前 easyui-datagrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示查找到了需要被删除的行，deleteRow 方法将会删除该行数据并立即停止和跳出循环操作；
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        deleteRow: function (jq, param) { return jq.each(function () { deleteRow(this, param); }); },

        //  删除多行数据，参数 param 表示要删除的内容；该参数可以是以下两种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-datagrid 调用 getRows 返回的结果集；
        //          如果 param 参数为 Function 类型，则 deleteRows 方法会对当前 easyui-datagrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示查找到了需要被删除的行，deleteRows 方法将会删除该行数据，并遍历下一行数据直至数数据集的末尾；
        //      Array 类型，数组中的每一项目均表示要删除的行的行索引号或者 idField(主键) 字段值或者行数据对象
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        deleteRows: function (jq, param) { return jq.each(function () { deleteRows(this, param); }); },

        //  设置 easyui-datagrid 中列的标题；参数 param 是一个 json 对象，包含如下属性：
        //      field: 列字段名称
        //      title: 列的新标题
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        setColumnTitle: function (jq, param) { return jq.each(function () { setColumnTitle(this, param); }); },

        //  设置 easyui-datagrid 中列的宽度；参数 param 是一个 JSON 对象，该 JSON 对象定义如下属性：
        //      field: 要设置列宽的的列 field 值；
        //      width: 要设置的列宽度，Number 类型值。
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        setColumnWidth: function (jq, param) { return jq.each(function () { setColumnWidth(this, param); }); },

        //  设置当前 easyui-datagrid 控件的 offset 属性；该操作能让 offset 即可随浏览器窗口大小调整而生效或禁用；
        //  备注： 参数 offset 格式参考扩展属性 offset。
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        setOffset: function (jq, offset) { return jq.each(function () { setOffset(this, offset); }); },

        //  设置当前 easyui-datagrid 控件的表头过滤器；该函数提供如下参数：
        //      columnFilter: 参见属性 columnFilter
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        setColumnFilter: function (jq, columnFilter) { return jq.each(function () { setColumnFilter(this, columnFilter); }); },

        //  对当前 easyui-datagrid 控件按特定条件进行行过滤/显示操作；该方法的参数 param 可以定义为如下两种类型：
        //      1、Boolean 类型：如果定义为该类型，则：
        //          如果值定义为 true，则表示选中所有的数据全部不过滤；
        //          如果值定义为 false，则表示清空所有的数据全部过滤掉而不显示；
        //      2、JSON-Object 类型：如果定义为该类型，则该参数定义包含如下属性：
        //          field:  String 类型，表示要操作的列的 field 值；
        //          selected：Boolean，表示要对 field 所指示的列进行过滤操作的类型：
        //              如果定义为 true，则表示进行选中操作；
        //              如果定义为 false，则表示进行过滤操作；
        //          value:  表示要对 field 所指示的列进行过滤操作的值，该参数可以定义为如下类型：
        //              Array 类型：表示一组要进行过滤操作的值；
        //              非 Array 类型：表示要进行过滤操作的值；
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        columnFilterSelect: function (jq, param) { return jq.each(function () { columnFilterSelect(this, param); }); },

        //  将当前表格数据导出为 excel 文件；该函数定义了一个参数 isAll；
        //  参数 isAll 指示是否导出全部而非仅当前页数据，如果不传入该参数默认为 false 即导出当前页数据。
        //  当参数 isAll 为 true 并且 remotePaging 为 true 时，需要当前 easyui-datagrid 控件的 url 属性指示的服务器数据源支持查询所有数据
        //      （以 rows: 0 方式不分页查询所有数据）。
        //  返回值：返回表示当前 easyui-datagrid 组件的 jQuery 链式对象。
        exportExcel: function (jq, isAll) { return jq.each(function () { exportGrid(this, isAll); }); }

    };
    var defaults = $.fn.datagrid.extensions.defaults = {

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示当屏幕大小调整时候随屏幕大小尺寸调整而自身大小调整的偏移量；
        //  该参数为一个 JSON 格式对象，该对象定义如下属性：
        //      width: 表示相对于浏览器窗口宽度的偏移量，如果是正数则其宽度比浏览器窗口大，反之则其宽度比浏览器窗口小，int类型；
        //      height: 表示相对于浏览器窗口高度的偏移量，如果是正数则其高度比浏览器窗口大，反之则其高度比浏览器窗口小，int类型；
        //  备注：该参数默认为 null，表示不随屏幕尺寸大小调整而调整；
        //      如果未定义 width 或者 width: 0，则表示屏幕大小调整时 easyui-datagrid 的 width 属性撑满屏幕宽度；
        //      如果未定义 height 或者 height: 0，则表示屏幕大小调整时 easyui-datagrid 的 height 属性撑满屏幕宽度；
        offset: null,

        //  覆盖 easyui-datagrid 的原生属性 loadFilter，以支持相应扩展功能。
        loadFilter: loadFilter,

        //  增加 easyui-datagrid 的自定义扩展属性；
        //      该属性表示当设定了属性 rowContextMenu 时，是否将双击数据行 onDblClickRow 事件的响应函数
        //      设置为 rowContextMenu 的第 "dblClickRowMenuIndex" 个菜单项的点击响应函数，并将该菜单项的字体加粗；
        //  Boolean 类型值，默认为 true；
        //  备注：当设置了有效的属性 rowContextMenu 时候，该功能方有效。
        //      自动绑定的 onDblClickRow 的回调函数中将会调用 rowContextMenu 的第 "dblClickRowMenuIndex" 个菜单项的点击响应函数，但是回调函数中不能用到参数 e 和 menu。
        autoBindDblClickRow: true,

        //  增加 easyui-datagrid 的自定义扩展属性；
        //  该属性表示当设定了属性 autoBindDblClickRow: true，双击行数据触发的右键菜单项事件的索引号；
        //      意即触发第几个右键菜单项上的事件。
        //  Number 类型值，从 0 开始计数，默认为 0；
        //  备注：当设置了自定义属性 autoBindDblClickRow: true并且设置了有效的属性 rowContextMenu 时，该功能方有效；
        //      如果此索引值超出菜单数量范围，则无效。
        dblClickRowMenuIndex: 0,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否启用右键点击表头或者行数据时候弹出菜单中具有 "导出数据" 菜单的功能；
        //  该属性可以定义为以下类型：
        //      Boolean 类型值，表示是否启用右键菜单中的“导出数据”菜单项功能，默认为 false。
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          current:   Boolean 类型值，表示是否启用“导出当前页”的菜单项，默认为 true；
        //          all:   Boolean 类型值，表示是否启用“导出全部”的菜单项，默认为 true；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //  备注：当 enableRowContextMenu 属性设置为 true 时，该属性才有效。
        //  导出数据功能的方法尚未实现，所以...就让它保持默认为 false 吧。
        exportMenu: false,

        //  增加 easyui-datagrid 的自定义扩展属性，Boolean 类型值，该属性表示是否启用：
        //      当右键单击行数据时选择右键当前单击的行的功能，默认为 true；
        //  注意：当此参数设置为 true 时，右键点击行会对性能产生一定影响；当时数据量大(单页数据超过 100 行)时不建议使用。
        selectOnRowContextMenu: false,

        //  增加 easyui-datagrid 的自定义扩展属性，Boolean 类型值，该属性表示是否启用：
        //      右键(表头右键或行右键)点击时弹出的菜单项，如果是 disabled: true ，则不显示的功能，默认为 false；
        hideDisabledMenu: false,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示表列头右键菜单，为一个 Array 对象；数组中的每一个元素都具有如下属性:
        //      id:         表示菜单项的 id；
        //      text:       表示菜单项的显示文本；
        //      iconCls:    表示菜单项的左侧显示图标；
        //      disabled:   表示菜单项是否被禁用(禁用的菜单项点击无效)；
        //      hideOnClick:    表示该菜单项点击后整个右键菜单是否立即自动隐藏；
        //      bold:           Boolean 类型值，默认为 false；表示该菜单项是否字体加粗；
        //      style:          JSON-Object 类型值，默认为 null；表示要附加到该菜单项的样式；
        //      handler:    表示菜单项的点击事件，该事件函数格式为 function(e, field, eventData, grid, item, menu)，其中 this 指向菜单项本身
        //  备注：具体格式参考 easyui-datagrid 的 toolbar 属性为 Array 对象类型的格式；
        headerContextMenu: null,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示数据行右键菜单，为一个 Array 对象；；数组中的每一个元素都具有如下属性:
        //      id:         表示菜单项的 id；
        //      text:       表示菜单项的显示文本；
        //      iconCls:    表示菜单项的左侧显示图标；
        //      disabled:   表示菜单项是否被禁用(禁用的菜单项点击无效)；
        //      hideOnClick:    表示该菜单项点击后整个右键菜单是否立即自动隐藏；
        //      bold:           Boolean 类型值，默认为 false；表示该菜单项是否字体加粗；
        //      style:          JSON-Object 类型值，默认为 null；表示要附加到该菜单项的样式；
        //      handler:    表示菜单项的点击事件，该事件函数格式为 function(e, rowIndex, rowData, eventData, grid, item, menu)，其中 this 指向菜单项本身
        //  备注：具体格式参考 easyui-datagrid 的 toolbar 属性为 Array 对象类型的格式；
        rowContextMenu: null,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否启用 easyui-datagrid 的表头列点击按钮菜单；
        //  Boolean 类型值，默认为 true。 
        enableHeaderClickMenu: true,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否启用 easyui-datagrid 的表头右键菜单；
        //  Boolean 类型值，默认为 true。
        enableHeaderContextMenu: true,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否启用 easyui-datagrid 的行右键菜单；
        //  Boolean 类型值，默认为 true。
        enableRowContextMenu: true,

        //  扩展 easyui-datagrid 的自定义属性，表示是否启用右键菜单中的“上移、下移”菜单项的功能；
        //  该属性可以定义为以下类型：
        //      Boolean 类型，表示是否启用这四个菜单项，默认为 false；
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          top:        布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“移至最上”菜单；
        //          up:         布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“上移”菜单；
        //          down:       布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“下移”菜单；
        //          bottom:     布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“移至最上”菜单；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //          上面四个属性，如果参数的值为函数，则函数的签名为 function(e, node, datagrid, item, menu)。
        //  备注：当 enableRowContextMenu 属性设置为 true 时，该属性才有效。
        //      这四个菜单点击时，会自动触发 easyui-datagrid 的 onDrop 事件。
        moveMenu: false,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否启用右键菜单中的“翻页”菜单项的功能；
        //  该属性可以定义为以下类型：
        //      Boolean 类型值，表示是否启用右键菜单中的“翻页”菜单项功能，默认为 true。
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          disabled:   Boolean 类型值，表示是否禁用右键菜单中的“翻页”菜单项功能，默认为 false；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //  备注：当 enableRowContextMenu 属性设置为 true 时，该属性才有效。
        pagingMenu: { submenu: false },

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否启用右键菜单中的“刷新当前页”菜单项的功能；
        //  Boolean 类型值，默认为 true。
        refreshMenu: true,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否启用表格的行节点拖动功能；
        //  Boolean 类型值，默认为 false。
        dndRow: false,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否启用行数据的 tooltip 功能；
        //  该属性可以是一个 Boolean 类型值；也可以是一个格式为 function(rowIndex, rowData) 的回调函数；
        //  如果该参数是一个回调函数，则表示启用行数据的 tooltip 功能，并且该函数的返回值为 tooltip 的 content 值。
        //  默认为 Boolean 类型，值为 false。
        //  注意：当启用该配置属性后，所有列的 tooltip 属性就会自动失效。
        rowTooltip: false,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示在触发 beginEdit 事件后，是否构建仿 ext-grid-rowediting 行编辑的“保存”和“取消”按钮面板；
        //  Boolean 类型值，默认为 true。
        extEditing: true,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示在双击 data-row(数据行) 时，是否自动启用该行的编辑功能(执行 beginEdit 操作)；
        //  Boolean 类型值，默认为 false。
        autoEditing: false,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示在 autoEditing: true 时自动触发行编辑效果的事件(双击行还是单击行)。
        //  String 类型值，可选的值为 "onClickRow" 和 "onDblClickRow"，默认为 "onDblClickRow"
        //  注意：该参数仅在 autoEditing: true 时才有效。
        //        因 "onDblClickRow" 在 autoBindDblClickRow: true 时会自动将右键菜单第一项绑定至行双击事件中；
        //        所以建议在 autoBindDblClickRow: true 且行右键菜单第一项为行编辑功能时，autoEditing 设置为 false 或 autoEditingEvent 设置为 "onClickRow"
        autoEditingEvent: "onDblClickRow",

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示在表格失去焦点(逻辑上失去焦点，实际上是判断页面上表格外的其他部分被点击)后，表格是否自动关闭行编辑状态。
        //  Boolean 类型值，默认为 false。
        finishEditOnBlur: false,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示当 finishEditOnBlur: true，点击哪个区域会导致当前表格自动关闭行编辑状态。
        //  该属性可以是一个 HTML-DOM 对象、也可以是一个 jQuery-DOM 对象、或者一个 jquery-DOM selector。默认为 window.document。
        finishEditLocale: window.document,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示当 finishEditOnBlur: true 时并且在表格失去焦点后将要触发表格自动关闭行编辑状态时，关闭行编辑状态所使用的方法。
        //  String 类型值，可选的值为 "endEdit" 或 "cancelEdit"，默认为 "endEdit"。
        finishEditMethod: "endEdit",

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否在一个时刻只允许一行数据开启编辑状态(当某行数据开启编辑状态时，其他正在编辑的行将会被自动执行 endEdit 操作)；
        //  Boolean 类型值，默认为 true。
        singleEditing: true,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示在对某行执行 beginEdit 后，是否让特定字段的编辑器对象自动获取输入焦点；
        //  该属性可以为 Boolean（默认，true） 类型或者 String 类型值；
        //  如果是 Boolean 类型，则表示是否启用编辑器对象自动获取焦点功能，在值为 true 的情况下该行的第一个编辑器对象将在 beginEdit 操作后自动获取焦点；
        //  如果是 String 类型，其值表示指定的 field 名称，则表示启用该功能并且指定的 field 将在 beginEdit 操作后自动获取焦点。
        autoFocusField: true,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示 easyui-datagrid 的数据行在可编辑状态下，当正在进行编辑操作时按下 Enter 键是否对当前行执行 endEdit 操作并对下一行执行 beginEdit 操作。
        //  Boolean 类型值，默认为 true。
        autoWrapEdit: true,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示 easyui-datagrid 的数据行在可编辑状态下，当按下 ESC 键时自动执行 cancelEdit 操作。
        cancelEditOnEsc: true,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示当前表格的列过滤器设置参数；该参数是一个 JSON 格式的对象，该对象定义如下属性：
        //      panelHeight: 列过滤器控件面板的高度，默认为 100，该值最小为 60；
        //      position:   表示列过滤器的位置，String 类型，可以填入的值限定在以下范围：
        //          "top":  表示列过滤器被放置在表头的上方；
        //          "bottom":   表示列过滤器被放置在表头的下方；默认值。
        //  备注：关于列过滤器组件中每个列具体的过滤效果设置，参见扩展的 ColumnOption 属性(见本源码文件后面注释)；
        //  注意：
        //      1、如果不定义该参数，则表示当前 easyui-datagrid 控件不启用列过滤器功能；该参数不影响表头右键过滤功能；
        //      2、该功能支持多行表头；但不保证在多行表头情况下布局不会出现排版错误；
        //      3、该功能仅实现本地数据过滤，也就是说该插件不会在处理远程数据请求时将过滤参数信息发送到远程服务器；
        //      4、当启用该功能时，easyui-datagrid 的属性 fitColumns 请保持默认值为 false，否则列头过滤器组件可能导致表头列不能对齐而布局混乱。
        columnFilter: null,

        //  增加 easyui-datagrid 的自定义扩展属性，该属性表示是否在分页栏显示当前页面的行过滤数据条目数；
        //      boolean 类型值；
        //  如果该值为 null 或 undefined，则表示分页栏的行过滤数据条目数文本自动判断是否显示；
        showFilterText: undefined,

        //  覆盖 easyui-datagrid 的原生属性 loader，以支持相应扩展功能。调用者请勿在自己的代码中使用该属性，否则扩展功能无效。
        loader: loader,

        //  覆盖 easyui-datagrid 的原生属性事件 onLoadSuccess，以支持相应扩展功能。
        //  注意：如果调用者需要在自己的代码中使用该事件，请以覆盖方式重写，而非直接重写。
        //  覆盖方式重写示例：
        //      grid.datagrid({
        //          onLoadSuccess: function(data) {
        //              $.fn.datagrid.extensions.onLoadSuccess.apply(this, arguments);  //这句一定要加上。
        //              ...                                     //这里是调用者的其他附加逻辑代码
        //          }
        //      });
        onLoadSuccess: onLoadSuccess,

        //  覆盖 easyui-datagrid 的原生属性事件 onResizeColumn，以支持相应扩展功能。
        //  注意：如果调用者需要在自己的代码中使用该事件，请以覆盖方式重写，而非直接重写。
        //  覆盖方式重写示例：
        //      grid.datagrid({
        //          onResizeColumn: function(data) {
        //              $.fn.datagrid.extensions.onResizeColumn.apply(this, arguments);  //这句一定要加上。
        //              ...                                     //这里是调用者的其他附加逻辑代码
        //          }
        //      });
        onResizeColumn: onResizeColumn,

        //  覆盖 easyui-datagrid 的原生属性事件 onBeforeEdit，以支持相应扩展功能。
        onBeforeEdit: onBeforeEdit,

        //  覆盖 easyui-datagrid 的原生属性事件 onAfterEdit，以支持相应扩展功能。
        //  注意：如果调用者需要在自己的代码中使用该事件，请以覆盖方式重写，而非直接重写。
        //  覆盖方式重写示例：
        //      grid.datagrid({
        //          onAfterEdit: function(data) {
        //              $.fn.datagrid.extensions.onAfterEdit.apply(this, arguments);  //这句一定要加上。
        //              ...                                     //这里是调用者的其他附加逻辑代码
        //          }
        //      });
        onAfterEdit: onAfterEdit,

        //  覆盖 easyui-datagrid 的原生属性事件 onCancelEdit，以支持相应扩展功能。
        onCancelEdit: onCancelEdit,

        //  扩展 easyui-datagrid 的自定义事件；该事件表示删除指定的列前触发的动作；该事件回调函数提供如下参数：
        //      field:  表示要被删除的列的 field 值。
        //  备注：如果该事件回调函数返回 false，则不进行删除列的操作。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        onBeforeDeleteColumn: function (field) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示删除指定的列后触发的动作；该事件回调函数提供如下参数：
        //      field:  表示要被删除的列的 field 值。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        onDeleteColumn: function (field) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示移动指定的列前触发的动作；该事件回调函数提供如下参数：
        //      source:  表示要被移动的列的 field 值。
        //      target:  表示目标位置的列的 field 值。
        //      point :  表示移动的方式；这是一个 String 类型值，可能的值包括：
        //          "before":   表示将列 source 移动至列 target 的前一格位置；
        //          "after" :   表示将列 source 移动至列 target 的后一格位置；
        //  备注：如果该事件回调函数返回 false，则不进行删除列的操作。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        onBeforeMoveColumn: function (source, target, point) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示移动指定的列后触发的动作；该事件回调函数提供如下参数：
        //      source:  表示要被移动的列的 field 值。
        //      target:  表示目标位置的列的 field 值。
        //      point :  表示移动的方式；这是一个 String 类型值，可能的值包括：
        //          "before":   表示将列 source 移动至列 target 的前一格位置；
        //          "after" :   表示将列 source 移动至列 target 的后一格位置；
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        onMoveColumn: function (source, target, point) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示移动 data-row(数据行) 之前触发的动作；该事件回调函数提供如下三个参数：
        //      target: 表示目标位置的 data-row(数据行) 索引号(从 0 开始计数)；
        //      source: 表示要移动的 data-row(数据行) 索引号(从 0 开始计数)；
        //      point:  表示移动到目标节点 target 的位置，String 类型，可能的值包括：
        //          "top":      表示移动到目标位置 target 的上一格位置；
        //          "bottom":   表示追加为目标位置 target 的下一格位置；
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        //  如果该事件函数返回 false，则会立即停止移动数据行操作；
        onBeforeDrop: function (target, source, point) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示移动 data-row(数据行) 之后触发的动作；该事件回调函数提供如下三个参数：
        //      target: 表示目标位置的 data-row(数据行) 索引号(从 0 开始计数)；
        //      source: 表示要移动的 data-row(数据行) 索引号(从 0 开始计数)；
        //      point:  表示移动到目标节点 target 的位置，String 类型，可能的值包括：
        //          "top":      表示移动到目标位置 target 的上一格位置；
        //          "bottom":   表示追加为目标位置 target 的下一格位置；
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        onDrop: function (target, source, point) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示拖动 data-row(数据行) 之前触发的动作；该事件回调函数提供如下两个参数：
        //      index:  表示被拖动的 data-row(数据行) 的索引号，从 0 开始计数；
        //      row:    表示被拖动的 data-row(数据行) 的行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件函数返回 false，则取消当前的拖动 data-row(数据行) 操作。
        onBeforeDrag: function (index, row) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示开始拖动 data-row(数据行) 时触发的动作；该事件回调函数提供如下两个参数：
        //      index:  表示被拖动的 data-row(数据行) 的索引号，从 0 开始计数；
        //      row:    表示被拖动的 data-row(数据行) 的行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        onStartDrag: function (index, row) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示结束拖动 data-row(数据行) 时触发的动作；该事件回调函数提供如下两个参数：
        //      index:  表示被拖动的 data-row(数据行) 的索引号，从 0 开始计数；
        //      row:    表示被拖动的 data-row(数据行) 的行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        onStopDrag: function (index, row) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示当有其他的 data-row(数据行) 被拖动至当前 data-row(数据行) 时所触发的动作；该事件回调函数提供如下两个参数：
        //      target: 表示当前 data-row(数据行) 的行数据对象，是一个 JSON-Object；
        //      source: 表示拖动过来的 data-row(数据行) 行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件函数返回 false，则立即取消当前的 data-row(数据行) 接收拖动过来对象的操作，并禁用当前 data-row(数据行) 的 droppable 效果；
        onDragEnter: function (target, source) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示当有其他的 data-row(数据行) 被拖动至当前 data-row(数据行) 后并在上面移动时所触发的动作；该事件回调函数提供如下两个参数：
        //      target: 表示当前 data-row(数据行) 的行数据对象，是一个 JSON-Object；
        //      source: 表示拖动过来的 data-row(数据行) 行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件函数返回 false，则立即取消当前的 data-row(数据行) 接收拖动过来对象的操作，并禁用当前 data-row(数据行) 的 droppable 效果；
        onDragOver: function (target, source) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示当有其他的 data-row(数据行) 被拖动至当前 data-row(数据行) 后并拖动离开时所触发的动作；该事件回调函数提供如下两个参数：
        //      target: 表示当前 data-row(数据行) 的行数据对象，是一个 JSON-Object；
        //      source: 表示拖动过来的 data-row(数据行) 行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-datagrid 的 DOM 对象(非 jQuery 对象)；
        onDragLeave: function (target, source) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示执行 updateRow 方法前所触发的动作；该事件回调函数提供如下两个参数：
        //      index:  表示要进行 updateRow 的行的索引号，从 0 开始计数；
        //      row:    表示要进行更新操作的新的行数据对象；
        //  该事件函数中的 this 指向当前 easyui-datarid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件回调函数返回 false，则立即取消即将要执行的 updateRow 操作。
        onBeforeUpdateRow: function (index, row) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示执行 updateRow 方法后所触发的动作；该事件回调函数提供如下两个参数：
        //      index:  表示要进行 updateRow 的行的索引号，从 0 开始计数；
        //      row:    表示要进行更新操作的新的行数据对象；
        //  该事件函数中的 this 指向当前 easyui-datarid 的 DOM 对象(非 jQuery 对象)；
        onUpdateRow: function (index, row) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示执行 appendRow 方法前所触发的动作；该事件回调函数提供如下参数：
        //      row:    表示要进行添加行操作的新的行数据对象；
        //  该事件函数中的 this 指向当前 easyui-datarid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件回调函数返回 false，则立即取消即将要执行的 appendRow 操作。
        onBeforeAppendRow: function (row) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示执行 appendRow 方法后所触发的动作；该事件回调函数提供如下参数：
        //      row:    表示要进行添加行操作的新的行数据对象；
        //  该事件函数中的 this 指向当前 easyui-datarid 的 DOM 对象(非 jQuery 对象)；
        onAppendRow: function (row) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示执行 insertRow 方法前所触发的动作；该事件回调函数提供如下两个参数：
        //      index:  表示要进行 insertRow 的行的索引号，从 0 开始计数；
        //      row:    表示要进行插入行操作的新的行数据对象；
        //  该事件函数中的 this 指向当前 easyui-datarid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件回调函数返回 false，则立即取消即将要执行的 insertRow 操作。
        onBeforeInsertRow: function (index, row) { },

        //  扩展 easyui-datagrid 的自定义事件；该事件表示执行 insertRow 方法后所触发的动作；该事件回调函数提供如下两个参数：
        //      index:  表示要进行 insertRow 的行的索引号，从 0 开始计数；
        //      row:    表示要进行插入行操作的新的行数据对象；
        //  该事件函数中的 this 指向当前 easyui-datarid 的 DOM 对象(非 jQuery 对象)；
        onBeforeRow: function (index, row) { },

        onBeforeDeleteRow: function (index, row) { },

        onDeleteRow: function (index, row) { }
    };

    //  另，增加了 easyui-datagrid 中列 columnOption 的部分自定义扩展属性：
    //      tooltip:    可以是一个 Boolean 类型，也可以是一个回调函数类型，表示是否启用该列的 tooptip 效果；
    //          如果该属性为 Boolean 类型，表示是否启用该列的 tooltip；
    //          如果该属性为 Function 类型，则其格式为 function (value, rowIndex, rowData)，表示为该列启用 tooltip 的方式；
    //              该回调函数返回一个 String 类型值，表示 tooltip 的 content 内容。
    //          默认为 Boolean 类型值为 false。
    //      filterable: Boolean 类型，默认为 true；表示是否禁用该列右键菜单中的 "过滤/显示" 菜单；
    //      hidable:    Boolean 类型，默认为 true；表示该列是否可隐藏。
    //      filter:     String 类型；表示该列的过滤器组件的类型；可选的值限定在以下范围：
    //          "none":     表示过滤器为空，即该列无过滤器效果。
    //          "checkbox": 表示过滤器的类型为一组 checkbox 复选框，默认值。
    //          "livebox":  表示过滤器的类型为模糊查询过滤方式；即过滤器组件为一个输入框，改变该输入框的值后，对该列进行按输入值的过滤匹配。
    //          "caps":     表示过滤器的类型为 slider 拖动条控件，且过滤的结果为只显示小于或等于 slider 选定的值；只有该列全部为数值数据时，才能设置为该类型。
    //          "lower":    表示过滤器的类型为 slider 拖动条控件，且过滤的结果为只显示大于或等于 slider 选定的值；只有该列全部为数值数据时，才能设置为该类型。
    //      precision:  Number 类型，默认为 1；表示过滤器类型(filter)为 caps 或 lower 时候，slider 组合控件的输入框的改变值的精度(保留的小数位数)。
    //      step:       Number 类型，默认为 1；表示过滤器类型(filter)为 caps 或 lower 时候，移动 slider 控件时值的改变值的精度(最小改变的刻度)。
    //
    //  备注： 当 filterable 的值设置为 true 时，参数 filter 方有效；
    //         当 filterable 的值设置为 true 且 filter 的值为 "caps" 或 "lower" 时，参数 precision 和 step 方有效。
    var columnOptions = $.fn.datagrid.extensions.columnOptions = {
        tooltip: false,
        filterable: true,
        hidable: true,
        filter: "checkbox",
        precision: 1,
        step: 1
    };


    $.extend($.fn.datagrid.defaults, defaults);
    $.extend($.fn.datagrid.methods, methods);



    var editors = $.fn.datagrid.defaults.editors,
        checkbox_init = editors.checkbox.init,
        datebox_init = editors.datebox.init,
        combobox_init = editors.combobox.init,
        combotree_init = editors.combotree.init,
        combogrid_init = editors.combogrid.init;
    $.extend(editors.checkbox, {
        init: function (container, options) {
            return checkbox_init.apply(this, arguments).addClass("datagrid-editable-input datagrid-editable-checkbox");
        },
        setFocus: function (target) {
            $(target).datebox("textbox").focus();
        }
    });
    $.extend(editors.datebox, {
        init: function (container, options) {
            var box = datebox_init.apply(this, arguments);
            box.datebox("textbox").addClass("datagrid-editable-input");
            return box;
        },
        setFocus: function (target) {
            $(target).datebox("textbox").focus();
        }
    });
    $.extend(editors.combobox, {
        init: function (container, options) {
            var box = combobox_init.apply(this, arguments);
            box.combobox("textbox").addClass("datagrid-editable-input");
            return box;
        },
        setFocus: function (target) {
            $(target).combobox("textbox").focus();
        }
    });
    $.extend(editors.combotree, {
        init: function (container, options) {
            var box = combotree_init.apply(this, arguments);
            box.combotree("textbox").addClass("datagrid-editable-input");
            return box;
        },
        setFocus: function (target) {
            $(target).combotree("textbox").focus();
        }
    });
    $.extend(editors.combogrid, {
        init: function (container, options) {
            var box = combogrid_init.apply(this, arguments);
            box.combogrid("textbox").addClass("datagrid-editable-input");
            return box;
        },
        setValue: function (target, value) {
            var t = $(target), opts = t.combogrid("options");
            if (value) {
                if (opts.multiple) {
                    if ($.util.likeArrayNotString(value)) {
                        t.combogrid("setValues", value);
                    } else if (typeof value == "string") {
                        t.combogrid("setValues", value.split(opts.separator));
                    } else {
                        t.combogrid("setValue", value);
                    }
                } else {
                    t.combogrid("setValue", value);
                }
            } else {
                t.combogrid("clear");
            }
        },
        setFocus: function (target) {
            $(target).combogrid("textbox").focus();
        }
    });



    $(document).on("keydown", "div.datagrid div.datagrid-editable input.datagrid-editable-input", function (e) {
        switch (e.which) {
            case 13: autoNextRowEdit(); break;
            case 27: autoCancelEdit(); break;
            default: break;
        }
        function autoNextRowEdit() {
            var input = $(e.target), t = input.currentDatagrid(), opts = t.datagrid("options"), isTg = $.data(t[0], "treegrid") ? true : false;
            if (!opts.autoWrapEdit || isTg) { return; }
            var rows = t.datagrid("getRows");
            if (!rows || !rows.length) { return; }
            var len = rows.length, field = input.closest("td[field]").attr("field"),
                index = window.parseInt(input.closest("tr[datagrid-row-index]").attr("datagrid-row-index"));
            t.datagrid("endEdit", index);
            if (index < len - 1) { t.datagrid("beginEdit", index + 1); }
        }
        function autoCancelEdit() {
            var input = $(e.target), t = input.currentDatagrid(), opts = t.datagrid("options"), isTg = $.data(t[0], "treegrid") ? true : false;
            if (!opts.cancelEditOnEsc || isTg) { return; }
            var index = window.parseInt(input.closest("tr[datagrid-row-index]").attr("datagrid-row-index"));
            t.datagrid("cancelEdit", index);
        }
    });

})(jQuery);


///<jscompress sourcefile="jeasyui.extensions.treegrid.js" />
/**
* jQuery EasyUI treegrid Extensions 1.0 beta
* jQuery EasyUI treegrid 组件扩展
* jeasyui.extensions.treegrid.js
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.tree.js v1.0 beta late
*   6、jeasyui.extensions.datagrid.js v1.0 beta late
*   6、jeasyui.extensions.panel.js v1.0 beta late 和 jeasyui.extensions.window.js v1.0 beta late(可选)
*/
(function ($, undefined) {

    $.fn.treegrid.extensions = {};

    /************************  initExtend Methods Begin  ************************/

    var _update = $.fn.treegrid.methods.update;
    var _append = $.fn.treegrid.methods.append;
    var _insert = $.fn.treegrid.methods.insert;
    var updateRow = function (target, param) {
        if (!param || param.id == undefined || !param.row) { return; }
        var t = $(target), opts = t.treegrid("options");
        if ($.isFunction(opts.onBeforeUpdate) && opts.onBeforeUpdate.call(target, param.id, param.row) == false) { return; }
        _update.call(t, t, param);
        initHeaderColumnFilterContainer(t, opts);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, param.id, param.row);
        if ($.isFunction(opts.onUpdate)) { opts.onUpdate.call(target, param.id, param.row); }
    };
    var appendRow = function (target, param) {
        if (!param || !param.data) { return; }
        var t = $(target), opts = t.treegrid("options");
        if ($.isFunction(opts.onBeforeAppend) && opts.onBeforeAppend.call(target, param.parent, param.data) == false) { return; }
        _append.call(t, t, param);
        initHeaderColumnFilterContainer(t, opts);
        initRowDndExtensions(t, opts);
        $.each(param.data, function () { initColumnRowTooltip(t, opts, this[opts.idField], this); });
        if ($.isFunction(opts.onAppend)) { opts.onAppend.call(target, param.parent, param.data); }
    };
    var insertRow = function (target, param) {
        if (!param || !param.data || (!param.before && !param.after)) { return; }
        var t = $(target), opts = t.treegrid("options");
        if ($.isFunction(opts.onBeforeInsert) && opts.onBeforeInsert.call(target, param.before, param.after, param.data) == false) { return; }
        _insert.call(t, t, param);
        initHeaderColumnFilterContainer(t, opts);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, param.data[opts.idField], param.data);
        resetTeeIndent(t, opts, param.data[opts.idField], opts.treeField);
        if ($.isFunction(opts.onInsert)) { opts.onInsert.call(target, param.before, param.after, param.data); }
    };
    var resetTeeIndent = function (t, opts, id, field) {
        var dom = t.treegrid("getCellDom", { field: field, id: id }),
            level = t.treegrid("getLevel", id), child = t.treegrid("getChildren", id);
        while (dom.find("span.tree-indent,span.tree-hit").length < level) {
            $("<span></span>").addClass("tree-indent").prependTo(dom);
        }
        $.each(child, function () { resetTeeIndent(t, opts, this[opts.idField], field); });
    };

    var getLevel = function (target, id) {
        var t = $(target), tr = t.treegrid("getRowDom", id);
        if (!tr || !tr.length) { return 0; }
        return tr.eq(0).parentsUntil("div.datagrid-body", "tr.treegrid-tr-tree").length + 1;
    };


    var freezeColumn = function (target, field) {
        var t = $(target), fields = t.treegrid("getColumnFields"), frozenFields = t.treegrid("getColumnFields", true);
        if (!frozenFields || !frozenFields.length || !$.array.contains(fields, field) || $.array.contains(frozenFields, field)) { return; }
        t.treegrid("moveColumn", { source: field, target: frozenFields[frozenFields.length - 1], point: "after" });
    };

    var unfreezeColumn = function (target, field) {
        var t = $(target), fields = t.treegrid("getColumnFields"), frozenFields = t.treegrid("getColumnFields", true);
        if (!fields || !fields.length || $.array.contains(fields, field) || !$.array.contains(frozenFields, field)) { return; }
        t.treegrid("moveColumn", { source: field, target: fields[0], point: "before" });
    };

    var moveColumn = function (target, param) {
        if (!param || !param.source || !param.target || param.source == param.target || !param.point) { return; };
        if (!$.array.contains(["before", "after"], param.point)) { param.point = "before"; }
        var t = $(target);
        if (t.treegrid("hasMuliRowHeader")) { return; }
        var opts = t.treegrid("options"), sourceFrozen, targetFrozen,
            fields = t.treegrid("getColumnFields"), frozenFields = t.treegrid("getColumnFields", true);
        if ($.array.contains(fields, param.source)) { sourceFrozen = false; }
        if (sourceFrozen == undefined && $.array.contains(frozenFields, param.source)) { sourceFrozen = true; }
        if ($.array.contains(fields, param.target)) { targetFrozen = false; }
        if (targetFrozen == undefined && $.array.contains(frozenFields, param.target)) { targetFrozen = true; }
        if (sourceFrozen == undefined || targetFrozen == undefined) { return; }
        if ($.isFunction(opts.onBeforeMoveColumn) && opts.onBeforeMoveColumn.call(target, param.source, param.target, param.point) == false) { return; }
        var panel = t.treegrid("getPanel"), view = panel.find("div.datagrid-view"),
            view1 = view.find("div.datagrid-view1"), view2 = view.find("div.datagrid-view2"),
            headerRow1 = view1.find("div.datagrid-header table tr.datagrid-header-row"),
            headerRow2 = view2.find("div.datagrid-header table tr.datagrid-header-row"),
            borderRow1 = view1.find("div.datagrid-body table tr.datagrid-row"),
            borderRow2 = view2.find("div.datagrid-body table tr.datagrid-row"),
            sourceHeaderTd = sourceFrozen ? headerRow1.find("td[field=" + param.source + "]") : headerRow2.find("td[field=" + param.source + "]"),
            targetHeaderTd = targetFrozen ? headerRow1.find("td[field=" + param.target + "]") : headerRow2.find("td[field=" + param.target + "]"),
            sourceRow = sourceFrozen ? borderRow1 : borderRow2,
            targetRow = targetFrozen ? borderRow1 : borderRow2;
        if (sourceRow.length != targetRow.length) { return; }
        targetHeaderTd[param.point](sourceHeaderTd);
        targetRow.each(function (i, n) {
            var targetBodyTr = $(this), id = targetBodyTr.attr("node-id");
            var targetBodyTd = targetBodyTr.find("td[field=" + param.target + "]"), sourceBodyTd = $(sourceRow[i]).find("td[field=" + param.source + "]");
            targetBodyTd[param.point](sourceBodyTd);
        });

        var sourceOpts = t.treegrid("getColumnOption", param.source), targetOpts = t.treegrid("getColumnOption", param.target),
            sourceColumns = sourceFrozen ? opts.frozenColumns[0] : opts.columns[0],
            targetColumns = targetFrozen ? opts.frozenColumns[0] : opts.columns[0],
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        $.array.remove(sourceColumns, sourceOpts);
        var index = $.array.indexOf(targetColumns, targetOpts);
        if (index > -1) { $.array.insert(targetColumns, param.point == "before" ? index : index + 1, sourceOpts); }

        var treeOpts = opts;
        opts = t.datagrid("options");
        sourceOpts = t.datagrid("getColumnOption", param.source);
        targetOpts = t.datagrid("getColumnOption", param.target);
        sourceColumns = sourceFrozen ? opts.frozenColumns[0] : opts.columns[0];
        targetColumns = targetFrozen ? opts.frozenColumns[0] : opts.columns[0];
        $.array.remove(sourceColumns, sourceOpts);
        var index = $.array.indexOf(targetColumns, targetOpts);
        if (index > -1) { $.array.insert(targetColumns, param.point == "before" ? index : index + 1, sourceOpts); }
        opts = treeOpts;

        if (sourceFrozen || targetFrozen && sourceFrozen != targetFrozen) { var data = t.treegrid("getData"); t.treegrid("loadData", data); } else { t.treegrid("fixColumnSize"); }
        if (sourceFrozen) {
            if (!targetFrozen) {
                index = $.array.indexOf(exts.fields, param.target);
                $.array.insert(exts.fields, param.point == "before" ? index : index + 1, param.source);
                $.array.insert(exts.fieldOptions, param.point == "before" ? index : index + 1, sourceOpts);
                $.array.insert(exts.fieldOptionsBackup, param.point == "before" ? index : index + 1, $.extend({}, sourceOpts));
            }
        }
        if (!sourceFrozen) {
            index = $.array.indexOf(exts.fields, param.source);
            if (targetFrozen) {
                $.array.removeAt(exts.fields, index);
                $.array.removeAt(exts.fieldOptions, index);
                $.array.removeAt(exts.fieldOptionsBackup, index);
            } else {
                var fieldOpts = exts.fieldOptions[index], fieldOptsBak = exts.fieldOptionsBackup[index];
                $.array.removeAt(exts.fields, index);
                $.array.removeAt(exts.fieldOptions, index);
                $.array.removeAt(exts.fieldOptionsBackup, index);
                index = $.array.indexOf(exts.fields, param.target);
                $.array.insert(exts.fields, param.point == "before" ? index : index + 1, param.source);
                $.array.insert(exts.fieldOptions, param.point == "before" ? index : index + 1, fieldOpts);
                $.array.insert(exts.fieldOptionsBackup, param.point == "before" ? index : index + 1, fieldOptsBak);
            }
        }
        if ($.isFunction(opts.onMoveColumn)) { opts.onMoveColumn.call(target, param.source, param.target, param.point); }
    }

    var shiftColumn = function (target, param) {
        if (!param || !param.field || !param.point) { return; };
        if (!$.array.contains(["before", "after"], param.point)) { param.point = "before"; }
        var t = $(target), fields = t.treegrid("getColumnFields", "all"),
            index = $.array.indexOf(fields, param.field);
        if (index == -1 || (param.point == "before" && index == 0) || (param.point == "after" && index == fields.length - 1)) { return; }
        var target = fields[param.point == "before" ? index - 1 : index + 1];
        t.treegrid("moveColumn", { source: param.field, target: target, point: param.point });
    };

    var deleteColumn = function (target, field) {
        var t = $(target), opts = t.treegrid("options"),
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        if ($.isFunction(opts.onBeforeDeleteColumn) && opts.onBeforeDeleteColumn.call(target, field) == false) { return; }
        $.fn.datagrid.extensions.removeField(opts, field, exts);
        t.treegrid("getColumnDom", { field: field, header: true }).remove();
        if ($.isFunction(opts.onDeleteColumn)) { opts.onDeleteColumn.call(target, field); }
    };

    var popColumn = function (target, field) {
        var t = $(target), colOpts = t.treegrid("getColumnOption", field);
        if (colOpts) { t.treegrid("deleteColumn", field); }
        return colOpts
    };


    var isChecked = function (target, id) {
        var t = $(target), opts = t.treegrid("options"), rows = t.treegrid("getChecked");
        return $.array.contains(rows, id, function (val) { return val[opts.idField] == id; });
    };

    var isSelected = function (target, id) {
        var t = $(target), opts = t.treegrid("options"), rows = t.treegrid("getSelections");
        return $.array.contains(rows, id, function (val) { return val[opts.idField] == id; });
    };

    var isEditing = function (target, id) {
        var t = $(target), panel = t.treegrid("getPanel");
        return panel.find("div.datagrid-view div.datagrid-body table tr.datagrid-row[node-id=" + id + "]").hasClass("datagrid-row-editing");
    };

    var getEditingNodeId = function (target) {
        var array = getEditingNodeIds(target);
        return array.length ? array[0] : undefined;
    };

    var getEditingNodeIds = function (target) {
        var t = $(target), panel = t.treegrid("getPanel"),
            rows = panel.find("div.datagrid-view div.datagrid-body table tr.datagrid-row.datagrid-row-editing").map(function () {
                return $(this).attr("node-id");
            }),
            array = $.array.distinct($.array.clone(rows));
        return array;
    };

    var isRootNode = function (target, id) {
        var t = $(target), roots = t.treegrid("getRoots"), node = t.treegrid("find", id);
        return node && $.array.contains(roots, node);
    };

    var moveRow = function (target, param) {
        if (!param || !param.source || !param.target || !param.point) { return; }
        if (!$.array.contains(["append", "top", "bottom"], param.point)) { param.point = "append"; }
        var t = $(target), opts = t.treegrid("options"),
            sourceNode = t.treegrid("find", param.source), targetNode = t.treegrid("find", param.target);
        if (!sourceNode || !targetNode || sourceNode == targetNode) { return; }
        if ($.isFunction(opts.onBeforeDrop) && opts.onBeforeDrop.call(target, targetNode, sourceNode, param.point) == false) { return; }
        if (t.treegrid("isParent", { id1: param.source, id2: param.target })) { return; }
        var node = t.treegrid("pop", param.source);
        switch (param.point) {
            case "append": t.treegrid("append", { parent: param.target, data: [node] }); break;
            case "top": t.treegrid("insert", { before: param.target, data: node }); break;
            case "bottom": t.treegrid("insert", { after: param.target, data: node }); break;
            default: t.treegrid("append", { parent: param.target, data: [node] }); break;
        }
        if (node && $.isFunction(opts.onDrop)) { opts.onDrop.call(target, targetNode, sourceNode, param.point); }
    };

    var shiftRow = function (target, param) {
        if (!param || !param.id || !param.point || !$.array.contains(["up", "upLevel", "down", "downLevel"], param.point)) { return; }
        var t = $(target), opts = t.treegrid("options"), node;
        switch (param.point) {
            case "up": node = t.treegrid("prevRow", param.id); break;
            case "upLevel": node = t.treegrid("getParent", param.id); break;
            case "down": node = t.treegrid("nextRow", param.id); break;
            case "downLevel": node = t.treegrid("prevRow", param.id); break;
            default: break;
        }
        if (!node) { return; }
        t.treegrid("moveRow", { target: node[opts.idField], source: param.id, point: param.point == "up" ? "top" : (param.point == "downLevel" ? "append" : "bottom") });
    };

    var compareNode = function (target, param) {
        if (isChild(target, param)) { return "child"; }
        if (isParent(target, param)) { return "parent"; }
        if (isSibling(target, param)) { return "sibling"; }
        return "normal";
    };

    var isParent = function (target, param) {
        var t = $(target), node = t.treegrid("find", param.id2);
        var children = t.treegrid("getChildren", param.id1);
        return $.array.contains(children, node);
    };

    var isChild = function (target, param) {
        var t = $(target), node = t.treegrid("find", param.id1);
        var children = t.treegrid("getChildren", param.id2);
        return $.array.contains(children, node);
    };

    var isSibling = function (target, param) {
        var t = $(target), p1 = t.treegrid("getParent", param.id1), p2 = t.treegrid("getParent", param.id2);
        return p1 && p2 && p1 == p2;
    };

    var getNextRow = function (target, id) {
        var t = $(target);
        var row = t.treegrid("getRowDom", id).nextAll("tr.datagrid-row:first"), rowId = row.attr("node-id");
        if (!row.length || !rowId) { return null; }
        return t.treegrid("find", rowId);
    };

    var getPrevRow = function (target, id) {
        var t = $(target);
        var row = t.treegrid("getRowDom", id).prevAll("tr.datagrid-row:first"), rowId = row.attr("node-id");
        if (!row.length || !rowId) { return null; }
        return t.treegrid("find", rowId);
    };

    var getNears = function (target, id) {
        var t = $(target), opts = t.treegrid("options");
        if (t.treegrid("isRoot", id)) { return t.treegrid("getRoots"); }
        var p = t.treegrid("getParent", id);
        if (!p) { return t.treegrid("getRoots"); }
        return t.treegrid("getNearChildren", p[opts.idField]);
    };

    var getNearChildren = function (target, id) {
        var t = $(target), opts = t.treegrid("options"),
            children = t.treegrid("getChildren", id);
        return $.array.filter(children, function (val) { return t.treegrid("getParent", val[opts.idField])[opts.idField] == id; });
    };


    var enableRowDnd = function (target) {
        var t = $(target), opts = t.treegrid("options");
        t.treegrid("getPanel").find("div.datagrid-view div.datagrid-body table tr.datagrid-row").draggable({
            disabled: false, revert: true, cursor: "default", deltaX: 10, deltaY: 5,
            proxy: function (source) {
                var tr = $(source), id = tr.attr("node-id"), dom = t.treegrid("getRowDom", id).clone();
                var temp = $("<tr></tr>").addClass("datagrid-row datagrid-row-selected");
                $("<td><span class='tree-dnd-icon tree-dnd-no' ></span></td>").appendTo(temp);
                var td = dom.find("td").each(function (i) { if (i < 6) { temp.append(this); } });
                if (td.length > 6) { $("<td>...</td>").css("width", "40px").appendTo(temp); }
                return $("<table></table>").addClass("tree-node-proxy").appendTo("body").append(temp).hide();
            }, onBeforeDrag: function (e) {
                var tr = $(this), id = tr.attr("node-id"), row = t.treegrid("find", id);
                if ($.isFunction(opts.onBeforeDrag) && opts.onBeforeDrag.call(target, row) == false) { return false; }
                if (e.which != 1) { return false; }
                if (e.target.type == "checkbox") { return false; }
                t.treegrid("getRowDom", { id: id, cascade: true }).droppable({ accept: "no-accept" });
            }, onStartDrag: function () {
                var tr = $(this), id = tr.attr("node-id"), row = t.treegrid("find", id);
                tr.draggable("proxy").css({ left: -10000, top: -10000 });
                if ($.isFunction(opts.onBeforeDrag)) { opts.onStartDrag.call(target, row); }
            }, onStopDrag: function () {
                var tr = $(this), id = tr.attr("node-id"), row = t.treegrid("find", id);
                t.treegrid("getRowDom", { id: id, cascade: true }).droppable({ accept: "tr.datagrid-row" });
                if ($.isFunction(opts.onStopDrag)) { opts.onStopDrag.call(target, row); }
            }, onDrag: function (e) {
                var x1 = e.pageX, y1 = e.pageY, x2 = e.data.startX, y2 = e.data.startY;
                var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                if (d > 15) { $(this).draggable("proxy").show(); }
                this.pageY = e.pageY;
            }
        }).droppable({
            accept: "tr.datagrid-row",
            onDragEnter: function (e, source) {
                var droper = $(this), drager = $(source),
                    droperId = droper.attr("node-id"), dragerId = drager.attr("node-id"),
                    droperRow = t.treegrid("find", droperId), dragerRow = t.treegrid("find", dragerId),
                    droperRowDom = t.treegrid("getRowDom", droperId),
                    mark = droperRowDom.find("td"), treeFieldDom = droperRowDom.find("td[field=" + opts.treeField + "]");
                var dnd = droper.data("dnd"), data = {
                    droper: droper, drager: drager, droperId: droperId, dragerId: dragerId,
                    droperRow: droperRow, dragerRow: dragerRow, droperRowDom: droperRowDom, mark: mark, treeFieldDom: treeFieldDom
                };
                if (!dnd) { droper.data("dnd", data); } else { $.extend(dnd, data); }
                if ($.isFunction(opts.onDragEnter) && opts.onDragEnter.call(target, droperRow, dragerRow) == false) {
                    setDroppableStatus(drager, false);
                    mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                    treeFieldDom.removeClass("datagrid-header-cell-append");
                }
            },
            onDragOver: function (e, source) {
                var droper = $(this), dnd = droper.data("dnd"), drager = dnd.drager,
                    droperId = dnd.droperId, dragerId = dnd.dragerId,
                    droperRow = dnd.droperRow, dragerRow = dnd.dragerRow,
                    mark = dnd.mark, treeFieldDom = dnd.treeFieldDom;
                if (droper.droppable("options").disabled) { return; }
                var pageY = source.pageY, top = droper.offset().top, height = top + droper.outerHeight();
                setDroppableStatus(drager, !t.treegrid("isParent", { id1: dragerId, id2: droperId }));
                mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                treeFieldDom.removeClass("datagrid-header-cell-append");
                if (pageY > top + (height - top) / 2) {
                    if (height - pageY < 5) {
                        mark.addClass("datagrid-header-cell-bottom");
                    } else {
                        treeFieldDom.addClass("datagrid-header-cell-append");
                    }
                } else {
                    if (pageY - top < 5) {
                        mark.addClass("datagrid-header-cell-top");
                    } else {
                        treeFieldDom.addClass("datagrid-header-cell-append");
                    }
                }
                if (opts.onDragOver.call(target, droperRow, dragerRow) == false) {
                    setDroppableStatus(drager, false);
                    mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                    treeFieldDom.removeClass("datagrid-header-cell-append");
                    droper.droppable("disable");
                }
            },
            onDragLeave: function (e, source) {
                var droper = $(this), dnd = droper.data("dnd"), drager = dnd.drager,
                    droperRow = dnd.droperRow, dragerRow = dnd.dragerRow, mark = dnd.mark, treeFieldDom = dnd.treeFieldDom;
                setDroppableStatus(drager, false);
                mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                treeFieldDom.removeClass("datagrid-header-cell-append");
                if ($.isFunction(opts.onDragLeave)) { opts.onDragLeave.call(target, droperRow, dragerRow); }
            },
            onDrop: function (e, source) {
                var droper = $(this), dnd = droper.data("dnd"),
                    droperId = dnd.droperId, dragerId = dnd.dragerId, mark = dnd.mark, treeFieldDom = dnd.treeFieldDom,
                    point = treeFieldDom.hasClass("datagrid-header-cell-append") ? "append" : (mark.hasClass("datagrid-header-cell-top") ? "top" : "bottom");
                t.treegrid("moveRow", { target: droperId, source: dragerId, point: point });
                mark.removeClass("datagrid-header-cell-top datagrid-header-cell-bottom");
                treeFieldDom.removeClass("datagrid-header-cell-append");
            }
        });
        opts.dndRow = true;
        function setDroppableStatus(source, state) {
            var icon = source.draggable("proxy").find("span.tree-dnd-icon");
            icon.removeClass("tree-dnd-yes tree-dnd-no").addClass(state ? "tree-dnd-yes" : "tree-dnd-no");
        };
    };

    var disableRowDnd = function (target) {
        var t = $(target), opts = t.treegrid("options");
        t.treegrid("getPanel").find("div.datagrid-view div.datagrid-body table tr.datagrid-row").draggable("disable");
        opts.dndRow = false;
    };







    var getRows = function (target, cascade) {
        var t = $(target), rows = t.treegrid("getRoots"), opts = t.treegrid("options");
        rows = rows && rows.length ? rows : [];
        return cascade ? $.array.reduce(rows, function (prev, val, index) {
            prev.push(val);
            var cc = t.treegrid("getChildren", val[opts.idField]);
            if (cc && cc.length) { $.array.merge(prev, cc); }
            return prev;
        }, []) : rows;
    };

    var getColumnData = function (target, param) {
        param = $.isPlainObject(param) ? param : { field: param, cascade: false };
        var field = param.field, cascade = param.cascade,
            t = $(target), rows = t.treegrid("getRows", cascade);
        return $.array.map(rows, function (val) { return val[field]; });
    };

    var getRowDom = function (target, param) {
        param = $.isPlainObject(param) ? param : { id: param, cascade: false };
        var id = param.id, cascade = param.cascade ? true : false,
            t = $(target), opts = t.treegrid("options"), panel = t.treegrid("getPanel"),
            dom = panel.find(".datagrid-view .datagrid-body tr.datagrid-row[node-id=" + id + "]");
        if (cascade) {
            var children = t.treegrid("getChildren", id);
            $.each(children, function (i, n) { var d = getRowDom(target, n[opts.idField]); dom = dom.add(d); });
        }
        return dom;
    };

    var getNode = function (target, id) {
        return $(target).treegrid("find", id);
    };

    var getCellDom = function (target, pos) {
        if (!pos || !pos.field || pos.id == null || pos.id == undefined) { return $(); }
        var t = $(target), tr = t.treegrid("getRowDom", pos.id);
        return tr.find("td[field=" + pos.field + "] .datagrid-cell");
    };
    var getCellData = function (target, pos) {
        if (!pos || !pos.field || pos.id == null || pos.id == undefined) { return undefined; }
        var t = $(target), row = t.treegrid("find", pos.id);
        return row[pos.field];
    };
    var getCellDisplay = function (target, pos) {
        var t = $(target), cell = t.treegrid("getCellDom", pos);
        return cell && cell.length ? cell.text() : undefined;
    };

    var getDistinctRows = function (target, param) {
        param = $.isPlainObject(param) ? param : { field: param, cascade: false };
        var field = param.field, cascade = param.cascade,
            t = $(target), fields = t.treegrid("getColumnFields", "all");
        if (!$.array.contains(fields, field)) { return []; }
        var rows = t.treegrid("getRows", cascade), data = $.array.clone(rows);
        $.array.distinct(data, function (a, b) { return a[field] == b[field]; });
        return data;
    };

    var getDistinctColumnData = function (target, param) {
        param = $.isPlainObject(param) ? param : { field: param, cascade: false };
        var field = param.field, cascade = param.cascade,
            t = $(target), fields = t.treegrid("getColumnFields", "all");
        if (!$.array.contains(fields, field)) { return []; }
        var data = t.treegrid("getColumnData", { field: field, cascade: cascade });
        $.array.distinct(data, function (a, b) { return a == b; });
        return data;
    };

    var _find = $.fn.treegrid.methods.find;
    var findRow = function (target, param, grid) {
        var t = grid || $(target);
        if (!$.isFunction(param)) { return _find.call(t, t, param); }
        var rows = t.treegrid("getRows", true);
        return $.array.first(rows, param);
    };

    var findRows = function (target, param) {
        var t = $(target), ret;
        if ($.isFunction(param)) {
            ret = $.array.filter(t.treegrid("getRows", true), param);
        } else if ($.array.likeArray(param) && !$.util.isString(param)) {
            ret = $.array.map(param, function (val) { return findRow(target, val, t); });
            ret = $.array.filter(ret, function (val) { return val != undefined && val != null; });
        } else {
            ret = [findRow(target, param, t)];
        }
        return ret;
    };

    var showRow = function (target, param, grid, options, extensions, refreshable) {
        var t = grid || $(target), opts = options || t.treegrid("options"),
            isFunc = $.isFunction(param), val = isFunc ? findRow(target, param, t) : null,
            id = isFunc ? (val ? val[opts.idField] : null) : ($.isPlainObject(param) && (opts.idField in param) ? param[opts.idField] : param);
        if (id == null || id == undefined) { return; }
        var dom = t.treegrid("getRowDom", { id: id, cascade: true }),
            refreshable = (refreshable == null || refreshable == undefined || refreshable == true) ? true : false;
        if (dom.length) {
            var row = isFunc ? val : t.treegrid("find", id),
                exts = extensions || (opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {}));
            exts.filterData = $.isArray(exts.filterData) ? exts.filterData : exts.filterData = [];
            dom.show();
            $.array.remove(exts.filterData, row);
            var children = t.treegrid("getChildren", id);
            $.each(children, function () { $.array.remove(exts.filterData, this); });
            if (refreshable) { refreshColumnFilterStatus(t, opts, exts, rows); }
        }
    };

    var hideRow = function (target, param, grid, options, extensions, refreshable) {
        var t = grid || $(target), opts = options || t.treegrid("options"),
            isFunc = $.isFunction(param), val = isFunc ? findRow(target, param, t) : null,
            id = isFunc ? (val ? val[opts.idField] : null) : ($.isPlainObject(param) && (opts.idField in param) ? param[opts.idField] : param);
        if (id == null || id == undefined) { return; }
        var dom = t.treegrid("getRowDom", { id: id, cascade: true }),
            refreshable = (refreshable == null || refreshable == undefined || refreshable == true) ? true : false;
        if (dom.length) {
            var row = isFunc ? val : t.treegrid("find", id),
                exts = extensions || (opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {}));
            exts.filterData = $.isArray(exts.filterData) ? exts.filterData : exts.filterData = [];
            t.treegrid("unselectRow", { id: id, cascade: true }).treegrid("uncheckRow", { id: id, cascade: true });
            dom.hide();
            $.array.unique(exts.filterData, row, t.treegrid("getChildren", id));
            if (refreshable) { refreshColumnFilterStatus(t, opts, exts, rows); }
        }
    };

    var showRows = function (target, param) {
        var t = $(target), opts = t.treegrid("options"), rows = t.treegrid("getRows", true), array,
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        if (param === true) {
            exts.filterData = [];
            var panel = t.treegrid("getPanel"), icons = panel.find("div.datagrid-header-filter-item-icon");
            panel.find(".datagrid-view .datagrid-body tr.datagrid-row").show();
            setItemIconCls(icons, "tree-checkbox1");
            refreshColumnFilterPagerStatus(t, opts);
        } else if ($.isFunction(param)) {
            array = $.array.filter(rows, param);
            array = $.array.map(array, function (val) { return val[opts.idField]; });
        } else if ($.array.likeArray(param) && !$.util.isString(param)) {
            array = param;
        } else { array = [param]; }
        if (array) {
            $.each(array, function (index, val) { showRow(target, val, t, opts, exts, false); });
            refreshColumnFilterStatus(t, opts, exts, t.treegrid("getRows"));
        }
    };

    var hideRows = function (target, param) {
        var t = $(target), opts = t.treegrid("options"), rows = t.treegrid("getRows", true), array,
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        if (param === true) {
            t.treegrid("unselectAll").treegrid("uncheckAll");
            exts.filterData = $.array.clone(rows);
            var panel = t.treegrid("getPanel"), icons = panel.find("div.datagrid-header-filter-item-icon");
            panel.find(".datagrid-view .datagrid-body tr.datagrid-row").hide();
            setItemIconCls(icons, "tree-checkbox0");
            refreshColumnFilterPagerStatus(t, opts);
        } else if ($.isFunction(param)) {
            array = $.array.filter(rows, param);
            array = $.array.map(array, function (val) { return val[opts.idField]; });
        } else if ($.array.likeArray(param) && !$.util.isString(param)) {
            array = param;
        } else { array = [param]; }
        if (array) {
            $.each(array, function (index, val) { hideRow(target, val, t, opts, exts, false); });
            refreshColumnFilterStatus(t, opts, exts, t.treegrid("getRows"));
        }
    };

    var getHiddenRows = function (target, cascade) {
        var t = $(target), opts = t.treegrid("options"),
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        if (cascade) { return exts.filterData; }
        var roots = t.treegrid("getRoots");
        return $.array.filter(exts.filterData, function (val) { return $.array.contains(roots, val); });
    };

    var getVisibleRows = function (target, cascade) {
        var t = $(target), opts = t.treegrid("options"), rows = t.treegrid("getRows", cascade),
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        return $.array.filter(rows, function (val) { return $.array.contains(exts.filterData, val) ? false : true; });
    };


    var _remove = $.fn.treegrid.methods.remove;
    var removeRow = function (target, id) {
        var t = $(target), opts = t.treegrid("options"), row = t.treegrid("find", id);
        if (row && $.isFunction(opts.onBeforeRemove) && opts.onBeforeRemove.call(target, row) != false) {
            _remove.call(t, t, id);
            initHeaderColumnFilterContainer(t, opts);
            if ($.isFunction(opts.onRemove)) { opts.onRemove.call(target, row); }
        }
    };


    var deleteRow = function (target, param) {
        var t = $(target);
        if (!$.isFunction(param)) { t.treegrid("remove", param); }
        var rows = t.treegrid("getRows", true), opts = t.treegrid("options"), row = $.array.first(rows, param), id = row ? row[opts.idField] : null;
        t.treegrid("remove", id);
    };

    var deleteRows = function (target, param) {
        var isArray = $.array.likeArray(param) && !$.util.isString(param);
        if (isArray) { $.each(param, function (index, val) { deleteRow(target, val); }); return; }
        if ($.isFunction(param)) {
            var t = $(target), opts = t.treegrid("options"), rows = t.treegrid("getRows", true), data = $.array.filter(rows, param);
            $.each(function () {
                var node = findRow(target, this[opts.idField], t);
                if (node != null && node != undefined) { t.treegrid("remove", this[opts.idField]); }
            });
        }
    };

    var setColumnTitle = function (target, param) {
        if (param && param.field && param.title) {
            var t = $(target), colOpts = t.treegrid("getColumnOption", param.field);
            colOpts.title = param.title;
            t.datagrid("setColumnTitle", param);
        }
    };

    var _select = $.fn.treegrid.methods.select;
    var _unselect = $.fn.treegrid.methods.unselect;
    var selectRow = function (target, param) {
        param = $.isPlainObject(param) ? param : { id: param, cascade: false };
        var id = param.id, cascade = param.cascade ? true : false, t = $(target);
        _select.call(t, t, id);
        if (cascade) {
            var opts = t.treegrid("options");
            $.each(t.treegrid("getChildren", id), function () { _select.call(t, t, this[opts.idField]); });
        }
    };

    var unselectRow = function (target, param) {
        param = $.isPlainObject(param) ? param : { id: param, cascade: false };
        var id = param.id, cascade = param.cascade ? true : false, t = $(target);
        _unselect.call(t, t, id);
        if (cascade) {
            var opts = t.treegrid("options");
            $.each(t.treegrid("getChildren", id), function () { _unselect.call(t, t, this[opts.idField]); });
        }
    };

    var checkRow = function (target, param) {
        param = $.isPlainObject(param) ? param : { id: param, cascade: false };
        var id = param.id, cascade = param.cascade ? true : false, t = $(target);
        t.datagrid("checkRow", id);
        if (cascade) {
            var opts = t.treegrid("options");
            $.each(t.treegrid("getChildren", id), function () { t.datagrid("checkRow", this[opts.idField]); });
        }
    };

    var uncheckRow = function (target, param) {
        param = $.isPlainObject(param) ? param : { id: param, cascade: false };
        var id = param.id, cascade = param.cascade ? true : false, t = $(target);
        t.datagrid("uncheckRow", id);
        if (cascade) {
            var opts = t.treegrid("options");
            $.each(t.treegrid("getChildren", id), function () { t.datagrid("uncheckRow", this[opts.idField]); });
        }
    };


    var setColumnFilter = function (target, columnFilter) {
        var t = $(target), opts = t.treegrid("options"),
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {}),
            panel = t.treegrid("getPanel"),
            selector = "div.datagrid-view div.datagrid-header tr.datagrid-header-row div.datagrid-header-filter-container";
        if (!columnFilter) {
            var headerFields = panel.find(selector), length = headerFields.length, i = 0;
            headerFields.slideUp("slow", function () {
                if (++i == length) {
                    clearHeaderColumnFilter(t, opts);
                    opts.columnFilter = columnFilter;
                }
            });
        } else {
            opts.columnFilter = columnFilter;
            initHeaderColumnFilterContainer(t, opts, exts);
            $.util.exec(function () {
                panel.find(selector).hide().slideDown("slow");
            });
        }
    };

    var columnFilterSelect = function (target, param) {
        var t = $(target);
        if ($.util.isBoolean(param)) { t.treegrid(param ? "showRows" : "hideRows", true); return; }
        if (!param || !param.field) { return; }
        var field = param.field, value = param.value, isArray = $.array.likeArray(value) && !$.util.isString(value),
            finder = isArray ? function (val) { return $.array.contains(value, val[field]); } : function (val) { return value == val[field]; },
            rows = t.treegrid("findRows", finder);
        t.treegrid(param.selected ? "showRows" : "hideRows", rows);
    };

    var setOffset = function (target, offset) {
        var t = $(target), opts = t.treegrid("options"),
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        opts.offset = exts.offset = $.fn.datagrid.extensions.parseOffset(offset);
        t.datagrid("setOffset", opts.offset);
    };

    var livesearch = function (target, param) {
        var t = $(target), panel = t.treegrid("getPanel"), opts = t.treegrid("options"), treeField = opts.treeField,
            cells, field, value = param, regular = false, ignoreCase = true, regexp;
        if ($.isPlainObject(param)) {
            value = param.value;
            field = param.field;
            regular = param.regular;
            ignoreCase = param.ignoreCase;
            cells = panel.find("div.datagrid-body tr.datagrid-row td[" + (field ? "field=" + field : "field") + "] div.datagrid-cell");
        } else {
            cells = panel.find("div.datagrid-body tr.datagrid-row td[field] div.datagrid-cell");
        }
        regexp = regular ? new RegExp(value, ignoreCase ? "gm" : "igm") : value;
        cells.each(function () {
            var cell = $(this), td = cell.parent(), field = td.attr("field");
            if (field == treeField) { cell = cell.find("span.tree-title"); }
            cell.find("span.datagrid-cell-hightlight").replaceWith(function () { return $(this).text(); });
            if (!value) { return; }
            var text = cell.html(); if (!text) { return; }
            cell.html($.string.replaceAll(text, value, "<span class='datagrid-cell-hightlight'>" + value + "</span>"));
        });
    };

    var exportGrid = function (target, isAll) {
        isAll = $.string.toBoolean(isAll);
        alert("导出" + (isAll ? "全部" : "当前页") + "数据");
    };

    /************************  initExtend Methods   End  ************************/



    var initRowDndExtensions = $.fn.treegrid.extensions.initRowDndExtensions = function (t, opts) {
        opts = opts || t.treegrid("options");
        if (opts.dndRow) { t.treegrid("enableRowDnd"); }
    };

    /************************  initExtend ColumnFilter Begin  ************************/
    function initHeaderColumnFilterContainer(t, opts, exts) {
        exts = exts || (opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {}));
        $.fn.datagrid.extensions.initColumnExtendProperties(t, exts);
        var data = t.treegrid("getData"), oldData = exts.oldData;
        if (data != oldData) { exts.filterData = []; }
        clearHeaderColumnFilter(t, opts);
        refreshColumnFilterPagerStatus(t, opts);
        if (!opts.columnFilter) { return; }
        exts.oldData = data;
        var header = t.treegrid("getPanel").find("div.datagrid-view div.datagrid-header"),
            headerRows = header.find("table.datagrid-htable tr.datagrid-header-row"),
            headerFields = headerRows.find("td[field]").filter(function () {
                var td = $(this), colspan = td.attr("colspan");
                return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
            }),
            columnFilter = opts.columnFilter = $.extend({ panelHeight: 100, position: "top" }, opts.columnFilter),
            position = $.array.contains(["top", "bottom"], columnFilter.position) ? columnFilter.position : "top",
            panelHeight = columnFilter.panelHeight = $.isNumeric(columnFilter.panelHeight) && columnFilter.panelHeight >= 60 ? columnFilter.panelHeight : 60,
            height = header.height(), rows = t.treegrid("getRows");
        headerFields.each(function () {
            var td = $(this).addClass("datagrid-header-filter").removeClass("datagrid-header-filter-top datagrid-header-filter-bottom"),
                cell = td.find("div.datagrid-cell").addClass("datagrid-header-filter-cell"),
                field = td.attr("field"), colOpts = t.treegrid("getColumnOption", field), colWidth = colOpts.width,
                line = $("<hr />").addClass("datagrid-header-filter-line")[position == "top" ? "prependTo" : "appendTo"](this),
                container = $("<div></div>").attr("field", field).addClass("datagrid-header-filter-container").css({
                    height: columnFilter.panelHeight, width: colWidth
                })[position == "top" ? "prependTo" : "appendTo"](this);
            td.addClass(position == "top" ? "datagrid-header-filter-top" : "datagrid-header-filter-bottom");
            if (field) { initColumnFilterField(t, opts, exts, container, colOpts, rows, headerFields); }
        });
        if (exts.filterData && exts.filterData.length) {
            t.treegrid("hideRows", exts.filterData);
        } else {
            refreshColumnFilterStatus(t, opts, exts, rows, headerFields);
        }
    };

    function clearHeaderColumnFilter(t, opts) {
        if (!opts.columnFilter) { return; }
        var headerFields = t.treegrid("getPanel").find("div.datagrid-view div.datagrid-header table.datagrid-htable tr.datagrid-header-row td[field]").filter(function () {
            var td = $(this), colspan = td.attr("colspan");
            return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
        });
        headerFields.removeClass("datagrid-header-filter datagrid-header-filter-top datagrid-header-filter-bottom").find("div.datagrid-cell").removeClass("datagrid-header-filter-cell");
        headerFields.find("hr.datagrid-header-filter-line,div.datagrid-header-filter-container").remove();
        var fields = t.treegrid("getColumnFields", "all");
        t.datagrid("fixColumnSize", fields[fields.length - 1]);
    };

    function initColumnFilterField(t, opts, exts, container, colOpts, rows, headerFields) {
        if (!colOpts.filterable) { return; }
        var field = colOpts.field, distinctVals = t.treegrid("getDistinctColumnData", field),
            filter = $.array.contains(["checkbox", "livebox", "caps", "lower", "none"], colOpts.filter) ? colOpts.filter : "checkbox",
            precision = colOpts.precision, step = colOpts.step;
        switch (filter) {
            case "checkbox": initColumnFilterFieldCheckBox(t, opts, exts, container, field, rows, distinctVals); break;
            case "livebox": initColumnFilterFieldLiveBox(t, opts, container, field, rows); break;
            case "caps":
                initColumnFilerFieldSlider(t, opts, container, field, step, precision, rows, distinctVals, "<=", opts.columnFilter.panelHeight, headerFields);
                break;
            case "lower":
                initColumnFilerFieldSlider(t, opts, container, field, step, precision, rows, distinctVals, ">=", opts.columnFilter.panelHeight, headerFields);
                break;
            case "none": break;
        }
    };

    function initColumnFilterFieldCheckBox(t, opts, exts, container, field, rows, distinctVals) {
        $.each(distinctVals, function (index, text) {
            var item = $("<div></div>").addClass("datagrid-header-filter-item").attr("text", text).appendTo(container),
                itemText = $("<div></div>").addClass("datagrid-header-filter-item-text").text(text).appendTo(item),
                icon = $("<div></div>").addClass("datagrid-header-filter-item-icon").appendTo(item),
                handler = function () {
                    var filterRows = $.array.filter(rows, function (value) { return value[field] == text; }),
                        filterData = t.treegrid("getHiddenRows"),
                        hiddenRows = $.array.filter(filterData, function (value) { return value[field] == text; });
                    t.treegrid(hiddenRows.length ? "showRows" : "hideRows", $.array.map(filterRows, function (val) { return val[opts.idField]; }));
                };
            item.click(handler);
        });
    };

    function initColumnFilterFieldLiveBox(t, opts, container, field, rows) {
        $("<div></div>").addClass("datagrid-header-filter-livebox-text").text("模糊过滤：").appendTo(container);
        var input = $("<input />").addClass("datagrid-header-filter-livebox").appendTo(container);
        var btn = $("<a />").linkbutton({ plain: true, iconCls: "icon-search" }).appendTo(container).click(function () {
            t.treegrid("showRows", true);
            var val = input.val();
            if ($.string.isNullOrEmpty(val)) { input.focus(); return; }
            var filterRows = $.array.filter(rows, function (value) { return String(value[field]).indexOf(val) == -1; });
            t.treegrid("hideRows", $.array.map(filterRows, function (val) { return val[opts.idField]; }));
            input.focus();
        });
        $("<a />").linkbutton({ plain: true, iconCls: "icon-undo" }).appendTo(container).click(function () {
            var val = input.val();
            if (val) { input.val("").focus(); btn.click(); } else { input.focus(); }
        });
        input.keypress(function (e) { if (e.which == 13) { btn.click(); } });
    };

    function initColumnFilerFieldSlider(t, opts, container, field, step, precision, rows, distinctVals, type, panelHeight, headerFileds) {
        var array = $.array.map(distinctVals, function (val) { val = parseFloat(val); return $.isNumeric(val) ? val : 0; }),
            min = array.length ? $.array.min(array) : 0, max = array.length ? $.array.max(array) : 0,
            maxPrecisionVal = array.length ? $.array.max(array, function (a, b) {
                return $.util.compare($.number.precision(a), $.number.precision(b));
            }) : 0,
            maxPrecision = array.length ? $.number.precision(maxPrecisionVal) : 0,
            height = panelHeight - 45,
            itemWrap = $("<div></div>").addClass("datagrid-header-filter-itemwrap").text(type).appendTo(container),
            sliderWrap = $("<div></div>").addClass("datagrid-header-filter-sliderwrap").css({
                height: height + 10
            })[type == "<=" ? "appendTo" : "prependTo"](container),
            input = $("<input />").addClass("datagrid-header-filter-numeric").appendTo(itemWrap),
            slider = $("<input />").addClass("datagrid-header-filter-slider").appendTo(sliderWrap),
            handler = function (newValue, oldValue) {
                changeSliderValue(t, opts, field, rows, newValue, type, input, slider, headerFileds);
            };
        input.numberbox({ value: type == "<=" ? max : min, min: min, max: max, precision: precision, onChange: handler, height: 18 });
        input.keypress(function (e) { if (e.which == 13) { var val = input.val(); input.numberbox("setValue", $.isNumeric(val) ? val : 0); } });
        slider.slider({
            height: height, mode: "v", showTip: true, value: type == "<=" ? max : min,
            min: min, max: max, rule: [min, "|", max], step: step, onComplete: handler,
            tipFormatter: function (val) { return $.number.round(val || 0, maxPrecision); }
        });
    };

    function changeSliderValue(t, opts, field, rows, value, type, input, slider, headerFileds) {
        var headerFields = headerFileds || t.treegrid("getPanel").find("div.datagrid-view div.datagrid-header table.datagrid-htable tr.datagrid-header-row td[field]").filter(function () {
            var td = $(this), colspan = td.attr("colspan");
            return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
        });
        var headerField = headerFields.filter(function () { return $(this).attr("field") == field; });
        input = input ? input : headerField.find(".datagrid-header-filter-numeric");
        slider = slider ? slider : headerField.find(".datagrid-header-filter-slider");
        var filterRows = $.array.filter(rows, function (val) {
            val = parseFloat(val[field]);
            val = $.isNumeric(val) ? val : 0;
            return type == ">=" ? (val < value) : (val > value);
        });
        t.treegrid("showRows", true).treegrid("hideRows", $.array.map(filterRows, function (val) { return val[opts.idField]; }));
        input.numberbox("setValue", value);
        slider.slider("setValue", value);
    };



    function refreshColumnFilterStatus(t, opts, exts, rows, headerFields) {
        refreshColumnFilterPagerStatus(t, opts);
        if (!opts.columnFilter) { return; }
        headerFields = headerFields || t.treegrid("getPanel").find("div.datagrid-view div.datagrid-header table.datagrid-htable tr.datagrid-header-row td[field]").filter(function () {
            var td = $(this), colspan = td.attr("colspan");
            return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
        });
        headerFields.each(function () {
            var td = $(this), field = td.attr("field");
            refreshColumnFilterCellStatus(t, exts, rows, td, field);
        });
    };

    function refreshColumnFilterPagerStatus(t, opts) {
        if (!opts.pagination) { return; }
        var pager = t.treegrid("getPager");
        if (pager && pager.length) {
            var len = t.treegrid("getVisibleRows").length, total = t.datagrid("getRows").length,
                isShow = len < total ? true : false, visible = pager.find("div.pagination-visiblerows");
            if (opts.showFilterText == false || ((opts.showFilterText == null || opts.showFilterText == undefined) && !isShow)) {
                return visible.remove();
            }
            if (visible.length) {
                visible.html("当前页显示" + len + "/" + total + "行");
            } else {
                pager.find("div.pagination-info").before("<div class=\"pagination-visiblerows\">当前页显示" + len + "/" + total + "行</div>");
            }
        }
    }

    function refreshColumnFilterCellStatus(t, exts, rows, td, field) {
        var colOpts = t.treegrid("getColumnOption", field), precision = colOpts.precision,
            filter = $.array.contains(["checkbox", "livebox", "caps", "lower", "none"], colOpts.filter) ? colOpts.filter : "checkbox";
        switch (filter) {
            case "checkbox": refreshColumnFilterCheckbox(t, exts, rows, td, field); break;
            case "livebox": refreshColumnFilterLiveBox(t, exts, rows, td, field); break;
            case "caps": refreshColumnFilterCaps(t, exts, rows, td, field); break;
            case "lower": refreshColumnFilterLower(t, exts, rows, td, field); break;
            case "none": break;
        };
    };

    function refreshColumnFilterCheckbox(t, exts, rows, td, field) {
        td.find("div.datagrid-header-filter-item").each(function () {
            var item = $(this), text = item.attr("text"), icon = item.find("div.datagrid-header-filter-item-icon");
            var length = $.array.sum(rows, function (val) { return val[field] == text ? 1 : 0; }),
                filterData = t.treegrid("getHiddenRows"),
                hiddenLength = $.array.sum(filterData, function (val) { return val[field] == text ? 1 : 0; }),
                iconCls = hiddenLength == 0 ? "tree-checkbox1" : (hiddenLength >= length ? "tree-checkbox0" : "tree-checkbox2");
            $.easyui.tooltip.init(item, { content: ($.string.isNullOrEmpty(text) ? "空白" : text) + ": 共" + length + "个元素" });
            setItemIconCls(icon, iconCls);
        });
    };

    function setItemIconCls(icon, iconCls) { icon.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2").addClass(iconCls); };

    //  当过滤器组件进行值筛选操作后，livebox 以及 slider 不更新，所以下面这三个方法未实现。
    function refreshColumnFilterLiveBox(t, exts, rows, td, field) { };
    function refreshColumnFilterCaps(t, exts, rows, td, field) { };
    function refreshColumnFilterLower(t, exts, rows, td, field) { };
    /************************  initExtend ColumnFilter   End  ************************/


    /************************  initContextMenu Begin  ************************/
    function initHeaderContextMenu(t, opts, exts) {
        var dgOpts = t.datagrid("options");
        exts.onHeaderContextMenuBak = opts.onHeaderContextMenu;
        opts.onHeaderContextMenu = dgOpts.onHeaderContextMenu = function (e, field) {
            if ($.isFunction(exts.onHeaderContextMenuBak)) { exts.onHeaderContextMenuBak.apply(this, arguments); }
            if (!opts.enableHeaderContextMenu) { return; }
            var eventData = $.fn.datagrid.extensions.parseContextMenuEventData(t, opts, e),
                items = parseHeaderContextMenuItems(t, opts, exts, e, field, eventData);
            $.easyui.showMenu({ items: items, left: e.pageX, top: e.pageY, hideDisabledMenu: opts.hideDisabledMenu });
            e.preventDefault();
        };
    };

    function initRowContextMenu(t, opts, exts) {
        exts.onContextMenuBak = opts.onContextMenu;
        opts.onContextMenu = function (e, row) {
            if ($.isFunction(exts.onContextMenuBak)) { exts.onContextMenuBak.apply(this, arguments); }
            if (opts.selectOnRowContextMenu) { t.treegrid("select", row[opts.idField]); }
            if (!opts.enableRowContextMenu) { return; }
            var eventData = $.fn.datagrid.extensions.parseContextMenuEventData(t, opts, e),
                items = parseRowContextMenuItems(t, opts, exts, e, row, eventData);
            if (opts.autoBindDblClickRow && opts.dblClickRowMenuIndex >= 0 && $.util.likeArray(opts.rowContextMenu) && !$.util.isString(opts.rowContextMenu)
                && opts.rowContextMenu.length > opts.dblClickRowMenuIndex) {
                items[opts.dblClickRowMenuIndex].bold = true;
            }
            $.easyui.showMenu({ items: items, left: e.pageX, top: e.pageY, hideDisabledMenu: opts.hideDisabledMenu });
            e.preventDefault();
        };
    };

    function initHeaderClickMenu(t, opts, exts) {
        if (!opts.enableHeaderClickMenu) { return; }
        t.treegrid("getPanel").find(".datagrid-view .datagrid-header table.datagrid-htable tr.datagrid-header-row td[field]").filter(function () {
            var td = $(this), colspan = td.attr("colspan");
            return (!colspan || colspan == "1") && !td.find("div.datagrid-header-check,div.datagrid-header-rownumber").length ? true : false;
        }).find("div.datagrid-cell").each(function () { initHeaderCellClickMenu(t, opts, exts, this); });
    };

    function initHeaderCellClickMenu(t, opts, exts, cell) {
        var arrow = $("<span class='s-btn-downarrow datagrid-header-cell-arrow'>&nbsp;</span>").click(function (e) {
            var span = $(this), offset = span.offset(), height = span.outerHeight(),
                field = span.parent().parent().attr("field"),
                eventData = $.fn.datagrid.extensions.parseContextMenuEventData(t, opts, e),
                items = parseHeaderContextMenuItems(t, opts, exts, e, field, eventData);
            var mm = $.easyui.showMenu({ items: items, left: offset.left, top: offset.top + height }),
                mmOpts = mm.menu("options"), onHide = mmOpts.onHide;
            arrow.hidable = false;
            mmOpts.onHide = function () {
                arrow.hidable = true;
                arrow.removeClass("datagrid-header-cell-arrow-show");
                onHide.apply(this, arguments);
            };
            return false;
        }).prependTo(cell);
        $(cell).off(".hoverArrow").on({
            "mouseenter.hoverArrow": function () {
                arrow.addClass("datagrid-header-cell-arrow-show");
            },
            "mouseleave.hoverArrow": function () {
                if (!$.util.isBoolean(arrow.hidable) || arrow.hidable) {
                    arrow.removeClass("datagrid-header-cell-arrow-show");
                }
            }
        });
    };


    function parseHeaderContextMenuItems(t, opts, exts, e, field, eventData) {
        var items = [], contextMenu = $.util.likeArray(opts.headerContextMenu) && !$.util.isString(opts.headerContextMenu) ? opts.headerContextMenu : [];
        if (contextMenu.length) { $.array.merge(items, contextMenu); }
        var baseItems = parseHeaderBaseContextMenuItems(t, opts, exts, e, field, eventData);
        if (baseItems.length) { $.array.merge(items, "-", baseItems); }
        items = $.fn.datagrid.extensions.parseHeaderContextMenuMap(e, field, eventData, items, t);
        if (items[0] == "-") { $.array.removeAt(items, 0); }
        return items;
    };

    function parseRowContextMenuItems(t, opts, exts, e, row, eventData) {
        var items = [], contextMenu = $.util.likeArray(opts.rowContextMenu) && !$.util.isString(opts.rowContextMenu) ? opts.rowContextMenu : [];
        if (contextMenu.length) { $.array.merge(items, contextMenu); }
        var baseItems = parseRowBaseContextMenuItems(t, opts, exts, e, row, eventData);
        if (baseItems.length) { $.array.merge(items, "-", baseItems); }
        items = $.fn.treegrid.extensions.parseRowContextMenuMap(e, row, eventData, items, t);
        if (items[0] == "-") { $.array.removeAt(items, 0); }
        return items;
    };


    function parseHeaderBaseContextMenuItems(t, opts, exts, e, field, eventData) {
        var mm = [], exp = opts.exportMenu,
            colOpts = t.treegrid("getColumnOption", field), sortable = colOpts.sortable;
        if (typeof exp == "object") { exp = $.extend({ current: false, all: false, submenu: true }, exp); }
        var m1 = {
            text: "升序", iconCls: "icon-standard-hmenu-asc", disabled: sortable != true,
            handler: function () { return t.treegrid("sort", { sortName: field, sortOrder: "asc" }); }
        };
        var m2 = {
            text: "降序", iconCls: "icon-standard-hmenu-desc", disabled: sortable != true,
            handler: function () { return t.treegrid("sort", { sortName: field, sortOrder: "desc" }); }
        };
        var m3 = {
            text: "显示/隐藏列", iconCls: "icon-standard-application-view-columns", disabled: false, children: [
                {
                    text: "显示全部列", iconCls: function () {
                        var len = exts.fields ? exts.fields.length : 0;
                        var count = $.array.sum(exts.fieldOptions, function (val) { return val.hidden ? 0 : 1; });
                        return count >= len ? "tree-checkbox1" : (count == 0 ? "tree-checkbox0" : "tree-checkbox2");
                    }, hideOnClick: false, handler: function (e, field, eventData, t, item, menu) {
                        $.each(exts.fields, function () { t.treegrid("showColumn", this); });
                        $(this).parent().children("div.menu-item:not(:eq(1))").each(function () {
                            menu.menu("setIcon", { target: this, iconCls: "tree-checkbox1" });
                            menu.menu("enableItem", this);
                        });
                    }
                },
                {
                    text: "还原默认", iconCls: "icon-standard-application-view-tile", hideOnClick: false, handler: function (e, field, eventData, t, item, menu) {
                        $.each(exts.fieldOptionsBackup, function () { t.treegrid(this.hidden == true ? "hideColumn" : "showColumn", this.field); });
                        var mm = $(this).parent();
                        mm.children("div.menu-item:gt(1)").each(function () {
                            var title = $(this).text(), colOpts = $.array.first(exts.fieldOptions, function (val) { return val.title == title; });
                            if (colOpts) { menu.menu("setIcon", { target: this, iconCls: colOpts.hidden ? "tree-checkbox0" : "tree-checkbox1" }); }
                            menu.menu("enableItem", this);
                        });
                        mm.children("div.menu-item:first").each(function () {
                            var len = exts.fields ? exts.fields.length : 0;
                            var count = $.array.sum(exts.fieldOptions, function (val) { return val.hidden ? 0 : 1; });
                            menu.menu("setIcon", { target: this, iconCls: count >= len ? "tree-checkbox1" : (count == 0 ? "tree-checkbox0" : "tree-checkbox2") });
                        });
                    }
                },
                "-"
            ]
        };
        var m4 = { text: "过滤/显示", iconCls: "icon-standard-application-view-list", disabled: !colOpts.filterable, children: [] };
        var m5 = { text: "导出当前页", iconCls: "icon-standard-page-white-put", disabled: !(exp == true || exp.current == true), handler: function () { return t.treegrid("exportExcel", false); } };
        var m6 = { text: "导出全部", iconCls: "icon-standard-page-white-stack", disabled: !(exp == true || exp.all == true), handler: function () { return t.treegrid("exportExcel", true); } };
        $.util.merge(m3.children, parseHeaderColumnsShowHideMenu(t, opts, exts, e, field, eventData));
        if (colOpts.filterable) { $.util.merge(m4.children, parseHeaderRowsShowHideMenu(t, opts, exts, e, field, eventData)); }
        $.util.merge(mm, [m1, m2, "-", m3, m4]);
        var expMenu = [m5, m6];
        if (exp) { $.array.merge(mm, "-", typeof exp == "object" && !exp.submenu ? expMenu : { text: "导出数据", iconCls: "icon-standard-page-save", children: expMenu }); }
        return mm;
    };

    function parseHeaderColumnsShowHideMenu(t, opts, exts, e, field, eventData) {
        return $.array.map(exts.fieldOptions, function (val) {
            var handler = function (e, field, eventData, t, item, menu) {
                if (val.field == opts.treeField) { $.messager.show("树节点列不能被隐藏。"); return; }
                var m = $(this),
                    count = m.parent().find(".menu-item:gt(1) .tree-checkbox1").length;
                if ((count == 1 && !val.hidden) || !val.hidable) { return; }
                t.treegrid(val.hidden ? "showColumn" : "hideColumn", val.field);
                menu.menu("setIcon", { target: this, iconCls: val.hidden ? "tree-checkbox0" : "tree-checkbox1" });
                count = $.array.sum(exts.fieldOptions, function (val) { return val.hidden ? 0 : 1; });
                var len = exts.fields ? exts.fields.length : 0;
                menu.menu("setIcon", {
                    target: m.parent().children("div.menu-item:first"),
                    iconCls: count >= len ? "tree-checkbox1" : (count == 0 ? "tree-checkbox0" : "tree-checkbox2")
                });
                var mm = m.parent().find(".menu-item:gt(1)").filter(function () { return $(".tree-checkbox1", this).length ? true : false; });
                mm.each(function () { menu.menu(mm.length > 1 ? "enableItem" : "disableItem", this); });
            };
            return {
                text: val.title || val.field, iconCls: val.hidden ? "tree-checkbox0" : "tree-checkbox1", hideOnClick: false,
                disabled: !val.hidable || val.field == opts.treeField ? true : false, handler: handler
            };
        });
    };

    function parseHeaderRowsShowHideMenu(t, opts, exts, e, field, eventData) {
        var rows = t.treegrid("getRows"), distinctVals = t.treegrid("getDistinctColumnData", field),
            mm = [
                {
                    text: "全部", hideOnClick: false,
                    iconCls: (!exts.filterData || !exts.filterData.length) ? "tree-checkbox1" : (exts.filterData.length >= rows.length ? "tree-checkbox0" : "tree-checkbox2"),
                    handler: function (e, field, eventData, t, item, menu) {
                        if (exts.filterData && exts.filterData.length) {
                            t.treegrid("showRows", true);
                        } else {
                            t.treegrid("hideRows", true);
                        }
                        $(this).parent().children("div.menu-item[hideOnClick=false]").each(function () {
                            menu.menu("setIcon", { target: this, iconCls: exts.filterData && exts.filterData.length ? "tree-checkbox0" : "tree-checkbox1" });
                        });
                    }
                }, "-"
            ];
        var hasMore = distinctVals.length >= 15,
            data = hasMore ? $.array.left(distinctVals, 10) : distinctVals,
            items = $.array.map(data, function (val) {
                var filterRows = $.array.filter(rows, function (value) { return value[field] == val; }),
                    filterLength = filterRows.length,
                    filterData = t.treegrid("getHiddenRows"),
                    hiddenLength = $.array.sum(filterData, function (value) { return value[field] == val ? 1 : 0; }),
                    iconCls = !hiddenLength ? "tree-checkbox1" : (hiddenLength >= filterLength ? "tree-checkbox0" : "tree-checkbox2");
                var handler = function (e, field, eventData, t, item, menu) {
                    var filterData = t.treegrid("getHiddenRows"),
                        hiddenLength = $.array.sum(filterData, function (value) { return value[field] == val ? 1 : 0; });
                    t.treegrid(hiddenLength ? "showRows" : "hideRows", $.array.map(filterRows, function (val) { return val[opts.idField]; }));
                    menu.menu("setIcon", { target: this, iconCls: hiddenLength ? "tree-checkbox1" : "tree-checkbox0" });
                    $(this).parent().children("div.menu-item:first").each(function () {
                        var filterData = t.treegrid("getHiddenRows");
                        menu.menu("setIcon", {
                            target: this,
                            iconCls: (!exts.filterData.length) ? "tree-checkbox1" : (filterData.length >= rows.length ? "tree-checkbox0" : "tree-checkbox2")
                        });
                    });
                };
                return { text: val, iconCls: iconCls, hideOnClick: false, handler: handler };
            });
        $.array.merge(mm, items);
        if (hasMore) {
            var colOpt = t.treegrid("getColumnOption", field), title = colOpt.title ? colOpt.title : colOpt.field, handler = function () {
                var checkAll = $("<input type=\"button\" value=\"全部选择\" />").click(function () {
                    t.treegrid("showRows", true);
                    $(this).parent().find(":checkbox").each(function () { this.checked = true; });
                });
                var uncheckAll = $("<input type=\"button\" value=\"全部不选\" />").click(function () {
                    t.treegrid("hideRows", true);
                    $(this).parent().find(":checkbox").each(function () { this.checked = false; });
                });
                $("<div></div>").append("<div>列：" + title + "，共" + distinctVals.length + "项</div><hr />").css({
                    padding: "10px"
                }).append(checkAll).append(uncheckAll).append("<hr />").each(function () {
                    var win = $(this), ul = $("<ul></ul>").css({ "list-style-type": "decimal", "padding-left": "40px", "line-height": "18px" }).appendTo(win);
                    $.each(distinctVals, function (index, text) {
                        var id = "itemCheckbox_" + $.util.guid("N"),
                            checked = !$.array.some(exts.filterData, function (val) { return val[field] == text; }),
                            itemWrap = $("<li></li>").appendTo(ul),
                            item = $("<input />").attr({ type: "checkbox", id: id, checked: checked }).appendTo(itemWrap),
                            itemText = $("<label></label>").attr("for", id).text(text).appendTo(itemWrap),
                            handler = function () {
                                var filterRows = $.array.filter(rows, function (val) { return val[field] == text; }),
                                    hiddenLength = $.array.sum(exts.filterData, function (val) { return val[field] == text ? 1 : 0; });
                                t.treegrid(hiddenLength ? "showRows" : "hideRows", $.array.map(filterRows, function (val) { return val[opts.idField]; }));
                            };
                        item.click(handler);
                    });
                }).dialog({
                    title: "过滤/显示", iconCls: "icon-standard-application-view-detail", height: 260, width: 220, left: e.pageX, top: e.pageY,
                    collapsible: false, minimizable: false, maximizable: false, closable: true, modal: true, resizable: true,
                    onClose: function () { $(this).dialog("destroy"); }
                }).dialog("open");
            };
            $.array.merge(mm, ["-", { text: "处理更多(共" + distinctVals.length + "项)...", iconCls: "icon-standard-application-view-detail", handler: handler }]);
        }
        return mm;
    };


    function parseRowBaseContextMenuItems(t, opts, exts, e, row, eventData) {
        var mm = [], paging = opts.pagingMenu, toggle = opts.toggleMenu, move = opts.moveMenu, exp = opts.exportMenu, id = row[opts.idField];
        if (typeof paging == "object") { paging = $.extend({ disabled: false, submenu: true }, paging); }
        if (typeof toggle == "object") {
            toggle = $.extend({ expand: true, expandAll: true, collapse: true, collapseAll: true, submenu: false }, toggle);
        }
        if (typeof move == "object") {
            move = $.extend({ up: false, upLevel: false, down: false, downLevel: false, submenu: false }, move);
        }
        if (typeof exp == "object") { exp = $.extend({ current: false, all: false, submenu: true }, exp); }
        var m1 = {
            text: "刷新当前页", iconCls: "pagination-load", disabled: !opts.refreshMenu,
            handler: function () { t.treegrid("reload"); }
        };
        var m2 = {
            text: "首页", iconCls: "pagination-first", disabled: function () { return !opts.pagination || eventData.page <= 1; },
            handler: function () { if (eventData.page > 1) { eventData.pager.pagination("select", 1); } }
        };
        var m3 = {
            text: "上一页", iconCls: "pagination-prev", disabled: function () { return !opts.pagination || eventData.page <= 1; },
            handler: function () { if (eventData.page > 1) { eventData.pager.pagination("select", eventData.page - 1); } }
        };
        var m4 = {
            text: "下一页", iconCls: "pagination-next", disabled: function () { return !opts.pagination || eventData.page >= eventData.pageCount; },
            handler: function () { if (eventData.page < eventData.pageCount) { eventData.pager.pagination("select", eventData.page + 1); } }
        };
        var m5 = {
            text: "末页", iconCls: "pagination-last", disabled: function () { return !opts.pagination || eventData.page >= eventData.pageCount; },
            handler: function () { if (eventData.page < eventData.pageCount) { eventData.pager.pagination("select", eventData.pageCount); } }
        };

        var m6 = { text: "展开当前所有", iconCls: "icon-metro-expand", disabled: !(toggle == true || toggle.expandAll == true), handler: function () { t.treegrid("expandAll", id); } };
        var m7 = { text: "展开当前", iconCls: "icon-metro-expand2", disabled: !(toggle == true || toggle.expand == true), handler: function () { t.treegrid("expand", id); } };
        var m8 = { text: "折叠当前", iconCls: "icon-metro-contract2", disabled: !(toggle == true || toggle.collapse == true), handler: function () { t.treegrid("collapse", id); } };
        var m9 = { text: "折叠当前所有", iconCls: "icon-metro-contract", disabled: !(toggle == true || toggle.collapseAll == true), handler: function () { t.treegrid("collapseAll", id); } };
        var m10 = { text: "上移一级", iconCls: "icon-standard-arrow-up", disabled: !(move == true || move.upLevel == true), handler: function () { t.treegrid("shiftRow", { point: "upLevel", id: id }); } };
        var m11 = { text: "上移", iconCls: "icon-standard-up", disabled: !(move == true || move.up == true), handler: function () { t.treegrid("shiftRow", { point: "up", id: id }); } };
        var m12 = { text: "下移", iconCls: "icon-standard-down", disabled: !(move == true || move.down == true), handler: function () { t.treegrid("shiftRow", { point: "down", id: id }); } };
        var m13 = { text: "下移一级", iconCls: "icon-standard-arrow-down", disabled: !(move == true || move.downLevel == true), handler: function () { t.treegrid("shiftRow", { point: "downLevel", id: id }); } };
        var m14 = { text: "导出当前页", iconCls: "icon-standard-page-white-put", disabled: !(exp == true || exp.current == true), handler: function () { return t.treegrid("exportExcel", false); } };
        var m15 = { text: "导出全部", iconCls: "icon-standard-page-white-stack", disabled: !(exp == true || exp.all == true), handler: function () { return t.treegrid("exportExcel", true); } };
        mm.push(m1);
        var pagingMenu = [m2, m3, m4, m5], toggleMenu = [m6, m7, m8, m9], moveMenu = [m10, m11, m12, m13], expMenu = [m14, m15];
        if (t.treegrid("isRoot", id)) {
            $.array.insertRange(toggleMenu, 0, [
                { text: "展开所有", iconCls: "icon-standard-arrow-out", handler: function () { t.treegrid("expandAll"); } },
                { text: "折叠所有", iconCls: "icon-standard-arrow-in", handler: function () { t.treegrid("collapseAll"); } }, "-"
            ]);
        }
        if (paging) { $.array.merge(mm, "-", typeof paging == "object" && !paging.submenu ? pagingMenu : { text: "翻页", iconCls: "", disabled: !(paging == true || !paging.disabled), children: pagingMenu }); }
        if (toggle) { $.array.merge(mm, "-", typeof toggle == "object" && !toggle.submenu ? toggleMenu : { text: "展开/折叠", iconCls: "", disabled: !toggle, children: toggleMenu }); }
        if (move) { $.array.merge(mm, "-", typeof move == "object" && !move.submenu ? moveMenu : { text: "上/下移动", iconCls: "", disabled: !move, children: moveMenu }); }
        if (exp) { $.array.merge(mm, "-", typeof exp == "object" && !exp.submenu ? expMenu : { text: "导出数据", iconCls: "icon-standard-page-save", disabled: !exp, children: expMenu }); }
        return mm;
    };


    var parseRowContextMenuMap = $.fn.treegrid.extensions.parseRowContextMenuMap = function (e, row, eventData, contextMenu, t) {
        return $.array.map(contextMenu, function (value, index) {
            if (!value || $.util.isString(value)) { return value; }
            var ret = $.extend({}, value);
            ret.id = $.isFunction(value.id) ? value.id.call(ret, e, row, eventData, t) : value.id;
            ret.text = $.isFunction(value.text) ? value.text.call(ret, e, row, eventData, t) : value.text;
            ret.iconCls = $.isFunction(value.iconCls) ? value.iconCls.call(ret, e, row, eventData, t) : value.iconCls;
            ret.disabled = $.isFunction(value.disabled) ? value.disabled.call(ret, e, row, eventData, t) : value.disabled;
            ret.hideOnClick = $.isFunction(value.hideOnClick) ? value.hideOnClick.call(ret, e, row, eventData, t) : value.hideOnClick;
            ret.onclick = $.isFunction(value.onclick) ? function (e, item, menu) { value.onclick.call(this, e, row, eventData, t, item, menu); } : value.onclick;
            ret.handler = $.isFunction(value.handler) ? function (e, item, menu) { value.handler.call(this, e, row, eventData, t, item, menu); } : value.handler;
            if (ret.children && ret.children.length) { ret.children = parseRowContextMenuMap(e, row, eventData, ret.children, t); }
            return ret;
        });
    };
    /************************  initContextMenu   End  ************************/


    /************************  initDblClickRow Begin  ************************/
    function initDblClickRowEvent(t, opts, exts) {
        exts.onDblClickRowBak = opts.onDblClickRow;
        opts.onDblClickRow = function (row) {
            if ($.isFunction(exts.onDblClickRowBak)) { exts.onDblClickRowBak.apply(this, arguments); }
            //  t.treegrid("select", row[opts.idField]);
            var eventData = $.fn.datagrid.extensions.parseContextMenuEventData(t, opts, null);
            items = parseRowContextMenuItems(t, opts, exts, null, row, eventData);
            if (opts.autoBindDblClickRow && opts.dblClickRowMenuIndex >= 0 && $.util.likeArray(opts.rowContextMenu)
                && !$.util.isString(opts.rowContextMenu) && opts.rowContextMenu.length > opts.dblClickRowMenuIndex) {
                var item = items[opts.dblClickRowMenuIndex], handler = item.handler || item.onclick;
                if (!item.disabled) {
                    return handler(null, row, eventData, t, item, null);
                }
            }
            //if (opts.autoEditing) { t.treegrid("beginEdit", row[opts.idField]); }
        };
    };
    /************************  initDblClickRow   End  ************************/

    function initAutoEditingEvent(t, opts, exts) {
        exts[opts.autoEditingEvent] = opts[opts.autoEditingEvent];
        opts[opts.autoEditingEvent] = function (row) {
            if ($.isFunction(exts[opts.autoEditingEvent])) { exts[opts.autoEditingEvent].apply(this, arguments); }
            if (opts.autoEditing) { t.treegrid("beginEdit", row[opts.idField]); }
        }
    }

    function initFinishEditEvent(t, opts, exts) {
        $(opts.finishEditLocale).click(function (e) {
            if (opts.finishEditOnBlur && $.data(t[0], "treegrid")) {
                var body = t.treegrid("getPanel"), rows = t.treegrid("getEditingNodeIds");
                if (!$.contains(body[0], e.target)) {
                    $.each(rows, function (ii, id) { t.treegrid(opts.finishEditMethod, id); });
                }
            }
        });
    };


    var initTreeGridExtensions = $.fn.treegrid.extensions.initTreeGridExtensions = function (t, opts, exts) {
        opts = opts || t.treegrid("options");
        exts = exts || (opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {}));

        exts.onClickRowBak = opts.onClickRow;
        opts.onClickRow = function (row) {
            if ($.isFunction(exts.onClickRowBak)) { exts.onClickRowBak.apply(this, arguments); }
            if (opts.toggleOnClick) { t.treegrid("toggle", row[opts.idField]); }
        };

        exts.onCheckBak = opts.onCheck;
        opts.onCheck = function (row) {
            if ($.isFunction(exts.onCheckBak)) { exts.onCheckBak.apply(this, arguments); }
            if (opts.cascadeCheck) {
                if (opts.checkOnSelect && opts.singleSelect) { return; }
                var idField = opts.idField, id = row[idField], children, checked, parent = t.treegrid("getParent", id);
                while (parent) {
                    children = t.treegrid("getChildren", parent[idField]);
                    checked = t.treegrid("getChecked");
                    if (!$.array.some(children, function (val) { return !$.array.contains(checked, val); })) {
                        if (!t.treegrid("isChecked", parent[idField])) { t.treegrid("check", parent[idField]); }
                    }
                    parent = t.treegrid("getParent", parent[idField]);
                }
                $.each(t.treegrid("getChildren", id), function (i, n) {
                    if (!t.treegrid("isChecked", n[idField])) { t.treegrid("check", n[idField]); }
                });
            }
        };

        exts.onUncheckBak = opts.onUncheck;
        opts.onUncheck = function (row) {
            if ($.isFunction(exts.onUncheckBak)) { exts.onUncheckBak.apply(this, arguments); }
            if (opts.cascadeCheck) {
                if (opts.checkOnSelect && opts.singleSelect) { return; }
                var idField = opts.idField, id = row[idField], children, checked, parent = t.treegrid("getParent", id);
                while (parent) {
                    children = t.treegrid("getChildren", parent[idField]);
                    checked = t.treegrid("getChecked");
                    if (!$.array.some(children, function (val) { return $.array.contains(checked, val); })) {
                        if (t.treegrid("isChecked", parent[idField])) { t.treegrid("uncheck", parent[idField]); }
                    }
                    parent = t.treegrid("getParent", parent[idField]);
                }
                $.each(t.treegrid("getChildren", id), function (i, n) {
                    t.treegrid("uncheck", n[idField]);
                });
            }
        };
    };


    /************************  initExtend initColumnTooltip Begin  ************************/
    var initColumnTooltip = function (t, opts) {
        t.treegrid("getPanel").find("div.datagrid-view div.datagrid-body table tr.datagrid-row").each(function () {
            var tr = $(this), id = tr.attr("node-id"), row = t.treegrid("find", id);
            initColumnRowTooltip(t, opts, id, row, tr);
        });
    };

    var initColumnRowTooltip = function (t, opts, id, row, tr) {
        tr = tr || t.treegrid("getRowDom", id);
        if (opts.rowTooltip) {
            var onShow = function (e) {
                var tt = $(this), text = $.isFunction(opts.rowTooltip) ? opts.rowTooltip.call(tt, row) : buildText(row);
                tt.tooltip("update", text);
            };
            tr.each(function () { $.easyui.tooltip.init(this, { onShow: onShow }); });
        } else {
            tr.children("td[field]").each(function () {
                var td = $(this), field = td.attr("field"), colOpts = t.treegrid("getColumnOption", field);
                if (!colOpts || !colOpts.tooltip) { return; }
                var cell = td.find("div.datagrid-cell"), onShow = function (e) {
                    var tt = $(this), text = $.isFunction(colOpts.tooltip) ? colOpts.tooltip.call(cell, row[field], id, row) : row[field];
                    tt.tooltip("update", text);
                };
                $.easyui.tooltip.init(cell, { onShow: onShow });
            });
        }
        function buildText(row) {
            var cols = t.treegrid("getColumns", "all"), content = $("<table></table>").css({ padding: "5px" });;
            $.each(cols, function (i, colOpts) {
                if (!colOpts || !colOpts.field || !colOpts.title) { return; }
                var msg = t.treegrid("getCellDisplay", { field: colOpts.field, id: id });
                content.append("<tr><td style='text-align: right; width: 150px;'>" + colOpts.title + ":</td><td style='width: 250px;'>" + msg + "</td></tr>");
            });
            return content;
        };
    };
    /************************  initExtend initColumnTooltip   End  ************************/


    /************************  initExtend initColumnTooltip   End  ************************/
    var initializeRowExtEditor = function (t, opts, id) {
        if (!opts.extEditing) { return; }
        var tr = t.treegrid("getRowDom", id);
        if (!tr.length) { return; }
        var view = t.treegrid("getPanel").find("div.datagrid-view"),
            view1 = view.find("div.datagrid-view1"),
            view2 = view.find("div.datagrid-view2"),
            body = view2.find("div.datagrid-body"),
            width = view1.outerWidth(), pos = view.position(),
            left = diff > 0 ? diff : 0;
        body.css("position", "relative");
        var height = tr.outerHeight(),
            top = tr.position().top + height + body.scrollTop() - view2.find("div.datagrid-header").outerHeight();
        var p = $("<div></div>").addClass("dialog-button datagrid-rowediting-panel").appendTo(body).css({
            "position": "absolute",
            "display": "block",
            "border": "1px solid #ddd",
            "top": top,
            "padding": '5px 5px'
        }).attr("node-id", id);
        $("<a></a>").linkbutton({ plain: false, iconCls: "icon-ok", text: "保存" }).appendTo(p).click(function () {
            t.treegrid("endEdit", id);
            disposeRowExtEditor(t, opts, id);
        });
        $("<a></a>").linkbutton({ plain: false, iconCls: "icon-cancel", text: "取消" }).appendTo(p).click(function () {
            t.treegrid("cancelEdit", id);
            disposeRowExtEditor(t, opts, id);
        });
        var diff = (opts.width - p.outerWidth()) / 2 - width, left = diff > 0 ? diff : 0;
        p.css("left", left);
    };

    var removeRowExtEditor = function (t, body, id) {
        body = body || t.treegrid("getPanel").find("div.datagrid-view div.datagrid-view2 div.datagrid-body");
        body.find("div.datagrid-rowediting-panel[node-id=" + id + "]").remove();
    };

    var disposeRowExtEditor = function (t, opts, id) {
        if (!opts.extEditing) { return; }
        body = t.treegrid("getPanel").find("div.datagrid-view div.datagrid-view2 div.datagrid-body");
        removeRowExtEditor(t, body, id);
    };

    var initSingleEditing = function (t, opts, id) {
        var exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        if (opts.singleEditing) { t.treegrid("endEdit", exts.lastEditingId); }
        exts.lastEditingId = id;
    };
    /************************  initExtend ExtEditor Begin  ************************/



    /******************** initExtensions Begin ********************/
    var initExtensions = $.fn.treegrid.extensions.initExtensions = function (t, opts) {
        var exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        if (exts._initialized) { return; }

        var fields = t.treegrid("getColumnFields", false);
        exts.fields = $.array.filter(fields, function (val) { return t.treegrid("getColumnOption", val).title ? true : false; });
        exts.fieldOptions = $.array.map(exts.fields, function (val) { return t.treegrid("getColumnOption", val); });
        exts.fieldOptionsBackup = $.array.map(exts.fieldOptions, function (val) { return $.extend({}, val); });
        exts.filterData = [];

        initColumnExtensions();
        initOffset();
        initContextMenu();
        initDblClickRow();
        initAutoEditing();
        initFinishEdit();
        initTreeExtensions();
        function initColumnExtensions() { $.fn.datagrid.extensions.initColumnExtendProperties(t, exts); };
        function initOffset() { t.treegrid("setOffset", opts.offset); };
        function initContextMenu() { initHeaderContextMenu(t, opts, exts); initRowContextMenu(t, opts, exts); initHeaderClickMenu(t, opts, exts); };
        function initDblClickRow() { initDblClickRowEvent(t, opts, exts); };
        function initAutoEditing() { initAutoEditingEvent(t, opts, exts); };
        function initFinishEdit() { initFinishEditEvent(t, opts, exts); };
        function initTreeExtensions() { initTreeGridExtensions(t, opts, exts); };

        var rows = t.datagrid("getRows");
        if (!rows || !rows.length) { initHeaderColumnFilterContainer(t, opts, exts); }

        exts._initialized = true;
    };

    var loader = $.fn.treegrid.extensions.loader = function (param, success, error) {
        var t = $(this), opts = t.treegrid("options");
        initExtensions(t, opts);
        if (!opts.url) { return false; }
        param = $.fn.datagrid.extensions.parsePagingQueryParams(opts, param);
        $.ajax({
            type: opts.method, url: opts.url, data: param, dataType: "json",
            success: function (data) { success(data); },
            error: function () { error.apply(this, arguments); }
        });
    };

    var _onLoadSuccess = $.fn.treegrid.defaults.onLoadSuccess;
    var onLoadSuccess = $.fn.treegrid.extensions.onLoadSuccess = function (data) {
        if ($.isFunction(_onLoadSuccess)) { _onLoadSuccess.apply(this, arguments); }
        var t = $(this), opts = t.treegrid("options"),
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        initHeaderColumnFilterContainer(t, opts, exts);
        initRowDndExtensions(t, opts);
        initColumnTooltip(t, opts);
    };

    var _onResizeColumn = $.fn.treegrid.defaults.onResizeColumn;
    var onResizeColumn = $.fn.treegrid.extensions.onResizeColumn = function (field, width) {
        if ($.isFunction(_onResizeColumn)) { _onResizeColumn.apply(this, arguments); }
        var t = $(this), opts = t.treegrid("options");
        if (opts.columnFilter) {
            var panel = t.treegrid("getPanel"), colOpts = t.treegrid("getColumnOption", field),
                container = panel.find("div.datagrid-header-filter-container[field=" + field + "]");
            container.width(colOpts.width);
        }
    };

    var _onBeforeEdit = $.fn.treegrid.defaults.onBeforeEdit;
    var onBeforeEdit = $.fn.treegrid.extensions.onBeforeEdit = function (row) {
        if ($.isFunction(_onBeforeEdit)) { _onBeforeEdit.apply(this, arguments); }
        var t = $(this), opts = t.datagrid("options");
        initializeRowExtEditor(t, opts, row[opts.idField]);
        initSingleEditing(t, opts, row[opts.idField]);
        t.treegrid("getPanel").find("div.datagrid-view div.datagrid-body table.datagrid-btable tr.datagrid-row").draggable("disable");
    }

    var _onAfterEdit = $.fn.treegrid.defaults.onAfterEdit;
    var onAfterEdit = $.fn.treegrid.extensions.onAfterEdit = function (row, changes) {
        if ($.isFunction(_onAfterEdit)) { _onAfterEdit.apply(this, arguments); }
        var t = $(this), opts = t.treegrid("options"),
            exts = opts._extensionsTreegrid ? opts._extensionsTreegrid : (opts._extensionsTreegrid = {});
        disposeRowExtEditor(t, opts, row[opts.idField]);
        initHeaderColumnFilterContainer(t, opts, exts);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, row[opts.idField], row);
    }

    var _onCancelEdit = $.fn.treegrid.defaults.onCancelEdit;
    var onCancelEdit = $.fn.treegrid.extensions.onCancelEdit = function (row) {
        if ($.isFunction(_onCancelEdit)) { _onCancelEdit.apply(this, arguments); }
        var t = $(this), opts = t.treegrid("options");
        disposeRowExtEditor(t, opts, row[opts.idField]);
        initRowDndExtensions(t, opts);
        initColumnRowTooltip(t, opts, row[opts.idField], row);
    };
    /******************** initExtensions   End ********************/



    var _loadFilter = $.fn.treegrid.defaults.loadFilter;
    var loadFilter = $.fn.treegrid.extensions.loadFilter = function (data, parent) {
        if ($.isFunction(_loadFilter)) { data = _loadFilter.apply(this, arguments); }
        var isArray = $.array.likeArray(data) && !$.util.isString(data), rows = isArray ? data : data.rows;
        if (!rows.length) { return data; }
        var t = $(this), opts = t.treegrid("options");
        rows = opts.dataPlain ? $.fn.tree.extensions.dataPlainConverter(rows, opts) : rows;
        if (parent != null && parent != undefined) { return isArray ? rows : { total: rows.length, rows: rows }; }
        return isArray ? rows : { total: data.length || rows.length, rows: rows };
    };

    var _onExpand = $.fn.treegrid.defaults.onExpand;
    var onExpand = $.fn.treegrid.extensions.onExpand = function (row) {
        if ($.isFunction(_onExpand)) { _onExpand.apply(this, arguments); }
        var t = $(this), opts = t.treegrid("options");
        if (opts.onlyNodeExpand) {
            var rows = t.treegrid("getNears", row[opts.idField]), animate = opts.animate
            opts.animate = false;
            $.each($.array.filter(rows, function (val) { return val[opts.idField] != row[opts.idField] && val.state == "open"; }), function () {
                t.treegrid("collapse", this[opts.idField]);
            });
            opts.animate = animate;
        }
    };


    var methods = $.fn.treegrid.extensions.methods = {

        //  覆盖 easyui-treegrid 的原生方法，以支持相应属性、事件和扩展功能；
        update: function (jq, param) { return jq.each(function () { updateRow(this, param); }); },

        //  覆盖 easyui-treegrid 的原生方法，以支持相应属性、事件和扩展功能；
        append: function (jq, param) { return jq.each(function () { appendRow(this, param); }); },

        //  覆盖 easyui-treegrid 的原生方法，以支持相应属性、事件和扩展功能；
        insert: function (jq, param) { return jq.each(function () { insertRow(this, param); }); },

        //  扩展 easyui-treegrid 的自定义方法；判断指定的 tree-node 是否被 check；该方法的参数 id 表示要判断的节点的 idField 值；
        //  返回值：如果参数 id 所表示的 tree-node 被 check，则返回 true，否则返回 false。
        isChecked: function (jq, id) { return isChecked(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；判断指定的 tree-node 是否被 select；该方法的参数 id 表示要判断的节点的 idField 值；
        //  返回值：如果参数 id 所表示的 tree-node 被 select，则返回 true，否则返回 false。
        isSelected: function (jq, id) { return isSelected(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；判断指定的 tree-node 是否开启行编辑状态；该方法的参数 id 表示要判断的节点的 idField 值；
        //  返回值：如果参数 id 所表示的 tree-node 正开启行编辑状态，则返回 true，否则返回 false。
        isEditing: function (jq, id) { return isEditing(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；获取当前表格中第一个开启了编辑状态的 tree-node 的节点 id 值(idField 属性所示值)；
        //  返回值：如果当前表格中存在开启了行编辑状态的行，则返回第一个编辑行 tree-node 的节点 id；否则返回 undefined。
        getEditingNodeId: function (jq) { return getEditingNodeId(jq[0]); },

        //  扩展 easyui-treegrid 的自定义方法；获取当前表格中所有开启了行编辑状态的 tree-node 的节点 id 值(idField 属性所示值)；
        //  返回值：返回一个数组，数组中包含当前表格中所有已经开启了行编辑状态的 tree-node 的节点 id；
        getEditingNodeIds: function (jq) { return getEditingNodeIds(jq[0]); },

        //  扩展 easyui-treegrid 的自定义方法；判断指定的 tree-node 是否为根节点；该方法定义如下参数：
        //      id: 用于判断的 tree-node 对象的 idField 值。
        //  返回值：如果指定的 jQuery 对象是该 easyui-treegrid 的根节点，则返回 true，否则返回 false。
        isRoot: function (jq, id) { return isRootNode(jq[0], id); },

        //  重写 easyui-treegrid 的方法 getLevel；修复该方法的部分 BUG；用于获取指定节点的级别；该方法的参数 target 表示要获取级别的节点的 idField 值；
        //  返回值：如果 id 表示的节点存在于此 easyui-treegrid，则返回表示其所在节点级别的数字(从 1 开始计数)，否则返回 0。
        getLevel: function (jq, id) { return getLevel(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；冻结指定的列；该方法的参数 field 表示要冻结的列的 field 值。
        //  返回值：返回表示当前 easyui-treegrid 的 jQuery 链式对象。
        //  注意：此方法在多行表头情况下无效。
        //      当前表格在执行此方法前必须存在至少一个冻结列，否则此方法无效；
        freezeColumn: function (jq, field) { return jq.each(function () { freezeColumn(this, field); }); },

        //  扩展 easyui-treegrid 的自定义方法；取消冻结指定的列；该方法的参数 field 表示要取消冻结的列的 field 值。
        //  返回值：返回表示当前 easyui-treegrid 的 jQuery 链式对象。
        //  注意：此方法在多行表头情况下无效。
        //      当前表格在执行此方法前必须存在至少一个非冻结列，否则此方法无效；
        unfreezeColumn: function (jq, field) { return jq.each(function () { unfreezeColumn(this, field); }); },

        //  扩展 easyui-treegrid 的自定义方法；移动指定的列到另一位置；该方法的参数 param 为一个 JSON-Object，定义包含如下属性：
        //      target: 表示目标位置列的 field 值；
        //      source: 表示要移动的列的 field 值；
        //      point:  表示移动到目标列的位置，String 类型，可选的值包括：
        //          before: 表示将 source 列移动至 target 列的左侧；
        //          after:  表示将 source 列移动值 target 列的右侧；
        //  返回值：返回表示当前 easyui-treegrid 的 jQuery 链式对象。
        //  注意：此方法在多行表头情况下无效。
        moveColumn: function (jq, param) { return jq.each(function () { moveColumn(this, param); }); },

        //  扩展 easyui-treegrid 的自定义方法；移动指定的列挪动一格位置；该方法的参数 param 为一个 JSON-Object，定义包含如下属性：
        //      field:  表示要挪动的列的 field 值；
        //      porint: 表示挪动 field 列的方式，String 类型，可选的值包括：
        //          before: 表示将该列向左挪动一格；
        //          after:  表示将该列向右挪动一格；
        //  返回值：返回表示当前 easyui-treegrid 的 jQuery 链式对象。
        //  注意：此方法在多行表头情况下无效。
        shiftColumn: function (jq, param) { return jq.each(function () { shiftColumn(this, param); }); },

        //  扩展 easyui-treegrid 的自定义方法；删除指定的列；该方法的参数 field 表示要删除的列的 field 值；
        //  返回值：返回表示当前 easyui-treegrid 的 jQuery 链式对象。
        deleteColumn: function (jq, field) { return jq.each(function () { deleteColumn(this, field); }); },

        //  扩展 easyui-treegrid 的自定义方法；删除指定的列并返回该列的 ColumnOption 值；该方法的参数 field 表示要删除的列的 field 值；
        //  返回值：返回参数 field 值所表示的列的 ColumnOption 值。如果当前 easyui-treegrid 不存在该列，则返回 null。
        popColumn: function (jq, field) { return popColumn(jq[0], param); },


        //  扩展 easyui-treegrid 的自定义方法；移动指定的节点到另一个位置；该方法定义如下参数：
        //      param:   这是一个 JSON-Object，该对象定义如下属性：
        //          target: 表示目标位置的 tree-node 对象的 idField 值；
        //          source: 表示要移动的 tree-node 对象的 idField 值；
        //          point:  表示移动到目标节点 target 的位置，String 类型，可选的值包括：
        //              "append":   表示追加为目标节点 target 的子节点，默认值；
        //              "top":      表示移动到目标节点 target 的上一格位置；
        //              "bottom":   表示追加为目标节点 target 的下一格位置；
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 对象。
        moveRow: function (jq, param) { return jq.each(function () { moveRow(this, param); }); },

        //  扩展 easyui-treegrid 的自定义方法；移动指定节点的位置；该方法的参数 param 为一个 JSON-Object 类型对象，包含如下属性：
        //      id: 表示要移动的 tree-node 对象的 idField 值；
        //      point:  表示移动 target 的方式，String 类型，可选的值报错：
        //      "up":       表示将 target 所表示的 tree-node 移动到上一格位置；
        //      "upLevel":  表示将 target 所表示的 tree-node 移动到上一级的末尾；
        //      "down":     表示将 target 所表示的 tree-node 移动到下一格位置；
        //      "downLevel":表示将 target 所表示的 tree-node 移动到下一级的末尾；
        //      如果不定义该值或者该值为空或该值不是上面四个之一，则不进行任何操作；
        //  返回值：返回表示当前 easyui-tree 组件的 jQuery 对象。
        shiftRow: function (jq, param) { return jq.each(function () { shiftRow(this, param); }); },

        //  扩展 easyui-treegrid 的自定义方法；判断两个 tree-node 之间的关系；该方法定义如下参数：
        //      param：  这是一个 JSON-Object，该对象定义如下属性：
        //          id1:    用于判断的第一个 tree-node 对象的 idField 值；
        //          id2:    用于判断的第二个 tree-node 对象的 idField 值；
        //  返回值：返回一个 String 类型的值：
        //      如果 id1 是 id2 的子节点，则返回 "child"；
        //      如果 id1 是 id2 的父节点，则返回 "parent"；
        //      如果 id1 和 id2 是具有同一个父级节点的平级节点，则返回 "sibling"；
        //      如果 id1 和 id2 既不是父子级关系，也不是具有同一个父级节点的平级节点关系，则返回 "normal"；
        compare: function (jq, param) { return compareNode(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；判断一个节点是否为另一个节点的子节点；该方法定义如下参数：
        //      param：  这是一个 JSON-Object，该对象定义如下属性：
        //          id1:    用于判断的第一个 tree-node 对象的 idField 值；
        //          id2:    用于判断的第二个 tree-node 对象的 idField 值；
        //  返回值：如果 tree-node id1 是 tree-node id2 的子节点，则返回 true，否则返回 false。
        isChild: function (jq, param) { return isChild(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；判断一个节点是否为另一个节点的父节点；该方法定义如下参数：
        //      param：  这是一个 JSON-Object，该对象定义如下属性：
        //          id1:    用于判断的第一个 tree-node 对象的 idField 值；
        //          id2:    用于判断的第二个 tree-node 对象的 idField 值；
        //  返回值：如果 tree-node id1 是 tree-node id2 的父节点，则返回 true，否则返回 false。
        isParent: function (jq, param) { return isParent(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；判断一个节点是否和另一个节点为具有同一个父节点的平级节点；该方法定义如下参数：
        //      param：  这是一个 JSON-Object，该对象定义如下属性：
        //          id1:    用于判断的第一个 tree-node 对象的 idField 值；
        //          id2:    用于判断的第二个 tree-node 对象的 idField 值；
        //  返回值：如果 tree-node id1 和 tree-node id2 是具有同一个父级节点的平级节点，则返回 true，否则返回 false。
        isSibling: function (jq, param) { return isSibling(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；获取指定节点的平级下一格位置的 tree-node 节点；该方法定义如下参数：
        //      id:  指定的表示 tree-node 对象的 idField 值；
        //  返回值：返回 tree-node id 的同级别下一格位置的 tree-node 节点 node 对象；
        //      如果该 tree-node id 为当前级别的最后一个节点即没有下一格节点；则返回 null。
        nextRow: function (jq, id) { return getNextRow(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；获取指定节点的平级上一格位置的 tree-node 节点；该方法定义如下参数：
        //      id:  指定的表示 tree-node 对象的 idField 值；
        //  返回值：返回 tree-node id 的同级别上一格位置的 tree-node 节点对象；该 tree-node 对象含有如下属性：
        //      如果该 tree-node id 为当前级别的第一个节点即没有上一格节点；则返回 null。
        prevRow: function (jq, id) { return getPrevRow(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；获取指定节点的同级所有节点(包含自身)；该方法定义如下参数：
        //      id:  指定的表示 tree-node 对象的 idField 值；
        //  返回值：返回 tree-node id 的同级别(具有和当前 tree-node id 同一个父级节点)所有节点构成的一个数组对象；
        //      如果传入的参数 id 是某个根节点的 id 或者未定义 id 参数，则该方法和 getRoots 方法返回的值相同；
        getNears: function (jq, id) { return getNears(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；获取指定节点的下一级所有节点；该方法定义如下参数：
        //      id:  指定的表示 tree-node 对象的 idField 值；
        //  返回值：返回 tree-node id 的下一级所有节点构成的一个数组对象；
        //      如果传入的参数 id 没有子节点，则返回一个包含 0 个元素的数组。
        //  备注：该方法和 getChildren 的不同之处在于，getChildren 方法返回的是 tree-node id 下的所有子节点内容；
        getNearChildren: function (jq, id) { return getNearChildren(jq[0], id); },


        //  扩展 easyui-treegrid 的自定义方法；启用当前表格的行拖动功能；该方法无参数；
        //  返回值：返回表示当前 easyui-treegrid 的 jQuery 链式对象。
        enableRowDnd: function (jq) { return jq.each(function () { enableRowDnd(this); }); },

        //  扩展 easyui-treegrid 的自定义方法；禁用当前表格的行拖动功能；该方法无参数；
        //  返回值：返回表示当前 easyui-treegrid 的 jQuery 链式对象。
        disableRowDnd: function (jq) { return jq.each(function () { disableRowDnd(this); }); },




        //  获取 easyui-treegrid 中当前页的行数据(包括根节点和子节点)所构成的一个集合；该方法的参数 cascade 定义为如下类型：
        //      Boolean 类型，默认为 false，表示是否连同子级节点数据一并返回；
        //  返回值：返回一个 Array 数组对象，数组中的每一个元素都表示一个 node；
        //      如果 cascade 为 true，则返回所有根节点以及子节点合并所构成的一个数组；
        //      如果 cascade 为 false，则仅返回所有根节点数据，同 getRoots 方法；
        //      如果 easyui-treegrid 的当前页没有数据，则返回一个长度为 0 的数组。
        getRows: function (jq, cascade) { return getRows(jq[0], cascade); },

        //  获取 easyui-treegrid 中当前页指定列所有行的单元格数据所构成的一个数组；该方法的参数 param 可以定义为如下两种类型：
        //      1、表示要获取的列的 field 值；
        //      2、JSON-Object 类型，包含如下属性：
        //          field: 要获取的数据的列的 field 名；
        //          cascade：Boolean 类型，默认为 false； 表示返回的结果集中是否还包括子节点数据；
        //  返回值：返回一个数组，数组中每一个元素都是其数据行的该列的值，数组的长度等于 grid.treegrid("getRows", cascade) 的长度；
        //          如果传入的列名不存在，则返回数组的长度同样等于 grid.treegrid("getRows") 的长度，只是每个元素的值都为 undefined.
        getColumnData: function (jq, param) { return getColumnData(jq[0], param); },

        //  获取 easyui-treegrid 中当前页指定行节点的 DOM-jQuery 对象元素集合；该方法的参数 param 可以定义为以下两种类型：
        //      1、表示要获取的行节点的 id 值；
        //      2、JSON-Object 对象，该对象需定义如下属性：
        //          id:     表示要获取的行节点的 id 值；
        //          cascade:Boolean 类型值，默认为 false，表示是否连同其子级节点的 DOM 行对象一并获取并返回。
        //  返回值：如果当前页存在 id 指示的行，则返回该行的 DOM-jQuery 对象集合，该集合中包含的 DOM 节点级别为一组 tr class="datagrid-row" 对象；
        //          否则返回一个空的 jQuery 对象。
        getRowDom: function (jq, param) { return getRowDom(jq[0], param); },

        //  获取当前 easyui-treegrid 中当前页指定 id 的节点数据对象；同 find 方法。
        getRowData: function (jq, id) { return getNode(jq[0], id); },

        //  获取当前 easyui-treegrid 中当前页指定 id 的节点数据对象；同 find 方法。
        getNode: function (jq, id) { return getNode(jq[0], id); },

        //  获取当前 easyui-treegrid 中当前页的多个节点所构成的一个数据集合；同 findRows 方法。
        getNodes: function (jq, param) { return findRows(jq[0], param); },

        //  获取 easyui-treegrid 中当前页指定单元格的 Dom-jQuery 对象元素；该方法的参数 pos 为一个 JSON-Object 对象，包含如下属性：
        //      field:  表示要获取的单元格位于哪个列；
        //      id:     表示要获取的单元格位于哪个行的节点 id；
        //  返回值：如果当前页存在指定列的指定行，则返回该列中指定行的 DOM-jQuery 对象，该对象中包含的 DOM 节点级别为一个 div class="datagrid-cell" 对象；
        //          否则返回一个空的 jQuery 对象。
        getCellDom: function (jq, pos) { return getCellDom(jq[0], pos); },

        //  获取 easyui-treegrid 中当前页指定单元格的数据；该方法的参数 pos 为一个 JSON-Object 对象，包含如下属性：
        //      field:  表示要获取的单元格位于哪个列；
        //      id:     表示要获取的单元格位于哪个行的节点 id；
        //  返回值：如果当前页存在指定列的指定行，则返回该列中指定行及指定列的单元格数据；否则返回 undefined。
        getCellData: function (jq, pos) { return getCellData(jq[0], pos); },

        //  获取 easyui-treegrid 中当前页指定单元格的显示数据(经过 formatter 格式化后的显示数据)；
        //  该方法的参数 pos 为一个 JSON-Object 对象，包含如下属性：
        //      field:  表示要获取的单元格位于哪个列；
        //      id:     表示要获取的单元格位于哪个行的节点 id；
        //  返回值：如果当前页存在指定列的指定行，则返回该列中指定行的单元格的显示数据(经过 formatter 格式化后的显示数据)；否则返回 undefined。
        getCellDisplay: function (jq, pos) { return getCellDisplay(jq[0], pos); },

        //  获取 easyui-treegrid 按指定列的去重复项后的行数据集合；该方法的参数 param 可以定义为如下两种类型：
        //      1、表示要获取的列的 field 值；
        //      2、JSON-Object 类型，包含如下属性：
        //          field: 要获取的数据的列的 field 名；
        //          cascade：Boolean 类型，默认为 false； 表示返回的结果集中是否还包括子节点数据；
        //  返回值：返回一个数组，数组中每一个元素都表示一个行数据；
        //      其结果相当于当前 easyui-treegrid 控件调用 getRows 返回后并经过对指定列去重复项后的结果；
        //      如果传入的列名不存在，则返回一个长度为 0 的数组对象.
        getDistinctRows: function (jq, param) { return getDistinctRows(jq[0], param); },

        //  获取 easyui-treegrid 指定列的值去重复项后的数据集合；该方法的参数 param 可以定义为如下两种类型：
        //      1、表示要获取的列的 field 值；
        //      2、JSON-Object 类型，包含如下属性：
        //          field: 要获取的数据的列的 field 名；
        //          cascade：Boolean 类型，默认为 false； 表示返回的结果集中是否还包括子节点数据；
        //  返回值：返回一个数组，数组中的每一个元素都表示某一行的相应 field 属性的值；
        //      其结果相当于当前 easyui-treegrid 控件调用 getColumnData 返回后并经过对指定列去重复项后的结果；
        //      如果传入的列名不存在，则返回一个长度为 0 的数组对象.
        getDistinctColumnData: function (jq, param) { return getDistinctColumnData(jq[0], param); },

        //  显示当前 easyui-treegrid 当前页数据中指定行的数据；该方法的参数 param 可以是以下两种类型：
        //      待查找的行数据的 idField(主键) 字段值；
        //      function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 function 类型，则 findRow 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示找到需要查找的结果，立即停止循环调用并显示该行数据；
        //          如果回调函数始终未返回 true，则该回调函数会一直遍历 rows 直到最后。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        showRow: function (jq, param) { return jq.each(function () { showRow(this, param); }); },

        //  隐藏当前 easyui-treegrid 当前页数据中指定行的数据；该方法的参数 param 可以是以下两种类型：
        //      待查找的行数据的 idField(主键) 字段值；
        //      function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 function 类型，则 findRow 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示找到需要查找的结果，立即停止循环调用并隐藏该行数据；
        //          如果回调函数始终未返回 true，则该回调函数会一直遍历 rows 直到最后。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        hideRow: function (jq, param) { return jq.each(function () { hideRow(this, param); }); },

        //  显示当前 easyui-treegrid 当前页数据中指定多行的数据；该方法的参数 param 可以是以下三种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 Function 类型，则 showRows 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则该行数据将会被显示；
        //      Array 类型，数组中的每一项都可以定义为如下类型：
        //          待查找的行数据的 idField(主键) 字段值；
        //          Function 类型；具体回调函数签名参考 showRow 方法中 param 参数为 function 类型时的定义；
        //          当 param 参数定义为 Array 类型时，则 showRows 方法会对数组中的每一项循环调用 showRow 方法；
        //      Boolean 类型且为 true：则 showRows 将会显示 easyui-treegrid 当前页的所有数据。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        showRows: function (jq, param) { return jq.each(function () { showRows(this, param); }); },

        //  隐藏当前 easyui-treegrid 当前页数据中指定多行的数据；该方法的参数 param 可以是以下三种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 Function 类型，则 hideRows 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则该行数据将会被隐藏；
        //      Array 类型，数组中的每一项都可以定义为如下类型：
        //          待查找的行数据的 idField(主键) 字段值；
        //          Function 类型；具体回调函数签名参考 hideRow 方法中 param 参数为 function 类型时的定义；
        //          当 param 参数定义为 Array 类型时，则 hideRows 方法会对数组中的每一项循环调用 hideRow 方法；
        //      Boolean 类型且为 true：则 hideRows 将会隐藏 easyui-treegrid 当前页的所有数据。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        hideRows: function (jq, param) { return jq.each(function () { hideRows(this, param); }); },

        //  获取当前 easyui-treegrid 当前页所有隐藏的行数据所构成的一个 Array 对象；该方法的参数 cascade 定义为如下类型：
        //      Boolean 类型，默认为 false，表示是否连同子级节点数据一并返回；
        //  返回值：返回一个 Array 数组对象，数组中的每一个元素都表示一个 node；
        //      如果 cascade 为 true，则返回所有根节点以及子节点合并所构成的一个数组；
        //      如果 cascade 为 false，则仅返回所有根节点数据，同 getRoots 方法；
        //      如果 easyui-treegrid 的当前页没有数据，则返回一个长度为 0 的数组。
        getHiddenRows: function (jq, cascade) { return getHiddenRows(jq[0], cascade); },

        //  获取当前 easyui-treegrid 当前页所有显示的行数据所构成的一个 Array 对象；该方法的参数 cascade 定义为如下类型：
        //      Boolean 类型，默认为 false，表示是否连同子级节点数据一并返回；
        //  返回值：返回一个 Array 数组对象，数组中的每一个元素都表示一个 node；
        //      如果 cascade 为 true，则返回所有根节点以及子节点合并所构成的一个数组；
        //      如果 cascade 为 false，则仅返回所有根节点数据，同 getRoots 方法；
        //      如果 easyui-treegrid 的当前页没有数据，则返回一个长度为 0 的数组。
        getVisibleRows: function (jq, cascade) { return getVisibleRows(jq[0], cascade); },

        //  对当前 easyui-treegrid 中进行高亮关键词查询；该方法的 param 可以定义为如下两种类型：
        //      1、String 类型值：表示要对所有列进行的高亮查询关键词；
        //      2、JSON-Object：表示对特定列进行高亮查询的参数，该对象类型参数包含如下属性：
        //          field:      表示要进行高亮查询的列；
        //          value:      表示要进行高亮查询的关键词；
        //          regular:    Boolean 类型值，默认为 false；指示该关键词是否为正则表达式；
        //          ignoreCase: Boolean 类型值，默认为 true；指示高亮查询时是否忽略大小写。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        livesearch: function (jq, param) { return jq.each(function () { livesearch(this, param); }); },

        //  重写 easyui-treegrid 的原生方法 find，使之功能更加丰富。
        //  获取当前 easyui-treegrid 当前页指定 id 的节点对象并返回；该方法的参数 param 可以定义为如下两种类型：
        //      待查找的行数据的 idField(主键) 字段值；
        //      function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 function 类型，则 findRow 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示找到需要查找的结果，立即停止循环调用并返回该行数据；
        //          如果回调函数始终未返回 true，则该回调函数会一直遍历 rows 直到最后并返回 null。
        //  返回值：返回一个 JSON-Object，表示一个行节点数据对象；如果未找到相应数据，则返回 null。
        find: function (jq, param) { return findRow(jq[0], param); },

        //  获取当前 easyui-treegrid 中当前页指定 id 的节点数据对象；同 find 方法。
        findRow: function (jq, param) { return findRow(jq[0], param); },

        //  获取当前 easyui-treegrid 当前页上的指定行数据集合并返回；该方法的参数 param 可以定义为如下两种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 Function 类型，则 findRows 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则返回的结果集中将会包含该行数据；
        //          如果该回调函数始终未返回 true，则该方法最终返回一个长度为 0 的数组对象。
        //      Array 类型，数组中的每一项都可以定义为如下类型：
        //          待查找的行数据的 idField(主键) 字段值；
        //          Function 类型；具体回调函数签名参考 findRow 方法中 param 参数为 function 类型时的定义；
        //          当 param 参数定义为 Array 类型时，则 findRows 方法会对数组中的每一项循环调用 findRow 方法，并过滤掉 findRow 方法返回 null 的结果行；
        //  返回值：返回一个 Array 数组对象；数组中的每一项都是 JSON-Object 类型，表示一个行数据对象；如果未找到相应数据，则返回一个长度为 0 的数组对象。
        findRows: function (jq, param) { return findRows(jq[0], param); },

        remove: function (jq, id) { return jq.each(function () { removeRow(this, id); }); },

        //  删除 easyui-treegrid 中当前页指定的节点以及它所有的子节点；参数 param 表示要删除的内容；该参数可以是以下三种类型：
        //      表示要删除的行数据的 idField(主键) 字段值；
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 Function 类型，则 deleteRow 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示查找到了需要被删除的行，deleteRow 方法将会删除该行数据并立即停止和跳出循环操作；
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        deleteRow: function (jq, param) { return jq.each(function () { deleteRow(this, param); }); },

        //  删除多行数据，参数 param 表示要删除的内容；该参数可以是以下两种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 Function 类型，则 deleteRows 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示查找到了需要被删除的行，deleteRows 方法将会删除该行数据，并遍历下一行数据直至数数据集的末尾；
        //      Array 类型，数组中的每一项目均表示要删除的行的行索引号或者 idField(主键) 字段值。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        deleteRows: function (jq, param) { return jq.each(function () { deleteRows(this, param); }); },

        //  设置 easyui-treegrid 中列的标题；参数 param 是一个 json 对象，包含如下属性：
        //      field: 列字段名称
        //      title: 列的新标题
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        setColumnTitle: function (jq, param) { return jq.each(function () { setColumnTitle(this, param); }); },

        //  选中 easyui-treegrid 当前页的某行节点数据；该方法的参数 param 可以定义为如下两种类型：
        //      1、表示行节点的 id 值；
        //      2、JSON-Object 对象，该对象需定义如下属性：
        //          id:     表示要获取的行节点的 id 值；
        //          cascade:Boolean 类型值，默认为 false，表示是否连同其子级节点的 DOM 行对象一并获取并返回。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        select: function (jq, param) { return jq.each(function () { selectRow(this, param); }); },

        //  不选中 easyui-treegrid 当前页的某行节点数据；该方法的参数 param 可以定义为如下两种类型：
        //      1、表示行节点的 id 值；
        //      2、JSON-Object 对象，该对象需定义如下属性：
        //          id:     表示要获取的行节点的 id 值；
        //          cascade:Boolean 类型值，默认为 false，表示是否连同其子级节点的 DOM 行对象一并获取并返回。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        unselect: function (jq, param) { return jq.each(function () { unselectRow(this, param); }); },

        //  同 select 方法；
        selectRow: function (jq, param) { return jq.each(function () { selectRow(this, param); }); },

        //  同 unselect 方法；
        unselectRow: function (jq, param) { return jq.each(function () { unselectRow(this, param); }); },

        //  选则 easyui-treegrid 当前页的某行节点数据；该方法的参数 param 可以定义为如下两种类型：
        //      1、表示行节点的 id 值；
        //      2、JSON-Object 对象，该对象需定义如下属性：
        //          id:     表示要获取的行节点的 id 值；
        //          cascade:Boolean 类型值，默认为 false，表示是否连同其子级节点的 DOM 行对象一并获取并返回。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        check: function (jq, param) { return jq.each(function () { checkRow(this, param); }); },

        //  不选则 easyui-treegrid 当前页的某行节点数据；该方法的参数 param 可以定义为如下两种类型：
        //      1、表示行节点的 id 值；
        //      2、JSON-Object 对象，该对象需定义如下属性：
        //          id:     表示要获取的行节点的 id 值；
        //          cascade:Boolean 类型值，默认为 false，表示是否连同其子级节点的 DOM 行对象一并获取并返回。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        uncheck: function (jq, param) { return jq.each(function () { uncheckRow(this, param); }); },

        // 同 check 方法。
        checkRow: function (jq, param) { return jq.each(function () { checkRow(this, param); }); },

        // 同 uncheck 方法。
        uncheckRow: function (jq, param) { return jq.each(function () { uncheckRow(this, param); }); },

        //  设置当前 easyui-treegrid 控件的表头过滤器；该函数提供如下参数：
        //      columnFilter: 参见属性 columnFilter
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        setColumnFilter: function (jq, columnFilter) { return jq.each(function () { setColumnFilter(this, columnFilter); }); },

        //  对当前 easyui-treegrid 控件按特定条件进行行过滤/显示操作；该方法的参数 param 可以定义为如下两种类型：
        //      1、Boolean 类型：如果定义为该类型，则：
        //          如果值定义为 true，则表示选中所有的数据全部不过滤；
        //          如果值定义为 false，则表示清空所有的数据全部过滤掉而不显示；
        //      2、JSON-Object 类型：如果定义为该类型，则该参数定义包含如下属性：
        //          field:  String 类型，表示要操作的列的 field 值；
        //          selected：Boolean，表示要对 field 所指示的列进行过滤操作的类型：
        //              如果定义为 true，则表示进行选中操作；
        //              如果定义为 false，则表示进行过滤操作；
        //          value:  表示要对 field 所指示的列进行过滤操作的值，该参数可以定义为如下类型：
        //              Array 类型：表示一组要进行过滤操作的值；
        //              非 Array 类型：表示要进行过滤操作的值；
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        columnFilterSelect: function (jq, param) { return jq.each(function () { columnFilterSelect(this, param); }); },

        //  设置当前 easyui-treegrid 控件的 offset 属性；该操作能让 offset 即可随浏览器窗口大小调整而生效或禁用；
        //  备注： 参数 offset 格式参考扩展属性 offset。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        setOffset: function (jq, offset) { return jq.each(function () { setOffset(this, offset); }); },

        //  将当前表格数据导出为 excel 文件；该函数定义了一个参数 isAll；
        //  参数 isAll 指示是否导出全部而非仅当前页数据，如果不传入该参数默认为 false 即导出当前页数据。
        //  当参数 isAll 为 true 并且 remotePaging 为 true 时，需要当前 easyui-treegrid 控件的 url 属性指示的服务器数据源支持查询所有数据
        //      （以 rows: 0 方式不分页查询所有数据）。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        exportExcel: function (jq, isAll) { return jq.each(function () { exportGrid(this, isAll); }); }

    };
    var defaults = $.fn.treegrid.extensions.defaults = {

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示当屏幕大小调整时候随屏幕大小尺寸调整而自身大小调整的偏移量；
        //  该参数为一个 JSON 格式对象，该对象定义如下属性：
        //      width: 表示相对于浏览器窗口宽度的偏移量，如果是正数则其宽度比浏览器窗口大，反之则其宽度比浏览器窗口小，int类型；
        //      height: 表示相对于浏览器窗口高度的偏移量，如果是正数则其高度比浏览器窗口大，反之则其高度比浏览器窗口小，int类型；
        //  备注：该参数默认为 null，表示不随屏幕尺寸大小调整而调整；
        //      如果未定义 width 或者 width: 0，则表示屏幕大小调整时 easyui-treegrid 的 width 属性撑满屏幕宽度；
        //      如果未定义 height 或者 height: 0，则表示屏幕大小调整时 easyui-treegrid 的 height 属性撑满屏幕宽度；
        offset: null,

        //  扩展 easyui-treegrid 的自定义属性，表示当前 easyui-treegrid 控件是否支持平滑数据格式。
        //  当支持平滑数据格式时，数据元素中不需要通过指定 children 来指定子节点，而是支持通过指定的 parentField 值所表示的列的值来指示其父级节点。
        //  Boolean 类型值，默认为 false。
        dataPlain: false,

        //  扩展 easyui-treegrid 的自定义属性，表示当前 easyui-treegrid 控件支持平滑数据格式时，程序用哪个 field 表示当前行数据的父级节点 idField 值
        //  String 类型值，默认为 "pid"。
        parentField: "pid",

        //  扩展 easyui-treegrid 的自定义属性，表示当左键点击带有子节点的条目时，是否自动展开/折叠相应节点。
        //  Boolean 类型，默认为 false。
        //  备注：该功能不会影响到 easyui-treegrid 的原生事件 onClick。
        toggleOnClick: false,

        //  扩展 easyui-treegrid 的自定义属性，表示同一级菜单节点下，只允许一个节点被展开。
        //  Boolean 类型，默认为 false。
        //  当该属性设置为 true 时，建议同时把 animate 属性设置为 false，以免影响菜单联动折叠时的美观效果。
        onlyNodeExpand: false,

        //  扩展 easyui-treegrid 的自定义属性，表示当前 easyui-treegrid 控件是否支持级联选择；
        //  Boolean 类型值，默认为 false。
        //  备注：在当 checkOnSelect、singleSelect 这两个属性都为 true 的情况下，不支持级联选择，此时属性 cascadeCheck 无效；
        cascadeCheck: false,

        //  覆盖 easyui-treegrid 的原生属性 loadFilter，以支持相应扩展功能(支持平滑数据格式)。
        loadFilter: loadFilter,

        //  覆盖 easyui-treegrid 的原生事件 onExpand，以支持相应扩展功能。
        onExpand: onExpand,


        //  增加 easyui-treegrid 的自定义扩展属性；
        //      该属性表示当设定了属性 rowContextMenu 时，是否将双击数据行 onDblClickRow 事件的响应函数
        //      设置为 rowContextMenu 的第 "dblClickRowMenuIndex" 个菜单项的点击响应函数，并将该菜单项的字体加粗；
        //  Boolean 类型值，默认为 true；
        //  备注：当设置了有效的属性 rowContextMenu 时候，该功能方有效。
        //      自动绑定的 onDblClickRow 的回调函数中将会调用 rowContextMenu 的第 "dblClickRowMenuIndex" 个菜单项的点击响应函数，但是回调函数中不能用到参数 e 和 menu。
        autoBindDblClickRow: true,

        //  增加 easyui-treegrid 的自定义扩展属性；
        //  该属性表示当设定了属性 autoBindDblClickRow: true，双击行数据触发的右键菜单项事件的索引号；
        //      意即触发第几个右键菜单项上的事件。
        //  Number 类型值，从 0 开始计数，默认为 0；
        //  备注：当设置了自定义属性 autoBindDblClickRow: true并且设置了有效的属性 rowContextMenu 时，该功能方有效；
        //      如果此索引值超出菜单数量范围，则无效。
        dblClickRowMenuIndex: 0,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否启用右键点击表头或者行数据时候弹出菜单中具有 "导出数据" 菜单的功能；
        //  该属性可以定义为以下类型：
        //      Boolean 类型值，表示是否启用右键菜单中的“导出数据”菜单项功能，默认为 false。
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          current:   Boolean 类型值，表示是否启用“导出当前页”的菜单项，默认为 true；
        //          all:   Boolean 类型值，表示是否启用“导出全部”的菜单项，默认为 true；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //  备注：当 enableRowContextMenu 属性设置为 true 时，该属性才有效。
        //  导出数据功能的方法尚未实现，所以...就让它保持默认为 false 吧。
        exportMenu: false,

        //  增加 easyui-treegrid 的自定义扩展属性，Boolean 类型值，该属性表示是否启用：
        //      当右键单击行数据时选择右键当前单击的行的功能，默认为 true；
        //  注意：当此参数设置为 true 时，右键点击行会对性能产生一定影响；当时数据量大(单页数据超过 100 行)时不建议使用。
        selectOnRowContextMenu: false,

        //  增加 easyui-treegrid 的自定义扩展属性，Boolean 类型值，该属性表示是否启用：
        //      右键(表头右键或行右键)点击时弹出的菜单项，如果是 disabled: true ，则不显示的功能，默认为 false；
        hideDisabledMenu: false,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示表列头右键菜单，为一个 Array 对象；数组中的每一个元素都具有如下属性:
        //      id:         表示菜单项的 id；
        //      text:       表示菜单项的显示文本；
        //      iconCls:    表示菜单项的左侧显示图标；
        //      disabled:   表示菜单项是否被禁用(禁用的菜单项点击无效)；
        //      hideOnClick:    表示该菜单项点击后整个右键菜单是否立即自动隐藏；
        //      bold:           Boolean 类型值，默认为 false；表示该菜单项是否字体加粗；
        //      style:          JSON-Object 类型值，默认为 null；表示要附加到该菜单项的样式；
        //      handler:    表示菜单项的点击事件，该事件函数格式为 function(e, field, eventData, grid, item, menu)，其中 this 指向菜单项本身
        //  备注：具体格式参考 easyui-treegrid 的 toolbar 属性为 Array 对象类型的格式；
        //      当 enableHeaderContextMenu 属性为 true 时，该设置方有效。
        headerContextMenu: null,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示数据行右键菜单，为一个 Array 对象；；数组中的每一个元素都具有如下属性:
        //      id:         表示菜单项的 id；
        //      text:       表示菜单项的显示文本；
        //      iconCls:    表示菜单项的左侧显示图标；
        //      disabled:   表示菜单项是否被禁用(禁用的菜单项点击无效)；
        //      hideOnClick:    表示该菜单项点击后整个右键菜单是否立即自动隐藏；
        //      bold:           Boolean 类型值，默认为 false；表示该菜单项是否字体加粗；
        //      style:          JSON-Object 类型值，默认为 null；表示要附加到该菜单项的样式；
        //      handler:    表示菜单项的点击事件，该事件函数格式为 function(e, row, eventData, grid, item, menu)，其中 this 指向菜单项本身
        //  备注：具体格式参考 easyui-treegrid 的 toolbar 属性为 Array 对象类型的格式；
        //      当 enableRowContextMenu 属性为 true 时，该设置方有效。
        rowContextMenu: null,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否启用 easyui-treegrid 的表头列点击按钮菜单；
        //  Boolean 类型值，默认为 true。 
        enableHeaderClickMenu: true,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否启用 easyui-treegrid 的表头右键菜单；
        //  Boolean 类型值，默认为 true。
        enableHeaderContextMenu: true,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否启用 easyui-treegrid 的行右键菜单；
        //  Boolean 类型值，默认为 true。
        enableRowContextMenu: true,

        //  扩展 easyui-treegrid 的自定义属性，表示是否启用右键菜单中的“展开当前、折叠当前、展开当前所有、折叠当前所有”菜单项的功能；
        //  该属性可以定义为以下类型：
        //      Boolean 类型，表示是否启用这四个菜单项；
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          expand:     布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“展开当前”菜单；
        //          expandAll:  布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“展开当前所有”菜单；
        //          collapse:   布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“折叠当前”菜单；
        //          collapseAll: 布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“折叠当前所有”菜单；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //          上面四个属性，如果参数的值为函数，则函数的签名为 function(e, node, treegrid, item, menu)。
        //  备注：当 enableRowContextMenu 属性设置为 true 时，该属性才有效。
        //      这四个菜单点击时，会自动触发 easyui-treegrid 的折叠/展开菜单项的相应事件。
        toggleMenu: true,

        //  扩展 easyui-treegrid 的自定义属性，表示是否启用右键菜单中的“上移、下移、上移一级、下移一级”菜单项的功能；
        //  该属性可以定义为以下类型：
        //      Boolean 类型，表示是否启用这四个菜单项，默认为 false；
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          up:         布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“上移”菜单；
        //          upLevel:    布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“上移一级”菜单；
        //          down:       布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“下移”菜单；
        //          downLevel:  布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“下移一级”菜单；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //          上面四个属性，如果参数的值为函数，则函数的签名为 function(e, node, treegrid, item, menu)。
        //  备注：当 enableRowContextMenu 属性设置为 true 时，该属性才有效。
        //      这四个菜单点击时，会自动触发 easyui-treegrid 的 onDrop 事件。
        moveMenu: false,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否启用右键菜单中的“翻页”菜单项的功能；
        //  该属性可以定义为以下类型：
        //      Boolean 类型值，表示是否启用右键菜单中的“翻页”菜单项功能，默认为 true。
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          disabled:   Boolean 类型值，表示是否启用右键菜单中的“翻页”菜单项功能，默认为 true；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //  备注：当 enableRowContextMenu 属性设置为 true 时，该属性才有效。
        pagingMenu: false,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否启用右键菜单中的“刷新当前页”菜单项的功能；
        //  Boolean 类型值，默认为 true。
        refreshMenu: true,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否启用表格的行节点拖动功能；
        //  Boolean 类型值，默认为 false。
        dndRow: false,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否启用行数据的 tooltip 功能；
        //  该属性可以是一个 Boolean 类型值；也可以是一个格式为 function(row) 的回调函数；
        //  如果该参数是一个回调函数，则表示启用行数据的 tooltip 功能，并且该函数的返回值为 tooltip 的 content 值。
        //  默认为 Boolean 类型，值为 false。
        //  注意：当启用该配置属性后，所有列的 tootip 属性就会自动失效。
        rowTooltip: false,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示在触发 beginEdit 事件后，是否构建仿 ext-grid-rowediting 行编辑的“保存”和“取消”按钮面板；
        //  Boolean 类型值，默认为 true。
        extEditing: true,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示在双击 data-row(数据行) 时，是否自动启用该行的编辑功能(执行 beginEdit 操作)；
        //  Boolean 类型值，默认为 false。
        autoEditing: false,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示在 autoEditing: true 时自动触发行编辑效果的事件(双击行还是单击行)。
        //  String 类型值，可选的值为 "onClickRow" 和 "onDblClickRow"，默认为 "onDblClickRow"
        //  注意：该参数仅在 autoEditing: true 时才有效。
        //        因 "onDblClickRow" 在 autoBindDblClickRow: true 时会自动将右键菜单第一项绑定至行双击事件中；
        //        所以建议在 autoBindDblClickRow: true 且行右键菜单第一项为行编辑功能时，autoEditing 设置为 false 或 autoEditingEvent 设置为 "onClickRow"
        autoEditingEvent: "onDblClickRow",

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示在表格失去焦点(逻辑上失去焦点，实际上是判断页面上表格外的其他部分被点击)后，表格是否自动关闭行编辑状态。
        //  Boolean 类型值，默认为 true。
        finishEditOnBlur: true,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示当 finishEditOnBlur: true，点击哪个区域会导致当前表格自动关闭行编辑状态。
        //  该属性可以是一个 HTML-DOM 对象、也可以是一个 jQuery-DOM 对象、或者一个 jquery-DOM selector。默认为 window.document。
        finishEditLocale: window.document,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示当 finishEditOnBlur: true 时并且在表格失去焦点后将要触发表格自动关闭行编辑状态时，关闭行编辑状态所使用的方法。
        //  String 类型值，可选的值为 "endEdit" 或 "cancelEdit"，默认为 "endEdit"。
        finishEditMethod: "endEdit",

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示是否在一个时刻只允许一行数据开启编辑状态(当某行数据开启编辑状态时，其他正在编辑的行将会被自动执行 endEdit 操作)；
        //  Boolean 类型值，默认为 true。
        singleEditing: true,

        //  增加 easyui-treegrid 的自定义扩展属性，该属性表示当前表格的列过滤器设置参数；该参数是一个 JSON 格式的对象，该对象定义如下属性：
        //      panelHeight: 列过滤器控件面板的高度，默认为 100，该值最小为 60；
        //      position:   表示列过滤器的位置，String 类型，可以填入的值限定在以下范围：
        //          "top":  表示列过滤器被放置在表头的上方；
        //          "bottom":   表示列过滤器被放置在表头的下方；默认值。
        //  备注：关于列过滤器组件中每个列具体的过滤效果设置，参见扩展的 ColumnOption 属性(见本源码文件后面注释)；
        //  注意：
        //      1、如果不定义该参数，则表示当前 easyui-treegrid 控件不启用列过滤器功能；该参数不影响表头右键过滤功能；
        //      2、该功能不支持多行表头；也就是说如果当前 easyui-treegrid 设置了多行表头，则该功能无效；
        //      3、该功能仅实现本地数据过滤，也就是说该插件不会在处理远程数据请求时将过滤参数信息发送到远程服务器；
        //      4、当启用该功能时，easyui-treegrid 的属性 fitColumns 请保持默认值为 false，否则列头过滤器组件可能导致表头列不能对齐而布局混乱。
        columnFilter: null,

        //  
        showFilterText: undefined,

        //  覆盖 easyui-treegrid 的原生属性 loader，以支持相应扩展功能。
        loader: loader,

        //  覆盖 easyui-treegrid 的原生属性事件 onLoadSuccess，以支持相应扩展功能。
        //  注意：如果调用者需要在自己的代码中使用该事件，请以覆盖方式重写，而非直接重写。
        //  覆盖方式重写示例：
        //      grid.treegrid({
        //          onLoadSuccess: function(data) {
        //              $.fn.treegrid.extensions.onLoadSuccess.apply(this, arguments);  //这句一定要加上。
        //              ...                                     //这里是调用者的其他附加逻辑代码
        //          }
        //      });
        onLoadSuccess: onLoadSuccess,

        //  覆盖 easyui-treegrid 的原生属性事件 onResizeColumn，以支持相应扩展功能。
        //  注意：如果调用者需要在自己的代码中使用该事件，请以覆盖方式重写，而非直接重写。
        //  覆盖方式重写示例：
        //      grid.treegrid({
        //          onResizeColumn: function(data) {
        //              $.fn.treegrid.extensions.onResizeColumn.apply(this, arguments);  //这句一定要加上。
        //              ...                                     //这里是调用者的其他附加逻辑代码
        //          }
        //      });
        onResizeColumn: onResizeColumn,

        //  覆盖 easyui-treegrid 的原生属性事件 onBeforeEdit，以支持相应扩展功能。
        onBeforeEdit: onBeforeEdit,

        //  覆盖 easyui-treegrid 的原生属性事件 onAfterEdit，以支持相应扩展功能。
        //  注意：如果调用者需要在自己的代码中使用该事件，请以覆盖方式重写，而非直接重写。
        //  覆盖方式重写示例：
        //      grid.treegrid({
        //          onAfterEdit: function(data) {
        //              $.fn.treegrid.extensions.onAfterEdit.apply(this, arguments);  //这句一定要加上。
        //              ...                                     //这里是调用者的其他附加逻辑代码
        //          }
        //      });
        onAfterEdit: onAfterEdit,

        //  覆盖 easyui-treegrid 的原生属性事件 onCancelEdit，以支持相应扩展功能。
        onCancelEdit: onCancelEdit,

        //  扩展 easyui-treegrid 的自定义事件；该事件表示删除指定的列前触发的动作；该事件回调函数提供如下参数：
        //      field:  表示要被删除的列的 field 值。
        //  备注：如果该事件回调函数返回 false，则不进行删除列的操作。
        //  该事件函数中的 this 指向当前 easyui-treegrid 的 DOM 对象(非 jQuery 对象)；
        onBeforeDeleteColumn: function (field) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示删除指定的列后触发的动作；该事件回调函数提供如下参数：
        //      field:  表示要被删除的列的 field 值。
        //  该事件函数中的 this 指向当前 easyui-treegrid 的 DOM 对象(非 jQuery 对象)；
        onDeleteColumn: function (field) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示移动指定的列前触发的动作；该事件回调函数提供如下参数：
        //      source:  表示要被移动的列的 field 值。
        //      target:  表示目标位置的列的 field 值。
        //      point :  表示移动的方式；这是一个 String 类型值，可能的值包括：
        //          "before":   表示将列 source 移动至列 target 的前一格位置；
        //          "after" :   表示将列 source 移动至列 target 的后一格位置；
        //  备注：如果该事件回调函数返回 false，则不进行删除列的操作。
        //  该事件函数中的 this 指向当前 easyui-treegrid 的 DOM 对象(非 jQuery 对象)；
        onBeforeMoveColumn: function (source, target, point) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示移动指定的列后触发的动作；该事件回调函数提供如下参数：
        //      source:  表示要被移动的列的 field 值。
        //      target:  表示目标位置的列的 field 值。
        //      point :  表示移动的方式；这是一个 String 类型值，可能的值包括：
        //          "before":   表示将列 source 移动至列 target 的前一格位置；
        //          "after" :   表示将列 source 移动至列 target 的后一格位置；
        //  该事件函数中的 this 指向当前 easyui-treegrid 的 DOM 对象(非 jQuery 对象)；
        onMoveColumn: function (source, target, point) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示移动 tree-node 之前触发的动作；该事件回调函数提供如下三个参数：
        //          target: 表示目标位置的 tree-node 对象；
        //          source: 表示要移动的 tree-node 对象；
        //          point:  表示移动到目标节点 target 的位置，String 类型，可能的值包括：
        //              "append":   表示追加为目标节点 target 的子节点，默认值；
        //              "top":      表示移动到目标节点 target 的上一格位置；
        //              "bottom":   表示追加为目标节点 target 的下一格位置；
        //  该事件函数中的 this 指向当前 easyui-treegrid 的 DOM 对象(非 jQuery 对象)；
        //  如果该事件函数返回 false，则会立即停止移动数据节点操作；
        onBeforeDrop: function (target, source, point) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示移动 tree-node 之后触发的动作；该事件回调函数提供如下三个参数：
        //          target: 表示目标位置的 tree-node 对象；
        //          source: 表示要移动的 tree-node 对象；
        //          point:  表示移动到目标节点 target 的位置，String 类型，可能的值包括：
        //              "append":   表示追加为目标节点 target 的子节点，默认值；
        //              "top":      表示移动到目标节点 target 的上一格位置；
        //              "bottom":   表示追加为目标节点 target 的下一格位置；
        //  该事件函数中的 this 指向当前 easyui-treegrid 的 DOM 对象(非 jQuery 对象)；
        onDrop: function (target, source, point) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示拖动 data-row(数据行) 之前触发的动作；该事件回调函数提供如下参数：
        //      row:    表示被拖动的 data-row(数据行) 的行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件函数返回 false，则取消当前的拖动 data-row(数据行) 操作。
        onBeforeDrag: function (row) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示开始拖动 data-row(数据行) 时触发的动作；该事件回调函数提供如下参数：
        //      row:    表示被拖动的 data-row(数据行) 的行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        onStartDrag: function (row) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示结束拖动 data-row(数据行) 时触发的动作；该事件回调函数提供如下参数：
        //      row:    表示被拖动的 data-row(数据行) 的行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        onStopDrag: function (row) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示当有其他的 data-row(数据行) 被拖动至当前 data-row(数据行) 时所触发的动作；该事件回调函数提供如下两个参数：
        //      target: 表示当前 data-row(数据行) 的行数据对象，是一个 JSON-Object；
        //      source: 表示拖动过来的 data-row(数据行) 行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件函数返回 false，则立即取消当前的 data-row(数据行) 接收拖动过来对象的操作，并禁用当前 data-row(数据行) 的 droppable 效果；
        onDragEnter: function (target, source) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示当有其他的 data-row(数据行) 被拖动至当前 data-row(数据行) 后并在上面移动时所触发的动作；该事件回调函数提供如下两个参数：
        //      target: 表示当前 data-row(数据行) 的行数据对象，是一个 JSON-Object；
        //      source: 表示拖动过来的 data-row(数据行) 行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件函数返回 false，则立即取消当前的 data-row(数据行) 接收拖动过来对象的操作，并禁用当前 data-row(数据行) 的 droppable 效果；
        onDragOver: function (target, source) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示当有其他的 data-row(数据行) 被拖动至当前 data-row(数据行) 后并拖动离开时所触发的动作；该事件回调函数提供如下两个参数：
        //      target: 表示当前 data-row(数据行) 的行数据对象，是一个 JSON-Object；
        //      source: 表示拖动过来的 data-row(数据行) 行数据对象，是一个 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        onDragLeave: function (target, source) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示执行 update 方法前所触发的动作；该事件回调函数提供如下两个参数：
        //      id:     表示要进行 update 操作的行的 idField 值；
        //      row:    表示要进行更新操作的新的行数据对象；
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件回调函数返回 false，则立即取消即将要执行的 update 操作。
        onBeforeUpdate: function (index, row) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示执行 updateRow 方法后所触发的动作；该事件回调函数提供如下两个参数：
        //      id:  表示要进行 update 的行的 idField 值
        //      row:    表示要进行更新操作的新的行数据对象；
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        onUpdate: function (index, row) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示执行 append 方法前所触发的动作；该事件回调函数提供如下参数：
        //      parent: 表示被添加至的父级节点的 idField 值；如果该值为 null 或者为 undefined，则表示数据被添加至根节点；
        //      data:   表示被添加的节点数据，是一个 Array 数组对象；数组中的每一项都是一个表示节点数据的 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件回调函数返回 false，则立即取消即将要执行的 append 操作。
        onBeforeAppend: function (parent, data) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示执行 append 方法后所触发的动作；该事件回调函数提供如下参数：
        //      parent: 表示被添加至的父级节点的 idField 值；如果该值为 null 或者为 undefined，则表示数据被添加至根节点；
        //      data:   表示被添加的节点数据，是一个 Array 数组对象；数组中的每一项都是一个表示节点数据的 JSON-Object。
        onAppend: function (parent, data) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示执行 insert 方法前所触发的动作；该事件回调函数提供如下三个参数：
        //      before: 如果该参数有值，则其值为某个节点的 idField 值，表示被插入的节点将会放置在该节点之前；
        //      after:  如果该参数有值，则其值为某个节点的 idField 值，表示被插入的节点将会放置在该节点之后；
        //      data:   表示被插入的节点数据，是一个 Array 数组对象；数组中的每一项都是一个表示节点数据的 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件回调函数返回 false，则立即取消即将要执行的 insert 操作。
        //      该回调函数的参数 before 和 after，两者只有一个会有值，另一个的值将会为 null 或者 undefined。
        onBeforeInsert: function (before, after, row) { },

        //  扩展 easyui-treegrid 的自定义事件；该事件表示执行 insert 方法后所触发的动作；该事件回调函数提供如下三个参数：
        //      before: 如果该参数有值，则其值为某个节点的 idField 值，表示被插入的节点将会放置在该节点之前；
        //      after:  如果该参数有值，则其值为某个节点的 idField 值，表示被插入的节点将会放置在该节点之后；
        //      data:   表示被插入的节点数据，是一个 Array 数组对象；数组中的每一项都是一个表示节点数据的 JSON-Object。
        //  该事件函数中的 this 指向当前 easyui-treerid 的 DOM 对象(非 jQuery 对象)；
        //  备注：如果该事件回调函数返回 false，则立即取消即将要执行的 insert 操作。
        //      该回调函数的参数 before 和 after，两者只有一个会有值，另一个的值将会为 null 或者 undefined。
        onInsert: function (before, after, data) { },

        onBeforeRemove: function (row) { },

        onRemove: function (row) { }
    };

    $.extend($.fn.treegrid.defaults, defaults);
    $.extend($.fn.treegrid.methods, methods);



    var view = {
        onBeforeRender: function (target, id, data) {
            if ($.isArray(id)) {
                data = { total: id.length, rows: id };
                id = null;
            }
            if (!data) { return false; }
            var state = $.data(target, "treegrid");
            var opts = state.options;
            if (data.length == undefined) {
                if (data.footer) { state.footer = data.footer; }
                if (data.total) { state.total = data.total; }
                data = this.transfer(target, id, data.rows);
            }
            setParent(data.length == undefined ? data.rows : data, id);
            var node = findRow(target, id);
            if (node) {
                if (node.children) {
                    node.children = node.children.concat(data);
                } else {
                    node.children = data;
                }
            } else {
                state.data = state.data.concat(data);
            }
            if (!opts.remoteSort) { this.sort(target, data); }
            this.treeNodes = data;
            this.treeLevel = $(target).treegrid("getLevel", id);

            function setParent(rows, id) {
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    row._parentId = id;
                    if (row.children && row.children.length) {
                        setParent(row.children, row[opts.idField]);
                    }
                }
            };
        }
    };

    $.extend($.fn.treegrid.defaults.view, view);

})(jQuery);

///<jscompress sourcefile="jeasyui.extensions.tree.js" />
/**
* jQuery EasyUI tree Extensions 1.0 beta
* jQuery EasyUI tree 组件扩展
* jeasyui.extensions.tree.js

* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.panel.js v1.0 beta late
*   5、jeasyui.extensions.window.js v1.0 beta late
*   6、jeasyui.extensions.dialog.js v1.0 beta late
*/
(function ($, undefined) {

    $.fn.tree.extensions = {};


    /******************** initExtensions Methods Begin ********************/

    function isRootNode(treeTarget, target) {
        var t = $(treeTarget);
        target = $(target)[0];
        return $.array.contains(t.tree("getRoots"), target, function (t1, t2) {
            return t1.target == t2;
        });
    };

    function showOption(treeTarget, target) {
        var t = $(treeTarget), opts, pos;
        if (target) {
            target = $(target)[0];
            opts = t.tree("getNode", target);
            pos = $(target).offset();
        } else {
            opts = t.tree("options");
            pos = t.offset();
        }
        $.extend(pos, { left: pos.left + 25, top: pos.top + 15 });
        $.easyui.showOption(opts, pos);
    };


    function getLevel(treeTarget, target) {
        var t = $(treeTarget), node = $(target);
        if (!t[0] || !node[0] || !node.is(".tree-node[node-id]") || !$.contains(t[0], node[0])) { return 0; }
        return node.parentsUntil("ul.tree", "ul").length + 1;
    };

    function moveNode(treeTarget, param) {
        if (!param || !param.source || !param.target || !param.point) { return; }
        if (!$.array.contains(["append", "top", "bottom"], param.point)) { param.point = "append"; }
        param.source = $(param.source)[0]; param.target = $(param.target)[0];
        if (param.source == param.target) { return; }
        var t = $(treeTarget), opts = t.tree("options");
        if ($.isFunction(opts.onBeforeDrop) && opts.onBeforeDrop.call(treeTarget, param.target, param.source, param.point) == false) { return; }
        if (t.tree("isParent", { target1: param.source, target2: param.target })) { return; }
        var node = t.tree("pop", param.source);
        switch (param.point) {
            case "append": t.tree("append", { parent: param.target, data: [node] }); break;
            case "top": t.tree("insert", { before: param.target, data: node }); break;
            case "bottom": t.tree("insert", { after: param.target, data: node }); break;
            default: t.tree("append", { parent: param.target, data: [node] }); break;
        }
        if (node && $.isFunction(opts.onDrop)) { opts.onDrop.call(treeTarget, param.target, param.source, param.point); }
    };

    function shiftNode(treeTarget, param) {
        if (!param || !param.target || !param.point || !$.array.contains(["up", "upLevel", "down", "downLevel"], param.point)) { return; }
        param.target = $(param.target)[0];
        var t = $(treeTarget), source = param.target, targetNode;
        switch (param.point) {
            case "up": targetNode = t.tree("prev", source); break;
            case "upLevel": targetNode = t.tree("getParent", source); break;
            case "down": targetNode = t.tree("next", source); break;
            case "downLevel": targetNode = t.tree("prev", source); break;
            default: break;
        }
        if (!targetNode) { return; }
        t.tree("move", { source: source, target: targetNode.target, point: param.point == "up" ? "top" : (param.point == "downLevel" ? "append" : "bottom") });
    };

    function compareNode(target, param) {
        if (isChild(target, param)) { return "child"; }
        if (isParent(target, param)) { return "parent"; }
        if (isSibling(target, param)) { return "sibling"; }
        return "normal";
    };

    function isChild(target, param) {
        var t = $(target),
            target1 = $(param.target1)[0], target2 = $(param.target2)[0];
        var children = t.tree("getChildren", target2);
        return $.array.some(children, function (val) { return val.target == target1; });
    };

    function isParent(target, param) {
        var t = $(target),
            target1 = $(param.target1)[0], target2 = $(param.target2)[0];
        var children = t.tree("getChildren", target1);
        return $.array.some(children, function (val) { return val.target == target2; });
    };

    function isSibling(target, param) {
        var t = $(target),
            target1 = $(param.target1)[0], target2 = $(param.target2)[0],
            p1 = t.tree("getParent", target1), p2 = t.tree("getParent", target2);
        return p1.target == p2.target;
    };

    function getNextNode(treeTarget, target) {
        var item = $(target);
        if (!item.hasClass("tree-node")) { return null; }
        var target = item[0], next = item.closest("li").next().children("div.tree-node");
        if (!next.length) { return null; }
        return next.length ? $(treeTarget).tree("getNode", next[0]) : null;
    };

    function getPrevNode(treeTarget, target) {
        var item = $(target);
        if (!item.hasClass("tree-node")) { return null; }
        var target = item[0], prev = item.closest("li").prev().children("div.tree-node");
        if (!prev.length) { return null; }
        return prev.length ? $(treeTarget).tree("getNode", prev[0]) : null;
    };

    function getNears(treeTarget, target) {
        var t = $(treeTarget); target = $(target);
        if (!$.contains(t[0], target[0]) || !target.is("div.tree-node")) { return null; }
        return target.closest("ul").find("li>div.tree-node").map(function () {
            return t.tree("getNode", this);
        });
    };

    function getNearChildren(treeTarget, target) {
        var t = $(treeTarget); target = $(target);
        if (!$.contains(t[0], target[0]) || !target.is("div.tree-node")) {
            return null;
        }
        return target.siblings("ul").find("li>div.tree-node").map(function () {
            return t.tree("getNode", this);
        });
    };

    function unselect(treeTarget, target) {
        $(target).removeClass("tree-node-selected");
    };

    function remoteLoad(target, param) {
        var t = $(target);
        if (!param) { return t.tree("reload"); }
        if (typeof param == "string") {
            t.tree("options").url = param;
            return remoteLoad(target, {});
        }
        var opts = t.tree("options"), queryParams = opts.queryParams;
        opts.queryParams = $.extend({}, queryParams, param);
        t.tree("reload");
    };

    function setNodeIcon(target, param) {
        if (!param || !param.target || !param.iconCls) { return; }
        $(target).tree("update", { target: param.target, iconCls: param.iconCls })
    };

    function setNodeText(target, param) {
        if (!param || !param.target || !param.text) { return; }
        $(target).tree("update", { target: param.target, text: param.text })
    };
    /******************** initExtensions Methods   End ********************/


    function initAutoToggle(t, opts, exts) {
        exts.onClickBak = opts.onClick;
        opts.onClick = function (node) {
            if ($.isFunction(exts.onClickBak)) { exts.onClickBak.apply(this, arguments); }
            if (opts.toggleOnClick) { t.tree("toggle", node.target); }
        };
    };

    function initContextMenu(t, opts, exts) {
        exts.onContextMenuBak = opts.onContextMenu;
        opts.onContextMenu = function (e, node) {
            if ($.isFunction(exts.onContextMenuBak)) { exts.onContextMenuBak.apply(this, arguments); }
            if (opts.selectOnContextMenu) { t.tree("select", node.target); }
            if (opts.enableContextMenu) {
                e.preventDefault();
                var items = parseContextMenuItems(t, opts, e, node);
                if (opts.autoBindDblClick && opts.dblClickMenuIndex >= 0 && $.util.likeArray(opts.contextMenu) && !$.util.isString(opts.contextMenu)
                    && opts.contextMenu.length > opts.dblClickMenuIndex) {
                    items[opts.dblClickMenuIndex].bold = true;
                }
                $.easyui.showMenu({ items: items, left: e.pageX, top: e.pageY });
            }
        };
    };

    function initBindDblClickEvent(t, opts, exts) {
        if (!$.array.likeArray(opts.contextMenu) || $.util.isString(opts.contextMenu) ||
            !opts.contextMenu.length || !opts.autoBindDblClick) { return; }
        opts.onDblClickBak = opts.onDblClick;
        opts.onDblClick = function (node) {
            if ($.isFunction(exts.onDblClickBak)) { exts.onDblClickBak.apply(this, arguments); }
            var items = parseContextMenuItems(t, opts, null, node);
            if (opts.dblClickMenuIndex >= 0 && items.length > opts.dblClickMenuIndex) {
                var item = items[opts.dblClickMenuIndex], handler = item.handler || item || onclick;
                handler(null, node, t, item, null);
            }
        };
    };


    function parseContextMenuItems(t, opts, e, node) {
        var toggle = opts.toggleMenu, move = opts.moveMenu;
        if (typeof toggle == "object") {
            toggle = $.extend({}, { expand: true, expandAll: true, collapse: true, collapseAll: true, submenu: false }, toggle);
        }
        if (typeof move == "object") {
            move = $.extend({}, { up: false, upLevel: false, down: false, downLevel: false, submenu: false }, move);
        }
        var mExpandAll = { text: "展开当前所有", iconCls: "icon-metro-expand", disabled: !(toggle == true || toggle.expandAll == true), handler: function () { t.tree("expandAll", node.target); } };
        var mExpand = { text: "展开当前", iconCls: "icon-metro-expand2", disabled: !(toggle == true || toggle.expand == true), handler: function () { t.tree("expand", node.target); } };
        var mCollapse = { text: "折叠当前", iconCls: "icon-metro-contract2", disabled: !(toggle == true || toggle.collapse == true), handler: function () { t.tree("collapse", node.target); } };
        var mCollapseAll = { text: "折叠当前所有", iconCls: "icon-metro-contract", disabled: !(toggle == true || toggle.collapseAll == true), handler: function () { t.tree("collapseAll", node.target); } };

        var mUpLevel = { text: "上移一级", iconCls: "icon-standard-arrow-up", disabled: !(move == true || move.upLevel == true), handler: function () { t.tree("shift", { point: "upLevel", target: node.target }); } };
        var mUp = { text: "上移", iconCls: "icon-standard-up", disabled: !(move == true || move.up == true), handler: function () { t.tree("shift", { point: "up", target: node.target }); } };
        var mDown = { text: "下移", iconCls: "icon-standard-down", disabled: !(move == true || move.down == true), handler: function () { t.tree("shift", { point: "down", target: node.target }); } };
        var mDownLevel = { text: "下移一级", iconCls: "icon-standard-arrow-down", disabled: !(move == true || move.downLevel == true), handler: function () { t.tree("shift", { point: "downLevel", target: node.target }); } };

        var mOpts = {
            text: "显示 Option", iconCls: "icon-standard-application-form", disabled: !opts.showOption, children: [
                { text: "树控件 Option", iconCls: "icon-hamburg-category", handler: function () { t.tree("showOption"); } },
                { text: "该节点 Option", iconCls: "tree-icon tree-file", handler: function () { t.tree("showOption", node.target); } }
            ]
        };

        var menus = [];
        var toggleMenu = [mExpandAll, mExpand, mCollapse, mCollapseAll], moveMenu = [mUpLevel, mUp, mDown, mDownLevel];
        if (t.tree("isRoot", node.target)) {
            $.array.insertRange(toggleMenu, 0, [
                { text: "展开所有", iconCls: "icon-standard-arrow-out", handler: function () { t.tree("expandAll"); } },
                { text: "折叠所有", iconCls: "icon-standard-arrow-in", handler: function () { t.tree("collapseAll"); } }, "-"
            ]);
        }
        if ($.array.likeArray(opts.contextMenu)) { $.array.merge(menus, opts.contextMenu, "-"); }


        /*
        Author:ybf
        Date:2015/04/30
        注销树菜单移动和展开功能        
        */

        //if (opts.showOption) { $.array.merge(menus, mOpts, "-"); }     
        
        //$.array.merge(menus, typeof toggle == "object" && !toggle.submenu
        //            ? $.array.merge(toggleMenu, "-") : [{ text: "展开/折叠", iconCls: "", disabled: !toggle, children: toggleMenu }, "-"]);
        //$.array.merge(menus, typeof move == "object" && !move.submenu
        //            ? moveMenu : { text: "上/下移(级)", iconCls: "", disabled: !move, children: moveMenu });
       
        return parseContextMenuMap(e, node, menus, t);
    };

    function parseContextMenuMap(e, node, menus, t) {
        return $.array.map(menus, function (value) {
            if (!value || $.util.isString(value)) { return value; }
            var ret = $.extend({}, value);
            ret.id = $.isFunction(value.id) ? value.id.call(ret, e, node, t) : value.id;
            ret.text = $.isFunction(value.text) ? value.text.call(ret, e, node, t) : value.text;
            ret.iconCls = $.isFunction(value.iconCls) ? value.iconCls.call(ret, e, node, t) : value.iconCls;
            ret.disabled = $.isFunction(value.disabled) ? value.disabled.call(ret, e, node, t) : value.disabled;
            ret.hideOnClick = $.isFunction(value.hideOnClick) ? value.hideOnClick.call(ret, e, node, t) : value.hideOnClick;
            ret.onclick = $.isFunction(value.onclick) ? function (e, item, menu) { value.onclick.call(this, e, node, t, item, menu); } : value.onclick;
            ret.handler = $.isFunction(value.handler) ? function (e, item, menu) { value.handler.call(this, e, node, t, item, menu); } : value.handler;
            if (ret.children && ret.children.length) { ret.children = parseContextMenuMap(e, node, ret.children, t); }
            return ret;
        });
    };


    /******************** initExtensions Begin ********************/
    var initExtensions = $.fn.tree.extensions.initExtensions = function (t, opts) {
        var exts = opts._extensions ? opts._extensions : opts._extensions = {};
        if (exts._initialized) { return; }
        initAutoToggle(t, opts, exts);
        initContextMenu(t, opts, exts);
        initBindDblClickEvent(t, opts, exts);
        exts._initialized = true;
    };

    var parseQueryParams = $.fn.tree.extensions.parseQueryParams = function (opts, param) {
        var ret = $.extend({}, param, opts.queryParams);
        return $.util.parseMapFunction(ret);
    };

    var loader = $.fn.tree.extensions.loader = function (param, success, error) {
        var t = $(this), opts = t.tree("options");
        initExtensions(t, opts);
        if (!opts.url) { return false; }
        param = parseQueryParams(opts, param);
        $.ajax({
            type: opts.method, url: opts.url, data: param, dataType: "json",
            success: function (data) { success(data); },
            error: function () { error.apply(this, arguments); }
        });
    };

    var _onExpand = $.fn.tree.defaults.onExpand;
    var onExpand = $.fn.tree.extensions.onExpand = function (node) {
        if ($.isFunction(_onExpand)) { _onExpand.apply(this, arguments); }
        var t = $(this), opts = t.tree("options");
        if (opts.onlyNodeExpand) {
            var nodes = t.tree("getNears", node.target), animate = opts.animate
            opts.animate = false;
            $.each($.array.filter(nodes, function (val) { return val.target != node.target && val.state == "open"; }), function () {
                t.tree("collapse", this.target);
            });
            opts.animate = animate;
        }
    };

    var _loadFilter = $.fn.tree.defaults.loadFilter;
    var loadFilter = $.fn.tree.extensions.loadFilter = function (data, parent) {
        if ($.isFunction(_loadFilter)) { data = _loadFilter.apply(this, arguments); }
        data = $.array.likeArray(data) && !$.util.isString(data) ? data : [];
        if (!data.length) { return data; }
        var t = $(this), opts = t.tree("options");
        return opts.dataPlain ? $.fn.tree.extensions.dataPlainConverter(data, opts) : data;
    };
    /******************** initExtensions   End ********************/

    $.fn.tree.extensions.dataPlainConverter = function (data, opts) {
        data = data || [];
        var ret = data, idField = opts.idField || "id", parentField = opts.parentField || "pid";
        if (opts.dataPlain) {
            var roots = $.array.filter(data, function (val) {
                if (val[parentField] == null || val[parentField] == undefined) { return true; }
                return !$.array.some(data, function (value) { return val[parentField] == value[idField]; });
            });
            var findChildren = function (array, value) {
                var temps = $.array.filter(array, function (val) {
                    return val[parentField] == null || val[parentField] == undefined ? false : val[parentField] == value[idField];
                });
                return $.array.map(temps, function (val) {
                    var children = findChildren(array, val);
                    if (children.length) {
                        val.children = $.array.likeArray(val.children) && !$.util.isString(val.children) ? val.children : [];
                        $.array.merge(val.children, children);
                    }
                    return val;
                });
            };
            ret = $.array.map(roots, function (val) {
                var children = findChildren(data, val);
                if (children.length) {
                    val.children = $.array.likeArray(val.children) && !$.util.isString(val.children) ? val.children : [];
                    $.array.merge(val.children, children);
                }
                return val;
            });
        }
        return ret;
    };



    $.fn.tree.extensions.cascadeToArray = function (data) {
        if ($.util.isEmptyObjectOrNull(data)) { return []; }
        if (!$.util.likeArrayNotString(data)) { data = [data]; }
        var ret = [], getNodeArray = function (node) {
            var tmp = $.extend({}, node), array = [tmp];
            if (!tmp.children || (tmp.children && !$.util.likeArrayNotString(tmp.children))) {
                return array;
            }
            $.each(tmp.children, function (i, n) {
                $.array.merge(array, getNodeArray(n));
            });
            tmp.children = undefined;
            return array;
        };
        $.each(data, function (i, n) {
            $.array.merge(ret, getNodeArray(n));
        });
        return ret;
    };



    var methods = $.fn.tree.extensions.methods = {
        //  扩展 easyui-tree 的自定义方法；判断制定的 tree-node 是否为根节点；该方法定义如下参数：
        //      target: 用于判断的 tree-node 的 jQuery 或 DOM 对象。
        //  返回值：如果指定的 jQuery 对象是该 easyui-tree 的根节点，则返回 true，否则返回 false。
        isRoot: function (jq, target) { return isRootNode(jq[0], target); },

        //  扩展 easyui-tree 的自定义方法；用于显示指定节点或树控件的属性信息；该方法定义如下参数：
        //      target: 要显示属性信息的 tree-node 的 jQuery 或 DOM 对象；该参数可选；如果不定义该参数，则显示树控件的属性信息；
        //  返回值：返回表示当前 easyui-tree 组件的 jQuery 对象。
        showOption: function (jq, target) { return jq.each(function () { showOption(this, target); }); },

        //  扩展 easyui-tree 的自定义方法；用于获取指定节点的级别；该方法的参数 target 表示要获取级别的 tree-node 节点的 jQuery 或 DOM 对象；
        //  返回值：如果 target 表示的 DOM 对象存在于此 easyui-tree，则返回表示其所在节点级别的数字(从 1 开始计数)，否则返回 0。
        getLevel: function (jq, target) { return getLevel(jq[0], target); },

        //  扩展 easyui-tree 的自定义方法；移动指定的节点到另一个位置；该方法定义如下参数：
        //      param:   这是一个 JSON-Object，该对象定义如下属性：
        //          target: 表示目标位置的 tree-node 的 jQuery 或 DOM 对象；
        //          source: 表示要移动的 tree-node 的 jQuery 或 DOM 对象；
        //          point:  表示移动到目标节点 target 的位置，String 类型，可选的值包括：
        //              "append":   表示追加为目标节点 target 的子节点，默认值；
        //              "top":      表示移动到目标节点 target 的上一格位置；
        //              "bottom":   表示追加为目标节点 target 的下一格位置；
        //  返回值：返回表示当前 easyui-tree 组件的 jQuery 对象。
        move: function (jq, param) { return jq.each(function () { moveNode(this, param); }); },

        //  扩展 easyui-tree 的自定义方法；移动指定节点的位置；该方法定义如下参数：
        //      param:  这是一个 JSON-Object，该对象定义如下属性：
        //          target: 表示要移动的 tree-node 的 jQuery 或 DOM 对象；
        //          point:  表示移动 target 的方式，String 类型，可选的值报错：
        //              "up":       表示将 target 所表示的 tree-node 移动到上一格位置；
        //              "upLevel":  表示将 target 所表示的 tree-node 移动到上一级的末尾；
        //              "down":     表示将 target 所表示的 tree-node 移动到下一格位置；
        //              "downLevel":表示将 target 所表示的 tree-node 移动到下一级的末尾；
        //              如果不定义该值或者该值为空或该值不是上面四个之一，则不进行任何操作；
        //  返回值：返回表示当前 easyui-tree 组件的 jQuery 对象。
        shift: function (jq, param) { return jq.each(function () { shiftNode(this, param); }); },

        //  扩展 easyui-tree 的自定义方法；判断两个 tree-node 之间的关系；该方法定义如下参数：
        //      param：  这是一个 JSON-Object，该对象定义如下属性：
        //          target1:    用于判断的第一个 tree-node 的 jQuery 或 DOM 对象；
        //          target2:    用于判断的第二个 tree-node 的 jQuery 或 DOM 对象；
        //  返回值：返回一个 String 类型的值：
        //      如果 target1 是 target2 的子节点，则返回 "child"；
        //      如果 target1 是 target2 的父节点，则返回 "parent"；
        //      如果 target1 和 target2 是具有同一个父级节点的平级节点，则返回 "sibling"；
        //      如果 target1 和 target2 既不是父子级关系，也不是具有同一个父级节点的平级节点关系，则返回 "normal"；
        compare: function (jq, param) { return compareNode(jq[0], param); },

        //  扩展 easyui-tree 的自定义方法；判断一个节点是否为另一个节点的子节点；该方法定义如下参数：
        //      param：  这是一个 JSON-Object，该对象定义如下属性：
        //          target1:    用于判断的第一个 tree-node 的 jQuery 或 DOM 对象；
        //          target2:    用于判断的第二个 tree-node 的 jQuery 或 DOM 对象；
        //  返回值：如果 tree-node target1 是 tree-node target2 的子节点，则返回 true，否则返回 false。
        isChild: function (jq, param) { return isChild(jq[0], param); },

        //  扩展 easyui-tree 的自定义方法；判断一个节点是否为另一个节点的父节点；该方法定义如下参数：
        //      param：  这是一个 JSON-Object，该对象定义如下属性：
        //          target1:    用于判断的第一个 tree-node 的 jQuery 或 DOM 对象；
        //          target2:    用于判断的第二个 tree-node 的 jQuery 或 DOM 对象；
        //  返回值：如果 tree-node target1 是 tree-node target2 的父节点，则返回 true，否则返回 false。
        isParent: function (jq, param) { return isParent(jq[0], param); },

        //  扩展 easyui-tree 的自定义方法；判断一个节点是否和另一个节点为具有同一个父节点的平级节点；该方法定义如下参数：
        //      param：  这是一个 JSON-Object，该对象定义如下属性：
        //          target1:    用于判断的第一个 tree-node 的 jQuery 或 DOM 对象；
        //          target2:    用于判断的第二个 tree-node 的 jQuery 或 DOM 对象；
        //  返回值：如果 tree-node target1 和 tree-node target2 是具有同一个父级节点的平级节点，则返回 true，否则返回 false。
        isSibling: function (jq, param) { return isSibling(jq[0], param); },

        //  扩展 easyui-tree 的自定义方法；获取指定节点的平级下一格位置的 tree-node 节点；该方法定义如下参数：
        //      target:  指定的表示 tree-node 的 jQuery 或 DOM 对象。
        //  返回值：返回 tree-node target 的同级别下一格位置的 tree-node 节点 node 对象；该 node 对象含有如下属性：
        //      id、text、iconCls、checked、state、attributes、target；
        //      如果该 tree-node target 为当前级别的最后一个节点即没有下一格节点；则返回 null。
        next: function (jq, target) { return getNextNode(jq[0], target); },

        //  扩展 easyui-tree 的自定义方法；获取指定节点的平级上一格位置的 tree-node 节点；该方法定义如下参数：
        //      target:  指定的表示 tree-node 的 jQuery 或 DOM 对象。
        //  返回值：返回 tree-node target 的同级别上一格位置的 tree-node 节点对象；该 tree-node 对象含有如下属性：
        //      id、text、iconCls、checked、state、attributes、target；
        //      如果该 tree-node target 为当前级别的第一个节点即没有上一格节点；则返回 null。
        prev: function (jq, target) { return getPrevNode(jq[0], target); },

        //  扩展 easyui-tree 的自定义方法；获取指定节点的同级所有节点(包含自身)；该方法定义如下参数：
        //      target:  指定的表示 tree-node 的 jQuery 或 DOM 对象。
        //  返回值：返回 tree-node target 的同级别(具有和当前 target 同一个父级节点)所有节点构成的一个数组对象；
        //      数组中每一个元素都是一个包含属性 id、text、iconCls、checked、state、attributes、target 的 tree-node 对象。
        //      如果传入的参数 target 是根节点或者未定义 target 参数，则该方法和 getRoots 方法返回的值相同；
        //      如果传入的参数 target 不是一个 div.tree-node 或者其不包含在当前 easyui-tree 中，则返回 null。
        getNears: function (jq, target) { return getNears(jq[0], target); },

        //  扩展 easyui-tree 的自定义方法；获取指定节点的下一级所有节点；该方法定义如下参数：
        //      target:  指定的表示 tree-node 的 jQuery 或 DOM 对象。
        //  返回值：返回 tree-node target 的下一级所有节点构成的一个数组对象；
        //      数组中每一个元素都是一个包含属性 id、text、iconCls、checked、state、attributes、target 的 tree-node 对象。
        //      如果传入的参数 target 没有子节点，则返回一个包含 0 个元素的数组。
        //      如果传入的参数 target 不是一个 div.tree-node 或者其不包含在当前 easyui-tree 中，则返回 null。
        //  备注：该方法和 getChildren 的不同之处在于，getChildren 方法返回的是 target 下的所有子节点内容；
        getNearChildren: function (jq, target) { return getNearChildren(jq[0], target); },

        //  扩展 easyui-tree 的自定义方法；用于取消指定树节点的选择状态；该方法定义如下参数：
        //      target:  指定的表示 tree-node 的 jQuery 或 DOM 对象。
        //  返回值：返回表示当前 easyui-tree 组件的 jQuery 对象。
        unselect: function (jq, target) { return jq.each(function () { unselect(this, target); }); },

        //  扩展 easyui-tree 的自定义方法；请求远程服务器地址并加载数据，并将返回的数据设置为当前 easyui-tree 的节点数据集；该方法定义如下参数：
        //      param：表示要进行远程请求的方式，该参数可以定义为以下类型：
        //          String 类型值：表示作为远程数据请求的目标 url 地址；
        //          JSON-Object 类型值：表示发送至远程服务器的查询参数；
        //      如果未定义参数 param，则相当于直接执行不带参数 { id } 的 reload 方法(reload 方法的执行默认会将指定节点的 id 作为参数发送到远程服务器地址)。
        //  返回值：返回表示当前 easyui-tree 组件的 jQuery 对象。
        load: function (jq, param) { return jq.each(function () { remoteLoad(this, param); }); },

        //  扩展 easyui-tree 的自定义方法；设置指定节点的图标；该方法定义如下参数：
        //      param: JSON-Object 类型值，该对象包含如下属性定义：
        //          target: 表示要设置图标的 easyui-tree node HTML-DOM 对象；
        //          iconCls:表示要设置的节点样式；
        //  返回值：返回表示当前 easyui-tree 组件的 jQuery 对象。
        setIcon: function (jq, param) { return jq.each(function () { setNodeIcon(this, param); }); },

        //  扩展 easyui-tree 的自定义方法；设置指定节点的显示文本；该方法定义如下参数：
        //      param: JSON-Object 类型值，该对象包含如下属性定义：
        //          target: 表示要设置图标的 easyui-tree node HTML-DOM 对象；
        //          text  : 表示要设置的显示文本值；
        //  返回值：返回表示当前 easyui-tree 组件的 jQuery 对象。
        setText: function (jq, param) { return jq.each(function () { setNodeText(this, param); }); }
    };
    var defaults = $.fn.tree.extensions.defaults = {

        //  增加 easyui-tree 的自定义扩展属性；
        //      该属性表示当设定了属性 contextMenu 时，是否将双击数据行 onDblClick 事件的响应函数
        //      设置为 contextMenu 的第一个菜单项的点击响应函数，并将该菜单项的字体加粗；
        //  Boolean 类型值，默认为 true；
        //  备注：当设置了自定义属性 contextMenu 时候，该功能方有效。
        //      自动绑定的 onClick 的回调函数中将会调用 contextMenu 的第 "dblClickMenuIndex" 个菜单项的点击响应函数，但是回调函数中不能用到参数 e 和 menu。
        autoBindDblClick: true,

        //  增加 easyui-tree 的自定义扩展属性；
        //  该属性表示当设定了属性 autoBindDblClick: true，双击行数据触发的右键菜单项事件的索引号；
        //      意即触发第几个右键菜单项上的事件。
        //  Number 类型值，从 0 开始计数，默认为 0；
        //  备注：当设置了自定义属性 autoBindDblClick: true 时，该功能方有效；如果此索引值超出菜单数量范围，则无效。
        dblClickMenuIndex: 0,

        //  扩展 easyui-tree 的自定义属性，表示当前 easyui-tree 控件是否支持平滑数据格式。
        //  当支持平滑数据格式时，数据元素中不需要通过指定 children 来指定子节点，而是支持通过 pid 属性来指示其父级节点。
        //  Boolean 类型值，默认为 false。
        dataPlain: false,

        //  扩展 easyui-treegrid 的自定义属性，表示当前 easyui-treeg 控件支持平滑数据格式时，程序用哪个 field 表示当前行数据的父级节点 idField 值
        //  String 类型值，默认为 "pid"。
        parentField: "pid",

        //  扩展 easyui-tree 的自定义属性，表示当右键点击 tree-node 时，是否自动选择被点击的 tree-node 对象；
        //  Boolean 类型值，默认为 false；
        selectOnContextMenu: false,

        //  扩展 easyui-tree 的自定义属性，表示当左键点击带有子节点的条目时，是否自动展开/折叠相应节点。
        //  Boolean 类型，默认为 false。
        //  备注：该功能不会影响到 easyui-tree 的原生事件 onClick。
        toggleOnClick: false,

        //  扩展 easyui-tree 的自定义属性，表示同一级菜单节点下，只允许一个节点被展开。
        //  Boolean 类型，默认为 false。
        //  当该属性设置为 true 时，建议同时把 animate 属性设置为 false，以免影响菜单联动折叠时的美观效果。
        onlyNodeExpand: false,

        //  扩展 easyui-tree 的自定义属性，表示是否启用当前 easyui-tree 组件的右键菜单。
        //  Boolean 类型，默认为 true。
        //  备注：该功能不会影响到 easyui-tree 的原生事件 onContextMenu。
        enableContextMenu: true,

        //  扩展 easyui-tree 的自定义属性，表示当前 easyui-tree 的右键菜单；
        //  这是一个数组类型，数组中的每一个元素都是一个 JSON-Object，该 JSON-Object 定义如下属性：
        //      id:         表示菜单项的 id；
        //      text:       表示菜单项的显示文本；
        //      iconCls:    表示菜单项的左侧显示图标；
        //      disabled:   表示菜单项是否被禁用(禁用的菜单项点击无效)；
        //      hideOnClick:    表示该菜单项点击后整个右键菜单是否立即自动隐藏；
        //      bold:           Boolean 类型值，默认为 false；表示该菜单项是否字体加粗；
        //      style:          JSON-Object 类型值，默认为 null；表示要附加到该菜单项的样式；
        //      handler:    表示菜单项的点击事件，该事件函数格式为 function(e, node, tree, item, menu)，其中 this 指向菜单项本身
        //  备注：当 enableContextMenu 属性设置为 true 时，该属性才有效。
        //  备注：该功能不会影响到 easyui-tree 的原生事件 onContextMenu。
        contextMenu: null,

        //  扩展 easyui-tree 的自定义属性，表示是否启用右键菜单中的“展开当前、折叠当前、展开当前所有、折叠当前所有”菜单项的功能；
        //  该属性可以定义为以下类型：
        //      Boolean 类型，表示是否启用这四个菜单项；
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          expand:     布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“展开当前”菜单；
        //          expandAll:  布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“展开当前所有”菜单；
        //          collapse:   布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“折叠当前”菜单；
        //          collapseAll: 布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“折叠当前所有”菜单；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //          上面四个属性，如果参数的值为函数，则函数的签名为 function(e, node, tree, item, menu)。
        //  备注：当 enableContextMenu 属性设置为 true 时，该属性才有效。
        //      这四个菜单点击时，会自动触发 easyui-tree 的折叠/展开菜单项的相应事件。
        toggleMenu: true,

        //  扩展 easyui-tree 的自定义属性，表示是否启用右键菜单中的“上移、下移、上移一级、下移一级”菜单项的功能；
        //  备注：当 enableContextMenu 属性设置为 true 时，该属性才有效。
        //  该属性可以定义为以下类型：
        //      Boolean 类型，表示是否启用这四个菜单项，默认为 false；
        //      JSON-Object 类型，该 JSON-Object 可以包含如下属性：
        //          up:         布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“上移”菜单；
        //          upLevel:    布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“上移一级”菜单；
        //          down:       布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“下移”菜单；
        //          downLevel:  布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“下移一级”菜单；
        //          submenu:    表示这四个菜单项是否以子菜单方式呈现，默认为 true；
        //          上面四个属性，如果参数的值为函数，则函数的签名为 function(e, node, tree, item, menu)。
        //      这四个菜单点击时，会自动触发 easyui-tree 的 onDrop 事件。
        moveMenu: false,

        //  扩展 easyui-tree 的自定义属性，该属性表示在启用右键菜单的情况下，右键菜单项中是否显示 "显示 Tree 的 Option" 菜单项
        //  Boolean 类型值；默认为 false。
        showOption: false,

        //  表示当执行远程请求获取数据时，被一并发送到服务器的查询参数，参考 easyui-datagrid 中的 queryParams 属性定义；
        //  这是一个 JSON-Object 类型参数对象，其中每一个属性的值可以是值类型，也可以是返回值的函数。
        queryParams: {},

        //  覆盖 easyui-tree 的原生属性 loader，以支持相应扩展功能。
        loader: loader,

        //  覆盖 easyui-tree 的原生属性 loadFilter，以支持相应扩展功能(支持平滑数据格式)。
        loadFilter: loadFilter,

        //  覆盖 easyui-tree 的原生事件 onExpand，以支持相应扩展功能。
        onExpand: onExpand
    };

    $.extend($.fn.tree.defaults, defaults);
    $.extend($.fn.tree.methods, methods);

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.combotree.js" />
/**
* jQuery EasyUI combotree Extensions 1.0 beta
* jQuery EasyUI combotree 组件扩展
* jeasyui.extensions.combotree.js

* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   3、jeasyui.extensions.combo.js v1.0 beta late
*   5、jeasyui.extensions.tree.js v1.0 beta late
*/
(function ($, undefined) {

    $.fn.combotree.extensions = {};


    var methods = $.fn.combotree.extensions.methods = {};
    var defaults = $.fn.combotree.extensions.defaults = $.extend({}, $.fn.tree.extensions.defaults, {

        //  更改继承于 easyui-tree 的自定义属性 toggleOnClick 的默认值，使得 easyui-combotree 中 tree 组件的页节点在点击后不自动展开/折叠子节点；
        //  Boolean 类型，默认为 false。
        toggleOnClick: true,

        //同节点只打开一个
        onlyNodeExpand: true,

        //  更改继承于 easyui-tree 的自定义属性 autoBindDblClick 的默认值，使得 easyui-combotree 中 tree 组件的页节点在双击后不触发第一个右键菜单项的事件；
        //  Boolean 类型，默认为 false。
        autoBindDblClick: false,


        onExpand: function () {
            $.fn.tree.extensions.defaults.onExpand.apply($(this).combotree("tree")[0], arguments);
        }
    });

    $.extend($.fn.combotree.defaults, defaults);
    $.extend($.fn.combotree.methods, methods);

})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.tabs.js" />
/**
* jQuery EasyUI tabs Extensions 1.0 beta
* jQuery EasyUI tabs 组件扩展
* jeasyui.extensions.tabs.js
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.panel.js v1.0 beta late
*   5、jeasyui.extensions.window.js v1.0 beta late
*   6、jeasyui.extensions.dialog.js v1.0 beta late
*/
(function ($, undefined) {


    $.fn.tabs.extensions = {};


    function initTabsPanelPaddingTopLine(target) {
        var t = $(target), opts = $.data(target, "tabs").options, position = opts.tabPosition;
        if ($.isNumeric(opts.lineHeight) && opts.lineHeight > 0) {
            if (!$.array.contains(["top", "bottom", "left", "right"], position)) { position = "top"; }
            t.children("div.tabs-panels").css("padding-" + position, opts.lineHeight.toString() + "px").children().children().css("border-" + position + "-width", "1px");
        }
    };


    var _onContextMenu = $.fn.tabs.defaults.onContextMenu;
    var onContextMenu = function (e, title, index) {
        if ($.isFunction(_onContextMenu)) { _onContextMenu.apply(this, arguments); }
        var t = $(this), opts = t.tabs("options");
        if (opts.enableConextMenu) {
            e.preventDefault();
            var panel = t.tabs("getTab", index),
                panelOpts = panel.panel("options"),
                leftTabs = t.tabs("leftClosableTabs", index),
                rightTabs = t.tabs("rightClosableTabs", index),
                otherTabs = t.tabs("otherClosableTabs", index),
                allTabs = t.tabs("closableTabs"),
                selected = t.tabs("isSelected", index),
                m0 = {
                    text: '在新页面中打开', iconCls: 'icon-standard-shape-move-forwards', disabled: panelOpts.href && panelOpts.iniframe ? false : true,
                    handler: function () { t.tabs("jumpTab", index); }
                },
                m1 = {
                    text: "显示 Option", iconCls: "icon-standard-application-form", disabled: opts.showOption ? false : true, children: [
                        { text: "选项卡组 Option", iconCls: "icon-standard-tab-go", handler: function () { t.tabs("showOption"); } },
                        { text: "该选项卡 Option", iconCls: "icon-standard-tab", handler: function () { t.tabs("showOption", index); } }
                    ]
                },
                m2 = {
                    text: "关闭选项卡", iconCls: "icon-standard-application-form-delete", disabled: panelOpts.closable ? false : true,
                    handler: function () { t.tabs("closeClosable", index); }
                },
                m3 = {
                    text: "关闭其他选项卡", iconCls: "icon-standard-cancel", disabled: otherTabs.length ? false : true,
                    handler: function () { t.tabs("closeOtherClosable", index); }
                },
                m4 = {
                    text: "刷新选项卡", iconCls: "icon-standard-table-refresh", disabled: panelOpts.refreshable && panelOpts.href ? false : true,
                    handler: function () { t.tabs("refresh", index); }
                },
                m5 = {
                    text: "关闭左侧选项卡", iconCls: "icon-standard-tab-close-left", disabled: leftTabs.length ? false : true,
                    handler: function () { t.tabs("closeLeftClosable", index); }
                },
                m6 = {
                    text: "关闭右侧选项卡", iconCls: "icon-standard-tab-close-right", disabled: rightTabs.length ? false : true,
                    handler: function () { t.tabs("closeRightClosable", index); }
                },
                m7 = {
                    text: "关闭所有选项卡", iconCls: "icon-standard-cross", disabled: allTabs.length ? false : true,
                    handler: function () { t.tabs("closeAllClosable"); }
                },
                m8 = {
                    text: "新建选项卡", iconCls: "icon-standard-tab-add", disabled: opts.enableNewTabMenu ? false : true,
                    handler: function () { t.tabs("newTab", index); }
                },
                m9 = {
                    text: "重复选项卡", iconCls: "icon-standard-control-repeat", disabled: panelOpts.repeatable ? false : true,
                    handler: function () { t.tabs("repeat", index); }
                };
            var items = [];
            if ($.array.likeArray(opts.contextMenu) && !$.util.isString(opts.contextMenu)) { $.array.merge(items, opts.contextMenu); }
            if (opts.enableJumpTabMenu) { $.array.merge(items, "-", m0); }
            if (opts.showOption) { $.array.merge(items, "-", m1); }
            $.array.merge(items, panelOpts.closable ? ["-", m2, m3] : ["-", m3]);
            if (panelOpts.refreshable) { $.array.merge(items, "-", m4); }
            $.array.merge(items, "-", m5, m6, m7);
            if (panelOpts.repeatable || opts.enableNewTabMenu) {
                var mm = [];
                if (opts.enableNewTabMenu) { mm.push(m8); }
                if (panelOpts.repeatable) { mm.push(m9); }
                $.array.merge(items, "-", mm);
            }
            items = parseContextMenuMap(e, title, index, items, t);
            if (items[0] == "-") { $.array.removeAt(items, 0); }
            $.easyui.showMenu({ left: e.pageX, top: e.pageY, items: items });
        }
    };
    function parseContextMenuMap(e, title, index, menus, tabs) {
        return $.array.map(menus, function (value) {
            if (!value || $.util.isString(value)) { return value; }
            var ret = $.extend({}, value);
            ret.id = $.isFunction(value.id) ? value.id.call(ret, e, title, index, tabs) : value.id;
            ret.text = $.isFunction(value.text) ? value.text.call(ret, e, title, index, tabs) : value.text;
            ret.iconCls = $.isFunction(value.iconCls) ? value.iconCls.call(ret, e, title, index, tabs) : value.iconCls;
            ret.disabled = $.isFunction(value.disabled) ? value.disabled.call(ret, e, title, index, tabs) : value.disabled;
            ret.hideOnClick = $.isFunction(value.hideOnClick) ? value.hideOnClick.call(ret, e, title, index, tabs) : value.hideOnClick;
            ret.onclick = $.isFunction(value.onclick) ? function (e, item, menu) { value.onclick.call(this, e, title, index, tabs, item, menu); } : value.onclick;
            ret.handler = $.isFunction(value.handler) ? function (e, item, menu) { value.handler.call(this, e, title, index, tabs, item, menu); } : value.handler;
            if (ret.children && ret.children.length) { ret.children = parseContextMenuMap(e, title, index, ret.children, tabs); }
            return ret;
        });
    };


    var _updateTab = $.fn.tabs.methods.update;
    function updateTab(target, param) {
        param = $.extend({ tab: null, options: null }, param);
        var tabs = $(target), opts = $.data(target, "tabs").options,
            index = tabs.tabs("getTabIndex", param.tab),
            panelOpts = $.union({}, param.options, $.fn.tabs.extensions.panelOptions),
            tools = panelOpts.tools,
            onLoad = panelOpts.onLoad, onError = panelOpts.onError,
            updateProgress = $.array.contains(["mask", "progress", "none"], opts.updateProgress) ? opts.updateProgress : "mask",
            loading = function () {
                if (updateProgress == "mask") {
                    $.easyui.loading({ topMost: true, msg: panelOpts.loadingMessage });
                } else if (updateProgress == "progress") {
                    $.easyui.messager.progress({ title: "操作提醒", msg: panelOpts.loadingMessage, interval: 100 });
                }
            },
            loaded = function () {
                if (updateProgress == "mask") {
                    $.easyui.loaded({ topMost: true });
                } else if (updateProgress == "progress") {
                    $.easyui.messager.progress("close");
                }
            },
            refreshButton = {
                iconCls: "icon-mini-refresh", handler: function () {
                    var title = $(this).parent().prev().find("span.tabs-title").text();
                    if (title) { $.util.exec(function () { tabs.tabs("refresh", title); }); }
                }
            };
        if (panelOpts.refreshable) {
            if ($.util.likeArrayNotString(panelOpts.tools)) {
                panelOpts.tools = $.array.merge([], panelOpts.tools, refreshButton);
            } else {
                panelOpts.tools = [refreshButton];
            }
        }
        if (updateProgress != "none" && !$.string.isNullOrWhiteSpace(panelOpts.href) && (panelOpts.selected || tabs.tabs("getSelected") == param.tab)) {
            loading();
            panelOpts.onLoad = function () {
                if ($.isFunction(onLoad)) { onLoad.apply(this, arguments); }
                $.util.exec(loaded);
                $(this).panel("options").onLoad = onLoad;
            };
            panelOpts.onError = function () {
                if ($.isFunction(onError)) { onError.apply(this, arguments); }
                $.util.exec(loaded);
                $(this).panel("options").onError = onError;
            };
        }
        var ret = _updateTab.call(tabs, tabs, { tab: param.tab, options: panelOpts });
        var tab = tabs.tabs("getTab", index);
        panelOpts = tab.panel("options");
        panelOpts.tools = tools;
        initTabsPanelPaddingTopLine(target);
        if (panelOpts.closeOnDblClick && panelOpts.closable) {
            tabs.find(">div.tabs-header>div.tabs-wrap>ul.tabs>li").eq(index).off("dblclick.closeOnDblClick").on("dblclick.closeOnDblClick", function () {
                tabs.tabs("close", panelOpts.title);
            }).attr("title", "双击此选项卡标题可以将其关闭");
        }
        return ret;
    };

    function refreshTab(target, which) {
        var tabs = $(target), opts = tabs.tabs("options"),
            panel = tabs.tabs("getTab", which), panelOpts = panel.panel("options"),
            index = tabs.tabs("getTabIndex", panel);
        if ($.string.isNullOrWhiteSpace(panelOpts.href) && $.string.isNullOrWhiteSpace(panelOpts.content)) { return; }
        tabs.tabs("update", { tab: panel, options: panelOpts });
        if ($.isFunction(opts.onRefresh)) { opts.onRefresh.call(target, opts.title, index); }
    };

    function isSelected(target, which) {
        var tabs = $(target), selected = tabs.tabs("getSelected"), index = tabs.tabs("getTabIndex", selected);
        var thisTab = tabs.tabs("getTab", which), thisIndex = tabs.tabs("getTabIndex", thisTab);
        return thisIndex == index;
    };

    function isClosable(target, which) {
        var tabs = $(target), panel = tabs.tabs("getTab", which), panelOpts = panel.panel("options");
        return panelOpts.closable;
    };

    function newTab(target, which) {
        var content = $("<table></table>").css({ width: "95%", height: "100%" }),
            txtTitle = $("<input type='text' style='width: 98%;'/>"),
            txtHref = $("<input type='text' style='width: 98%;'/>"),
            ckRefreshable = $("<input id='refreshable' type='checkbox' checked='true' />"),
            ckIniframe = $("<input id='iniframe' type='checkbox' />"),
            lblRefreshable = $("<label>是否可刷新</label>"),
            lblIniframe = $("<label>是否嵌至 IFRAME(浏览器内部窗体) 中</label>");

        var tr1 = $("<tr></tr>").append("<td width='24%' align='right'>选项卡标题：</td>").appendTo(content);
        var tr2 = $("<tr></tr>").append("<td width='24%' align='right'>路径(href)：</td>").appendTo(content);
        var tr3 = $("<tr></tr>").appendTo(content);
        $("<td></td>").append(txtTitle).appendTo(tr1);
        $("<td></td>").append(txtHref).appendTo(tr2);
        $("<td width='24%' align='right'></td>").append(ckRefreshable).append(lblRefreshable).appendTo(tr3);
        $("<td align='right'></td>").append(ckIniframe).append(lblIniframe).appendTo(tr3);

        which = which || 0;
        var tabs = $(target),
            index = $.isNumeric(which) ? which : tabs.tabs("getTabIndex", tabs.tabs("getTab", which)),
            header = tabs.find(">div.tabs-header>div.tabs-wrap>ul.tabs>li:eq(" + index + ")"),
            offset = header.offset(), position = $.extend({}, { left: offset.left + 10, top: offset.top + 10 });
        var dialogOptions = $.extend({
            iconCls: "icon-standard-application-form",
            title: "新建选项卡 - 设置参数",
            width: 400,
            height: 165,
            maximizable: false,
            resizable: false,
            autoVCenter: false,
            autoHCenter: false,
            enableSaveButton: false,
            topMost: false,
            applyButtonIndex: 1,
            applyButtonText: "打开",
            onApply: function (dia) {
                var title = txtTitle.val(), href = txtHref.val();
                href = href || $.fn.tabs.extensions.panelOptions.href;
                if ($.string.isNullOrWhiteSpace(title)) { title = "新建选项卡"; }
                var i = 0; while (tabs.tabs("getTab", title = title + (i ? i : ""))) { i++; }
                if ($.string.isNullOrWhiteSpace(href)) { $.easyui.messager.show("操作提醒", "请输入要创建的选项卡的路径！", "info"); txtHref.focus(); return; }
                var iniframe = ckIniframe.prop("checked"), refreshable = ckRefreshable.prop("checked");
                tabs.tabs("add", { title: title, href: href, refreshable: refreshable, closable: true, iniframe: iniframe });
                dia.dialog("close");
            },
            content: content
        }, position);
        var dia = $.easyui.showDialog(dialogOptions);
        $.util.exec(function () {
            var enter = dia.find(">div.dialog-button>a:first");
            txtTitle.keydown(function (e) { if (e.which == 13) { txtHref.focus(); } });
            txtHref.keydown(function (e) { if (e.which == 13) { ckRefreshable.focus(); } });
            ckRefreshable.keydown(function (e) { if (e.which == 13) { ckIniframe.focus(); } });
            ckIniframe.keydown(function (e) { if (e.which == 13) { enter.focus(); } });
            lblRefreshable.click(function () { ckRefreshable.click(); });
            lblIniframe.click(function () { ckIniframe.click(); });
            enter.focus();
            txtTitle.focus();
        });
    };

    function repeatTab(target, which) {
        var tabs = $(target), panel = tabs.tabs("getTab", which), panelOpts = panel.panel("options");
        var opts = $.extend({}, panelOpts, { selected: true, closable: true }), i = 2, title = opts.title;
        while (tabs.tabs("getTab", opts.title = title + "-" + i.toString())) { i++; }
        tabs.tabs("add", opts);
    };

    function getTabOption(target, which) {
        var t = $(target), tab = t.tabs("getTab", which), tabOpts = tab.panel("options");
        return tabOpts;
    };

    function getSelectedOption(target) {
        var t = $(target), tab = t.tabs("getSelected"), tabOpts = tab.panel("options");
        return tabOpts;
    };

    function getSelectedIndex(target) {
        var t = $(target), tab = t.tabs("getSelected"), index = t.tabs("getTabIndex", tab);
        return index;
    };

    function getSelectedTitle(target) {
        var t = $(target), tabOpts = t.tabs("getSelectedOption"), title = tabOpts.title;
        return title;
    };

    function leftTabs(target, which) {
        var tabs = $(target), index = $.isNumeric(which) ? which : tabs.tabs("getTabIndex", tabs.tabs("getTab", which)),
            panels = tabs.tabs("tabs");
        return $.array.range(panels, 0, index);
    };

    function rightTabs(target, which) {
        var tabs = $(target), index = $.isNumeric(which) ? which : tabs.tabs("getTabIndex", tabs.tabs("getTab", which)),
            panels = tabs.tabs("tabs");
        return $.array.range(panels, index + 1);
    };

    function otherTabs(target, which) {
        var tabs = $(target), index = $.isNumeric(which) ? which : tabs.tabs("getTabIndex", tabs.tabs("getTab", which)),
            panels = tabs.tabs("tabs");
        return $.array.merge($.array.range(panels, 0, index), $.array.range(panels, index + 1));
    };

    function closableFinder(val) {
        if ($.util.isJqueryObject(val) && val.length) {
            var state = $.data(val[0], "panel");
            return state && state.options && state.options.closable;
        } else { return false; }
    };

    function closableTabs(target) {
        var tabs = $(target), panels = tabs.tabs("tabs");
        return $.array.filter(panels, closableFinder);
    };

    function leftClosableTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("leftTabs", which);
        return $.array.filter(panels, closableFinder);
    };

    function rightClosableTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("rightTabs", which);
        return $.array.filter(panels, closableFinder);
    };

    function otherClosableTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("otherTabs", which);
        return $.array.filter(panels, closableFinder);
    };

    function closeLeftTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("leftTabs", which);
        $.each(panels, function () { tabs.tabs("close", tabs.tabs("getTabIndex", this)); });
    };

    function closeRightTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("rightTabs", which);
        $.each(panels, function () { tabs.tabs("close", tabs.tabs("getTabIndex", this)); });
    };

    function closeOtherTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("otherTabs", which);
        $.each(panels, function () { tabs.tabs("close", tabs.tabs("getTabIndex", this)); });
    };

    function closeAllTabs(target) {
        var tabs = $(target), panels = tabs.tabs("tabs");
        $.each($.array.clone(panels), function () { tabs.tabs("close", tabs.tabs("getTabIndex", this)); });
    };

    function closeClosableTab(target, which) {
        var tabs = $(target), panel = tabs.tabs("getTab", which);
        if (panel && panel.panel("options").closable) {
            var index = $.isNumeric(which) ? which : tabs.tabs("getTabIndex", panel);
            tabs.tabs("close", index);
        }
    };

    function closeLeftClosableTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("leftClosableTabs", which);
        $.each($.array.clone(panels), function () { tabs.tabs("close", tabs.tabs("getTabIndex", this)); });
    };

    function closeRightClosableTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("rightClosableTabs", which);
        $.each($.array.clone(panels), function () { tabs.tabs("close", tabs.tabs("getTabIndex", this)); });
    };

    function closeOtherClosableTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("otherClosableTabs", which);
        $.each($.array.clone(panels), function () { tabs.tabs("close", tabs.tabs("getTabIndex", this)); });
    };

    function closeAllClosableTabs(target, which) {
        var tabs = $(target), panels = tabs.tabs("closableTabs", which);
        $.each($.array.clone(panels), function () { tabs.tabs("close", tabs.tabs("getTabIndex", this)); });
    };

    function showOption(target, which) {
        var t = $(target), opts, pos;
        if (which != null && which != undefined) {
            var p = t.tabs("getTab", which);
            opts = p.panel("options");
            pos = p.panel("header").offset();
        } else {
            opts = t.tabs("options");
            pos = t.offset();
        }
        $.extend(pos, { left: pos.left + 25, top: pos.top + 15 });
        $.easyui.showOption(opts, pos);
    };

    function moveTab(tabTarget, param) {
        if (!param || param.source == undefined || param.target == undefined || !param.point) { return; }
        var source = param.source, target = param.target,
            point = $.array.contains(["before", "after"], param.point) ? param.point : "before",
            t = $(tabTarget), tabs = t.tabs("tabs"),
            sourcePanel = t.tabs("getTab", source), targetPanel = t.tabs("getTab", target),
            sourceIndex = t.tabs("getTabIndex", sourcePanel),
            sourceHeader = sourcePanel.panel("header"), targetHeader = targetPanel.panel("header");
        if (!sourcePanel || !targetPanel) { return; }

        $.array.removeAt(tabs, sourceIndex);
        var targetIndex = $.array.indexOf(tabs, targetPanel);
        $.array.insert(tabs, point == "before" ? targetIndex : targetIndex + 1, sourcePanel);

        sourcePanel = sourcePanel.panel("panel"); targetPanel = targetPanel.panel("panel");
        targetPanel[point](sourcePanel); targetHeader[point](sourceHeader);
    };

    function insertTab(tabTarget, options) {
        var target = options.target, t = $(tabTarget);
        options.target = undefined;
        t.tabs("add", options);
        var tabs = t.tabs("tabs");
        t.tabs("move", { source: tabs.length - 1, target: target, point: "before" });
    };

    function setTitle(target, param) {
        if (!param || !(param.which || $.isNumeric(param.which)) || !param.title) { return; }
        var t = $(target), tab = t.tabs("getTab", param.which);
        tab.panel("setTitle", param.title);
    };

    function jumpTab(target, which) {
        var t = $(target),
            tab = (which == null || which == undefined) ? t.tabs("getSelected") : t.tabs("getTab", which),
            opts = tab.panel("options");
        if (opts.href && opts.iniframe) {
            window.open(opts.href, "_blank");
        } else {
            $.easyui.messager.show("\"" + opts.title + "\" 选项卡不可在新页面中打开。");
        }
    };

    var panelOptions = $.fn.tabs.extensions.panelOptions = $.extend({}, $.fn.panel.defaults, {

        //  该选项卡的 href 是否在 iframe 中打开。
        iniframe: false,

        //  该选项卡是否具有重复打开功能
        repeatable: false,

        //  该选项卡是否具有刷新功能。
        refreshable: true,

        //  双击选项卡标题是否能将其关闭，当该选项卡 closable: true 时，该属性有效。
        closeOnDblClick: true,

        href: null,

        iconCls: "icon-standard-application-form"
    });
    var methods = $.fn.tabs.extensions.methods = {
        //  覆盖 easyui-tabs 的原生方法 update，以支持扩展的功能；
        update: function (jq, param) { return jq.each(function () { updateTab(this, param); }); },

        //  刷新指定的选项卡；该方法定义如下参数：
        //      which:  表示被刷新的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        refresh: function (jq, which) { return jq.each(function () { refreshTab(this, which); }); },

        //  判断指定的选项卡是否被选中；该方法定义如下参数：
        //      which:  要判断的选项卡的 索引号 或者 标题。
        //  返回值：如果指定的选项卡被选中，则返回 true，否则返回 false。
        isSelected: function (jq, which) { return isSelected(jq[0], which); },

        //  判断指定的选项卡是否可关闭(closable:true)；该方法定义如下参数：
        //      which:  要判断的选项卡的 索引号 或者 标题。
        //  返回值：如果指定的选项卡可被关闭(closable:true)，则返回 true，否则返回 false。
        isClosable: function (jq, which) { return isClosable(jq[0], which); },

        //  弹出一个 easyui-dialog，可以在该 dialog 中输入参数以在当前选项卡组件中创建一个新的选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题，可选，默认为 0；该参数用于指示弹出的 easyui-dialog 出现的位置。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        newTab: function (jq, which) { return jq.each(function () { newTab(this, which); }); },

        //  创建一个和指定选项卡相同内容的新选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        repeat: function (jq, which) { return jq.each(function () { repeatTab(this, which); }); },

        //  获取指定选项卡的属性值集合(option)；
        getTabOption: function (jq, which) { return getTabOption(jq[0], which); },

        //  获取当前选中的选项卡的属性值集合 (option)；
        getSelectedOption: function (jq) { return getSelectedOption(jq[0]); },

        //  获取当前选中的选项卡的索引号；
        getSelectedIndex: function (jq) { return getSelectedIndex(jq[0]); },

        //  获取当前选中的选项卡的标题。
        getSelectedTitle: function (jq) { return getSelectedTitle(jq[0]); },

        //  获取指定选项卡的左侧所有选项卡元素；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回一个数组，数组中的每一项都是一个表示选项卡页的 panel(jQuery) 对象；
        //      如果指定选项卡左侧没有其他选项卡，则返回一个空数组。
        leftTabs: function (jq, which) { return leftTabs(jq[0], which); },

        //  获取指定选项卡的右侧所有选项卡元素；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回一个数组，数组中的每一项都是一个表示选项卡页的 panel(jQuery) 对象；
        //      如果指定选项卡右侧没有其他选项卡，则返回一个空数组。
        rightTabs: function (jq, which) { return rightTabs(jq[0], which); },

        //  获取当前选项卡控件中除指定选项卡页在的其他所有选项卡元素；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回一个数组，数组中的每一项都是一个表示选项卡页的 panel(jQuery) 对象；
        //      如果当前选项卡控件除指定的选项卡页外没有其他选项卡，则返回一个空数组。
        otherTabs: function (jq, which) { return otherTabs(jq[0], which); },

        //  获取所有可关闭的选项卡页元素集合；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回一个数组，数组中的每一项都是一个表示选项卡页的 panel(jQuery) 对象；
        //      如果没有可关闭的选项卡，则返回一个空数组。
        closableTabs: function (jq) { return closableTabs(jq[0]); },

        //  获取指定选项卡左侧的所有可关闭的选项卡元素；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回一个数组，数组中的每一项都是一个表示选项卡页的 panel(jQuery) 对象；
        //      如果指定选项卡左侧没有可关闭的选项卡，则返回一个空数组。
        leftClosableTabs: function (jq, which) { return leftClosableTabs(jq[0], which); },

        //  获取指定选项卡右侧的所有可关闭的选项卡元素；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回一个数组，数组中的每一项都是一个表示选项卡页的 panel(jQuery) 对象；
        //      如果指定选项卡右侧没有可关闭的选项卡，则返回一个空数组。
        rightClosableTabs: function (jq, which) { return rightClosableTabs(jq[0], which); },

        //  获取当前选项卡控件中除指定选项卡页在的其他所有可关闭的选项卡元素；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回一个数组，数组中的每一项都是一个表示选项卡页的 panel(jQuery) 对象；
        //      如果当前选项卡控件除指定的选项卡页外没有其他可关闭的选项卡，则返回一个空数组。
        otherClosableTabs: function (jq, which) { return otherClosableTabs(jq[0], which); },

        //  关闭指定选项卡左侧的所有选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeLeft: function (jq, which) { return jq.each(function () { closeLeftTabs(this, which); }); },

        //  关闭指定选项卡右侧的所有选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeRight: function (jq, which) { return jq.each(function () { closeRightTabs(this, which); }); },

        //  关闭除指定选项卡外的其他所有选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeOther: function (jq, which) { return jq.each(function () { closeOtherTabs(this, which); }); },

        //  关闭所有选项卡；
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeAll: function (jq) { return jq.each(function () { closeAllTabs(this); }); },

        //  指定指定的选项卡，但是如果该选项卡不可被关闭(closable:false)，则不执行任何动作；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeClosable: function (jq, which) { return jq.each(function () { closeClosableTab(this, which); }); },

        //  指定指定的选项卡左侧的所有可关闭的选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeLeftClosable: function (jq, which) { return jq.each(function () { closeLeftClosableTabs(this, which); }); },

        //  指定指定的选项卡右侧的所有可关闭的选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeRightClosable: function (jq, which) { return jq.each(function () { closeRightClosableTabs(this, which); }); },

        //  指定除指定选项卡外的所有可关闭的选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeOtherClosable: function (jq, which) { return jq.each(function () { closeOtherClosableTabs(this, which); }); },

        //  指定所有可关闭的选项卡；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        closeAllClosable: function (jq) { return jq.each(function () { closeAllClosableTabs(this); }); },

        //  以 easyui-dialog 的方式弹出一个 dialog 对话框窗体，该窗体中显示指定选项卡的所有属性值(options)；该方法定义如下参数：
        //      which:  指定的选项卡的 索引号 或者 标题。该参数可选；如果不定义该参数，则显示选项卡组的 options 信息。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        showOption: function (jq, which) { return jq.each(function () { showOption(this, which); }); },

        //  将指定的 easyui-tabs tab-panel 选项卡页移动至另一位置；该方法定义如下参数：
        //      param:  这是一个 JSON-Object 对象，该对象定义如下属性：
        //          source: Integer 或 String 类型值，表示要移动的 tab-panel 的索引号或者标题 title 值；
        //          target: Integer 或 String 类型值，表示移动目标位置的 tab-panel 的索引号或者标题 title 值；
        //          point:  移动到目标位置的方式，String 类型值，仅限于定义为如下值：
        //              "before":   表示把 source 选项卡移动至 target 选项卡的前面，默认值；
        //              "after":    表示把 source 选项卡移动至 target 选项卡的后面；
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        move: function (jq, param) { return jq.each(function () { moveTab(this, param); }); },

        //  在当前 easyui-tabs 组件上创建一个新的选项卡，并将其移动至指定选项卡的前一格位置；该方法定义如下参数：
        //      options:  表示要创建的新选项卡的属性；是一个 JSON-Object 对象；
        //          该对象的各项属性参考 easyui-tabs 中 add 方法的参数 options，并在此基础上增加了如下属性：
        //          target: Integer 或 String 类型值，表示移动位置的 tab-panel 的索引号或者标题 title 值；
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        insert: function (jq, options) { return jq.each(function () { insertTab(this, options); }); },

        //  重设指定选项卡的标题名；该方法定义如下参数：
        //      param:  这是一个 JSON-Object 对象，该对象定义如下属性：
        //          which: 需要重设标题名的选项卡的 索引号(index) 或者原标题名(title)；
        //          title: 新的标题名；
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        setTitle: function (jq, param) { return jq.each(function () { setTitle(this, param); }); },

        //  将执行的选项卡在新页面中打开；该方法定义如下参数：
        //      which:  可选值参数；表示需要在新页面打开的的选项卡的 索引号(index) 或者原标题名(title)；如果未传入该参数，则对当前选中的选项卡进行操作。
        //  返回值：返回当前选项卡控件 easyui-tabs 的 jQuery 对象。
        jumpTab: function (jq, which) { return jq.each(function () { jumpTab(this, which); }); }
    };
    var defaults = $.fn.tabs.extensions.defaults = {
        //  增加 easyui-tabs 的自定义扩展属性，该属性表示当前选项卡标题栏和选项卡的 pane-body 之间的空白区域高(宽)度(px)；
        //  该参数是一个 Number 数值，默认为 2.
        lineHeight: 2,

        //  是否启用点击选项卡头的右键菜单。
        enableConextMenu: true,

        //  是否启用 “创建新选项卡” 的右键菜单。
        enableNewTabMenu: false,

        //  是否启用 "在新页面中打开" 选项卡的右键菜单。
        enableJumpTabMenu: false,

        //  定义 easyui-tabs 的 onRefresh 事件，当调用 easyui-tabs 的 refresh 方法后，将触发该事件。
        onRefresh: function (title, index) { },

        //  定义当 enableContextMenu 为 true 时，右键点击选项卡标题时候弹出的自定义右键菜单项内容；
        //  这是一个数组格式对象，数组中的每一项都是一个 menu-item 元素；该 menu-item 元素格式定义如下：
        //      id:         表示菜单项的 id；
        //      text:       表示菜单项的显示文本；
        //      iconCls:    表示菜单项的左侧显示图标；
        //      disabled:   表示菜单项是否被禁用(禁用的菜单项点击无效)；
        //      hideOnClick:    表示该菜单项点击后整个右键菜单是否立即自动隐藏；
        //      bold:           Boolean 类型值，默认为 false；表示该菜单项是否字体加粗；
        //      style:          JSON-Object 类型值，默认为 null；表示要附加到该菜单项的样式；
        //      handler:    表示菜单项的点击事件，该事件函数格式为 function(e, title, index, tabs, item, menu)，其中 this 指向菜单项本身
        contextMenu: null,

        //  覆盖 easyui-tabs 的原生事件属性 onContextMenu，以支持相应扩展功能。
        onContextMenu: onContextMenu,

        //  增加 easyui-tabs 的自定义扩展属性；该属性表示当右键点击选项卡头时，是否显示 "显示该选项卡的 option" 菜单项。
        //  Boolean 类型值，默认为 false。
        showOption: false,

        //  增加 easyui-tabs 的自定义扩展属性；该属性表示或者更新选项卡时，显示的遮蔽层进度条类型。
        //  String 类型值，可选的值限定范围如下：
        //      "mask": 表示遮蔽层 mask-loading 进度显示，默认值
        //      "progress": 表示调用 $.messager.progress 进行进度条效果显示
        //      "none": 表示不显示遮蔽层和进度条
        updateProgress: "mask"
    };

    $.extend($.fn.tabs.defaults, defaults);
    $.extend($.fn.tabs.methods, methods);




    function closeCurrentTab(target, iniframe) {
        iniframe = iniframe && !$.util.isUtilTop ? true : false;
        var current = $(target),
            currentTabs = current.currentTabs(),
            index;
        if (!iniframe && currentTabs.length) {
            index = current.currentTabIndex();
            if (index > -1) { currentTabs.tabs("close", index); }
        } else {
            var jq = $.util.parent.$;
            current = jq($.util.currentFrame);
            currentTabs = current.currentTabs();
            if (currentTabs.length) {
                index = current.currentTabIndex();
                if (index > -1) { currentTabs.tabs("close", index); }
            }
        }
    };

    function refreshCurrentTab(target, iniframe) {
        iniframe = iniframe && !$.util.isUtilTop ? true : false;
        var current = $(target),
            currentTabs = current.currentTabs(),
            index;
        if (!iniframe && currentTabs.length) {
            index = current.currentTabIndex();
            if (index > -1) { currentTabs.tabs("refresh", index); }
        } else {
            var jq = $.util.parent.$;
            current = jq($.util.currentFrame);
            currentTabs = current.currentTabs();
            if (currentTabs.length) {
                index = current.currentTabIndex();
                if (index > -1) { currentTabs.tabs("refresh", index); }
            }
        }
    };

    $.fn.extend({
        //  扩展 jQuery 对象的实例方法；用于关闭当前对象所在的 easyui-tabs 当前选项卡(支持当前选项卡页面为 iframe 加载的情况)。
        //  该方法定义如下参数：
        //      iniframe: Boolean 类型值，表示是否为关闭当前对象所在的父级页面的选项卡；默认为 false。
        //          如果当前页面为顶级页面，
        //          或者当前对象在 iframe 中但是不在当前iframe中的某个 easyui-tabs 内，则参数参数 inframe 无效。
        //  返回值：返回当前 jQuery 链式对象(实际上返回的 jQuery 对象中，所包含的元素已经被销毁，因为其容器 tab-panel 被关闭销毁了)。
        closeCurrentTab: function (iniframe) { return this.each(function () { closeCurrentTab(this, iniframe); }); },

        //  扩展 jQuery 对象的实例方法；用于刷新当前对象所在的 easyui-tabs 当前选项卡(支持当前选项卡页面为 iframe 加载的情况)。
        //  该方法定义如下参数：
        //      iniframe: Boolean 类型值，表示是否为刷新当前对象所在的父级页面的选项卡；默认为 false。
        //          如果当前页面为顶级页面，
        //          或者当前对象在 iframe 中但是不在当前iframe中的某个 easyui-tabs 内，则参数参数 inframe 无效。
        //  返回值：返回当前 jQuery 链式对象。
        refreshCurrentTab: function (iniframe) { return this.each(function () { refreshCurrentTab(this, iniframe); }); }
    });


})(jQuery);
///<jscompress sourcefile="jeasyui.extensions.theme.js" />
/**
jQuery EasyUI theme Extensions 1.0 beta
* jQuery EasyUI theme 组件扩展
* jeasyui.extensions.theme.js
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*/
(function ($) {

    $.util.namespace("$.easyui");

    //  获取或设置当前页面的 jQuery EasyUI 主题皮肤包；该函数定义如下参数：
    //      isTop: 可选参数；表示是否从当前窗口的顶级页面逐级向下依次设置所有页面包括iframe在内的皮肤包名称；
    //      themeName: 可选参数；表示被设置的皮肤包名称；
    //      callback: 可选参数；表示在设置完皮肤包名称后要执行的回调函数；该回调函数执行时依次定义如下参数：
    //          newTheme: 表示更改后的主题皮肤；
    //          oldTheme: 表示更改前的主题皮肤；
    //          上面两个参数 oldTheme、newTheme 都是一个格式如 { id, name, path } 的 JSON-Object，其可能的值参考 $.easyui.theme.dataSource 。
    //      thisArg: 可选参数；表示 callback 回调函数执行中的 this 引用；
    //  备注：如果该方法未传入任何参数；则获取当前页面的 jQuery EasyUI 主题皮肤名称并返回；
    $.easyui.theme = function (isTop, themeName, callback, thisArg) {
        if (arguments.length == 0) { return getTheme($); }
        if (arguments.length == 1 && typeof isTop == "boolean") {
            return isTop ? getTheme($.util.$) : getTheme($);
        } else {
            if (isTop === true) {
                return setTopTheme($.util.$, themeName, callback, thisArg);
            } else {
                return isTop === false ? setTheme($, themeName, callback, thisArg) : setTheme($, isTop, themeName, callback);
            }
        }
    };

    function getTheme(jq) {
        jq = jq || $;
        var link = jq("link[href$='easyui.css']"), href = link.attr("href"), array = href.split("/");
        return array.length > 1 ? array[array.length - 2] : array[array.length - 1];
    };

    function setTheme(jq, theme, callback, thisArg) {
        var oldTheme = getTheme(jq);
        if (oldTheme == theme) { return; }
        var link = jq("link[href$='easyui.css']"), href = link.attr("href"), array = href.split("/");
        if (arguments.length > 1) { array[array.length - 2] = theme; } else { jq.array.insert(array, 0, theme); }
        link.attr("href", array.join("/"));
        callbackFunc(callback, oldTheme, theme, thisArg);
    };

    function setTopTheme(jq, theme, callback, thisArg) {
        var oldTheme = getTheme(jq);
        setTheme(jq, theme);
        jq("iframe,iframe").each(function () {
            try {
                if (jq.util && jq.util.isWindow(this.contentWindow) && jq.util.isObject(this.contentWindow.document)
                    && jq.isFunction(this.contentWindow.$) && this.contentWindow.$.easyui && this.contentWindow.$.easyui.theme) {
                    setTopTheme(this.contentWindow.$, theme);
                }
            } catch (ex) { };
        });
        callbackFunc(callback, oldTheme, theme, thisArg);
    };

    function callbackFunc(callback, oldTheme, theme, thisArg) {
        if (!$.isFunction(callback)) { return; }
        var item1 = $.array.first($.easyui.theme.dataSource, function (val) { return val.path == oldTheme; }),
            item2 = $.array.first($.easyui.theme.dataSource, function (val) { return val.path == theme; });
        if (item1) { oldTheme = item1; }
        if (item2) { theme = item2; }
        $.util.exec(function () {
            callback.call(thisArg, theme, oldTheme);
        });
    };

    $.easyui.theme.dataSource = [
        { id: 1, name: "默认(天空蓝,推荐)", path: "default" },
        { id: 2, name: "金属黑(推荐)", path: "black" },
        { id: 3, name: "银色(推荐)", path: "bootstrap" },
        { id: 4, name: "灰霾(推荐)", path: "gray" },

        { id: 5, name: "清泉", path: "ui-cupertino", disabled: false },
        { id: 6, name: "黑巢", path: "ui-dark-hive", disabled: false },
        { id: 7, name: "杏黄", path: "ui-pepper-grinder", disabled: false },
        { id: 8, name: "阳光", path: "ui-sunny", disabled: false },

        { id: 9, name: "磁贴（标准）", path: "metro-standard" },
        { id: 10, name: "磁贴（蓝）", path: "metro-blue" },
        { id: 11, name: "磁贴（灰）", path: "metro-gray" },
        { id: 12, name: "磁贴（绿）", path: "metro-green" },
        { id: 13, name: "磁贴（橙）", path: "metro-orange" },
        { id: 14, name: "磁贴（红）", path: "metro-red" }
    ];




})(jQuery);


///<jscompress sourcefile="jquery.portal.js" />
/**
 * Dependencies:
 *   draggable
 *   panel
 * 
 * jQuery EasyUI portal Plugin 1.0 beta
 * jQuery EasyUI portal 插件
 * jquery.portal.js
 */
(function ($) {
    /**
    * initialize the portal
    */
    function init(target) {
        $(target).addClass('portal');
        var table = $('<table border="0" cellspacing="0" cellpadding="0"><tr></tr></table>').appendTo(target);
        var tr = table.find('tr');

        var columnWidths = [];
        var totalWidth = 0;
        $(target).children('div:first').addClass('portal-column-left');
        $(target).children('div:last').addClass('portal-column-right');
        $(target).find('>div').each(function () {	// each column panel
            var column = $(this);
            totalWidth += column.outerWidth();
            columnWidths.push(column.outerWidth());

            var td = $('<td class="portal-column-td"></td>').appendTo(tr)
            column.addClass('portal-column').appendTo(td);
            column.find('>div').each(function () {	// each portal panel
                var p = $(this).addClass('portal-p').panel({
                    doSize: false,
                    cls: 'portal-panel',
                    onClose: function () { $(this).panel("destroy"); }
                });
                makeDraggable(target, p);
            });
        });
        for (var i = 0; i < columnWidths.length; i++) {
            columnWidths[i] /= totalWidth;
        }

        $(target).bind('_resize', function () {
            var opts = $.data(target, 'portal').options;
            if (opts.fit == true) {
                setSize(target);
            }
            return false;
        });

        return columnWidths;
    }

    function setSize(target) {
        var t = $(target);
        var opts = $.data(target, 'portal').options;
        if (opts.fit) {
            var p = t.parent();
            opts.width = p.width();
            opts.height = p.height();
        }
        if (!isNaN(opts.width)) {
            t._outerWidth(opts.width);
        } else {
            t.width('auto');
        }
        if (!isNaN(opts.height)) {
            t._outerHeight(opts.height);
        } else {
            t.height('auto');
        }

        var hasScroll = t.find('>table').outerHeight() > t.height();
        var width = t.width();
        var columnWidths = $.data(target, 'portal').columnWidths;
        var leftWidth = 0;

        // calculate and set every column size
        for (var i = 0; i < columnWidths.length; i++) {
            var p = t.find('div.portal-column:eq(' + i + ')');
            var w = Math.floor(width * columnWidths[i]);
            if (i == columnWidths.length - 1) {
                //				w = width - leftWidth - (hasScroll == true ? 28 : 10);
                w = width - leftWidth - (hasScroll == true ? 18 : 0);
            }
            p._outerWidth(w);
            leftWidth += p.outerWidth();

            // resize every panel of the column
            p.find('div.portal-p').panel('resize', { width: p.width() });
        }
        opts.onResize.call(target, opts.width, opts.height);
    }

    /**
    * set draggable feature for the specified panel
    */
    function makeDraggable(target, panel) {
        var spacer;
        panel.panel('panel').draggable({
            handle: '>div.panel-header>div.panel-title',
            proxy: function (source) {
                var p = $('<div class="portal-proxy">proxy</div>').insertAfter(source);
                p.width($(source).width());
                p.height($(source).height());
                p.html($(source).html());
                p.find('div.portal-p').removeClass('portal-p').hide();
                return p;
            },
            onBeforeDrag: function (e) {
                e.data.startTop = $(this).position().top + $(target).scrollTop();
            },
            onStartDrag: function (e) {
                $(this).hide();
                spacer = $('<div class="portal-spacer"></div>').insertAfter(this);
                setSpacerSize($(this).outerWidth(), $(this).outerHeight());
            },
            onDrag: function (e) {
                var p = findPanel(e, this);
                if (p) {
                    if (p.pos == 'up') {
                        spacer.insertBefore(p.target);
                    } else {
                        spacer.insertAfter(p.target);
                    }
                    setSpacerSize($(p.target).outerWidth());
                } else {
                    var c = findColumn(e);
                    if (c) {
                        if (c.find('div.portal-spacer').length == 0) {
                            spacer.appendTo(c);
                            setSize(target);
                            setSpacerSize(c.width());
                        }
                    }
                }
            },
            onStopDrag: function (e) {
                $(this).css('position', 'static');
                $(this).show();
                spacer.hide();
                $(this).insertAfter(spacer);
                spacer.remove();
                setSize(target);
                panel.panel('move');

                var opts = $.data(target, 'portal').options;
                opts.onStateChange.call(target);
            }
        });

        /**
        * find which panel the cursor is over
        */
        function findPanel(e, source) {
            var result = null;
            $(target).find('div.portal-p').each(function () {
                var pal = $(this).panel('panel');
                if (pal[0] != source) {
                    var pos = pal.offset();
                    if (e.pageX > pos.left && e.pageX < pos.left + pal.outerWidth()
							&& e.pageY > pos.top && e.pageY < pos.top + pal.outerHeight()) {
                        if (e.pageY > pos.top + pal.outerHeight() / 2) {
                            result = {
                                target: pal,
                                pos: 'down'
                            };
                        } else {
                            result = {
                                target: pal,
                                pos: 'up'
                            }
                        }
                    }
                }
            });
            return result;
        }

        /**
        * find which portal column the cursor is over
        */
        function findColumn(e) {
            var result = null;
            $(target).find('div.portal-column').each(function () {
                var pal = $(this);
                var pos = pal.offset();
                if (e.pageX > pos.left && e.pageX < pos.left + pal.outerWidth()) {
                    result = pal;
                }
            });
            return result;
        }

        /**
        * set the spacer size
        */
        function setSpacerSize(width, height) {
            spacer._outerWidth(width);
            if (height) {
                spacer._outerHeight(height);
            }
        }
    }


    $.fn.portal = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.portal.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'portal');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'portal', {
                    options: $.extend({}, $.fn.portal.defaults, $.fn.portal.parseOptions(this), options),
                    columnWidths: init(this)
                });
            }
            if (state.options.border) {
                $(this).removeClass('portal-noborder');
            } else {
                $(this).addClass('portal-noborder');
            }
            setSize(this);
        });
    };

    $.fn.portal.methods = {
        options: function (jq) {
            return $.data(jq[0], 'portal').options;
        },
        resize: function (jq, param) {
            return jq.each(function () {
                if (param) {
                    var opts = $.data(this, 'portal').options;
                    if (param.width) opts.width = param.width;
                    if (param.height) opts.height = param.height;
                }
                setSize(this);
            });
        },
        getPanels: function (jq, columnIndex) {
            var c = jq; // the panel container
            if (columnIndex >= 0) {
                c = jq.find('div.portal-column:eq(' + columnIndex + ')');
            }
            var panels = [];
            c.find('div.portal-p').each(function () {
                panels.push($(this));
            });
            return panels;
        },
        add: function (jq, param) {	// param: {panel,columnIndex}
            return jq.each(function () {
                if (!param || !$.isNumeric(param.columnIndex) || !param.panel) { return; }
                var portal = $(this), opts = portal.portal("options");
                if (opts.onBeforeAdd.call(this, param.columnIndex, param.panel) == false) { return; }
                var c = portal.find('div.portal-column:eq(' + param.columnIndex + ')');
                var p = param.panel.addClass('portal-p');
                p.panel('panel').addClass('portal-panel').appendTo(c);
                makeDraggable(this, p);
                p.panel('resize', { width: c.width() });
                var panelOpts = p.panel("options"), onClose = opts.onClose;
                panelOpts.onClose = function () {
                    if ($.isFunction(onClose)) { onClose.apply(this, arguments); }
                    if (!p.length) { return; }
                    var body = $("body");
                    if ($.contains(body[0], p[0])) { p.panel("destroy"); }
                }
                opts.onAdd.call(this, param.columnIndex, param.panel);
            });
        },
        remove: function (jq, panel) {
            return jq.each(function () {
                var p = $(this), opts = p.portal("options");
                if (opts.onBeforeRemove.call(this, panel) == false) { return; }
                var panels = p.portal('getPanels'), panelOpts = panel.panel("options");
                for (var i = 0; i < panels.length; i++) {
                    var p = panels[i];
                    if (p[0] == $(panel)[0]) {
                        p.panel('destroy');
                    }
                }
                opts.onRemove.call(this, panelOpts);
            });
        },
        addColumn: function (jq) {
            return jq.each(function () {
                var state = $.data(this, "portal"), opts = state.options, columnWidths = state.columnWidths,
                    portal = $(this), totalWidth = portal.outerWidth(),
                    tr = portal.find(">table tr"), td = $("<td></td>").addClass("portal-column-td").appendTo(tr),
                    column = $("<div></div>").addClass("portal-column").appendTo(td),
                    width = parseFloat(1) / (columnWidths.length + 1);
                if (opts.onBeforeAddColumn.call(this, columnWidths.length) == false) { return; }
                for (var i = 0; i < columnWidths.length; i++) { columnWidths[i] = width; }
                columnWidths.push(width);
                tr.find(">td>div.portal-column").removeClass("portal-column-left portal-column-right");
                tr.find(">td>div.portal-column:first").addClass("portal-column-left");
                tr.find(">td>div.portal-column:last").addClass("portal-column-right");
                setSize(this);
                opts.onAddColumn.call(this, columnWidths.length - 1);
            });
        },
        removeColumn: function (jq, index) {
            return jq.each(function () {
                var state = $.data(this, "portal"), opts = state.options, columnWidths = state.columnWidths;
                if (!$.isNumeric(index) || !columnWidths || !columnWidths.length || index > columnWidths.length - 1) { return; }
                if (opts.onBeforeRemoveColumn.call(this, index) == false) { return; }
                var tr = $(this).find(">table tr"), width = parseFloat(1) / (columnWidths.length - 1);
                columnWidths.pop();
                for (var i = 0; i < columnWidths.length; i++) { columnWidths[i] = width; }
                tr.find(">td:eq(" + index + ")").remove();
                tr.find(">td>div.portal-column").removeClass("portal-column-left portal-column-right");
                tr.find(">td>div.portal-column:first").addClass("portal-column-left");
                tr.find(">td>div.portal-column:last").addClass("portal-column-right");
                setSize(this);
                opts.onRemoveColumn.call(this, index);
            });
        },
        columns: function (jq) {
            return $.data(jq[0], "portal").columnWidths.length;
        },
        disableDragging: function (jq, panel) {
            panel.panel('panel').draggable('disable');
            return jq;
        },
        enableDragging: function (jq, panel) {
            panel.panel('panel').draggable('enable');
            return jq;
        }
    };

    $.fn.portal.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, ["width", "height", { border: "boolean", fit: "boolean"}]));
    };

    $.fn.portal.defaults = {
        width: 'auto',
        height: 'auto',
        border: true,
        fit: false,
        onResize: function (width, height) { },
        onStateChange: function () { },

        onBeforeAdd: function (columnIndex, panel) { },
        onAdd: function (columnIndex, panel) { },

        onBeforeAddColumn: function (columnIndex) { },
        onAddColumn: function (columnIndex) { },

        onBeforeRemove: function (panel) { },
        onRemove: function (panelOption) { },

        onBeforeRemoveColumn: function (columnIndex) { },
        onRemoveColumn: function (columnIndex) { }
    };

    $.parser.plugins.push("portal");

})(jQuery);
