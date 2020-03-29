import { Picker, PickerItem, StyleSheet } from 'react-native';
import { number, string } from 'yup';

import MiddleTitle from 'molecules/Text/MiddleTitle';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

interface StyleProps {
  size?: number;
}

const Container = styled.View`
  margin-top: 15px;
  padding-top: 10px;
  width: ${(props: StyleProps) => props.size ? props.size : 'transparent'};
`;

const PickerWrap = styled.View``;

const styles = StyleSheet.create({
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3
  },
  itemPicker: {}
});

interface Props {
  title: string;
  subTitle: string;
  selectedValue: string;
  items: Array<PickerItem>;
  onValueChange: (value: string) => void;
  size: number;
  selectLabel: string;
  errorText: string;
}
const JBPicker: React.FC<Props> = (props) =>
{
  const [selectedValue, setSelectedValue] = React.useState();

  return (
    <Container size={props.size}>
      <MiddleTitle label={props.title} subLabel={props.subTitle} errorText={props.errorText} />
      <PickerWrap>
        <Picker
          selectedValue={selectedValue}
          style={styles.itemPicker}
          onValueChange={(itemValue): void => { props.onValueChange(itemValue); setSelectedValue(itemValue) }}
          mode="dropdown"
        >
          <Picker.Item label={props.selectLabel || '선택'} value="" key={-1} />
          {props.items}
        </Picker>
      </PickerWrap>
    </Container>
  );
};

export default JBPicker;
