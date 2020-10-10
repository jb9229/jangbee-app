import * as React from 'react';

import { DefaultStyledProps } from 'src/theme';
import { ImageSourcePropType } from 'react-native';
import JBPicker from 'molecules/JBPicker';
import MiddleTitle from '../molecules/Text/MiddleTitle';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

interface StyledProps extends DefaultStyledProps {
  isImageBox?: boolean;
  selected?: boolean;
}

const Container = styled.View<StyledProps>`
  margin-top: 15px;
`;

const Title = styled.Text`
  font-family: ${fonts.title};
  margin: 3px;
  margin-bottom: 7px;
`;

const SelectListWrap = styled.ScrollView.attrs(props => ({
  contentContainerStyle: {
    alignItems: 'center',
    padding: 6,
  }
}))`
  flex-direction: row;
  border-top-width: 1;
  border-bottom-width: 1;
  border-color: ${colors.batangLight};
  height: ${(props) => props.isImageBox ? 150 : 80};
`;

const SelectBox = styled.View<StyledProps>`
  height: 65;
  margin-right: 15;
  border-width: 1;
  border-radius: 10;
  background-color: ${colors.batangLight};
  border-color: ${colors.batangLight};
  justify-content: flex-end;
  align-items: center;
  ${(props) =>
    props.selected &&
    `
    background-color: ${colors.point3Light};
    border-color: ${colors.point3Light};
  `}
  ${(props) =>
    props.isImageBox &&
    `
    height: 135;
    padding-top: 5;
  `}
`;

const CateImgTO = styled.TouchableOpacity`
  justify-content: center;
  margin-top: 8;
`;

const CateImage = styled.Image`
  width: 95;
  height: 80;
  border-radius: 20;
`;

const CateTextWrap = styled.TouchableOpacity<StyledProps>`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  ${props =>
    props.isImageBox &&
    `
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.5);
    border-width: 1;
    border-radius: 5;
    border-color: rgba(255, 255, 255, 0.5);
    ${props.selected &&
      `
      background-color: rgba(0, 0, 0, 0.7);
    `};
  `}
`;

const CategoryText = styled.Text<StyledProps>`
  font-family: ${fonts.titleMiddle};
  font-size: 16;
  padding: 4px;
  color: ${(props) => props.selected ? colors.pointDark : colors.batangDark};
`;

const ItemListWrap = styled.View<StyledProps>`
  height: 25;
  margin-top: 5;
  background-color: ${(props) => props.selected ? colors.point3_other2 : props.theme.ColorBGGray};
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
`;

interface Props {
  title: string;
  subLabel?: string;
  categoryList: Array<string>;
  itemList: Array<string>;
  selectedCat: string;
  selectedItem: string;
  cateImageArr: Array<ImageSourcePropType>;
  itemPicker: string;
  errorText?: string;
  selectCategory: (catStr: string) => void;
  selectItem: (category: string, itemValue: string) => void;
}

const JBSelectBox: React.FC<Props> = (props) =>
{
  const [category, setCategory] = React.useState(props.selectedCat);
  const [item, setItem] = React.useState(props.selectedItem);

  return (
    <Container>
      <MiddleTitle label={props.title} subLabel={props.subLabel} errorText={props.errorText} />
      <SelectListWrap horizontal persistentScrollbar={true} isImageBox={!!props.cateImageArr}>
        {props.categoryList.map((catStr, i) => (
          <SelectBox
            key={i}
            selected={catStr === category}
            isImageBox={!!props.cateImageArr}
          >
            <CateImgTO
              onPress={() => { setCategory(catStr); setItem(props.itemPicker); props.selectCategory(catStr) }}
            >
              {props.cateImageArr && <CateImage source={props.cateImageArr[i]} />}
            </CateImgTO>
            <CateTextWrap
              isImageBox={!!props.cateImageArr}
              selected={catStr === category}
              onPress={() => { setCategory(catStr); setItem(props.itemPicker); props.selectCategory(catStr) }}
            >
              <CategoryText selected={catStr === category}>
                {catStr}
              </CategoryText>
            </CateTextWrap>
            <ItemListWrap selected={catStr === category}>
              <JBPicker
                items={props.itemList[catStr]}
                selectedValue={catStr === props.selectedCat ? item : ''}
                onValueChange={(itemValue): void => { setCategory(catStr); setItem(`${itemValue}`); props.selectItem(catStr, `${itemValue}`) }}
                selectLabel={props.itemPicker || undefined}
                size={catStr === '세종특별자치시' || catStr === '제주특별자치도' ? 120 : 110}
              />
            </ItemListWrap>
          </SelectBox>
        ))}
      </SelectListWrap>
    </Container>
  );
};

export default JBSelectBox;

