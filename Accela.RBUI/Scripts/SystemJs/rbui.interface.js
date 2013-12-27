///****** jquery modal dialog***/
///id: target element
///isopen :open
///width :width
///cancelFun:function Name
////saveFun:function Name
//title:dialog title
function modalDialog(id, isOpen, width, cancelFun, saveFun, title) {
    //$("div[id$='dialog']")
    $("#" + id).dialog({
        autoOpen: isOpen,
        width: width,
        title: title,
        modal: true,
        buttons: {
            "Cancel": function () {
                if (typeof (cancelFun) == "undefined" || cancelFun == null || cancelFun == "") {
                    $(this).dialog("close");
                }
                else {
                    cancelFun();
                    $(this).dialog("close");
                }
            },
            "Save Changes": function () {
                if (typeof (saveFun) == "undefined" || saveFun == null || saveFun == "") {
                    $(this).dialog("close");
                }
                else {
                    saveFun();
                }
            }
        },
        show: {
            effect: "fade",
            duration: 500
        },
        hide: {
            effect: "fade",
            duration: 500
        }
    });
}

function modalSaveAandClose(id, isOpen, width, title, fun) {
    //$("div[id$='dialog']")
    $("#" + id).dialog({
        autoOpen: isOpen,
        width: width,
        title: title,
        modal: true,
        buttons: {
            "Save & Close": function () {
                if (typeof (fun) == "undefined" || fun == null || fun == "") {
                    $(this).dialog("close");
                }
                else {
                    cancelFun();
                    $(this).dialog("close");
                }
            }  
        },
        show: {
            effect: "fade",
            duration: 500
        },
        hide: {
            effect: "fade",
            duration: 500
        }
    });
}

///dialog
///
function dialog(id, isOpen, width, okFun, title) {
    //$("div[id$='dialog']")
    $("#" + id).dialog({
        autoOpen: isOpen,
        width: width,
        title:title,
        buttons: {
            "OK": function () {
                if (typeof (okFun) == "undefined" || okFun == null || okFun == "") {
                    $(this).dialog("close");
                }
                else {
                    okFun();
                    $(this).dialog("close");
                }
            }
        },
        show: {
            effect: "fade",
            duration: 500
        },
        hide: {
            effect: "fade",
            duration: 500
        }
    });
}

