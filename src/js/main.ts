import Elevator from './Elevator';
import Button from './Button';

export default class Main {
    MAX_FLOOR_COUNT: number = 5;
    MAX_ELEVATOR_COUNT: number = 4;
    elevatorList: any[] = [];
    buttonList: any[] = [];
    btnWrap: HTMLElement;
    wrap: HTMLElement;
    wm = new WeakMap();

    constructor() {
        this.cacheElement();
        this.init();
        this.setEvent();
    }
    
    cacheElement() {
        this.btnWrap = document.querySelector('#btnWrap');
        this.wrap = document.querySelector('.wrap');
    }

    setEvent() {
        this.btnWrap.onclick = e => {this.onClickBtn(e);};
        document.querySelectorAll('.elevator').forEach((el) => {
            el.addEventListener('evMoveFinished', (e) => {this.onEvMoveFinished(e);});
        })
    }
    
    init() {
        for(let i=0; i< this.MAX_FLOOR_COUNT; i++) {
            const btn = new Button(this.btnWrap, i, this.MAX_FLOOR_COUNT);
            this.wm.set(btn.getElement(), btn);
            this.buttonList.push(btn);
        }
        for(let i=0; i< this.MAX_ELEVATOR_COUNT; i++) {
            const ev = new Elevator(this.wrap, i, this.MAX_FLOOR_COUNT);
            this.wm.set(ev.getElement(), ev);
            this.elevatorList.push(ev);
        }
    }

    onEvMoveFinished(e) {
        const ev = this.wm.get(e.target);
        this.buttonList[ev.getCurrentFloor() - 1].enable();
    }

    onClickBtn(e) {
        if(e.target.tagName !== 'BUTTON') {
            return;
        }
        const btn = this.wm.get(e.target);
        btn.disable();
        const isMovalble = this.callElevator(btn.getFloor());
        // 이동하지 않을 경우 바로 버튼을 enable 시킨다.
        if (!isMovalble) {
            btn.enable();
        }
    }

    callElevator(floor: number) {
        // 가장 가까이 있는 엘레베이터를 찾는다.
        const closestElevator = this.elevatorList.reduce((closestElevator, elevator, idx) => {
            if(closestElevator.getDistance(floor) > elevator.getDistance(floor)) {
                closestElevator = elevator;
            }
            return closestElevator;
        }, this.elevatorList[0]);

        return closestElevator.move(floor);
    }
}
