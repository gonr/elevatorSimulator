import Elevator from './Elevator';
import Button from './Button';

export default class Main {
    floorCount: number = 5; // 층 수
    evCount: number = 4; // 엘레베이터 수
    param: IinitialValue = {elevatorCount: 4, floorCount: 5};

    elevatorList: any[] = [];
    buttonList: any[] = [];
    btnWrap: HTMLElement;
    wrap: HTMLElement;
    wm = new WeakMap();

    constructor(param) {
        this.param = param;
        this.cacheElement();
        this.setWrapElementSize();
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
        for(let i=0; i< this.param.floorCount; i++) {
            const btn = new Button(this.btnWrap, i, this.param.floorCount);
            this.wm.set(btn.getElement(), btn); // WeakMap으로 버튼 element에 버튼 Object를 맵핑한다
            this.buttonList.push(btn);
        }

        // 엘레베이터  생성
        for(let i=0; i< this.param.elevatorCount; i++) {
            const ev = new Elevator(this.wrap, i, this.param.floorCount);
            this.wm.set(ev.getElement(), ev); // WeakMap으로 엘레베이터 element에 엘레베이터 Object를 맵핑한다
            this.elevatorList.push(ev);
        }
    }

    setWrapElementSize() {
        const FLOOR_HEIGHT = 100;
        const EV_GAP_DEFAULT = 240;
        const EV_GAP = 120;
        this.wrap.style.height = `${this.param.floorCount * FLOOR_HEIGHT}px`;
        this.wrap.style.width = `${EV_GAP_DEFAULT + this.param.elevatorCount * EV_GAP}px`;
    }
    
    /**
     * 엘레베이터가 정지했을 때 이벤트 핸들러
     * @param e
     */
    onEvMoveFinished(e : MouseEvent) {
        const ev = this.wm.get(e.target);
        this.buttonList[ev.getCurrentFloor() - 1].enable();
    }

    /**
     * 엘레베이터 버튼을 클릭했을 때 이벤트 핸들러
     * @param e
     */
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

    /**
     * 가장 가까이에 있는 엘레베이터를 찾아서 부른다
     * @param e
     */
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
