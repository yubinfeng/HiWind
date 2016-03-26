//Generate random pictures 
function CodeImgSrc() {
    var id = "CodeImg";
    $.ajax({
        type: "GET",
        url: "/Users/CodeImg",
        data: "name=John&location=Boston&anticache=" + Math.floor(Math.random() * 1000),
        success: function (msg) {
            $("#"+id).attr("src", "/Users/CodeImg/" + (Math.floor(Math.random() * 1000)));
        }
    });
}
function ValidatorCode() {
    $.ajax({
        type: "GET",
        url: "/CongYeRY/ValidatorCode/" + $("#code").val(),
        data: "id=" + $("#code").val() + "&&anticache=" + Math.floor(Math.random() * 1000),
        success: function (msg) {
            //if (msg == 1) {
                waiting("hide");
                SearchGrid_List(typer, 1);
            //}
            //else {
            //    var err = "<font color=red><b>输入验证码有误，请重新输入！</b></font> ";
            //    $("#err").html(err);
            //}
        }
    });
}

// User exit 
function UserExit() {

     $.easyui.messager.confirm("操作提醒", "您确定要退出系统？", function (c) {
        if (c) {
            //$.util.closeWindowNoConfirm();
            $.ajax({
                type: "POST",
                url: "/Users/UserExit",
                // data: "username=" + $("#UserName").val() + "&PassWord=" + $("#PassWord").val() + "&UserType=" + $("#UserType").val() + "&CheckCode=" + $("#Code").val() + "&anticache=" + Math.floor(Math.random() * 1000),
                beforeSend: function (XMLHttpRequest) { $.messager.progress({ text: '正在退出系统中，请稍等……' }); },
                // dataType: 'json',
                success: function (datas) {
                    //alert(obj.msg);               
                    if (datas == "退出成功") {
                        $.messager.progress('close');
                        $.messager.alert('提示', "退出成功，感谢您使用本系统！");
                        window.location.href = "/Users/Login/";
                        return true;
                    }
                    else {
                        str = '发生异常，请联系管理员！';//（调试时查看）+result.responseText;
                        $.messager.alert('提示', str);
                    }
                },
                // complete: function (XMLHttpRequest, textStatus) { $.messager.progress('close'); },
                error: function (datas) {
                    str = '发生异常，请联系管理员！';//（调试时查看）+result.responseText;
                    $.messager.alert('提示', str);
                }
            });
        }
    });
   
}
//Save setting
    function LoginSet(date) {
        debugger;
        var SaveDate = $("#SaveDate").is(':checked');
        if (SaveDate!=false) {
            $.cookie("User", $("#User").validatebox('getValue'));
            $.cookie("Pass", $("#Pass").validatebox('getValue'));
            $.cookie('SaveDate', SaveDate);//写入保存
        }
        else {
            $.cookie("User", null);
            $.cookie("Pass", null);
            $.cookie("SaveDate", null);
            //$("#User").validatebox('setValue', "");
           // $("#Pass").validatebox('setValue', "");
            $("#SaveDate").removeAttr("checked");
        }
    }

    //Load user into 
    function LoadGet() {
        debugger;
        if ($.cookie('SaveDate')=="true") {
            if($.cookie('User')!="" && $.cookie('Pass')!="")
            {
                $("#User").validatebox('setValue',$.cookie('User'));
                $("#Pass").validatebox('setValue', $.cookie('Pass'));
                $("#SaveDate").attr("checked",true);
            }
            else{
                $("#User").validatebox('setValue', "");
                $("#Pass").validatebox('setValue', "");
                $("#SaveDate").removeAttr("checked");
            }
            
        }
        else {
            $.cookie("User", null);
            $.cookie("Pass", null);
            $.cookie("SaveDate", null);
            $("#User").validatebox('setValue', "");
            $("#Pass").validatebox('setValue', "");
            $("#SaveDate").removeAttr("checked");
        }
    }