import * as React from 'react';

import { Modal, TouchableWithoutFeedback, View } from 'react-native';

import HeaderClose from 'src/components/molecules/HeaderClose';
// import HeaderClose from '../HeaderClose';
import styled from 'styled-components/native';

// Styled Components
interface StyleComponentPorps {
  bottomProp?: boolean;
  fullSize?: boolean;
  loading?: boolean;
}

const BackGround = styled.View`
  position:absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
`;

const Container = styled.View`
  flex: 1;
  justify-content: ${(props: StyleComponentPorps): string => props.bottomProp ? 'flex-end' : 'center'};
  align-items: center;
`;

const Contents = styled.View`
  width: 95%;
  min-width: 200;
  min-height: 100;
  background-color: ${(props: StyleComponentPorps): string => props.fullSize ? 'white' : 'transparent'};
  ${(props: StyleComponentPorps): string | null => props.fullSize ? `
    flex: 1;
    width: 100%;
    border-radius: 0;
  ` : null};
  ${(props: StyleComponentPorps): string | null => props.bottomProp ? `
    width: 100%;
    border-radius: 0;
  ` : null};
`;
const HeaderWrap = styled.View`
`;
const Content = styled.View`
  ${(props: StyleComponentPorps): string | null => props.fullSize ? 'flex: 1' : null};
  ${(props: StyleComponentPorps): string => props.bottomProp ? 'padding: 0' : 'padding: 5px'}
`;

interface Props {
  visible: boolean;
  setVisible?: (visible: boolean) => void;
  contents: React.ReactElement;
  onClose?: () => void;
  bottom?: boolean;
  full?: boolean;
  loading?: boolean;
}

const ModalTemplate = (props: Props): React.ReactElement =>
{
  return (
    <Modal
      animationType="none"
      transparent={true}
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
      visible={props.visible}
      onRequestClose={props.onClose}>
      <Container bottomProp={props.bottom}>
        {props.visible && <BackGround />}
        <TouchableWithoutFeedback onPress={(): void => { if (props.setVisible) props.setVisible(false); }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        </TouchableWithoutFeedback>

        <Contents bottomProp={props.bottom} fullSize={props.full} loading={props.loading}>
          {props.full && props.setVisible &&
            <HeaderWrap>
              <HeaderClose onClick={(): void => { if (props.setVisible) { props.setVisible(false) } } } />
            </HeaderWrap>
          }
          <Content bottomProp={props.bottom} fullSize={props.full} >
            {props.contents}
          </Content>
        </Contents>
      </Container>
    </Modal>
  );
};

export default ModalTemplate;
