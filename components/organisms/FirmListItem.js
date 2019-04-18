import React from 'react';
import {
  Alert, Linking, Image, StyleSheet, TouchableHighlight, Text, View,
} from 'react-native';
import JBIcon from '../molecules/JBIcon';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  itemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    margin: 3,
  },
  centerWrap: {
    flex: 3,
  },
  fnameText: {
    fontSize: 16,
    fontFamily: fonts.titleMiddle,
    textDecorationLine: 'underline',
  },
  intrText: {
    fontSize: 14,
    fontFamily: fonts.batang,
    paddingTop: 5,
    paddingBottom: 5,
  },
  bottomText: {
    fontSize: 14,
    backgroundColor: colors.point2Light,
    fontWeight: 'bold',
    padding: 1,
    paddingLeft: 4,
    paddingRight: 4,
  },
  bottomWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callIconWrap: {
    justifyContent: 'center',
  },
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

function calDistance(dis) {
  if (!dis) {
    return '';
  }

  if (dis < 1000) {
    return `${dis}m`;
  }

  let kmValue = dis / 1000;
  kmValue = parseInt(kmValue, 10);
  return `${kmValue}km`;
}

const firmListItem = (props) => {
  const { item, onPressItem } = props.data;
  return (
    <View style={styles.itemWrap}>
      <Image style={styles.avatar} source={{ uri: item.thumbnail }} />
      <View style={styles.centerWrap}>
        <TouchableHighlight onPress={() => onPressItem(item.accountId)}>
          <Text style={styles.fnameText}>{item.fname}</Text>
        </TouchableHighlight>
        <Text style={styles.intrText} numberOfLines={1}>
          {item.introduction}
        </Text>
        <View style={styles.bottomWrap}>
          <Text style={styles.bottomText}>{item.equiListStr}</Text>
          <Text style={styles.bottomText}>{calDistance(item.distance)}</Text>
        </View>
      </View>
      <View style={styles.callIconWrap}>
        <JBIcon
          name="call"
          size={42}
          color={colors.point}
          onPress={() => callFirm(item.phoneNumber)}
        />
      </View>
    </View>
  );
};

export default firmListItem;
