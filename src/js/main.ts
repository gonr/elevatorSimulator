import Elevator from './Elevator';
import Button from './Button';

export default class Main {
    MAX_FLOOR_COUNT: number = 5; // 층 수
    MAX_ELEVATOR_COUNT: number = 4; // 엘레베이터 수

    elevatorList: any[] = [];
    buttonList: any[] = [];
    btnWrap: HTMLElement;
    wrap: HTMLElement;
    wm = new WeakMap();

    constructor() {
        this.cacheElement();
        this.wrap.style.height = `${this.MAX_FLOOR_COUNT * 100}px`;
        this.wrap.style.width = `${240 + this.MAX_ELEVATOR_COUNT * 120}px`;
        this.init();
        this.setEvent();
    }

    cacheElement() {
        this.btnWrap = document.querySelector('#btnWrap');
        this.wrap = document.querySelector('.wrap');
    }

    setEvent() {
        this.btnWrap.onclick = (e : MouseEvent) => {this.onClickBtn(e);};
        document.querySelectorAll('.elevator').forEach((el: HTMLDivElement) => {
            el.addEventListener('evMoveFinished', (e: MouseEvent) => {this.onEvMoveFinished(e);});
        })
    }

    init() {
        // 버튼 생성
        for(let i=0; i< this.MAX_FLOOR_COUNT; i++) {
            const btn = new Button(this.btnWrap, i, this.MAX_FLOOR_COUNT);
            this.wm.set(btn.getElement(), btn); // WeakMap으로 버튼 element에 버튼 Object를 맵핑한다
            this.buttonList.push(btn);
        }

        // 엘레베이터  생성
        for(let i=0; i< this.MAX_ELEVATOR_COUNT; i++) {
            const ev = new Elevator(this.wrap, i, this.MAX_FLOOR_COUNT);
            this.wm.set(ev.getElement(), ev); // WeakMap으로 엘레베이터 element에 엘레베이터 Object를 맵핑한다
            this.elevatorList.push(ev);
        }
    }

    /**
     * 엘레베이터가 정지했을 때 이벤트 핸들러
     * @param e
     */
    onEvMoveFinished(e : MouseEvent) {
        const ev = this.wm.get(e.target);
        this.buttonList[ev.getCurrentFloor() - 1].enable();
    }

    onClickBtn(e: MouseEvent) {
        if((e.target as HTMLButtonElement).tagName !== 'BUTTON') {
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
        const closestElevator = this.elevatorList.reduce((closestElevator, elevator) => {
            if(closestElevator.getDistance(floor) > elevator.getDistance(floor)) {
                closestElevator = elevator;
            }
            return closestElevator;
        }, this.elevatorList[0]);

        return closestElevator.move(floor);
    }
}
