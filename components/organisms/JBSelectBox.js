import React from 'react';
import styled from 'styled-components';
import colors from '../../constants/Colors';

const Container = styled.View`
  height: 100;
  margin-bottom: 5;
`;

const CategoryListWrap = styled.ScrollView`
  margin-bottom: 5;
  padding: 5px;
`;

const CategoryTO = styled.TouchableOpacity`
  border-width: 1;
  border-color: ${colors.batangLight};
  border-radius: 5;
  padding: 8px;
  margin-right: 10;
  background-color: ${colors.batangLight};
`;

const CategoryText = styled.Text``;

const ItemListWrap = styled.ScrollView`
  background-color: ${colors.pointBatang};
  padding: 5px;
`;

const ItemTO = styled.TouchableOpacity`
  border-width: 1;
  border-color: ${colors.pointLight};
  border-radius: 15;
  padding: 10px;
  margin-right: 10;
`;

const ItemText = styled.Text``;

export default class JBSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { categoryList } = this.props;

    const categoryUIList = categoryList.map(catStr => (
      <CategoryTO onPress={() => this.selectCategory(catStr)}>
        <CategoryText>{catStr}</CategoryText>
      </CategoryTO>
    ));

    this.selectCategory(categoryList[0]);
    this.setState({ categoryUIList });
  }

  selectCategory = (category) => {
    const { itemList } = this.props;

    const itemUIList = itemList[category].map(itemStr => (
      <ItemTO onPress={() => this.selectItem()}>
        <ItemText>{itemStr}</ItemText>
      </ItemTO>
    ));

    this.setState({ itemUIList });
  };

  selectItem = () => {};

  render() {
    const { categoryUIList, itemUIList } = this.state;

    return (
      <Container>
        <CategoryListWrap horizontal>{categoryUIList}</CategoryListWrap>
        <ItemListWrap horizontal>{itemUIList}</ItemListWrap>
      </Container>
    );
  }
}
