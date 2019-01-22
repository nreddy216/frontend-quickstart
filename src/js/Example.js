import Component from './Component';

// Example of how other modules extend from base Component module
export default class Example extends Component {
    constructor(id) {
        super(id);
    }

    _elements() {
        this.bodyEl = document.querySelector('body');
    }
}
