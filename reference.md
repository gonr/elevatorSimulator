#Elevator Simulator API Reference


##`activateFloor` 함수
넘겨 받은 층의 버튼을 화성화 시킨다.

### Parameter
`floor` {Number} : 활성화 시킬 층수
### Return
`void`

### Useage
```javascript
activateFloor(4); // 4층 버튼 활성화
```


##`isActivatedFloor` 함수
해당층 버튼이 활성화 중인지 확인한다.

### Parameter
`floor` {Number} : 확인할 층수
### Return
`true` {Boolean} : 활성화 여부

### Useage
```javascript
isActivatedFloor(4); // 활성화 된경우: true, 되지 않은경우: false
```