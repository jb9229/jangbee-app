import * as React from 'react';

import { Picker, StyleSheet } from 'react-native';

import { FirmHarmCaseCountData } from 'types';
import JBButton from 'molecules/JBButton';
import { SearchBar } from 'react-native-elements';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const HeaderWrap = styled.View`
  margin-top: 10;
  margin-left: 3;
  margin-right: 3;
  padding-top: 3;
  padding-right: 3;
  padding-left: 3;
  padding-bottom: 3;
  background-color: ${colors.batangDark};
  elevation: 14;
  border-radius: 10;
  border-width: 1;
`;
const HeaderTopWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const PickerArrowWrap = styled.View`
  justify-content: center;
  position: absolute;
  top: 15;
  left: 117;
`;
const CommandWrap = styled.View`
  flex-direction: row;
  margin-right: 3;
`;
const SearchNoticeWrap = styled.View`
  padding-top: 5;
  padding-right: 5;
  padding-left: 5;
  justify-content: space-between;
  align-items: center;
`;
const SearchCountWrap = styled.View`
  flex-direction: row;
`;
const SearchNoticeText = styled.Text`
  color: ${colors.pointDark};
  font-family: ${fonts.batang};
  justify-content: center;
  font-size: 13;
  margin-bottom: 8;
`;

const PickerArrow = styled.Text`
  color: ${colors.pointDark};
`;

const styles = StyleSheet.create({
  searchPicker: {
    width: 167,
    color: colors.point,
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0
  },
  containerSearchBar: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: colors.batangDark,
    borderTopColor: colors.batangDark,
    borderBottomColor: colors.batangDark
  },
  inputSearchBar: {
    fontSize: 16,
    paddingLeft: 3
  }
});

interface Props {
  searchArea: string;
  searchWord: string;
  searchNotice: string;
  countData: FirmHarmCaseCountData;
  setSearchArea: (a: string) => void;
  setSearchWord: (w: string) => void;
  onClickMyEvaluList: () => void;
  onClickNewestEvaluList: () => void;
  setVisibleCreateModal: (flag: boolean) => void;
  searchFilterCliEvalu: (searchWord: string) => void;
}

export default function FirmHarmCaseHeader (props: Props): React.ReactElement {
  const [searchPlaceholder, setSearchPlaceholder] = React.useState('전화번호 입력(- 없이)');

  return (
    <HeaderWrap>
      <HeaderTopWrap>
        <Picker
          selectedValue={props.searchArea}
          style={styles.searchPicker}
          onValueChange={(val): void =>
            onSearchAreaChange(val, props.setSearchArea, setSearchPlaceholder)}
        >
          <Picker.Item label="전화번호 검색" value="TEL" />
          <Picker.Item label="사업자번호 검색" value="FIRM_NUMBER" />
          <Picker.Item label="업체명 검색" value="FIRM_NAME" />
          <Picker.Item label="고객명 검색" value="CLI_NAME" />
        </Picker>
        <PickerArrowWrap>
          <PickerArrow>&#9660;</PickerArrow>
        </PickerArrowWrap>
        <CommandWrap>
          <JBButton
            title="내 사례"
            onPress={props.onClickMyEvaluList}
            size="small"
            align="right"
            bgColor={colors.batangDark}
            color={colors.pointDark}
          />
          <JBButton
            title="최근"
            onPress={props.onClickNewestEvaluList}
            size="small"
            align="right"
            bgColor={colors.batangDark}
            color={colors.pointDark}
          />
          <JBButton
            title="추가"
            onPress={(): void => props.setVisibleCreateModal(true)}
            size="small"
            align="right"
            bgColor={colors.batangDark}
            color={colors.pointDark}
          />
        </CommandWrap>
      </HeaderTopWrap>
      <SearchBar
        value={props.searchWord}
        placeholder={searchPlaceholder}
        containerStyle={styles.containerSearchBar}
        inputStyle={styles.inputSearchBar}
        lightTheme
        round
        onChangeText={(text): void => props.setSearchWord(text)}
        searchIcon={{ onPress: props.searchFilterCliEvalu }}
        onSubmitEditing={props.searchFilterCliEvalu}
        autoCorrect={false}
      />
      <SearchNoticeWrap>
        <SearchNoticeText>{props.searchNotice}</SearchNoticeText>
        <SearchCountWrap>
          <SearchNoticeText>
            {`전체글: ${props.countData ? props.countData.totalCnt : '-'}`}
          </SearchNoticeText>
          <SearchNoticeText>
            {'  |  '}
          </SearchNoticeText>
          <SearchNoticeText>
            {`내글: ${props.countData ? props.countData.myCnt : '-'}`}
          </SearchNoticeText>
        </SearchCountWrap>
      </SearchNoticeWrap>
    </HeaderWrap>
  );
}

const onSearchAreaChange = (itemValue, setSearchArea, setSearchPlaceholder): void => {
  setSearchArea(itemValue);
  if (itemValue === 'TEL') {
    setSearchPlaceholder('전화번호 입력(- 없이)');
    return;
  }
  if (itemValue === 'FIRM_NUMBER') {
    setSearchPlaceholder('사업자번호 입력(- 포함)');
    return;
  }
  if (itemValue === 'FIRM_NAME') {
    setSearchPlaceholder('업체명 입력');
    return;
  }
  if (itemValue === 'CLI_NAME') {
    setSearchPlaceholder('고객명 입력');
  }
};