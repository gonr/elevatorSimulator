export default class Button {
    index: number; // 버튼 인덱스
    maxFloor: number; // 최대 층수
    parent: HTMLDivElement; // 부모 엘리먼트
    el: HTMLButtonElement; // 자기 자신 엘리먼트

    constructor(parent, index, maxFloor) {
        this.index = index;
        this.maxFloor = maxFloor;
        this.parent = parent;
        this.render();
    }
    
    render() {
        this.el = document.createElement('button');
        this.el.id = `btn${this.index}`;
        this.el.innerHTML = `${this.index + 1}층`;
        this.parent.insertAdjacentElement('afterbegin', this.el);
    }

    disable() {
        this.el.className = 'disabled';
        this.el.disabled = true;
    }

    enable() {
        this.el.className = '';
        this.el.disabled = false;
    }

    isActivated() {
        return this.el.disabled === true;
    }
    
    getElement() {
        return this.el;
    }

    getFloor() {
        return this.index + 1;
    }
}
