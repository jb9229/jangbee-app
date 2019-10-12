import * as React from 'react';
import { ImageSourcePropType } from 'react-native';
import ExpoIcon from 'atoms/ExpoIcon';
import SwitchToggle from 'atoms/SwitchToggle';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-top-width: 0.5;
  border-bottom-width: 0.5;
  align-items: center;
`;

const LeftContents = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Image = styled.Image`
  width: 20;
  height: 20;
`;

const Text = styled.Text`
  padding-left: 15;
  font-family: notosansBold;
  font-size: 21;
`;

const RightContents = styled.View`
  flex-direction: row;
`;

interface Props {
  iconName?: string;
  iconType?: string;
  img?: ImageSourcePropType;
  switchOn?: boolean;
  text: string;
  switchAction: () => void;
}

export default function SettingItems(props: Props): React.ReactElement {
  return (
    <Container>
      <LeftContents>
        {props.iconName && <ExpoIcon type={props.iconType} name={props.iconName} size={24} color='black' />}
        {!props.iconName && props.img && <Image source={props.img} fadeDuration={10} /> }
        <Text>{props.text}</Text>
      </LeftContents>
      <RightContents>
        {props.switchOn !== undefined && <SwitchToggle switchOn={props.switchOn} onPress={props.switchAction} backgroundColorOn="#ccd8ff" />}
      </RightContents>
    </Container>
  );
};
