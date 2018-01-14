var CalcManger = {
    add: function (id, value) {
        this.data = this.data || {};
        this.data[id] = value;
    },
    remove: function (id) {

        this.data = this.data || {};
        delete this.data[id];
    },
    get: function () {
        return this.data;
    },
    set: function (value) {
        this.data = value;
    }
};