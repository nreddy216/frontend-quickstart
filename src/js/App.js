import Example from './Example';

export default class App {
    constructor() {
        this.example = new Example('test');
    }

    init() {
        this.example.init();
    }
}
