export default class Component {
    constructor(id) {
        this.el = document.getElementById(id);
    }

    init() {
        this._elements();
        this._events();
        return this;
    }

    _elements() {}

    _events() {}
}
