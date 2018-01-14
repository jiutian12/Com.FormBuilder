/*表单状态机处理*/
Page.StateMachine = Page.StateMachine || {};
Page.StateMachine = (function (fsm, win, $) {
    fsm.map = {};

    // 初始化卡片状态机
    fsm.map["card_fsm"] = {
        actions: [
            { id: "modify", text: "开始编辑" },
            { id: "adddown", text: "增加下级" },
            { id: "add", text: "增加" },
            { id: "delete", text: "删除" },
            { id: "cancel", text: "取消编辑" },
            { id: "save", text: "保存数据" },
            { id: "saveadd", text: "保存并新增" },
            { id: "edit", text: "内部编辑" }
        ],
        state: ["none", "begin", "modify", "add"],
        transitions: [
	        { name: 'begin', from: 'none', to: 'none' },
            { name: 'view', from: 'none', to: 'begin' },
            { name: 'modify', from: 'begin', to: 'modify' },
            { name: 'adddown', from: 'beginmodify', to: 'modify' },
            { name: 'adddown', from: 'begin', to: 'modify' },
            { name: 'delete', from: 'begin', to: 'begin' },
            { name: 'add', from: 'begin', to: 'add' },
            { name: 'add', from: 'addbegin', to: 'add' },
	        { name: 'cancel', from: 'modify', to: 'begin' },
	        { name: 'save', from: 'modify', to: 'begin' },
	        { name: 'saveadd', from: 'modify', to: 'add' },
            { name: 'edit', from: 'modify', to: 'modify' },
	        { name: 'delete', from: 'modify', to: 'modify' },
            { name: 'saveadd', from: 'add', to: 'add' },
	        { name: 'cancel', from: 'add', to: 'addbegin' },
	        { name: 'saveadd', from: 'add', to: 'begin' },
	        { name: 'save', from: 'add', to: 'begin' },
	        { name: 'edit', from: 'add', to: 'add' },
            { name: 'modify', from: 'beginmodify', to: 'modify' },
            { name: 'modify', from: 'addbegin', to: 'modify' },
            { name: 'cancel', from: 'modify', to: 'beginmodify' },
            { name: 'add', from: 'beginmodify', to: 'modify' },

        ]
    };

    function FSM(transitions) {
        this.transitions = transitions;
    }
    var log = function (mes) {
        console.log(mes);
    }

    FSM.prototype = {
        init: function () {
            var self = this;
            this.fsm = new StateMachine({
                transitions: this.transitions,
                methods: {
                    onBeforeTransition: function (lifecycle) {
                        // self.log.call(self, "BEFORE: " + lifecycle.transition, true);
                    },
                    onLeaveState: function (lifecycle) {
                        // self.log.call(self, "LEAVE: " + lifecycle.from);
                    },
                    onEnterState: function (lifecycle) {
                        //self.log.call(self, "ENTER: " + lifecycle.to);
                    },
                    onAfterTransition: function (lifecycle) {
                        //self.log.call(self, "AFTER: " + lifecycle.transition);
                    },
                    onTransition: function (lifecycle) {
                        self.log.call(self, "DURING: " + lifecycle.transition + " (from " + lifecycle.from + " to " + lifecycle.to + ")");
                    },
                    onLeaveRed: function (lifecycle) {
                        return new Promise(function (resolve, reject) {
                            var msg = lifecycle.transition + ' to ' + lifecycle.to;
                            self.log.call(self, "PENDING " + msg + " in ...3");
                            setTimeout(function () {
                                self.log.call(self, "PENDING " + msg + " in ...2");
                                setTimeout(function () {
                                    self.log.call(self, "PENDING " + msg + " in ...1");
                                    setTimeout(function () {
                                        resolve();
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        });
                    }

                }
            });
            //this.fsm.begin();
            //this.fsm.view();
        },
        setOnTransitionListener: function (callback) {
            this.callback = callback;
        },
        get: function () {
            return this.fsm;
        },
        action: function (action) {
            this.fsm[action]();//触发动作
        },
        log: function (mes) {
            this.onTransition(mes)
        },
        cannot: function (action) {
            return this.fsm.cannot(action, true);
        },
        onTransition: function (mes) {
            var self = this;
            if (this.callback)
                setTimeout(function () {
                    self.callback(self.fsm, mes);
                }, 0);

        }
    }

    fsm.instance = FSM;
    return fsm;
})(Page.StateMachine, window, $)

