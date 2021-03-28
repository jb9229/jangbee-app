import { Dimensions, Modal } from 'react-native';

import CloseButton from 'molecules/CloseButton';
import ImageZoom from 'react-native-image-pan-zoom';
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Image = styled.Image`
  width: ${props => (props.width ? props.width : '90%')};
  height: ${props => (props.height ? props.height : '300')};
  margin: 10px auto;
`;

export default class DocumentsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: '계약 문서양식' },
        { key: 'second', title: '전화번호부' },
        { key: 'third', title: '제원표' },
      ],
    };
  }

  render() {
    const { isVisibleModal, closeModal, img, width, height } = this.props;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <Container>
          <CloseButton onClose={() => closeModal()} align="flex-end" />
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            imageWidth={Dimensions.get('window').width}
            imageHeight={Dimensions.get('window').height}
          >
            <Image source={img} width={width} height={height} />
          </ImageZoom>
        </Container>
      </Modal>
    );
  }
}
