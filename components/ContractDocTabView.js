import React from 'react';
import styled from 'styled-components/native';
import * as workImgs from '../common/Images';
import download from '../common/Download';
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
          onPress={() => this.setState({ popupIMG: workImgs.IMG_RADIUS_WORKRULE, isVisibleImageModal: true })
          }
          underline
        />
        <JBButton
          title="수산887제원표"
          onPress={() => download(
            'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/doc/%EC%88%98%EC%82%B0887%EC%A0%9C%EC%9B%90%ED%91%9C.pdf',
            'abc.pdf',
          )
          }
          underline
        />
        <JBButton
          title="수산887인증서"
          onPress={() => this.setState({
            popupIMG: workImgs.IMG_SAFETY_CERTIFICATION,
            isVisibleImageModal: true,
          })
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
