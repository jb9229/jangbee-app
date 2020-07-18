import * as React from 'react';

import { CashBack, CashBackCrtDto, CashBackCrtError, ScreenMode } from 'container/cashback/type';
import { FlatList, KeyboardAvoidingView, ScrollView, StyleProp, ViewStyle } from 'react-native';
import styled, { DefaultTheme, withTheme } from 'styled-components/native';

import CardUI from 'src/components/molecules/CardUI';
import CashBackListItem from 'src/container/cashback/CashBackListItem';
import { DefaultStyledProps } from 'src/theme';
import EditText from 'src/components/molecules/EditText';
import JBButton from 'src/components/molecules/JBButton';
import JBPicker from 'src/components/molecules/JBPicker';
import { PickerItem } from 'src/types';
import UnderLineButton from 'src/components/molecules/UnderLineButton';
import { numberWithCommas } from 'src/utils/NumberUtils';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${(props): string => props.theme.ColorBGLightGray};
`;
const Header = styled.View`
  flex-direction: row;
`;
const CommandWrap = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 10px;
`;
const AssetCard = styled(CardUI).attrs(() => ({
  wrapperStyle: {
    height: 300
  }
}))`
`;
const AssetTitle = styled.Text<DefaultStyledProps>``;
const AssetSubTitle = styled.Text<DefaultStyledProps>``;
const MoneyWrap = styled.View`
  flex-direction: row;
  justify-content: center;
`;
const Money = styled.Text<DefaultStyledProps>`
  font-family: ${(props): string => props.theme.FontTitle};
  font-size: 34;
  align-self: center;
`;
const MoneyUnit = styled.Text<DefaultStyledProps>`
  font-family: ${(props): string => props.theme.FontTitle};
  font-size: 21;
  align-self: center;
`;
const CashBackCard = styled(CardUI).attrs(() => ({
  wrapperStyle: {
    flex: 1
  }
}))`
`;
const CashbackList = styled(FlatList).attrs((props) => ({
  contentContainerStyle: {
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: props.theme.ColorBatangWhite,
    borderRadius: 5
  }
}))``;

interface Props {
  theme: DefaultTheme;
  crtDto: CashBackCrtDto;
  crtError: CashBackCrtError;
  screenMode: ScreenMode;
  assetMoney: number;
  cashbacks: Array<CashBack>;
  onSubmitRegister: () => void;
  setScreenMode: (screenMode: ScreenMode) => void;
  wrapperStyle?: StyleProp<ViewStyle>;
}
const CashBackLayout: React.FC<Props> = (props) =>
{
  const [visibleRequestForm, setVisibleRequestForm] = React.useState(false);
  const [amount, setAmount] = React.useState(props.assetMoney);

  return (
    <Container style={props.wrapperStyle}>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'center' }}>
          <AssetCard Primary>
            <Header>
              <AssetTitle>내 통장</AssetTitle>
              <AssetSubTitle>(일감배차 소득)</AssetSubTitle>
            </Header>
            <MoneyWrap>
              <Money>{`${numberWithCommas(props.assetMoney)}`}</Money><MoneyUnit>원</MoneyUnit>
            </MoneyWrap>
            <CommandWrap>
              <UnderLineButton text="신청 리스트"
                onPress={(): void => props.setScreenMode(props.screenMode === ScreenMode.LIST ? ScreenMode.DEFAULT : ScreenMode.LIST)}
                lineColor={props.screenMode === ScreenMode.LIST ? props.theme.ColorBtnPrimary : undefined}
              />
              <UnderLineButton text="캐쉬백 신청"
                onPress={(): void => props.setScreenMode(props.screenMode === ScreenMode.REGISTER ? ScreenMode.DEFAULT : ScreenMode.REGISTER)}
                lineColor={props.screenMode === ScreenMode.REGISTER ? props.theme.ColorBtnPrimary : undefined}
              />
            </CommandWrap>
          </AssetCard>

          {props.screenMode === ScreenMode.REGISTER && (
            <>
              <CashBackCard>
                <JBPicker title="은행선택" onValueChange={(value: string): void => { props.crtDto.bank = value }}
                  items={[new PickerItem('카카오뱅크', '카카오뱅크', '카카오뱅크'), new PickerItem('국민은행', '국민은행', '국민은행'),
                    new PickerItem('기업은행', '기업은행', '기업은행'), new PickerItem('농협은행', '농협은행', '농협은행'), new PickerItem('신한은행', '신한은행', '신한은행'),
                    new PickerItem('우리은행', '우리은행', '우리은행'), new PickerItem('하나은행', '하나은행', '하나은행'), new PickerItem('우체국', '우체국', '우체국'),
                    new PickerItem('부산은행', '부산은행', '부산은행'), new PickerItem('새마을금고', '새마을금고', '새마을금고'), new PickerItem('광주은행', '광주은행', '광주은행')]}
                />
                <EditText label="금액" keyboardType="decimal-pad"
                  errorText={props.crtError.amount}
                  onChangeText={(text): void =>
                  {
                    props.crtDto.amountStr = text;
                  }}
                />
                <EditText label="계좌번호" subLabel="(숫자만)"
                  keyboardType="decimal-pad"
                  errorText={props.crtError.accountNumber}
                  onChangeText={(text): void =>
                  {
                    const num = Number.parseInt(text); if (num && !isNaN(num)) { props.crtDto.accountNumber = num }
                  }}
                />
                <EditText label="예금주"
                  errorText={props.crtError.accountHolder}
                  onChangeText={(text): void => { props.crtDto.accountHolder = text }} />
              </CashBackCard>

              <JBButton Secondary size="full" title="신청" onPress={props.onSubmitRegister} />
            </>
          )}
          {props.screenMode === ScreenMode.LIST && (
            <CashbackList
              keyExtractor={(item): string => `KEY_${item._id}`}
              data={props.cashbacks}
              renderItem={(item): React.ReactElement => <CashBackListItem no={item.index + 1} item={item.item} />}
            />
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </Container>
  );
};

export default withTheme(CashBackLayout);
