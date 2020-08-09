import { KeyboardAvoidingView, Modal, ScrollView } from 'react-native';
import { LOCAL_CATEGORY, LOCAL_CATEGORY_ALL, LOCAL_ITEM } from 'src/STRING';

import Card from 'molecules/CardUI';
import EditText from '../molecules/EditText';
import JBButton from 'molecules/JBButton';
import JBSelectBox from 'src/components/organisms/JBSelectBox';
import React from 'react';
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
  const { createDto, createErrorDto, onClickAdd } = useFirmHarmCaseCreateContext();

  return (
    <Container>
      <KeyboardAvoidingView>
        <ScrollView>
          <Card>
            <ContentsView>
              <EditText
                label="전화번호"
                subLabel="(숫자만)"
                text={createDto.telNumber}
                onChangeText={text => { createDto.telNumber = text }}
                placeholder="블랙리스트 전화번호를 기입해 주세요"
                keyboardType="phone-pad"
                errorText={createErrorDto.telNumber}
              />

              <EditText
                label="사유"
                text={createDto.reason}
                onChangeText={text => { createDto.reason = text }}
                placeholder="블랙리스트 사유를 기입해 주세요"
                numberOfLines={5}
                multiline
                errorText={createErrorDto.reason}
              />

              <EditText
                label="작성자 연락처"
                subLabel="(옵션)"
                text={createDto.regiTelNumber}
                onChangeText={text => { createDto.regiTelNumber = text }}
                placeholder="타업체가 행적을 신고 해 줍니다."
                keyboardType="phone-pad"
                errorText={createErrorDto.regiTelNumber}
              />
              
              <EditText
                label="금액"
                subLabel="(옵션)"
                text={createDto.amount}
                onChangeText={text => { if(text) { const num = Number.parseInt(text); if(num && !isNaN(num)) { createDto.amount = num } } }}
                placeholder="피해금액이 얼마입니까?"
                keyboardType="numeric"
                errorText={createErrorDto.amount}
              />

              <EditText
                label="고객명"
                subLabel="(옵션)"
                text={createDto.cliName}
                onChangeText={text => { createDto.cliName = text }}
                placeholder="고객명을 기입해 주세요"
                errorText={createErrorDto.cliName}
              />

              <EditText
                label="업체명"
                subLabel="(옵션)"
                text={createDto.firmName}
                onChangeText={text => { createDto.firmName = text }}
                placeholder="업체명을 기입해 주세요"
                errorText={createErrorDto.firmName}
              />
              <EditText
                label="사업자번호"
                subLabel="(옵션)"
                text={createDto.firmNumber}
                onChangeText={text => { if (!text) { createDto.firmNumber = undefined } else { createDto.firmNumber = text } }}
                placeholder="사업자번호를 기입해 주세요"
                keyboardType="numeric"
                errorText={createErrorDto.firmNumber}
              />

              <EditText
                label="장비"
                subLabel="(옵션)"
                text={createDto.equipment}
                onChangeText={text => { createDto.equipment = text }}
                placeholder="어떤 장비의 피해사례 입니까?"
                errorText={createErrorDto.equipment}
              />

              {/* <EditText
                label="지역"
                text={createDto.local}
                onChangeText={text => { createDto.local = text }}
                placeholder="어느 지역 피해사례 입니까?"
                editable={false}
                row
              /> */}
              <JBSelectBox
                title="지역"
                subLabel="(옵션)"
                categoryList={LOCAL_CATEGORY_ALL}
                itemList={LOCAL_ITEM}
                selectCategory={sido => { console.log('sido: ', sido); createDto.local = sido }}
                selectItem={(sido, sigungu) => { console.log('sido item: ', sido); createDto.local = `${sido} ${sigungu}` }}
                itemPicker="전체"
              />

              <EditText
                label="전화번호2"
                subLabel="(옵션, 숫자만)"
                text={createDto.telNumber2}
                onChangeText={text => { createDto.telNumber2 = text }}
                placeholder="추가 전화번호를 기입해 주세요"
                keyboardType="phone-pad"
                errorText={createErrorDto.telNumber2}
              />

              <EditText
                label="전화번호3"
                subLabel="(옵션, 숫자만)"
                text={createDto.telNumber3}
                onChangeText={text => { createDto.telNumber3 = text }}
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
