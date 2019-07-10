import React from 'react';
import styled from 'styled-components/native';
import { IMG_RADIUS_WORKRULE } from '../common/Images';
import ImageModal from './ImageModal';
import JBButton from './molecules/JBButton';

const RouteContainer = styled.View`
  flex: 1;
  align-items: center;
  padding: 5px;
`;

export default class ContractDocTabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleImageModal: false,
    };
  }

  render() {
    const { isVisibleImageModal, popupIMG } = this.state;
    return (
      <RouteContainer>
        <JBButton
          title="작업반경-양정도"
          onPress={() => this.setState({ popupIMG: IMG_RADIUS_WORKRULE, isVisibleImageModal: true })
          }
          underline
        />
        <ImageModal
          isVisibleModal={isVisibleImageModal}
          img={popupIMG}
          closeModal={() => this.setState({ isVisibleImageModal: false })}
        />
      </RouteContainer>
    );
  }
}
