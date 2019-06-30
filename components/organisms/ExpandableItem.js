import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import Styled from 'styled-components';
import colors from '../../constants/Colors';

const Container = Styled.View`
  margin-bottom: 10px;
`;

const CateWrap = Styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  elevation: 3;
  border-radius: 10;
  background-color: ${props => props.bgColor};
`;

const CateTO = Styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px;
  border-right-width: 1;
  border-color: ${colors.batangLight};
  flex: 1;
`;

const SubCatTO = Styled.TouchableOpacity`
  margin-left: 8;
  margin-right: 8;
  padding-left: 8;
  padding-right: 8;
  background-color: #fff;
  ${props => props.checked
    && `
    background-color: ${colors.pointLight};
  `}
`;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: colors.point2Light,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  catCB: {
    margin: 0,
    padding: 0,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 8,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
});

export default class ExpandableItem extends React.Component {
  // Custom Component for the Expandable List
  constructor() {
    super();
    this.state = {
      willUpdate: false,
      layoutHeight: 0,
      catBgColor: colors.point2Light,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;

    if (!item) {
      return;
    }

    if (item.isExpanded) {
      this.setState(() => ({
        layoutHeight: null,
      }));
    } else {
      this.setState(() => ({
        layoutHeight: 0,
      }));
    }

    if (item.isChecked) {
      this.setState({ catBgColor: colors.pointLight });
    } else {
      this.setState({ catBgColor: colors.point2Light });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { item } = nextProps;

    if (item.willUpdate) {
      item.willUpdate = false;
      return true;
    }
    return false;
  }

  render() {
    const {
      onClickFunction,
      onCatCheck,
      item,
      completeSel,
      selectSubCate,
      isCatSelectable,
    } = this.props;
    const { layoutHeight, catBgColor } = this.state;
    return (
      <Container>
        {/* Header of the Expandable List Item */}
        <CateWrap bgColor={catBgColor}>
          <CateTO activeOpacity={0.8} onPress={onClickFunction}>
            <Text style={styles.headerText}>{item.category_name}</Text>
            {item.isExpanded ? (
              <AntDesign name="up" size={20} color={colors.batangDark} />
            ) : (
              <AntDesign name="down" size={20} color={colors.batang} />
            )}
          </CateTO>
          {isCatSelectable && (
            <CheckBox
              iconRight
              checked={item.isChecked}
              size={40}
              containerStyle={styles.catCB}
              onPress={onCatCheck}
            />
          )}
        </CateWrap>
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}
        >
          {/* Content under the header of the Expandable List Item */}
          {item.subcategory.map((local, key) => (
            <SubCatTO key={key} checked={local.isChecked} onPress={() => selectSubCate(key)}>
              <Text style={styles.text}>{local.val}</Text>
              <View style={styles.separator} />
            </SubCatTO>
          ))}
        </View>
      </Container>
    );
  }
}
