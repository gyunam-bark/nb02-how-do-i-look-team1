// test.js
function processData(data, _options) {
  // _options는 파라미터로 받았지만, 이 함수 내에서 직접 사용하지 않습니다.
  // ESLint는 이 경우 'no-unused-vars' 규칙에 의해 경고를 낼 수 있습니다.
  // 하지만 설정에서 _로 시작하는 변수를 무시하도록 했으므로 문제가 없어야 합니다.
  console.log('데이터를 처리 중입니다:', data);

  const _internalHelper = '임시 내부 변수';
  // _internalHelper 역시 선언되었지만, 직접 사용되지 않습니다.
  // 이 변수도 ESLint 규칙에 의해 무시되어야 합니다.

  if (data.length > 5) {
    console.log('데이터 길이가 5보다 큽니다.');
  }

  // 이 변수는 사용되므로 ESLint 경고가 발생해서는 안 됩니다.
  const usedVariable = '사용된 변수';
  console.log(usedVariable);

  // 이 변수는 사용되지 않으므로 ESLint 경고가 발생해야 합니다.
  // (만약 no-unused-vars를 'off'로 설정했다면 경고가 발생하지 않을 수 있습니다.)
  const unusedButNotUnderscore = '사용되지 않은 변수';
  // console.log(unusedButNotUnderscore); // 이 줄을 주석 해제하면 경고가 사라집니다.

  return data;
}

processData('hello world', { mode: 'full' });
processData('short', { mode: 'lite' });

// prettier 규칙 테스트를 위한 잘못된 포맷팅
const testArray = [1,2,3]; // 콤마 뒤에 공백이 없으므로 prettier 경고 예상