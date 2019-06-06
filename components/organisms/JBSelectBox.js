import React from 'react';
import styled from 'styled-components';
import colors from '../../constants/Colors';

const Container = styled.View`
  height: 100;
  margin-bottom: 5;
`;

const Title = styled.Text``;

const CategoryListWrap = styled.ScrollView`
  flex-direction: row;
`;

const CategoryWrap = styled.View``;

const CategoryTO = styled.TouchableOpacity`
  border-width: 1;
  border-color: ${colors.batangLight};
  border-radius: 5;
  padding: 8px;
  margin-right: 10;
  background-color: ${colors.batangLight};
  ${props => props.selected
    && `
    border-color: ${colors.pointLight};
    background-color: ${colors.pointLight};
  `}
`;

const CategoryText = styled.Text``;

const SelectedIndicator = styled.View`
  height: 12;
  margin-right: 10;
  ${props => props.selected
    && `
    border-color: ${colors.pointBatang};
    background-color: ${colors.pointBatang};
  `}
`;

const ItemListWrap = styled.ScrollView`
  background-color: ${colors.pointBatang};
  padding: 5px;
`;

const ItemTO = styled.TouchableOpacity`
  justify-content: center;
  border-width: 1;
  border-color: ${colors.pointLight};
  border-radius: 15;
  padding: 10px;
  margin-right: 10;
  ${props => props.selected
    && `
    border-color: ${colors.pointLight};
    background-color: ${colors.pointLight};
  `}
`;

const ItemText = styled.Text``;

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
      title, categoryList, itemList, selectedCat, selectedItem,
    } = this.props;

    const selectedCatStr = selectedCat || categoryList[0];
console.log("selectedCatStr: "+selectedCatStr);
    return (
      <Container>
        {title ? <Title>{title}</Title> : null}
        <CategoryListWrap horizontal>
          {categoryList.map(catStr => (
            <CategoryWrap>
              <CategoryTO
                onPress={() => this.selectCategory(catStr)}
                selected={catStr === selectedCat}
              >
                <CategoryText>{catStr}</CategoryText>
              </CategoryTO>
              <SelectedIndicator selected={catStr === selectedCat} />
            </CategoryWrap>
          ))}
        </CategoryListWrap>
        <ItemListWrap horizontal>
          {itemList[selectedCatStr].map(itemStr => (
            <ItemTO onPress={() => this.selectItem(itemStr)} selected={itemStr === selectedItem}>
              <ItemText>{itemStr}</ItemText>
            </ItemTO>
          ))}
        </ItemListWrap>
      </Container>
    );
  }
}
