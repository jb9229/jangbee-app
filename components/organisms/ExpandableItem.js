import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F5FCFF',
    padding: 16,
    borderBottomWidth: 1,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
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
    const { onClickFunction, item } = this.props;
    const { layoutHeight } = this.state;
    return (
      <View>
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
              onPress={() => this.setState({ sigungu: local.val })}
            >
              <Text style={styles.text}>{local.val}</Text>
              <View style={styles.separator} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}
