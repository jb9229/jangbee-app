import React from 'react';
import { SceneMap, TabView, TabBar } from 'react-native-tab-view';

export default function renderTabView() {
  return (
    <TabView
      navigationState={this.state}
      renderScene={SceneMap({
        first: renderOpenWorkList,
        second: renderMatchedWorkList,
      })}
      onIndexChange={this.changeTabView}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={styles.tabBarIndicator}
          style={styles.tabBar}
          labelStyle={styles.tabBarLabel}
        />
      )}
    />
  );
}
