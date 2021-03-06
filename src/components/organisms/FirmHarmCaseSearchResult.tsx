import * as React from 'react';

import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';

import FirmHarmCaseItem from './FirmHarmCaseItem';
import { FlatList } from 'react-native-gesture-handler';
import { HarmCase } from 'src/container/firmHarmCase/type';
import Indicator from '../atoms/ActivityIndicator';
import JBButton from '../molecules/JBButton';
import LoadingIndicator from '../molecules/LoadingIndicator';
import moment from 'moment';
import { shareNotExistCEvalu } from 'src/container/firmHarmCase/searchAction';
import styled from 'styled-components/native';
import { useFirmHarmCaseSearchContext } from 'src/contexts/FirmHarmCaseSearchContext';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.View`
  flex: 1;
`;
const FirmHarmCaseFlatList = styled(FlatList).attrs(() => ({
  wrapperStyle: {
    flex: 1,
  },
}))``;
const NoticeWrap = styled.View`
  height: 300;
  justify-content: space-around;
`;
const Notice = styled.Text`
  align-self: center;
`;

interface Props {
  harmCaseList: Array<HarmCase> | undefined;
  searchWord: string;
  searchTime: Date;
  wrapperStyle?: StyleProp<ViewStyle>;
}
const FirmHarmCaseSearchResult: React.FC<Props> = props => {
  const { userProfile } = useLoginContext();
  const {
    loading,
    openDetailModal,
    deleteFirmHarmCase,
    openUpdateFirmHarmCase,
    onEndReachedCaseList,
  } = useFirmHarmCaseSearchContext();
  console.log('>>> loading: ', loading);
  const searchTimeStr = moment(props.searchTime).format('YYYY-MM-DD HH:mm');

  if (props.harmCaseList?.length === 0 && !loading) {
    return (
      <Container>
        <NoticeWrap>
          <Notice>{`[${props.searchWord}]는 등록된 피해사례가 없습니다`}</Notice>
          <Notice>피해사례 없음을 공유 해 보세요</Notice>
          <JBButton
            title={`'${props.searchWord}' 피해사례 없음 공유`}
            onPress={() => shareNotExistCEvalu(props.searchWord, searchTimeStr)}
            align="center"
            Secondary
          />
        </NoticeWrap>
      </Container>
    );
  }

  if (props.harmCaseList?.length === 0 && loading) {
    return <Indicator />;
  }

  return (
    <Container style={props.wrapperStyle}>
      <FirmHarmCaseFlatList
        data={props.harmCaseList}
        onEndReachedThreshold={0.4}
        onEndReached={onEndReachedCaseList}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        renderItem={({ item, index }) => (
          <FirmHarmCaseItem
            key={`KEY_${index}`}
            item={item.node}
            searchTime={searchTimeStr}
            accountId={userProfile.uid}
            updateCliEvalu={openUpdateFirmHarmCase}
            deleteCliEvalu={deleteFirmHarmCase}
            // openCliEvaluLikeModal={openCliEvaluLikeModal}
            openDetailModal={evalu => openDetailModal(evalu)}
          />
        )}
      />
    </Container>
  );
};

export default FirmHarmCaseSearchResult;
