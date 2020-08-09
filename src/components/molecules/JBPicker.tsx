import { Picker, StyleSheet } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import ErrorText from 'src/components/molecules/Text/ErrorText';
import MiddleTitle from 'molecules/Text/MiddleTitle';
import { PickerItem } from 'src/types';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

interface StyleProps {
  theme: DefaultTheme;
  size?: number;
  error?: boolean;
}

const Container = styled.View`
  width: ${(props: StyleProps): number | string => props.size ? props.size : 'auto'};
`;

const PickerWrap = styled.View`
  border-width: ${(props: StyleProps): number => props.error ? 1 : 0};
  border-color: ${(props: StyleProps): string => props.theme.ColorError};
  border-radius: 5;
`;

const styles = StyleSheet.create({
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3
  },
  itemPicker: {height: 20}
});

interface Props {
  title?: string;
  subTitle?: string;
  selectedValue: number | string;
  items: Array<PickerItem>;
  onValueChange: (value: string | number) => void;
  size?: number;
  selectLabel?: string;
  errorText?: string;
}
const JBPicker: React.FC<Props> = (props) =>
{
  React.useEffect(() =>
  {
    setSelectedValue(props.selectedValue);
    // props.onValueChange(props.selectedValue);
  }, [props.selectedValue]);

  const [selectedValue, setSelectedValue] = React.useState(props.selectedValue);

  return (
    <Container size={props.size}>
      {!!props.title && (<MiddleTitle label={props.title} subLabel={props.subTitle} errorText={props.errorText} />)}
      <PickerWrap error={!!props.errorText}>
        <Picker
          selectedValue={selectedValue}
          style={styles.itemPicker}
          onValueChange={(itemValue): void => { props.onValueChange(itemValue); setSelectedValue(itemValue) }}
          mode="dropdown"
        >
          <Picker.Item label={props.selectLabel || '선택'} value="" key={-1} />
          {!!props.items && props.items.map((item) => <Picker.Item key={item.key} label={item.label} value={item.value} />)}
        </Picker>
      </PickerWrap>
      <ErrorText text={props.errorText}/>
    </Container>
  );
};

export default JBPicker;
