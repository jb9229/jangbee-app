import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseLayout from '../../components/templates/FirmHarmCaseLayout';
import FirmHarmCaseProvider from 'src/container/firmHarmCase/FirmHarmCaseProvider';
import React from 'react';
import styled from 'styled-components/native';

interface Props {
  navigation: DefaultNavigationProps;
}
function FirmHarmCaseContainer (props): React.ReactElement
{
  return (
    <FirmHarmCaseProvider navigation={props.navigation}>
      <FirmHarmCaseLayout />
    </FirmHarmCaseProvider>
  );
}

FirmHarmCaseContainer.navigationOptions = ({ navigation }) => ({
  title: '피해사례 고객',
  headerStyle: {
    marginTop: -28
  }
});

export default FirmHarmCaseContainer;
