import * as Icon from '@expo/vector-icons';

import Colors from 'constants/Colors';
import React from 'react';

export default class TabBarIcon extends React.PureComponent {
  render() {
    const { type, name, focused } = this.props;

    if (type && type === 'MaterialIcons') {
      return (
        <Icon.MaterialIcons
          name={name}
          size={26}
          style={{ marginBottom: -3 }}
          color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
      );
    }

    if (type && type === 'MaterialCommunityIcons') {
      return (
        <Icon.MaterialCommunityIcons
          name={name}
          size={26}
          style={{ marginBottom: -3 }}
          color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
      );
    }

    return (
      <Icon.Ionicons
        name={name}
        size={26}
        style={{ marginBottom: -3 }}
        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}