import { InteractionManager } from 'react-native';
import React from 'react';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const ContainTO = styled.TouchableOpacity`
  align-items: center;
  padding: 10px;
  margin-top: 10px;
  elevation: 10;
`;
const TitleWrap = styled.View`
  border-radius: 10;
  padding: 3px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: ${fonts.batang};
  padding-top: 5;
`;

const ImageWrap = styled.View`
  background-color: white;
  border-radius: 30;
  padding: 3px;
`;

const ButtonImage = styled.Image`
  width: ${props => props.width || 95};
  height: ${props => props.width || 100};
  margin: 3px;
  resize-mode: contain;
  border-radius: 4;
`;
const BottomText = styled.Text`
  font-size: 15;
  font-family: ${fonts.batang};
`;

export default class JBIconButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pressing: false,
    };
  }

  preventDoubleTap = () => {
    const { onPress } = this.props;
    const { pressing } = this.state;

    if (pressing === false) {
      this.setState({ pressing: true });

      onPress();

      InteractionManager.runAfterInteractions(() => {
        this.setState({ pressing: false });
      });
    }
  };

  render() {
    const { title, subTitle, img, onPress, imgWidth, imgHeight } = this.props;

    return (
      <ContainTO onPress={() => onPress()}>
        <ImageWrap>
          <ButtonImage source={img} width={imgWidth} height={imgHeight} />
          {subTitle ? <BottomText>{subTitle}</BottomText> : null}
        </ImageWrap>
        <TitleWrap>
          <Title>{title}</Title>
        </TitleWrap>
      </ContainTO>
    );
  }
}
