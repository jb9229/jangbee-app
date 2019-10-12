import React from 'react';
import styled from 'styled-components/native';
import JBPicker from 'molecules/JBPicker';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

const Container = styled.View`
  border-width: 1;
  border-color: ${colors.batangLight};
  padding: 6px;
  height: 80;
  ${props =>
    props.isImageBox &&
    `
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
    alignItems: 'center'
  }
}))`
  flex-direction row;
`;

const SelectBox = styled.View`
  align-items: center;
  height: 60;
  margin-right: 15;
  border-width: 1;
  border-radius: 10;
  background-color: ${colors.batangLight};
  border-color: ${colors.batangLight};
  ${props =>
    props.selected &&
    `
    background-color: ${colors.point3Light};
    border-color: ${colors.point3Light};
  `}
  ${props =>
    props.isImageBox &&
    `
    height: 130;
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

const CateTextWrap = styled.TouchableOpacity`
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

const CategoryText = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 16;
  padding: 4px;
  color: ${colors.batangDark};
  ${props =>
    props.selected &&
    `
    color: ${colors.pointDark};
  `};
`;

const ItemListWrap = styled.View`
  justify-content: center;
  align-items: center;
`;

const ItemPickerWrap = styled.View`
  height: 31;
  border-top-width: 1;
  margin-top: 2;
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
      itemPicker
    } = this.props;

    return (
      <Container isImageBox={!!cateImageArr}>
        {title ? <Title>{title}</Title> : null}
        <SelectListWrap horizontal>
          {categoryList.map((catStr, i) => (
            <SelectBox
              key={i}
              selected={catStr === selectedCat}
              isImageBox={!!cateImageArr}
            >
              <CateImgTO
                onPress={() => {
                  selectCategory(catStr, itemList[catStr][0].value);
                }}
              >
                {cateImageArr && <CateImage source={cateImageArr[i]} />}
              </CateImgTO>
              <CateTextWrap
                isImageBox={!!cateImageArr}
                selected={catStr === selectedCat}
                onPress={() => selectCategory(catStr)}
              >
                <CategoryText selected={catStr === selectedCat}>
                  {catStr}
                </CategoryText>
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
