import * as React from 'react';

import { CallLog } from './types';
import moment from 'moment';
import styled from 'styled-components/native';

const Container = styled.View``;
const LogHeaderWrap = styled.View`
  flex-direction: row;
`;
const LogWrap = styled.View`
  flex-direction: row;
`;
const LogHeader = styled.Text`
  width: 150px;
  padding: 5px;
  border-width: 0.5;
`;
const LogHeaderNo = styled(LogHeader)`
  width: 50px;
`;
const LogItem = styled.Text`
  width: 150px;
  padding: 5px;
  border-width: 0.5;
`;
const LogItemNo = styled(LogItem)`
  width: 50px;
`;

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
  return (
    <Container>
      <LogItem>네비 해더 네임: 콜 이력</LogItem>
      <LogItem>조회 달 앞 뒤</LogItem>
      <LogHeaderWrap>
        <LogHeaderNo>No</LogHeaderNo>
        <LogHeader>걸려온 번호</LogHeader>
        <LogHeader>시간</LogHeader>
      </LogHeaderWrap>
      {logs.map((log, index) => (
        <CallLogItem key={`KEY_${index}`} log={log} no={index} />
      ))}
    </Container>
  );
};

export default CallLogLayout;
