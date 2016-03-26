/*Disclaimer: partial extensions from cjw0511 */
(function () {

    var plugins = {
        ueditor: [
            "<link href=\"/scripts/plugins/ueditor/ue1_4_3-utf8-net/themes/default/css/ueditor.css\" rel=\"stylesheet\"/>",
            "<script src=\"/scripts/plugins/ueditor/ue1_4_3-utf8-net/ueditor.config.js\"></script>",
            "<script src=\"/scripts/plugins/ueditor/ue1_4_3-utf8-net/ueditor.all.js\"></script>",
            "<script src=\"/scripts/plugins/ueditor/ue1_4_3-utf8-net/lang/zh-cn/zh-cn.js\"></script>",
            "<script src=\"/scripts/jeasyui-extensions/jquery-easyui-ueditor/jquery.ueditor.js\"></script>"
        ],
        syntaxhighlighter: [
            "<script src=\"/scripts/plugins/syntaxhighlighter_3.0.83/scripts/shCore.min.js\"></script>",
            "<script src=\"/scripts/plugins/syntaxhighlighter_3.0.83/scripts/shBrushJScript.js\"></script>",
            "<script src=\"/scripts/plugins/syntaxhighlighter_3.0.83/scripts/shBrushXml.js\"></script>",
            "<link href=\"/scripts/plugins/syntaxhighlighter_3.0.83/styles/shCoreDefault.css\" rel=\"stylesheet\" type=\"text/css\"/>"
        ],
        my97: [
            "<script src=\"/scripts/plugins/My97DatePicker/WdatePicker.js\"></script>",
            "<script src=\"/scripts/jeasyui-extensions/jquery-easyui-my97/jquery.my97.js\"></script>"
        ],
        codemirror: [
            "<link href=\"/scripts/plugins/codemirror-4.2/lib/codemirror.css\" rel=\"stylesheet\"/>",
            "<script src=\"/scripts/plugins/codemirror-4.2/lib/codemirror.js\"></script>",
            "<script src=\"/scripts/plugins/codemirror-4.2/mode/xml/xml.js\"></script>",
            "<script src=\"/scripts/plugins/codemirror-4.2/mode/javascript/javascript.js\"></script>",
            "<script src=\"/scripts/plugins/codemirror-4.2/mode/vbscript/vbscript.js\"></script>",
            "<script src=\"/scripts/plugins/codemirror-4.2/mode/css/css.js\"></script>",
            "<script src=\"/scripts/plugins/codemirror-4.2/mode/htmlmixed/htmlmixed.js\"></script>",
            "<script src=\"/scripts/jeasyui-extensions/jquery-easyui-codemirror/jquery.codemirror.js\"></script>"
        ],
        euploadify: [
            "<link href=\"/scripts/plugins/uploadify/uploadify.css\" rel=\"stylesheet\"/>",
            "<script src=\"/scripts/plugins/uploadify/jquery.uploadify.js\"></script>",
            "<script src=\"/scripts/jeasyui-extensions/jquery-easyui-euploadify/jquery.euploadify.js\"></script>"
        ]
    };

    var param = $.util.request["plugin"],
        params = param ? String(param).split(",") : [],
        list = ["syntaxhighlighter", "codemirror"],
        imported = [];

    if ($.array.contains(params, "all"), function (val) { return String(val).toLocaleLowerCase() == "all" }) {
        return $.each(plugins, function (name) { loadPlugin(name); });
    }

    $.each(list, function (i, name) { loadPlugin(name); });

    $.each(params, function (i, name) { loadPlugin(name); });

    function loadPlugin(name) {
        if ($.string.isNullOrWhiteSpace(name)) { return; }
        var plugin = plugins[name];
        if (plugin && !$.array.contains(imported, name)) {
            $.each(plugin, function (i, script) {
                //$(script).appendTo("head");
                document.write(script);
            });
            imported.push(name);
        }
    };

})();