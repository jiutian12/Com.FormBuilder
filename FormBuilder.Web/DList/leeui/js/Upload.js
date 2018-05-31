(function ($) {
    $.fn.leeUpload = function () {
        return $.leeUI.run.call(this, "leeUIUpload", arguments);
    };
    $.leeUIDefaults.Upload = {
        isMul: false,
        isPic: false,// 是否图片模式
        isPreview: false,//图片是否集成预览
        isCard: false,//列表展示还是卡片展示
        url: _global.sitePath + "/File/upload",//远程上传地址
        ext: "",//文件扩展名
        downloadUrl: _global.sitePath + "/File/DownFile?fileid=",
        buttonText: "上传附件",
        isAvatar: false,
        data: []
    };
    $.leeUI.controls.Upload = function (element, options) {
        $.leeUI.controls.Upload.base.constructor.call(this, element, options);
    };

    $.leeUI.controls.Upload.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'Upload';
        },
        __idPrev: function () {
            return 'Upload';
        },
        _render: function () {
            var g = this,
				p = this.options;
            if (p.isCard == false) {
                p.isPreview = false;
            }
            if (p.isCard && !p.isMul) {
                p.isAvatar = true;
            }
            g.deldata = [];
            //p.isCard = false;
            g.inputText = $(this.element);
            g.picker = $("<div class='picker'></div>");
            g.picker.insertBefore(g.inputText);
            g.picker.append("<span><i class='lee-ion-ios-cloud-outline'></i>" + p.buttonText + "</span>")
            g.inputText.hide();



            g.wrapper = g.picker.wrap("<div class='lee-upload'></div>").parent();

            g.uploadFile = $("<div class='lee-upload-files'></div>");
            g.progress = $('<div class="progress"> <div class="progressbar"><div class="line"></div> </div> <div class="title"></div>');
            g.cardList = $('<div class="file-list"></div>');
            g.list = $('<div class="list"></div>');
            g.emptyWrap = $('<div style="text-align:center; font-size: 14px;color:#5b5b5b;"> <span><i class="lee-ion-ios-list-outline" style="font-size: 26px;"></i></span> <div>暂无数据</div></div>');
            g.uploadFile.append(g.progress).append(g.cardList).append(g.list).append(g.emptyWrap);



            if (p.isAvatar) {
                //g.picker.addClass("single"); // 但选择增加但样式
                g.wrapper.addClass("single"); // 但选择增加但样式
                g.picker.html("<i class='lee-ion-plus'></i>");
                g.avList = $("<div class='lee-upload-files'></div>");
                g.avList.insertBefore(g.picker);
            } else {
                g.wrapper.append(g.uploadFile);
                g.list.hide();
                g.progress.hide();
                g.cardList.hide();
            }
            if (p.isCard) {
                g.cardList.show();

            } else {
                g.list.show();
            }


            var BASE_URL = _global.sitePath + "/DList/webupload";
            var uploader = WebUploader.create({
                auto: true,
                duplicate: true,
                swf: BASE_URL + '/Uploader.swf',
                server: p.url,
                pick: g.picker,
                accept: g.getAccept()
            });
            uploader.on('uploadStart', function (file) {
                g._updateProgress(0);
                // alert(1);
                //uploader.option("formData", ngModel.$modelValue.getPostData());
            });
            //uploader.option("formData", { dataid: "1" });

            uploader.on('uploadProgress', function (file, percentage) {
                console.log("progress:" + percentage);
                g._updateProgress(percentage * 100);
            });

            uploader.on('uploadSuccess', function (file, response) {
                //alert(1);
                var srcinfo = "";
                if (response.res) {
                    var model = {
                        id: response.data,
                        name: file.name,
                        ext: "." + file.ext,
                        type: file.type
                    }
                    if (p.isCard) {
                        var res = g._canPreview(model.ext.toLowerCase())
                        if (res.res) {
                            uploader.makeThumb(file, function (error, src) {
                                model.src = src;
                                g._uploadSuccess(model);

                            }, 100, 100);
                        } else {
                            model.src = res.src;
                            g._uploadSuccess(model);
                        }

                    } else {
                        g._uploadSuccess(model);
                    }

                } else {
                    alert(response.mes);
                }
                g.progress.hide();



            });
            g.uploader = uploader;
            g._bind();
            g.set(p);
        },
        updateParams: function (obj) {

            this.uploader.option('formData', obj);
        },
        getAccept: function () {
            var g = this,
                 p = this.options;
            var hashExt = {
                "jpeg": "image/jpeg",
                "jpg": "image/jpeg",
                "png": "image/png",
                "gif": "image/gif",
                "bmp": "image/bmp",
                "pdf": "application/pdf",
                "doc": "application/msword",
                "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "ppt": "application/vnd.ms-powerpoint",
                "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "xls": "application/vnd.ms-excel",
                "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
            if (p.ext != "") {
                var mimetypearr = [];
                var arr = p.ext.split(",");
                $.each(arr, function (i, key) {

                    mimetypearr.push(getMimeType(key));
                });

                return {
                    title: p.ext,
                    extensions: p.ext,
                    mimeTypes: mimetypearr.join(",")
                }

            }

            function getMimeType(ext) {
                ext = ext.toLocaleLowerCase();
                return hashExt[ext];
            }

        },
        _buidTitle: function (data) {
            var arr = [];
            if (data.name) {
                arr.push("文件名:" + data.name + "&#10;");
            }
            if (data.ext) {
                arr.push("扩展名:" + data.ext + "&#10;");
            }
            if (data.creatuser) {
                arr.push("创建人:" + data.creatuser + "&#10;");
            }
            if (data.createtime) {
                arr.push("创建时间:" + data.createtime + "&#10;");
            }
            return arr.join("");
        },
        _bind: function () {
            var g = this,
                  p = this.options;
            g.wrapper.on("click", ".op.download", function (e) {
                g.downloadFile($(this));
            });
            g.wrapper.on("click", ".op.delete", function (e) {
                g.removeFile($(this));
            });
        },
        downloadFile: function (achor) {
            var g = this,
                  p = this.options;
            var $ele = $(achor).closest(".box");
            var id = $ele.attr("dataid");

            window.open(p.downloadUrl + id);

        },
        removeFile: function (achor) {

            var g = this,
                 p = this.options;
            var $ele = $(achor).closest(".box");
            var id = $ele.attr("dataid");


            if (p.onRemoveFile) {

                p.onRemoveFile(g, id, $ele);
                return;
            }
            this.removeData(id);
            this._setEmpty();

            $ele.remove();

        },
        removeData: function (id) {
            var g = this,
                 p = this.options;
            g.deldata = g.deldata || [];
            var index = -1;
            for (var item in p.data) {
                if (p.data[item].id === id) {
                    index = item;
                    g.deldata.push(p.data[item]);
                }
            }
            p.data.splice(item, 1);
        },
        bindViewImage: function () {

            if (this.viewer) {
                this.viewer.destroy();
            }
            var $previewDom = this.cardList[0];
            if (this.options.isAvatar) {
                $previewDom = this.avList[0];
            }
            this.viewer = new Viewer($previewDom);
            //viewer.show();
        },
        includeCss: function (filename) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = filename;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link)
        },
        loadViewer: function () {
            var self = this;
            if (typeof (Viewer) == "undefined") {
                var baseDir = _global.scriptPath + "Dlist/Viewer/";
                self.includeCss(baseDir + "viewer.min.css");
                jQuery.getScript(baseDir + "viewer.js").done(function () {
                    self.bindViewImage();
                }).fail(function () {

                });
            } else {
                self.bindViewImage();
            }
        },
        _canPreview: function (ext) {
            ext = ext.toLowerCase();
            if (ext) ext = ext.substr(1);
            if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "gif") {
                return { res: true, src: _global.imgFolder + "/png.png" }
            }
            else if (ext == "xls" || ext == "xlsx") {
                return { res: false, src: _global.imgFolder + "/excel.png" };
            } else if (ext == "ppt" || ext == "pptx") {
                return { res: false, src: _global.imgFolder + "/ppt.png" };
            }
            else if (ext == "txt") {
                return { res: false, src: _global.imgFolder + "/txt.png" };
            } else if (ext == "zip") {
                return { res: false, src: _global.imgFolder + "/zip.png" };
            } else if (ext == "pdf") {
                return { res: false, src: _global.imgFolder + "/pdf.png" };
            }
            else if (ext == "doc" || ext == "docx") {
                return { res: false, src: _global.imgFolder + "/doc.png" };
            } else {

                return { res: false, src: _global.imgFolder + "/default.png" };
            }
        },
        _updateProgress: function (per, text) {
            this.progress.show();
            this.progress.find("line").css("width", per + "%")
        },
        _hideProgress: function () {
            this.progress.hide();
        },
        _uploadSuccess: function (data) {
            var g = this,
          p = this.options;
            //alert(p.isMul)
            if (!p.isMul) {
                p.data = [];
            }
            g._appendData(data);
            g._appendView(data);


            g._setEmpty();
            if (p.isPreview)
                g.loadViewer();
        },
        _setEmpty: function () {
            var g = this,
             p = this.options;
            if (p.data.length == 0) {
                g.emptyWrap.show();
            } else {
                g.emptyWrap.hide();
            }

            if (p.data.length >= 1 && !p.isMul) {
                g.picker.hide();
            } else {
                g.picker.show();
            }
        },
        _appendView: function (data) {
            var g = this,
              p = this.options;
            if (p.isAvatar) {
                g.avList.html(g._getView(data));
            }
            else if (p.isCard) {
                g.cardList.append(g._getView(data));
            }
            else {
                g.list.append(g._getView(data));
            }

        },
        _clearWrap: function () {
            this.cardList.empty();
            this.cardList.empty();
        },
        _getView: function (data) {
            var g = this,
               p = this.options;
            var htmlarr = [];

            if (p.isCard) {

                htmlarr.push('<div class="file-item box" dataid="' + data.id + '">');
                htmlarr.push('    <img src="' + data.src + '">');
                htmlarr.push('    <div class="info" title="' + g._buidTitle(data) + '">' + data.name + '</div>');
                htmlarr.push('    <div class="panel">');
                htmlarr.push('        <i class="lee-ion-android-close op delete"></i>');
                htmlarr.push('        <i class="lee-ion-archive op download"></i>');
                htmlarr.push('    </div>');
                htmlarr.push('</div>');
            } else {
                htmlarr.push('<div class="item box" dataid="' + data.id + '">');
                var img = g._canPreview(data.ext);
                htmlarr.push('    <img class="fileinfo" src="' + img.src + '"/>');
                htmlarr.push('    <a href="#" class="op download"  title="' + g._buidTitle(data) + '">' + data.name + '</a>');
                htmlarr.push('    <span class="op"><i class="lee-ion-android-close op delete"></i></span>');
                htmlarr.push('</div>');
            }
            return htmlarr.join('');
        },
        _appendData: function (data) {
            var g = this,
               p = this.options;
            p.data.push(data);
        },
        _setValue: function (value) {
            var g = this,
              p = this.options;
            p.data = [];
            g._clearWrap();
            for (var item in value) {
                // 格式化URL
                var row = value[item];
                var res = g._canPreview(row.ext);
                if (res.res) {
                    value[item].src = p.downloadUrl + row.id;
                } else {
                    value[item].src = res.src;
                }

                g._appendData(value[item]);
                g._appendView(value[item]);
            }
            g._setEmpty();
            if (p.isPreview)
                g.loadViewer();

            g._setDisabled(g.disabled);
        },
        _getValue: function () {
            var g = this,
              p = this.options;

            return p.data;
        },
        getDelData: function () {
            var g = this,
            p = this.options;
            return g.deldata;
        },
        getSingleValue: function () {
            var g = this,
             p = this.options;
            if ((p.isAvatar || p.isMul) && p.data.length == 1)
                return p.data[0]["id"];


            return "";
        },
        _setDisabled: function (flag) {
            var g = this,
              p = this.options;
            g.disabled = flag;
            if (flag) {



                if (p.isAvatar) {
                    g.picker.addClass("disabled");
                    $("input[type = 'file']", g.picker).attr("disabled", "disabled");
                } else {
                    g.picker.hide();
                }

                g.picker.parent().find(".delete").hide();

            } else {
                if (p.isAvatar) {

                    g.picker.removeClass("disabled");
                    $("input[type = 'file']", g.picker).removeAttr("disabled");
                } else {
                    g.picker.show();
                }


                g.wrapper.find(".delete").show();

            }

        },
        _setRequired: function (value) {

        },
    });

    $.leeUI.controls.Upload.prototype.setValue = $.leeUI.controls.Upload.prototype._setValue;
    $.leeUI.controls.Upload.prototype.getValue = $.leeUI.controls.Upload.prototype._getValue;
    $.leeUI.controls.Upload.prototype.setDisabled = $.leeUI.controls.Upload.prototype._setDisabled;
})(jQuery);