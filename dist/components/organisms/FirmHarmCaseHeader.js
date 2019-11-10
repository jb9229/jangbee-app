import * as React from 'react';
import { Picker, StyleSheet } from 'react-native';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components';
const HeaderWrap = styled.View `
  margin-top: 10;
  margin-left: 3;
  margin-right: 3;
  padding: 3;
  background-color: ${colors.batangDark};
  elevation: 14;
  border-radius: 10;
  border-width: 1;
`;
const HeaderTopWrap = styled.View `
  flex-direction: row;
  justify-content: space-between;
`;
const PickerArrowWrap = styled.View `
  justify-content: center;
  position: absolute;
  top: 15;
  left: 117;
`;
const CommandWrap = styled.View `
  flex-direction: row;
  margin-right: 3;
`;
const SearchNoticeWrap = styled.View `
  padding: 5;
  padding-bottom: 8;
  justify-content: center;
  align-items: center;
`;
const SearchNoticeText = styled.Text `
  color: ${colors.pointDark},
  font-family: ${fonts.batang};
  justify-content: center;
  font-size: 13;
`;
const PickerArrow = styled.Text `
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
        backgroundColor: colors.batangDark,
        borderTopColor: colors.batangDark,
        borderBottomColor: colors.batangDark,
        paddingTop: 5,
        paddingBottom: 5
    },
    inputSearchBar: {
        fontSize: 16,
        paddingLeft: 3
    }
});
export default function FirmHarmCaseHeader(props) {
    const [searchArea, setSearchArea] = React.useState('TEL');
    const { searchWord, setSearchWord } = React.useState('');
    return (<HeaderWrap>
      <HeaderTopWrap>
        <Picker selectedValue={searchArea} style={styles.searchPicker} onValueChange={this.onSearchAreaChange}>
          <Picker.Item label="전화번호 검색" value="TEL"/>
          <Picker.Item label="사업자번호 검색" value="FIRM_NUMBER"/>
          <Picker.Item label="업체명 검색" value="FIRM_NAME"/>
          <Picker.Item label="고객명 검색" value="CLI_NAME"/>
        </Picker>
        <PickerArrowWrap>
          <PickerArrow>&#9660;</PickerArrow>
        </PickerArrowWrap>
        <CommandWrap>
          <JBButton title="내 사례" onPress={() => this.setMyClinetEvaluList()} size="small" align="right" bgColor={colors.batangDark} color={colors.pointDark}/>
          <JBButton title="최근" onPress={() => this.onClickNewestEvaluList()} size="small" align="right" bgColor={colors.batangDark} color={colors.pointDark}/>
          <JBButton title="추가" onPress={() => this.setState({ isVisibleCreateModal: true })} size="small" align="right" bgColor={colors.batangDark} color={colors.pointDark}/>
        </CommandWrap>
      </HeaderTopWrap>
      <SearchBar value={searchWord} placeholder={searchPlaceholder} containerStyle={styles.containerSearchBar} inputStyle={styles.inputSearchBar} lightTheme round onChangeText={text => this.setState({ searchWord: text })} searchIcon={{ onPress: () => this.searchFilterCliEvalu() }} onSubmitEditing={() => this.searchFilterCliEvalu()} autoCorrect={false}/>
      <SearchNoticeWrap>
        <SearchNoticeText>{searchNotice}</SearchNoticeText>
      </SearchNoticeWrap>
    </HeaderWrap>);
}
//# sourceMappingURL=FirmHarmCaseHeader.js.map