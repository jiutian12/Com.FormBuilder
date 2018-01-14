function code_toolbar() {
}

code_toolbar.prototype.generate = function (control) {
    var arr = [];
    var id = control.barid;
    arr.push("var " + control.id + "={}");
    arr.push("\"table\":\"\",\r\n");
    arr.push("\"field\":\"\",\r\n");
    arr.push("}");
    //去数据库取出按钮信息构造形成options
}