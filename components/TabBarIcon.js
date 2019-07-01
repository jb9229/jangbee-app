import React from 'react';
<<<<<<< HEAD
import * as Icon from '@expo/vector-icons'
=======
import { Icon } from 'expo';
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b

import Colors from '../constants/Colors';

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
