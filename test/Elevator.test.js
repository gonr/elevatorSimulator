import Elevator from '../src/js/component/Elevator';

describe('Elevator Class Test', () => {
    // Mock Element
    document.body.innerHTML = `<div class="wrap">
            <div id="btnWrap"></div>
            <div class="elevator"></div>
        </div>`;
    const testEv = new Elevator(document.getElementById('btnWrap'), 5, 10);

    test('초기값 확인', () => {
        expect(testButton.index).toEqual(5);
        expect(testButton.maxFloor).toEqual(10);
    });

    test('disable 함수 테스트', () => {
        testButton.disable();
        expect(testButton.el.className).toEqual('disabled');
        expect(testButton.el.disabled).toBeTruthy();
    });

    test('enable 함수 테스트', () => {
        testButton.enable();
        expect(testButton.el.className).toEqual('');
        expect(testButton.el.disabled).toBeFalsy();
    });

    test('getElement 함수 테스트', () => {
        expect(testButton.getFloor()).toEqual(5 + 1);
    });

    test('getFloor 함수 테스트', () => {
        expect(testButton.getElement()).toMatchObject(document.getElementById('btnWrap'));
    });
});

