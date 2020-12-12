import * as React from 'react';

import CloseButton from './CloseButton';
import HeaderClose from './HeaderClose';
import styled from 'styled-components/native';

const Container = styled.View`
`;

interface Props {
  title: string;
  subTitle?: string;
  closeModal: () => void;
}
const ModalHeadOrganism: React.FC<Props> = (props) =>
{
  return (
    <Container>
      <CloseButton onClose={props.closeModal} />
      {/* <HeaderClose onClick={props.closeModal} /> */}
    </Container>
  );
};

export default ModalHeadOrganism;
