
require.config({
    urlArgs: "v=1",
    baseUrl: "/FormBuilder.Web/Scripts",
    paths: {
        "Runtime": "/FormBuilder.Web/Scripts/Runtime",
    },
    shim: {
        //"lib/jquery-ui": {
        //    deps: ['jquery']
        //},
        //"lib/jquery.cookies": {
        //    deps: ['jquery'],
        //    exports: 'jQuery.fn.cookie'
        //},
        //"lib/jquery-migrate-1.2.1.min": {
        //    deps: ['jquery']
        //},
        //"lib/bootstrap3/js/bootstrap": {
        //    deps: ['jquery']
        //},
        //"gsp.rtf.core": {
        //    deps: ["jquery"]
        //},
        //"bizcomponentProxy": {
        //    deps: ['gsp.rtf.core']
        //},
        //"lib/metisMenu/metisMenu.min": {
        //    deps: ['jquery']
        //}
    },
    waitSeconds: 20
});


require(['Runtime/core'], function (core) {
    alert(1);
});
