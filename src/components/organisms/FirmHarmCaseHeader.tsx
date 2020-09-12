import * as React from 'react';

import styled, { DefaultTheme, withTheme } from 'styled-components/native';

import { EvaluListType } from 'src/container/firmHarmCase/type';
import { FirmHarmCaseCountData } from 'types/index';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

const HeaderWrap = styled.View`
  margin-top: 10;
  margin-left: 3;
  margin-right: 3;
  padding-top: 3;
  padding-right: 3;
  padding-left: 3;
  padding-bottom: 3;
`;
const HeaderTopWrap = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;
const SearchNoticeWrap = styled.View`
  padding: 10px;
  justify-content: space-between;
  background-color: ${colors.batangDark};
  elevation: 14;
  border-radius: 8;
`;
const SearchCountWrap = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 14;
`;
const SearchNoticeText = styled.Text`
  color: ${colors.pointDark};
  font-family: ${fonts.batang};
  justify-content: center;
  font-size: 18;
  margin-bottom: 8;
`;
const TotalHarmCaseCount = styled.Text`
  color: ${colors.pointDark};
  font-family: ${fonts.batang};
  justify-content: center;
  font-size: 18;
  margin-bottom: 8;
  text-decoration-line: underline;
`;
const MyHarmCaseCount = styled.Text`
  color: ${colors.pointDark};
  font-family: ${fonts.batang};
  justify-content: center;
  font-size: 18;
  margin-bottom: 8;
  text-decoration-line: underline;
`;
const MyHarmCaseCountWrap = styled.TouchableOpacity``;
const TotalHarmCaseCountTO = styled.TouchableOpacity``;

const PickerArrow = styled.Text`
  color: ${colors.pointDark};
`;
const SearchTO = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  /* background-color: ${(props): string => props.theme.ColorBGLightGray}; */
`;
const SearchText = styled.Text`
  font-size: 21;
  margin-left: 15;
  color: ${(props) => props.theme.ColorPrimaryDark};
`;

interface Props {
  theme: DefaultTheme;
  countData: FirmHarmCaseCountData;
  onClickSearch: () => void;
  onClickMyEvaluList: () => void;
  onClickTotalEvaluList: () => void;
}

const FirmHarmCaseHeader: React.FC<Props> = (props: Props) =>
{
  return (
    <HeaderWrap removeClippedSubviews={false}>
      <SearchNoticeWrap>
        <SearchTO onPress={props.onClickSearch}>
          <MaterialCommunityIcons name="account-search" size={34} color={props.theme.ColorPrimaryDark} />
          <SearchText>피해사례를 조회해 드릴게요.</SearchText>
        </SearchTO>
      </SearchNoticeWrap>
      <SearchCountWrap>
        <TotalHarmCaseCountTO
          onPress={props.onClickTotalEvaluList}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <TotalHarmCaseCount>
            {`전체글: ${props.countData ? props.countData.totalCnt : '-'}`}
          </TotalHarmCaseCount>
        </TotalHarmCaseCountTO>
        <SearchNoticeText>
          {'  |  '}
        </SearchNoticeText>
        <MyHarmCaseCountWrap
          onPress={props.onClickMyEvaluList}
          hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
        >
          <MyHarmCaseCount>
            {`내글: ${props.countData ? props.countData.myCnt : '-'}`}
          </MyHarmCaseCount>
        </MyHarmCaseCountWrap>
      </SearchCountWrap>
    </HeaderWrap>
  );
}

export default withTheme(FirmHarmCaseHeader);
