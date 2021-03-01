import * as Icon from '@expo/vector-icons';

import Colors from 'constants/Colors';
import React from 'react';

interface Props {
  type: string;
  name: string;
  focused: boolean;
}
const TabBarIcon: React.FC<Props> = ({ type, name, focused }) => {
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

  if (type && type === 'SimpleLineIcons') {
    return (
      <Icon.SimpleLineIcons
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
};

export default TabBarIcon;
