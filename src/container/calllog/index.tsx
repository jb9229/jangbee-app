import React, { useCallback, useEffect, useState } from 'react';

import { CALL_LOGS } from 'src/api/queries';
import CallLogLayout from './CallLogLayout';
import styled from 'styled-components/native';
import { useLazyQuery } from '@apollo/client';
import { useLoginContext } from 'src/contexts/LoginContext';
import { wait } from 'src/utils/TimeUtils';

const Container = styled.View`
  flex: 1;
`;

const CallLogContainer: React.FC = (): React.ReactElement => {
  // useEffect
  useEffect(() => {
    if (userProfile?.uid) {
      req({ variables: { accountId: userProfile?.uid } });
    }
  }, []);
  // States
  const { userProfile } = useLoginContext();
  const [req, rsp] = useLazyQuery(CALL_LOGS);
  const [refreshing, setRefreshing] = useState(false);

  // Actions
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <Container>
      <CallLogLayout
        logs={rsp.data?.callLogs || []}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </Container>
  );
};

export default CallLogContainer;
