import React from 'react';
import {
  ScrollView, StyleSheet, TouchableHighlight, Text,
} from 'react-native';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: '업체 정보',
  };

  registerFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmRegister');
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
         * content, we just wanted to provide you with some helpful links */}
        <TouchableHighlight onPress={() => this.registerFirm()}>
          <Text>업체 등록</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
