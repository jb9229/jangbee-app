import React from 'react';
import styled from 'styled-components';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const Container = styled.View`
  height: 120;
  margin-bottom: 5;
  border-width: 1;
  border-color: ${colors.batangLight};
  padding: 5px;
`;

const Title = styled.Text`
  font-family: ${fonts.title};
  margin: 3px;
  margin-bottom: 7px;
`;

const CategoryListWrap = styled.ScrollView`
  flex-direction: row;
`;

const CategoryWrap = styled.View`
  border-bottom-width: 1;
  border-color: ${colors.batangLight};
`;

const CategoryTO = styled.TouchableOpacity`
  border-width: 1;
  border-color: ${colors.batangLight};
  border-radius: 5;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  margin-right: 10;
  background-color: ${colors.batangLight};
  ${props => props.selected
    && `
    border-color: ${colors.pointLight};
    background-color: ${colors.pointLight};
  `}
`;

const CategoryText = styled.Text`
  font-family: ${fonts.title};
  font-size: 16;
`;

const SelectedIndicator = styled.View`
  height: 25;
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
  padding: 13px;
  margin-right: 10;
  ${props => props.selected
    && `
    border-color: ${colors.pointLight};
    background-color: ${colors.pointLight};
  `}
`;

const ItemText = styled.Text`
  font-family: ${fonts.title};
  font-size: 16;
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
    const { itemScrollView } = this.refs;

    itemScrollView.scrollTo({ x: 0, y: 0, animated: true });
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
    console.log('Rendering JBSelectBox');
    const selectedCatStr = selectedCat || categoryList[0];
    return (
      <Container>
        {title ? <Title>{title}</Title> : null}
        <CategoryListWrap horizontal>
          {categoryList.map((catStr, i) => (
            <CategoryWrap key={i}>
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
        <ItemListWrap ref="itemScrollView" horizontal>
          {itemList[selectedCatStr].map((itemStr, i) => (
            <ItemTO
              key={i}
              onPress={() => this.selectItem(itemStr)}
              selected={itemStr === selectedItem}
            >
              <ItemText>{itemStr}</ItemText>
            </ItemTO>
          ))}
        </ItemListWrap>
      </Container>
    );
  }
}
