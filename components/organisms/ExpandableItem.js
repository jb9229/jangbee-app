import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Styled from 'styled-components';
import colors from '../../constants/Colors';

const Container = Styled.View`
  margin-bottom: 10px;
`;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.point2Light,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
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
  content: {
    marginLeft: 8,
    marginRight: 8,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#fff',
  },
});

export default class ExpandableItem extends React.Component {
  // Custom Component for the Expandable List
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => ({
        layoutHeight: null,
      }));
    } else {
      this.setState(() => ({
        layoutHeight: 0,
      }));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { layoutHeight } = this.state;

    if (layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    const { onClickFunction, item, completeSel } = this.props;
    const { layoutHeight } = this.state;
    return (
      <Container>
        {/* Header of the Expandable List Item */}
        <TouchableOpacity activeOpacity={0.8} onPress={onClickFunction} style={styles.header}>
          <Text style={styles.headerText}>{item.category_name}</Text>
        </TouchableOpacity>
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}
        >
          {/* Content under the header of the Expandable List Item */}
          {item.subcategory.map((local, key) => (
            <TouchableOpacity
              key={key}
              style={styles.content}
              onPress={() => completeSel(item.category_name, local.val)}
            >
              <Text style={styles.text}>{local.val}</Text>
              <View style={styles.separator} />
            </TouchableOpacity>
          ))}
        </View>
      </Container>
    );
  }
}
