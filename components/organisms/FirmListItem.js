import React from 'react';
import {
  Alert, Linking, Image, StyleSheet, TouchableHighlight, Text, View,
} from 'react-native';
import JBIcon from '../molecules/JBIcon';

const styles = StyleSheet.create({
  container: {},
  avatar: {},
  bottomWrap: {},
});

/**
 * 업체 전화연결 함수
 */
function callFirm(number) {
  if (number === null || number === '') {
    return;
  }

  const telStr = `tel:${number}`;

  Linking.openURL(telStr).catch(
    Alert.alert(`전화앱 열기에 문제가 있습니다, 다시 시도해 주세요 [${telStr}]`),
  );
}

const firmListItem = (props) => {
  const { item, onPressItem } = props;
  return (
    <View>
      <TouchableHighlight onPress={() => onPressItem(item.id)}>
        <Image style={styles.avatar} source={{ uri: item.thumbnail }} />
        <Text>fname</Text>
        <Text>instroduce?</Text>
        <View style={styles.bottomWrap}>
          <Text>거리</Text>
        </View>
      </TouchableHighlight>
      <JBIcon name="md-call" size={32} onPress={() => callFirm(item.telNumber)} />
    </View>
  );
};

export default firmListItem;
