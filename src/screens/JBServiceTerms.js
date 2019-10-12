import React from 'react';
import { StyleSheet, Dimensions, View, WebView } from 'react-native';
import { SceneMap, TabView, TabBar } from 'react-native-tab-view';
import * as url from 'constants/Url';
import JBTerm from 'templates/JBTerm';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

const styles = StyleSheet.create({
  Container: {
    flex: 1
  },
  scene: {
    flex: 1
  },
  tabBarIndicator: {
    backgroundColor: colors.point
  },
  tabBar: {
    backgroundColor: colors.point2Dark
  },
  tabBarLabel: {
    fontFamily: fonts.titleMiddle,
    fontWeight: 'bold'
  }
});

export default class JBServiceTerms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: '이용 약관' },
        { key: 'second', title: '개인정보 처리방침' }
      ]
    };
  }

  componentDidMount() {}

  /**
   * Tab View 변경함수
   */
  changeTabView = index => {
    this.setState({ index });
  };

  render() {
    const { navigation } = this.props;

    const serviceTerms = () => (
      <WebView
        source={{
          uri: `${url.TERM_SERVICE}`
        }}
      />
    );

    const securityTerms = () => (
      <WebView
        source={{
          uri: `${url.TERM_SECURITY}`
        }}
      />
    );

    return (
      <View style={styles.Container}>
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: serviceTerms,
            second: securityTerms
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
        <JBTerm />
      </View>
    );
  }
}
