var _FSM = {};

_FSM["card_fsm"] = {
    name: "卡片状态机",
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
        { name: 'init', from: 'none', to: 'none' },
        { name: 'view', from: 'none', to: 'begin' },
        { name: 'modify', from: 'begin', to: 'modify' },
        { name: 'adddown', from: 'begin', to: 'modify' },
        { name: 'delete', from: 'begin', to: 'begin' },
        { name: 'add', from: 'modify', to: 'modify' },
        { name: 'cancel', from: 'modify', to: 'begin' },
        { name: 'save', from: 'modify', to: 'begin' },
        { name: 'saveadd', from: 'modify', to: 'add' },
        { name: 'delete', from: 'modify', to: 'modify' },
        { name: 'cancel', from: 'add', to: 'begin' },
        { name: 'saveadd', from: 'add', to: 'begin' },
        { name: 'save', from: 'add', to: 'begin' },
        { name: 'edit', from: 'add', to: 'add' },
        { name: 'edit', from: 'modify', to: 'modify' }
    ]
};