import * as React from 'react';

import { FIRMHARMCASE_COUNT } from './api/queries';
import { noticeUserError } from './container/request';
import styled from 'styled-components/native';
import { useQuery } from '@apollo/client';

const Container = styled.View``;
const Count = styled.Text``;

const ApolloWebTest: React.FC = (): React.ReactElement =>
{
  const firmHarmCaseCountRsp = useQuery(FIRMHARMCASE_COUNT, {
    variables: { id: '' },
    onError: (err) =>
    {
      noticeUserError('FirmHarmCaseCount(firmHarmCaseCount result)', err?.message);
    }
  });
console.log(`test: firmHarmCaseCountRsp?.data:`, firmHarmCaseCountRsp?.data)
  return (
    <Container>
      <Count>{firmHarmCaseCountRsp?.data?.firmHarmCaseCount?.totalCnt}</Count>
    </Container>
  );
};

export default ApolloWebTest;
