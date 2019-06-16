import React from 'react';
import styled from 'styled-components';
import JBPicker from '../molecules/JBPicker';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const Container = styled.View`
  border-width: 1;
  border-color: ${colors.batangLight};
  padding: 5px;
  height: 90;
  ${props => props.isImageBox
    && `
    height: 150;
  `}
`;

const Title = styled.Text`
  font-family: ${fonts.title};
  margin: 3px;
  margin-bottom: 7px;
`;

const SelectListWrap = styled.ScrollView.attrs(props => ({
  contentContainerStyle: {
    alignItems: 'center',
  },
}))`
  flex-direction row;
`;

const SelectBox = styled.View`
  align-items: center;
  height: 70;
  margin-right: 12;
  border-width: 1;
  border-radius: 10;
  background-color: ${colors.batangLight};
  border-color: ${colors.batangLight};
  ${props => props.selected
    && `
    background-color: ${colors.point3Light};
    border-color: ${colors.point3Light};
  `}
  ${props => props.isImageBox
    && `
    height: 130;
    padding-top: 5;
  `}
`;

const CateImgTO = styled.TouchableOpacity`
  justify-content: center;
`;

const CateImage = styled.Image`
  width: 90;
  height: 90;
  border-radius: 20;
`;

const CateTextWrap = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  ${props => props.isImageBox
    && `
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
  `}
`;

const CategoryText = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 16;
  padding: 5px;
  color: ${colors.batangDark};
  ${props => props.selected
    && `
    color: ${colors.pointDark};
  `};
`;

const ItemListWrap = styled.View`
  justify-content: center;
`;

const ItemPickerWrap = styled.View`
  height: 25;
  border-top-width: 1;
  margin-top: 5;
  justify-content: center;
`;

export default class JBSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const {
      title,
      categoryList,
      itemList,
      selectCategory,
      selectItem,
      selectedCat,
      selectedItem,
      cateImageArr,
      itemPicker,
    } = this.props;

    return (
      <Container isImageBox={!!cateImageArr}>
        {title ? <Title>{title}</Title> : null}
        <SelectListWrap horizontal>
          {categoryList.map((catStr, i) => (
            <SelectBox key={i} selected={catStr === selectedCat} isImageBox={!!cateImageArr}>
              <CateImgTO onPress={() => selectCategory(catStr)}>
                {cateImageArr && <CateImage source={cateImageArr[i]} />}
              </CateImgTO>
              <CateTextWrap isImageBox={!!cateImageArr} onPress={() => selectCategory(catStr)}>
                <CategoryText selected={catStr === selectedCat}>{catStr}</CategoryText>
              </CateTextWrap>
              <ItemListWrap>
                <ItemPickerWrap>
                  <JBPicker
                    items={itemList[catStr]}
                    selectedValue={catStr === selectedCat ? selectedItem : ''}
                    onValueChange={itemValue => selectItem(catStr, itemValue)}
                    selectLabel={itemPicker || undefined}
                    size={110}
                  />
                </ItemPickerWrap>
              </ItemListWrap>
            </SelectBox>
          ))}
        </SelectListWrap>
      </Container>
    );
  }
}
