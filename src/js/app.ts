import Main from './component/Main';

class App {
    oMain: Main;
    constructor(param: IinitialValue) {
        this.oMain = new Main(param) as Main;
        this.setWindowFunc();
    }

    setWindowFunc() {
        window.activateFloor = (floor: number) => {
            this.oMain.activateFloor(floor);
        };

        window.isActivatedFloor = (floor: number) => {
            return this.oMain.isActivatedFloor(floor);
        };
    }
}

new App({ elevatorCount: 4, floorCount: 5});