import { CallLog, CallLogQueryRsp } from './types';
import React, { useEffect } from 'react';

import { CALL_LOGS } from 'src/api/queries';
import CallLogLayout from './CallLogLayout';
import styled from 'styled-components/native';
import { useLazyQuery } from '@apollo/client';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.View`
  flex: 1;
`;

const CallLogContainer: React.FC = (): React.ReactElement => {
  // useEffect
  useEffect(() => {
    if (user?.uid) {
      req({ variables: { accountId: user?.uid } });
    }
  }, []);
  // States
  const { user } = useLoginContext();
  const [req, rsp] = useLazyQuery<CallLogQueryRsp>(CALL_LOGS);

  return (
    <Container>
      <CallLogLayout logs={rsp.data?.callLogs || []} />
    </Container>
  );
};

export default CallLogContainer;
