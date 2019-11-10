import React from 'react';
import styled from 'styled-components';
import CardButton from 'molecules/CardButton';
const ActiCntersWrap = styled.View `
  flex-direction: row;
`;
function FirmDmgCaseActiCnters(props) {
    return (<ActiCntersWrap>
      <CardButton title="전체 글" value="5,000" action="최신 피해사례 조회하기" onPress={() => console.log('onPress 전체글')}/>
      <CardButton title="내 글" value="30" action="최신 피해사례 조회하기" onPress={() => console.log('onPress 내 글')}/>
    </ActiCntersWrap>);
}
export default FirmDmgCaseCnterAction;
//# sourceMappingURL=FirmDmgCaseActiCnters.js.map