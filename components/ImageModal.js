import React from 'react';
import { Dimensions, Modal } from 'react-native';
import styled from 'styled-components/native';
import * as FileSystem from 'expo-file-system';
import ImageZoom from 'react-native-image-pan-zoom';
import JBButton from './molecules/JBButton';
import CloseButton from './molecules/CloseButton';
import download from '../common/Download';

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: white;
`;

const Image = styled.Image`
  width: 90%;
  height: 300;
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
    const { isVisibleModal, closeModal, img } = this.props;

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
            imageHeight={500}
          >
            <Image source={img} />
          </ImageZoom>
        </Container>
      </Modal>
    );
  }
}
