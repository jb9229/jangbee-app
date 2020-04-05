import { Picker, PickerItem, StyleSheet } from 'react-native';
import { number, string } from 'yup';
import styled, { DefaultTheme } from 'styled-components/native';

import ErrorText from 'src/components/molecules/Text/ErrorText';
import MiddleTitle from 'molecules/Text/MiddleTitle';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

interface StyleProps {
  theme: DefaultTheme;
  size?: number;
  error?: boolean;
}

const Container = styled.View`
  margin-top: 15px;
  padding-top: 10px;
  width: ${(props: StyleProps): number | string => props.size ? props.size : 'transparent'};
`;

const PickerWrap = styled.View`
  border-width: ${(props: StyleProps): number => props.error ? 1 : 0};
  border-color: ${(props: StyleProps): string => props.theme.ColorError};
  border-radius: 5;
  padding: 5px 0px;
`;

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
  selectedValue: number;
  items: Array<PickerItem>;
  onValueChange: (value: string) => void;
  size: number;
  selectLabel: string;
  errorText: string;
}
const JBPicker: React.FC<Props> = (props) =>
{
  React.useEffect(() =>
  {
    setSelectedValue(props.selectedValue);
  }, [props.selectedValue]);

  const [selectedValue, setSelectedValue] = React.useState(props.selectedValue);

  return (
    <Container size={props.size}>
      <MiddleTitle label={props.title} subLabel={props.subTitle} errorText={props.errorText} />
      <PickerWrap error={!!props.errorText}>
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
      <ErrorText text={props.errorText}/>
    </Container>
  );
};

export default JBPicker;
