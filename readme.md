# 사용된 라이브러리
1. `Weback4` : Bundling
1. `Babel6` : Transpiling
1. `Typescript3` : Typescripting
1. `Jest` : Testing


# 실행항법
이미 빌드되어 전달 드리므로 index.html 을 열어주시면 되니다

# 테스트(Jest)
```
npm install
npm test
```

# 모듈 구조
- `app.ts` entry point이고 외부 접근 가능한 전역변수를 셋팅한다.
- `/component/Main.ts` 버튼과 엘레베이터 instance 생성 및 event binding을 한다
- `/component/Button.ts` 각 층의 버튼 클래스로 버튼 활성화 비활성화를 담당한다.
- `/component/Elevator.ts` 엘레베이터 클래스로 이동 에니메이션 구현과 해당 층 이동시 이동시간을 계산한다


# 특이사항
- 엘레베이터, 층수 셋팅은 /src/js/app.ts에서 설정할수 있습니다
```javascript
new App({ elevatorCount: 4, floorCount: 5});
```
- 엘레베이터 개수와 층수의 limit는 두지 않았습니다. 다음과 같이 10개 20개 씩도 가능합니다.
```javascript
new App({ elevatorCount: 10, floorCount: 20});
```

- 각 엘레베이터는 이동할 층수를 저장해두는 배열을 가지고 있어서 많은 층수가 눌리더라도 모두 순서에 따라 이동합니다.