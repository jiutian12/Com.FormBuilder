(function() {
    var a = null;
    var b = function(i) {
        if (a) {
            return
        }
        i = i || {};
        function o(s, r) {
            var q = [];
            $.each(s, function(u, v) {
                var t;
                if ($.isFunction(v)) {
                    t = v(r);
                    q.push.apply(q, t)
                } else {
                    q.push(v)
                }
            });
            return q
        }
        function g(u) {
            var t = 0, q = 0, v, r, s = [];
            q = i.SetTables.length;
            while (t < q) {
                v = i.SetTables[t];
                if (v.IsMain) {
                    r = v.SetID;
                    break
                }
                t++
            }
            t = 0;
            q = i.SetItems.length;
            while (t < q) {
                v = i.SetItems[t];
                if (v.SetTable == r && u(v)) {
                    s.push({
                        text: v.ItemID + " " + v.ItemName,
                        value: v.ItemID,
                        _type: v.ItemType
                    })
                }
                t++
            }
            return s
        }
        var c = [{
            title: "基本设置",
            name: "common"
        }, {
            title: "处理人",
            name: "participant"
        }, {
            title: "数据权限",
            name: "data"
        }, {
            title: "操作权限",
            name: "oper"
        }, {
            title: "协办",
            name: "assist"
        }, {
            title: "超时预警",
            name: "timeout"
        }, {
            title: "事件处理",
            name: "event"
        }];
        var k = [{
            text: "任一",
            value: 0
        }, {
            text: "全部",
            value: 1
        }];
        var f = $.map([{
            FormID: "",
            FormName: null
        }].concat(i.Forms || []), function(q) {
            return {
                text: q.FormName,
                value: q.FormID
            }
        });
        var m = [{
            text: "不做处理",
            value: 0
        }, {
            text: "使用上一次审批结果",
            value: 1
        }, {
            text: "审批通过",
            value: 2
        }];
        var d = [{
            text: "自动选择",
            value: 0
        }, {
            text: "手动选择",
            value: 1
        }];
        var l = [{
            value: "Save",
            text: "保存"
        }, {
            value: "Submit",
            text: "提交"
        }, {
            value: "Disapproval",
            text: "不同意"
        }, {
            value: "RejectToStart",
            text: "退回重填"
        }, {
            value: "RejectToFixed",
            text: "退回某步"
        }, {
            value: "RejectExt",
            text: "拒绝"
        }, {
            value: "Depute",
            text: "委托"
        }, {
            value: "Inform",
            text: "知会"
        }, {
            value: "InviteIndicate",
            text: "邀请阅示"
        }, {
            value: "Dispatch",
            text: "调度"
        }, {
            value: "Cancel",
            text: "撤销"
        }, {
            value: "Delete",
            text: "删除"
        }, {
            value: "Retrieve",
            text: "取回"
        }, {
            value: "Tracing",
            text: "流程状态"
        }];
        var j = i.ActorAdapters || [];
        var h = i.ActionListeners || [];
        var p = [{
            name: "OnActivityBeforeCreate",
            title: "活动创建前",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }, {
            name: "OnActivityAfterCreate",
            title: "活动创建后",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }, {
            name: "OnActivityBeforeFinish",
            title: "活动完成前",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }, {
            name: "OnActivityAfterFinish",
            title: "活动完成后",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }];
        var e = [{
            name: "OnBeforeTaskCreate",
            title: "任务创建前",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }, {
            name: "OnAfterTaskCreate",
            title: "任务创建后",
            descript: "任务创建完成后事件， 保存到数据库之前",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }, {
            name: "OnBeforeTaskSubmit",
            title: "任务提交前",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }, {
            name: "OnAfterTaskSubmit",
            title: "任务提交后",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }, {
            name: "OnAfterSaveForm",
            title: "数据保存后",
            group: "event",
            editor: {
                type: "Event",
                items: h
            }
        }];
        var n = {
            "default": {
                title: "",
                list: [{
                    name: "ID",
                    title: "编码",
                    group: "common",
                    editor: "Text"
                }, {
                    name: "Name",
                    title: "显示名称",
                    group: "common",
                    editor: "Text"
                }]
            },
            WorkFlow: {
                title: "",
                list: [{
                    name: "ID",
                    title: "编码",
                    group: "common",
                    editor: "Text"
                }, {
                    name: "Name",
                    title: "显示名称",
                    group: "common",
                    editor: "Text"
                }, {
                    name: "Form",
                    title: "任务表单",
                    group: "common",
                    editor: {
                        type: "Combobox",
                        items: f
                    }
                }, {
                    name: "Subject",
                    title: "摘要",
                    group: "common",
                    editor: "StringTemplate"
                }, {
                    name: "OnBeforeStart",
                    title: "流程发起前",
                    group: "event",
                    editor: {
                        type: "Event",
                        items: h
                    }
                }, {
                    name: "OnAfterStart",
                    title: "流程发起后",
                    group: "event",
                    editor: {
                        type: "Event",
                        items: h
                    }
                }, {
                    name: "OnBeforeFinish",
                    title: "流程完成前",
                    group: "event",
                    editor: {
                        type: "Event",
                        items: h
                    }
                }, {
                    name: "OnAfterFinish",
                    title: "流程完成后",
                    group: "event",
                    editor: {
                        type: "Event",
                        items: h
                    }
                }, {
                    name: "OnAfterRejectToEnd",
                    title: "流程拒绝后",
                    group: "event",
                    editor: {
                        type: "Event",
                        items: h
                    }
                }, {
                    name: "OnAfterCancel",
                    title: "流程撤销后",
                    group: "event",
                    editor: {
                        type: "Event",
                        items: h
                    }
                }, {
                    name: "OnLogicDeleted",
                    title: "流程删除后",
                    group: "event",
                    editor: {
                        type: "Event",
                        items: h
                    }
                }]
            },
            StartEvent: {
                title: "开始节点",
                list: [{
                    name: "ID",
                    title: "编码",
                    group: "common",
                    editor: "Text"
                }, {
                    name: "Name",
                    title: "显示名称",
                    group: "common",
                    editor: "Text"
                }].concat(p)
            },
            EndEvent: {
                title: "结束节点",
                list: [{
                    name: "ID",
                    title: "编码",
                    group: "common",
                    editor: "Text"
                }, {
                    name: "Name",
                    title: "显示名称",
                    group: "common",
                    editor: "Text"
                }, {
                    name: "EntryCondition ",
                    title: "前置条件",
                    group: "common",
                    editor: {
                        type: "Radio",
                        items: k
                    },
                    defaultValue: 1
                }].concat(p)
            },
            SequenceFlow: {
                title: "线",
                list: [{
                    name: "ID",
                    title: "编码",
                    group: "common",
                    editor: "Text"
                }, {
                    name: "Name",
                    title: "显示名称",
                    group: "common",
                    editor: "Text"
                }, {
                    name: "Condition",
                    title: "<div style='margin-top:8px'>条件</div>",
                    titleStyle: "style='vertical-align:top'",
                    group: "common",
                    editor: {
                        type: "Expression",
                        mode: "bool"
                    }
                }, {
                    name: "IsDefault",
                    title: "Else",
                    descript: "是否默认顺序流, ELSE",
                    group: "common",
                    editor: "Boolean",
                    getRelativePropertyOptions: function(q) {
                        return [{
                            name: "Condition",
                            visible: !q
                        }]
                    }
                }, {
                    name: "DispOrder",
                    title: "排序",
                    group: "common",
                    editor: "Number",
                    visible: false
                }, {
                    name: "Description",
                    title: "描述",
                    group: "common",
                    editor: "Textarea",
                    visible: false
                }, {
                    name: "OnAfterSelect",
                    title: "选择后",
                    group: "event",
                    editor: {
                        type: "Event",
                        items: h
                    }
                }]
            }
        };
        n.Task = {
            title: "任务",
            list: [{
                name: "ID",
                title: "编码",
                group: "common",
                editor: "Text"
            }, {
                name: "Name",
                title: "显示名称",
                group: "common",
                editor: "Text",
                onpropertyvaluechange: function(s) {
                    var r = this
                      , q = this.propertyCtrls;
                    setTimeout(function() {
                        var u = q.TaskName
                          , t = q.Summary;
                        if (u) {
                            u.setDefaultValue(s)
                        }
                        if (t) {
                            t.setDefaultValue(s)
                        }
                    }, 10)
                }
            }, {
                name: "EntryCondition",
                title: "前置条件",
                group: "common",
                editor: {
                    type: "Radio",
                    items: [{
                        text: "任一",
                        value: 0
                    }, {
                        text: "全部",
                        value: 1
                    }]
                },
                defaultValue: 1,
            }, {
                name: "TaskName",
                title: "工作项名称",
                descript: "自定义工作项名称",
                group: "common",
                editor: "StringTemplate"
            }, {
                name: "Form",
                title: "任务表单",
                group: "common",
                editor: {
                    type: "Combobox",
                    items: f
                }
            }, {
                name: "Summary",
                title: "摘要",
                descript: "工作项摘要",
                group: "common",
                editor: "StringTemplate"
            }, {
                name: "Description",
                title: "描述",
                group: "common",
                editor: "Text",
                visible: false
            }, {
                name: "Candidate",
                title: "Candidate",
                group: "common",
                editor: "Text",
                visible: false
            }, {
                name: "CommentDefault",
                title: "意见默认值",
                group: "common",
                editor: "Text"
            }, {
                name: "CommentField",
                title: "意见字段",
                group: "common",
                editor: {
                    type: "Combobox",
                    items: g(function(q) {
                        return (q.ItemType == "String" || q.ItemType == "Memo")
                    })
                }
            }, {
                name: "NewTaskNotices",
                title: "通知",
                group: "common",
                editor: {
                    type: "Notice"
                }
            }, {
                name: "ActorConfigs",
                title: "处理人",
                group: "participant",
                editor: {
                    type: "Participant",
                    items: j
                },
                showTitle: true
            }, {
                name: "EnableMultiuser",
                title: "处理人类型",
                descript: "启用多用户",
                group: "participant",
                editor: {
                    type: "Radio",
                    items: [{
                        text: "单人",
                        value: false
                    }, {
                        text: "多人",
                        value: true
                    }]
                },
                defaultValue: false,
                getRelativePropertyOptions: function(q) {
                    var r = q == "1";
                    return [{
                        name: "EnableParallelWork",
                        visible: r
                    }, {
                        name: "CompleteCondition",
                        visible: r
                    }, {
                        name: "EnableSharedWork",
                        visible: !r
                    }, {
                        name: "ApproveExit",
                        visible: r
                    }, {
                        name: "DisapproveExit",
                        visible: r
                    }]
                }
            }, {
                name: "EnableParallelWork",
                title: "处理方式",
                descript: "启用并行工作",
                group: "participant",
                editor: {
                    type: "Radio",
                    items: [{
                        text: "并行",
                        value: true
                    }, {
                        text: "串行",
                        value: false
                    }]
                },
                defaultValue: true
            }, function(q) {
                if (q == "UserTask") {
                    return [{
                        name: "CompleteCondition",
                        title: "完成出口",
                        descript: "多用户处理完成出口(数字or百分比)",
                        group: "participant",
                        editor: {
                            type: "Number",
                            postfix: "%"
                        }
                    }, {
                        name: "EnableSharedWork",
                        title: "共享任务",
                        descript: "启用共享工作任务，需要签收后才能办理",
                        group: "participant",
                        editor: "Boolean"
                    }]
                }
                if (q == "ApproveTask") {
                    return [{
                        name: "ApproveExit",
                        title: "同意出口",
                        descript: "同意出口数字or百分比)",
                        group: "participant",
                        editor: {
                            type: "Number",
                            postfix: "%"
                        },
                        defaultValue: "100%"
                    }, {
                        name: "DisapproveExit",
                        title: "否决出口",
                        descript: "否决出口(数字or百分比)",
                        group: "participant",
                        editor: {
                            type: "Number",
                            postfix: "%"
                        },
                        defaultValue: 1
                    }]
                }
            }
            , {
                name: "NoneActorHandler",
                title: "无处理人",
                descript: "无处理人处理策略",
                group: "participant",
                editor: {
                    type: "Combobox",
                    items: m
                },
                defaultValue: 0
            }, {
                name: "ActorIsInitiatorHandler",
                title: "是发起人",
                descript: "处理人是发起人处理策略",
                group: "participant",
                editor: {
                    type: "Combobox",
                    items: m
                },
                defaultValue: 0
            }, {
                name: "ActorIsPreviousHandler",
                title: "是上一步处理人",
                descript: "处理人是上一步处理者处理策略",
                group: "participant",
                editor: {
                    type: "Combobox",
                    items: m
                },
                defaultValue: 0
            }, {
                name: "ActorIsJoinedHandler",
                title: "参与过流程",
                descript: "参与过流程处理策略",
                group: "participant",
                editor: {
                    type: "Combobox",
                    items: m
                },
                defaultValue: 0
            }, {
                name: "SubmitActorChooseKind",
                title: "选择处理人模式",
                descript: "选择处理人的策略",
                group: "participant",
                editor: {
                    type: "Combobox",
                    items: d
                },
                defaultValue: 0
            }, function(q) {
                if (q == "UserTask") {
                    return [{
                        name: "PermittedActions",
                        title: "操作权限",
                        showTitle: false,
                        descript: "用户操作权限",
                        group: "oper",
                        editor: {
                            type: "PermittedActions",
                            items: l
                        },
                        defaultValue: [{
                            ID: "Save",
                            Name: "保存"
                        }, {
                            ID: "Submit",
                            Name: "提交"
                        }, {
                            ID: "Cancel",
                            Name: "撤销"
                        }, {
                            ID: "Retrieve",
                            Name: "取回"
                        }, {
                            ID: "Tracing",
                            Name: "流程状态"
                        }]
                    }]
                } else {
                    if (q == "ApproveTask") {
                        return [{
                            name: "PermittedActions",
                            title: "操作权限",
                            showTitle: false,
                            descript: "用户操作权限",
                            group: "oper",
                            editor: {
                                type: "PermittedActions",
                                items: l
                            },
                            defaultValue: [{
                                ID: "Submit",
                                Name: "提交"
                            }, {
                                ID: "RejectToStart",
                                Name: "退回重填"
                            }, {
                                ID: "RejectExt",
                                Name: "拒绝"
                            }, {
                                ID: "Tracing",
                                Name: "流程状态"
                            }]
                        }]
                    }
                }
            }
            , {
                name: "DataItemPermissions",
                title: "数据权限",
                group: "data",
                editor: {
                    type: "DataItemPermissions",
                    items: null,
                    initItems: function(q) {
                        q(i.SetTables, i.SetItems)
                    }
                },
                showTitle: false
            }, {
                name: "TimeoutRule",
                title: "超时预警",
                group: "timeout",
                editor: {
                    type: "TimeoutRule",
                    dateSetItems: g(function(q) {
                        return q.ItemType == "DateTime"
                    }),
                    minutesSetItems: g(function(q) {
                        return q.ItemType == "Float"
                    })
                },
                showTitle: false
            }].concat(p).concat(e)
        };
        n.UserTask = {
            title: "用户任务",
            list: o(n.Task.list, "UserTask")
        };
        n.ApproveTask = {
            title: "审批任务",
            list: o(n.Task.list, "ApproveTask")
        };
        n.WaitTask = {
            title: "等待节点",
            list: [{
                name: "ID",
                title: "编码",
                group: "common",
                editor: "Text"
            }, {
                name: "Name",
                title: "显示名称",
                group: "common",
                editor: "Text"
            }, {
                name: "EntryCondition",
                title: "前置条件",
                group: "common",
                editor: {
                    type: "Radio",
                    items: [{
                        text: "任一",
                        value: 0
                    }, {
                        text: "全部",
                        value: 1
                    }]
                },
                defaultValue: 1
            }, {
                name: "FireCondition",
                title: "检查条件",
                group: "common",
                editor: "Script"
            }].concat(p)
        };
        n.ScriptTask = {
            title: "脚本节点",
            list: [{
                name: "ID",
                title: "编码",
                group: "common",
                editor: "Text"
            }, {
                name: "Name",
                title: "显示名称",
                group: "common",
                editor: "Text"
            }, {
                name: "EntryCondition",
                title: "前置条件",
                group: "common",
                editor: {
                    type: "Radio",
                    items: [{
                        text: "任一",
                        value: 0
                    }, {
                        text: "全部",
                        value: 1
                    }]
                },
                defaultValue: 1
            }, {
                name: "Scripts",
                title: "脚本",
                group: "common",
                editor: {
                    type: "Event",
                    items: h,
                    title: "脚本设置"
                }
            }]
        };
        n.Gateway = {
            title: "网关",
            list: [{
                name: "ID",
                title: "编码",
                group: "common",
                editor: "Text"
            }, {
                name: "Name",
                title: "显示名称",
                group: "common",
                editor: "Text"
            }, {
                name: "EntryCondition",
                title: "前置条件",
                group: "common",
                editor: {
                    type: "Radio",
                    items: [{
                        text: "任一",
                        value: 0
                    }, {
                        text: "全部",
                        value: 1
                    }]
                },
                defaultValue: 1
            }]
        };
        n.Connector = n.SequenceFlow;
        a = {
            groups: c,
            list: n
        }
    };
    window.getPropertyConfig = function(e, d) {
        b(d);
        var c = a.list;
        return {
            groups: a.groups,
            list: c[e] && c[e].list || c["default"].list
        }
    }
}
)();
