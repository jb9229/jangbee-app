import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { LOCAL_CATEGORY_ALL, LOCAL_ITEM } from 'src/STRING';

import Card from 'molecules/CardUI';
import EditText from '../molecules/EditText';
import JBButton from 'molecules/JBButton';
import JBSelectBox from 'src/components/organisms/JBSelectBox';
import React from 'react';
import { numberWithCommas } from 'src/utils/NumberUtils';
import styled from 'styled-components/native';
import { useFirmHarmCaseCreateContext } from 'src/contexts/FirmHarmCaseCreateContext';

const Container = styled.View`
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  background-color: white;
`;

const ContentsView = styled.View`
  padding: 20px;
`;

const FirmHarmCaseCreateLayout: React.FC = () => {
  const {
    createDto,
    createErrorDto,
    onClickAdd,
  } = useFirmHarmCaseCreateContext();

  return (
    <Container>
      <KeyboardAvoidingView>
        <ScrollView>
          <Card>
            <ContentsView>
              {/* <EditText
                label=""
                subLabel="(옵션)"
                text={createDto.cliName}
                onChangeText={(text): void => { createDto.cliName = text }}
                placeholder="고객명을 기입해 주세요"
                errorText={createErrorDto.cliName}
              /> */}

              <EditText
                label="업체(고객)명"
                text={createDto.firmName}
                onChangeText={(text): void => {
                  createDto.firmName = text;
                }}
                placeholder="업체(고객)명을 기입해 주세요"
                errorText={createErrorDto.firmName}
              />
              <EditText
                label="전화번호"
                subLabel="(숫자만)"
                text={createDto.telNumber}
                onChangeText={(text): void => {
                  createDto.telNumber = text;
                }}
                placeholder="업체(고객) 전화번호를 기입해 주세요"
                keyboardType="phone-pad"
                errorText={createErrorDto.telNumber}
              />

              <EditText
                label="피해내용"
                text={createDto.reason}
                onChangeText={(text): void => {
                  createDto.reason = text;
                }}
                placeholder="피해내용을 기입해 주세요"
                numberOfLines={5}
                multiline
                errorText={createErrorDto.reason}
              />

              <JBSelectBox
                title="피해 지역"
                categoryList={LOCAL_CATEGORY_ALL}
                itemList={LOCAL_ITEM}
                selectedCat="전국"
                selectCategory={(sido): void => {
                  console.log('sido: ', sido);
                  createDto.local = sido;
                }}
                selectItem={(sido, sigungu): void => {
                  console.log('sido item: ', sido);
                  createDto.local = `${sido} ${sigungu}`;
                }}
                itemPicker="전체"
              />

              <EditText
                label="피해 금액"
                subLabel="(옵션, 단위: 원)"
                text={numberWithCommas(createDto.amount)}
                onChangeText={(text): void => {
                  if (text) {
                    const num = Number.parseInt(text);
                    if (num && !isNaN(num)) {
                      createDto.amount = num;
                    }
                  }
                }}
                placeholder="피해금액이 얼마입니까?"
                keyboardType="numeric"
                errorText={createErrorDto.amount}
              />
              <EditText
                label="연락받을 전화번호"
                subLabel="(옵션)"
                text={createDto.regiTelNumber}
                onChangeText={(text): void => {
                  createDto.regiTelNumber = text;
                }}
                placeholder="기사님이 행적을 신고해 줄 수 있습니다"
                keyboardType="phone-pad"
                errorText={createErrorDto.regiTelNumber}
              />
              <EditText
                label="사업자번호"
                subLabel="(옵션)"
                text={createDto.firmNumber}
                onChangeText={(text): void => {
                  if (!text) {
                    createDto.firmNumber = undefined;
                  } else {
                    createDto.firmNumber = text;
                  }
                }}
                placeholder="사업자번호를 기입해 주세요"
                keyboardType="numeric"
                errorText={createErrorDto.firmNumber}
              />

              <EditText
                label="장비"
                subLabel="(옵션)"
                text={createDto.equipment}
                onChangeText={(text): void => {
                  createDto.equipment = text;
                }}
                placeholder="어떤 장비의 피해사례 입니까?"
                errorText={createErrorDto.equipment}
              />

              <EditText
                label="전화번호2"
                subLabel="(옵션, 숫자만)"
                text={createDto.telNumber2}
                onChangeText={text => {
                  createDto.telNumber2 = text;
                }}
                placeholder="추가 전화번호를 기입해 주세요"
                keyboardType="phone-pad"
                errorText={createErrorDto.telNumber2}
              />

              <EditText
                label="전화번호3"
                subLabel="(옵션, 숫자만)"
                text={createDto.telNumber3}
                onChangeText={text => {
                  createDto.telNumber3 = text;
                }}
                placeholder="추가 전화번호를 기입해 주세요"
                keyboardType="phone-pad"
                errorText={createErrorDto.telNumber3}
              />
            </ContentsView>
          </Card>
        </ScrollView>
        <JBButton
          title="피해사례 등록하기"
          onPress={onClickAdd}
          size="full"
          Secondary
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default FirmHarmCaseCreateLayout;
