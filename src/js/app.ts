import Main from './component/Main';

interface ImainClass {
    new (): Main;
}

class App {
    oMain: ImainClass;
    constructor() {
        this.oMain = new Main({ elevatorCount: 4, floorCount: 5}) as ImainClass;
    }
}

new App();