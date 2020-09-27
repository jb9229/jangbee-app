import * as React from 'react';

import { NativeSyntheticEvent, StyleProp, TextInput, TextInputEndEditingEventData, ViewStyle } from 'react-native';

import ClientEvaluDetailModal from 'templates/ClientEvaluDetailModal';
import { DefaultStyledProps } from 'src/theme';
import FirmHarmCaseSearchResult from '../organisms/FirmHarmCaseSearchResult';
import Indicator from '../atoms/ActivityIndicator';
import RoundButton from '../atoms/button/RoundButton';
import { SimpleLineIcons } from '@expo/vector-icons';
import { formatTelnumber } from 'src/utils/StringUtils';
import moment from 'moment';
import styled from 'styled-components/native';
import { useFirmHarmCaseSearchContext } from 'src/contexts/FirmHarmCaseSearchContext';

interface StyledProps extends DefaultStyledProps {
  searched?: boolean;
}
// Styled Component
const Container = styled.View`flex: 1;`;
const CallLatestHistoryWrap = styled.View``;
const CallLatestHistoryHeaderWrap = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-top: 20;
  margin-bottom: 15;
  padding-left: 10;
`;
const CallLatestHistoryBodyWrap = styled.ScrollView<StyledProps>`
  height: 200;
  padding-left: 10;
  padding-right: 10;
`;
const SearchResultSeperator = styled.View<StyledProps>`
  height: ${(props) => props.searched ? 1 : 20};
  background-color: ${(props): string => props.theme.ColorBGGray};
  border-top-width: 1;
  border-bottom-width: 1;
  border-color: ${(props): string => props.theme.ColorBGDarkGray};
`;
const CallHistoryTableRow = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  height: 50;
`;
const CallLatestTitle = styled.Text`
  margin-left: 10;
  padding-bottom: 5;
`;
const CallHistoryPhoneNumber = styled.Text``;
const SearchResultWrap = styled.View`flex: 1;`;
const SearchWrap = styled.View``;
const SearchTextInput = styled.TextInput`
  padding-top: 15;
  padding-left: 5;
  padding-bottom: 10;
  font-size: 18;
  border-bottom-width: 1;
  border-color: ${(props): string => props.theme.ColorBorderTextInput};
`;
const SearchInfoWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15;
  margin-left: 8;
  margin-right: 8;
  margin-bottom: 18;
`;
const SearchWord = styled.Text`
  font-family: ${(props): string => props.theme.FontMiddleTitle};
  font-size: 16;
  font-weight: bold;
`;
const SeachCancelBtn = styled(RoundButton).attrs(() => ({
  wrapperStyle: {
    width: 20,
    height: 25,
    borderRadius: 20
  }
}))``;

interface Props {
  wrapperStyle?: StyleProp<ViewStyle>;
}
const FirmHarmCaseSearchLayout: React.FC<Props> = (props) =>
{
  const searchTextInputRef = React.useRef<TextInput>();
  React.useEffect(() => {
    searchTextInputRef.current.focus();
  },[])
  const {
    searched, harmCaseList, searchWord, searchTime, detailEvalu,
    visibleDetailModal,
    onCancelSearch, onSearchWordEndEditing, closeFirmHarmCaseDetailModal
  } = useFirmHarmCaseSearchContext();

  return (
    <Container style={props.wrapperStyle}>
      {!searched && (
        <>
          <SearchWrap>
            <SearchTextInput
              ref={searchTextInputRef}
              placeholder="전화번호 | 업체명 | 사업자번호로 검색하세요"
              onEndEditing={(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => onSearchWordEndEditing(e?.nativeEvent?.text)}
            />
          </SearchWrap>
        </>
      )}
      {searched && (
        <SearchResultWrap>
          <SearchInfoWrap>
            <SearchWord>{searchWord}</SearchWord>
            <SeachCancelBtn iconDelete={true} onClick={() => onCancelSearch()} />
          </SearchInfoWrap>
          <FirmHarmCaseSearchResult
            harmCaseList={harmCaseList}
            searchWord={searchWord}
            searchTime={searchTime}
          />
        </SearchResultWrap>
      )}
      <ClientEvaluDetailModal
        isVisibleModal={visibleDetailModal}
        detailEvalu={detailEvalu}
        closeModal={() => closeFirmHarmCaseDetailModal()}
        completeAction={() => {}}
        size="full"
        searchTime={searchTime}
      />
    </Container>
  );
};

export default FirmHarmCaseSearchLayout;