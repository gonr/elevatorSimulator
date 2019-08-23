export default class Elevator {
    STANDBY_TIME: number = 3000; // 머무르는 시간 (ms)
    ONE_FLOOR_MOVING_TIME: number = 1000; // 1층 이동하는데 걸리는 시간(ms)
    ONE_FLOOR_Y_PIXEL: number = 100; // 한개층의 엘리먼트 Y축 픽셀

    index: number; // 엘레베이터 인덱스
    currentFloor: number = 1; // 현재 층수
    targetFloorList: number[] = []; // 이동할 층수 리스트
    curTargetFloor: number; // 현재 이동할 층수
    moveTime: number = 0; // 이동을 시작했을때 해당 층까지 걸리는 시간

    isMoving: boolean = false; // 이동중인가?
    stanbyRemain: number = 0; // 남은 머무르는 시간(ms)
    maxFloor: number; // 최대 층수
    parent: HTMLDivElement; // 부모 엘리먼트
    el: HTMLDivElement; // 자기 자신 엘리먼트
    moveAnimation: any; // animation 객체

    constructor(parent, index, maxFloor) {
        this.index = index;
        this.maxFloor = maxFloor;
        this.parent = parent;
        this.render();
    }

    /**
     * 엘리베이터를 1초 간격으로 머무르도록 시킨다.
     */
    setStandBy() {
        setTimeout(() => {
            this.stanbyRemain -= 1000; // 남은 머무는 시간을 빼준다.

            if(this.stanbyRemain !== 0) { // 머무는 시간이 완료되었을 경우
                this.setStandBy();
            } else {
                this.setElNormal();
                this.startMove();
            }
        }, 1000);
    }

    /**
     * 엘레베이터를 이동시킬경우 이동리스트에 저장한다.
     * @param targetFloor
     * @returns {boolean} 해당 층의 버튼을 disable 할껀지 정한다.
     */
    move(targetFloor: number) {
        if(!this.isMoving && this.currentFloor === targetFloor) { // 같은 층이면 무시
            return false;
        }

        // 움직이고 있는 경우 같은 층으로 가야하면 무시, true값을 리턴하여 버튼을 disable 상태로 유지
        if(this.isMoving && this.curTargetFloor === targetFloor) {
            return true;
        }

        // 마지막에 추가된 이동할층과 현재 추가해야할 층이 같을 경우 무시, true값을 리턴하여 버튼을 disable 상태로 유지
        if(this.targetFloorList.length > 0 && this.targetFloorList[this.targetFloorList.length - 1] === targetFloor) {
            return true;
        }

        this.targetFloorList.push(targetFloor); // 이동할 층수 추가

        if(this.isMoving || this.stanbyRemain !== 0) {
            return true;
        }

        this.startMove();
        return true;
    }

    /**
    * 머무는 상태로 만든다.
    */
    setElStandBy() {
        this.isMoving = false;
        this.el.className = 'elevator standby';
        this.el.innerHTML = 'STANDBY';
    }

    /**
    * 이동중 상태로 만든다.
    */
    setElMoving() {
        this.isMoving = true;
        this.el.className = 'elevator moving';
        this.el.innerHTML = 'MOVING';
    }

    /**
    * 사용가능한 상태로 만든다.
    */
    setElNormal() {
        this.isMoving = false;
        this.el.className = 'elevator';
        this.el.innerHTML = '';
    }

    startMove() {
        if (this.targetFloorList.length === 0) {
            return;
        }
        this.setElMoving();
        this.stanbyRemain = this.STANDBY_TIME;
        this.curTargetFloor = this.targetFloorList.shift(); // 이동할 층수 리스트에서 하나를 꺼낸다.

        this.moveTime = Math.abs(this.currentFloor - this.curTargetFloor) * 1000; // 이동하는데 걸리는 시간(ms)
        const newTop = (this.maxFloor - this.curTargetFloor) * this.ONE_FLOOR_Y_PIXEL; // 이동할 top 값
        this.moveAnimation = this.el.animate(
            [
                { transform: this.el.style.transform ? this.el.style.transform : "translate(0)" },
                { transform: `translate(0, ${newTop}px)` }
            ],
            this.moveTime
        );

        this.moveAnimation.onfinish = () => { this.onFinishMove(newTop); };
    }

    /**
     * 이동이 완료되었을 때 실행
     * @param newTop
     */
    onFinishMove(newTop: number) {
        this.currentFloor = this.curTargetFloor;
        this.el.style.transform = `translate(0, ${newTop}px)`;
        this.setElStandBy();
        this.setStandBy();
        this.sendFinishEvent();
    }

    /**
     * 이동완료 후 커스텀 이벤트 호출
     */
    sendFinishEvent() {
        const finishEvent = new CustomEvent('evMoveFinished');
        this.el.dispatchEvent(finishEvent);
    }

    /**
     * 해당 층수까지 걸리는 시간을 리턴한다.
     * @param floor
     * @returns {number}
     */
    getDistance(floor: number) {
        let distance: number = 0;

        // 이동할 층이 남아 있는지 보고 계산한다.
        this.targetFloorList.forEach((savedFloor, idx, list) => {
            const prevFloor = idx === 0 ? (this.isMoving ? this.curTargetFloor : this.currentFloor) : list[idx - 1]; // 이동하기 바로 이전의 층수
            // 이동 시간과 대기 시간을 더해준다.
            distance += Math.abs(prevFloor - savedFloor) * this.ONE_FLOOR_MOVING_TIME + this.STANDBY_TIME;
            if (list.length - 1 === idx && savedFloor === floor) { // 가야할 마지막 층과 같은 층일 경우 대기 시간을 더하지 않는다.
                distance -= this.STANDBY_TIME;
            }
        });

        // 이동 시간 계산
        if (this.isMoving) {
            distance += this.moveTime - Math.round(this.moveAnimation.currentTime); // 이동끝날 때까지 남은 시간을 더한다.
            distance += Math.abs(this.curTargetFloor - floor) * this.ONE_FLOOR_MOVING_TIME; // 이동할 층까지 이동 시간을 더한다.
        } else {
            distance += Math.abs(this.currentFloor - floor) * this.ONE_FLOOR_MOVING_TIME; // 이동할 층까지 이동 시간을 더한다.
        }

        // 머무르는 시간 계산
        if (this.isMoving && this.curTargetFloor !== floor) { // 이동중이고 이동하는 층이 다를 경우
            distance += this.stanbyRemain;
        } else if (!this.isMoving && this.currentFloor !== floor) {// 이동중이 아니고 현재 층이과 다를 경우
            distance += this.stanbyRemain;
        }
        return distance;
    }

    render() {
        const elevatorWrap = document.createElement('div');
        elevatorWrap.className = `vert`;
        elevatorWrap.innerHTML = `<div class="elevator" style="transform: translate(0, ${this.ONE_FLOOR_Y_PIXEL * (this.maxFloor - 1)}px);"></div>`;
        this.parent.insertAdjacentElement('beforeend', elevatorWrap);
        this.el = elevatorWrap.children[0] as HTMLDivElement;
    }

    getElement() {
        return this.el;
    }

    getCurrentFloor() {
        return this.currentFloor;
    }
}
