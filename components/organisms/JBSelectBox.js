import React from 'react';
import styled from 'styled-components';
import JBPicker from '../molecules/JBPicker';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const Container = styled.View`
  margin-bottom: 5;
  border-width: 1;
  border-color: ${colors.batangLight};
  padding: 5px;
  height: 100;
  ${props => props.isImageBox
    && `
    height: 130;
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
  flex-direction: row;
  height: 100;
  padding: 4px;
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
    height: 70;
  `}
`;

const CateImgTO = styled.TouchableOpacity``;

const CateImage = styled.Image`
  width: 90;
  height: 90;
  border-radius: 20;
`;

const CateTextTO = styled.TouchableOpacity`
  flex: 3;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1;
  margin-left: 3;
`;

const CategoryText = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 16;
  ${props => props.selected
    && `
    color: ${colors.pointDark}
  `}
`;

const ItemListWrap = styled.View`
  flex: 1;
  justify-content: space-around;
`;

const ItemPickerWrap = styled.View`
  flex: 2;
  justify-content: center;
`;

export default class JBSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: null,
      itemList: null,
    };
  }

  componentDidMount() {
    const { categoryList, itemList } = this.props;

    this.setState({ categoryList, itemList });
  }

  componentWillReceiveProps(nextProps) {}

  selectCategory = (category) => {
    const { selectCategory, selectItem } = this.props;

    selectCategory(category);
    selectItem('');
  };

  selectItem = (item) => {
    const { selectedItem, selectItem } = this.props;

    if (selectedItem === item) {
      selectItem('');
    } else {
      selectItem(item);
    }
  };

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

    const selectedCatStr = selectedCat || categoryList[0];

    return (
      <Container isImageBox={!!cateImageArr}>
        {title ? <Title>{title}</Title> : null}
        <SelectListWrap horizontal>
          {categoryList.map((catStr, i) => (
            <SelectBox key={i} selected={catStr === selectedCat} isImageBox={!cateImageArr}>
              <CateImgTO onPress={() => this.selectCategory(catStr)}>
                {cateImageArr && <CateImage source={cateImageArr[i]} />}
              </CateImgTO>
              <ItemListWrap>
                <CateTextTO onPress={() => this.selectCategory(catStr)}>
                  <CategoryText selected={catStr === selectedCat}>{catStr}</CategoryText>
                </CateTextTO>
                <ItemPickerWrap>
                  <JBPicker
                    items={itemList[catStr]}
                    selectedValue={catStr === selectedCat ? selectedItem : ''}
                    onValueChange={itemValue => selectItem(itemValue)}
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
