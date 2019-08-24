import Button from '../src/js/component/Button';
import Elevator from '../src/js/component/Elevator';
import Main from '../src/js/component/Main';
jest.mock('../src/js/component/Button', () => jest.fn());
jest.mock('../src/js/component/Elevator', () => jest.fn());

Button.mockImplementation(() => ({
    getElement: () => {
        return document.createElement('button');
    }
}));

Elevator.mockImplementation(() => ({
    getElement: () => {
        return document.createElement('div')
    }
}));

beforeEach(() => {
    Button.mockClear();
    Elevator.mockClear();
});

describe('Main Class Test', () => {
    // Mock Element
    document.body.innerHTML = `<div class="wrap">
            <div id="btnWrap"><button id="testBtn"></button></div>
            <div class="elevator"></div>
        </div>`;
    const testMain = new Main({ elevatorCount: 4, floorCount: 5});

    test('초기값 확인', () => {
        expect(testMain.evCount).toEqual(4);
        expect(testMain.floorCount).toEqual(5);
    });

    test('Instance 생성 확인', () => {
        expect(testMain.elevatorList.length).toEqual(4);
        expect(testMain.buttonList.length).toEqual(5);
    });

    test('Wrap Element Size 확인', () => {
        const wrapEl = document.querySelector('.wrap');
        expect(wrapEl.style.height).toEqual(`${5 * 100}px`);
        expect(wrapEl.style.width).toEqual(`${240 + 4 * 120}px`);
    });

    test('버튼 클릭 테스트', () => {
        testMain.onClickBtn = jest.fn();
        document.querySelector('#btnWrap').click();
        expect(testMain.onClickBtn).toBeCalled();
    });

    test('엘레베이터 커스텀 이벤트 테스트', () => {
        testMain.onEvMoveFinished = jest.fn();
        document.querySelector('.elevator').dispatchEvent(new CustomEvent('evMoveFinished'));
        expect(testMain.onEvMoveFinished).toBeCalled();
    });

    test('callElevator 함수 테스트', () => {
        describe('가장 가까운 엘베를 부른다', () => {
            testMain.elevatorList = [
                {getDistance: () => 5, move: () => 1},
                {getDistance: () => 3, move: () => 2},
                {getDistance: () => 2, move: () => 3},
                {getDistance: () => 1, move: () => 4}
            ];
            expect(testMain.callElevator()).toEqual(4);
            testMain.elevatorList = [
                {getDistance: () => 5, move: () => 1},
                {getDistance: () => 1, move: () => 2},
                {getDistance: () => 2, move: () => 3},
                {getDistance: () => 3, move: () => 4}
            ];
            expect(testMain.callElevator()).toEqual(2);
        });

        describe('같은 거리일 경우 첫번째 엘베를 부른다', () => {
            testMain.elevatorList = [
                {getDistance: () => 1, move: () => 1},
                {getDistance: () => 1, move: () => 2},
                {getDistance: () => 1, move: () => 3},
                {getDistance: () => 1, move: () => 4}
            ];
            expect(testMain.callElevator()).toEqual(1);
        });
    });

});

