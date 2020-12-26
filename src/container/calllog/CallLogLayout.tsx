import * as React from 'react';

import { MText, RText } from 'atoms/StyledText';

import { CallLog } from './types';
import { DefaultStyledProps } from 'src/theme';
import moment from 'moment';
import styled from 'styled-components/native';
import { useState } from 'react';

interface StyledProps extends DefaultStyledProps {
  active?: boolean;
}
const Container = styled.View`
  flex: 1;
`;
const Header = styled.View`
  padding-horizontal: 5%;
`;
const Contents = styled.View`
  flex: 1;
  padding-horizontal: 5%;
`;
const LogListWrap = styled.View`
  align-items: center;
`;
const LogListHeaderWrap = styled.View<StyledProps>`
  flex-direction: row;
  background-color: ${({ theme }) => theme.ColorPrimaryBatang};
`;
const LogWrap = styled.View`
  flex-direction: row;
`;
const LogHeader = styled.Text`
  flex: 1;
  padding: 5px;
  text-align: center;
`;
const LogHeaderNo = styled(LogHeader)`
  flex: none;
  width: 50px;
  align-items: center;
`;
const LogItem = styled.Text`
  flex: 1;
  padding: 5px;
  border-top-width: 0.5px;
  text-align: center;
`;
const LogItemNo = styled(LogItem)`
  flex: none;
  width: 50px;
`;
const SearchMonthWrap = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-top: 10px;
`;
const SearchMonth = styled(MText)<StyledProps>`
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  color: ${({ active, theme }) =>
    active ? theme.ColorTextBlack : theme.ColorTextDisable};
`;
const SearchMonthTO = styled.TouchableOpacity`
  padding-horizontal: 10px;
`;
const EvaluateWrap = styled.View<DefaultStyledProps>`
  background-color: ${({ theme }) => theme.ColorPrimaryLight};
  padding-horizontal: 15px;
  padding-bottom: 15px;
`;
const EvaluateItemWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const EvaluateTitle = styled(MText)`
  text-align: center;
  font-size: 24px;
  line-height: 34px;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const EvaluateLabel = styled(MText)``;
const EvaluateValue = styled(RText)``;

interface Props {
  logs: CallLog[];
}

const CallLogItem = ({
  no,
  log,
}: {
  no: number;
  log: CallLog;
}): React.ReactElement => (
  <LogWrap>
    <LogItemNo>{no + 1}</LogItemNo>
    <LogItem>{log.callerPhoneNumber}</LogItem>
    <LogItem>{moment(log.callTime).format('YYYY/MM/DD hh:mm:ss')}</LogItem>
  </LogWrap>
);

const CallLogLayout: React.FC<Props> = ({ logs }): React.ReactElement => {
  const initMonth = moment().format('yyyy.MM');
  const [searchMonth, setSearchMonth] = useState(initMonth);
  const searchMonths = [];
  searchMonths.push(moment().add(-2, 'months').format('yyyy.MM'));
  searchMonths.push(moment().add(-1, 'months').format('yyyy.MM'));
  searchMonths.push(initMonth);

  return (
    <Container>
      <Header>
        <SearchMonthWrap>
          {searchMonths.map((month, index) => (
            <SearchMonthTO
              key={`KEY_${index}`}
              onPress={() => {
                setSearchMonth(month);
              }}
            >
              <SearchMonth active={searchMonth === month}>{month}</SearchMonth>
            </SearchMonthTO>
          ))}
        </SearchMonthWrap>
      </Header>
      <Contents>
        <EvaluateWrap>
          <EvaluateTitle>{`${initMonth}월 콜이력`}</EvaluateTitle>
          <EvaluateItemWrap>
            <EvaluateLabel>총 콜수</EvaluateLabel>
            <EvaluateValue>2</EvaluateValue>
          </EvaluateItemWrap>
        </EvaluateWrap>
        <LogListWrap>
          <LogListHeaderWrap>
            <LogHeaderNo>No</LogHeaderNo>
            <LogHeader>걸려온 번호</LogHeader>
            <LogHeader>시간</LogHeader>
          </LogListHeaderWrap>
          {logs.map((log, index) => (
            <CallLogItem key={`KEY_${index}`} log={log} no={index} />
          ))}
        </LogListWrap>
      </Contents>
    </Container>
  );
};

export default CallLogLayout;
