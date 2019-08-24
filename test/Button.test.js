import Button from '../src/js/component/Button';

describe('Button Class Test', () => {
    // Mock Element
    document.body.innerHTML = `<div class="wrap">
            <div id="btnWrap"><button id="testBtn"></button></div>
            <div class="elevator"></div>
        </div>`;
    const testButton = new Main(document.getElementById('testBtn'), 5, 10);

    test('초기값 확인', () => {
        expect(testButton.index).toEqual(5);
        expect(testMain.maxFloor).toEqual(10);
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

