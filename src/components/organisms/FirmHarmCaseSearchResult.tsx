import * as React from 'react';

import { StyleProp, ViewStyle } from 'react-native';

import FirmHarmCaseItem from './FirmHarmCaseItem';
import { HarmCase } from 'src/container/firmHarmCase/type';
import styled from 'styled-components/native';

const Container = styled.ScrollView``;
const Notice = styled.Text`
  align-self: center;
`;

interface Props {
  harmCaseList: Array<HarmCase> | undefined;
  searchWord: string;
  wrapperStyle?: StyleProp<ViewStyle>;
}
const FirmHarmCaseSearchResult: React.FC<Props> = (props) =>
{
  if (props.harmCaseList.length === 0 ) { return <Notice>{`[${props.searchWord}]는 등록된 피해사례가 없습니다\n 피해사례 없음을 공유 해 보세요`}</Notice> }
  return (
    <Container style={props.wrapperStyle}>
      {props.harmCaseList.map((harmCase) =>
        <FirmHarmCaseItem
          item={harmCase}
          // accountId={user.uid}
          // updateCliEvalu={openUpdateCliEvaluForm}
          // deleteCliEvalu={deleteCliEvalu}
          // openCliEvaluLikeModal={openCliEvaluLikeModal}
          // openDetailModal={evalu => openDetailModal(evalu)}
          // searchTime={searchTime}
        />
      )}
    </Container>
  );
};

export default FirmHarmCaseSearchResult;