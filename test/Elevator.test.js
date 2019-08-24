import Elevator from '../src/js/component/Elevator';

describe('Elevator Class Test', () => {
    // Mock Element
    document.body.innerHTML = `<div class="wrap">
            <div id="btnWrap"></div>
            <div class="elevator"></div>
        </div>`;
    const testEv = new Elevator(document.querySelector('.wrap'), 3, 10);

    test('초기값 확인', () => {
        expect(testEv.index).toEqual(3);
        expect(testEv.maxFloor).toEqual(10);
        expect(testEv.parent).toMatchObject(document.querySelector('.wrap'));
    });

    test('setStandBy 함수 테스트', () => {
        jest.useFakeTimers();

        testEv.setStandBy();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    });

    test('setElStandBy 함수 테스트', () => {
        testEv.setElStandBy();
        expect(testEv.isMoving).toBeFalsy();
        expect(testEv.el.className).toEqual('elevator standby');
        expect(testEv.el.innerHTML).toEqual('STANDBY');
    });

    test('setElMoving 함수 테스트', () => {
        testEv.setElMoving();
        expect(testEv.isMoving).toBeTruthy();
        expect(testEv.el.className).toEqual('elevator moving');
        expect(testEv.el.innerHTML).toEqual('MOVING');
    });

    test('setElNormal 함수 테스트', () => {
        testEv.setElNormal();
        expect(testEv.isMoving).toBeFalsy();
        expect(testEv.el.className).toEqual('elevator');
        expect(testEv.el.innerHTML).toEqual('');
    });

    describe('move 함수 테스트', () => {
        test('이동중아님, 현재층과 같은층으로 이동할 경우', () => {
            testEv.startMove = jest.fn();
            Object.assign(testEv, {
                targetFloorList: [],
                isMoving: false,
                currentFloor: 2,
                curTargetFloor: 2
            });
            expect(testEv.move(2)).toBeFalsy();
            expect(testEv.targetFloorList.length).toEqual(0);
            expect(testEv.startMove).not.toBeCalled();
        });

        test('이동중아님, 현재층과 다른층으로 이동할 경우', () => {
            testEv.startMove = jest.fn();
            Object.assign(testEv, {
                targetFloorList: [],
                isMoving: false,
                currentFloor: 2,
                curTargetFloor: 2
            });
            expect(testEv.move(3)).toBeTruthy();
            expect(testEv.targetFloorList.length).toEqual(1);
            expect(testEv.startMove).toBeCalled();
        });

        test('이동중이고, 이동할층과 같은층으로 이동할 경우', () => {
            testEv.startMove = jest.fn();
            Object.assign(testEv, {
                targetFloorList: [],
                isMoving: true,
                currentFloor: 2,
                curTargetFloor: 3
            });

            expect(testEv.move(3)).toBeTruthy();
            expect(testEv.targetFloorList.length).toEqual(0);
            expect(testEv.startMove).not.toBeCalled();
        });

        test('예약된 마지막 층과 이동할 층이 같은 경우', () => {
            testEv.startMove = jest.fn();
            Object.assign(testEv, {
                targetFloorList: [2, 3],
                isMoving: true,
                currentFloor: 1,
                curTargetFloor: 2
            });

            expect(testEv.move(3)).toBeTruthy();
            expect(testEv.targetFloorList.length).toEqual(2);
            expect(testEv.startMove).not.toBeCalled();
        });
    });

    describe('getDistance 함수 테스트', () => {
        test('예약된 층수 없음, 이동중아님, 대기중 아님, 현재 1층', () => {
            const currentFloor = 1;
            const targetFloor = 1;
            Object.assign(testEv, {
                targetFloorList: [],
                curTargetFloor: targetFloor,
                isMoving: false,
                stanbyRemain: 0,
                moveTime: Math.abs(currentFloor - targetFloor) * testEv.ONE_FLOOR_MOVING_TIME,
                currentFloor: currentFloor,
                moveAnimation: {
                    currentTime: 1000
                }
            });

            expect(testEv.getDistance(1)).toEqual(0);
            expect(testEv.getDistance(2)).toEqual(1000);
            expect(testEv.getDistance(4)).toEqual(3000);
            expect(testEv.getDistance(6)).toEqual(5000);
        });

        test('예약된 층수 없음, 3층으로 이동중, 대기중 아님, 현재 1층', () => {
            const currentFloor = 1;
            const targetFloor = 3;
            Object.assign(testEv, {
                targetFloorList: [],
                curTargetFloor: targetFloor,
                isMoving: true,
                stanbyRemain: 3000,
                moveTime: Math.abs(currentFloor - targetFloor) * testEv.ONE_FLOOR_MOVING_TIME,
                currentFloor: currentFloor,
                moveAnimation: {
                    currentTime: 1000
                }           
            });

            expect(testEv.getDistance(1)).toEqual(6000);
            expect(testEv.getDistance(2)).toEqual(5000);
            expect(testEv.getDistance(4)).toEqual(5000);
            expect(testEv.getDistance(6)).toEqual(7000);
        });


        test('예약된 층수 있음, 3층으로 이동중, 대기중 아님, 현재 1층', () => {
            const currentFloor = 1;
            const targetFloor = 3;
            Object.assign(testEv, {
                targetFloorList: [5, 2],
                curTargetFloor: targetFloor,
                isMoving: true,
                stanbyRemain: 3000,
                moveTime: Math.abs(currentFloor - targetFloor) * testEv.ONE_FLOOR_MOVING_TIME,
                currentFloor: currentFloor,
                moveAnimation: {
                    currentTime: 1000
                }
            });

            expect(testEv.getDistance(1)).toEqual(17000);
            expect(testEv.getDistance(2)).toEqual(13000);
            expect(testEv.getDistance(4)).toEqual(16000);
            expect(testEv.getDistance(6)).toEqual(18000);
        });
    });
});

