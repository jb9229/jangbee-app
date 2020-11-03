import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import JBIcon from 'atoms/JBIcon';
import { Rating } from 'react-native-elements';
import React from 'react';
import {callSearchFirm} from 'common/CallLink';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

const styles = StyleSheet.create({
  itemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10
  },
  leftWrap: {
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    margin: 3
  },
  ratingWrap: {
    alignItems: 'center',
    marginTop: 3
  },
  rating: {},
  ratingText: {
    fontSize: 12
  },
  noneRatingText: {
    fontFamily: fonts.title,
    fontSize: 12
  },
  centerWrap: {
    flex: 3
  },
  fnameText: {
    fontSize: 16,
    fontFamily: fonts.titleMiddle,
    textDecorationLine: 'underline'
  },
  intrText: {
    fontSize: 14,
    fontFamily: fonts.batang,
    paddingLeft: 5,
    paddingBottom: 5
  },
  bottomText: {
    fontSize: 14,
    backgroundColor: colors.point2Light,
    fontWeight: 'bold',
    padding: 1,
    paddingLeft: 4,
    paddingRight: 4
  },
  bottomWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5
  },
  topWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5
  }
});

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

const firmListItem = props => {
  const { item, onPressItem } = props;
console.log('>> firmitem:', item)
  return (
    <View style={styles.itemWrap}>
      <View style={styles.leftWrap}>
        <Image style={styles.avatar} source={{ uri: item.thumbnail }} />
        {item.rating ? (
          <View style={styles.ratingWrap}>
            <Rating
              imageSize={10}
              readonly
              startingValue={item.rating}
              style={styles.rating}
            />
            <Text style={styles.ratingText}>({item.ratingCnt})</Text>
          </View>
        ) : (
          <Text style={styles.noneRatingText}>후기없음</Text>
        )}
      </View>
      <View style={styles.centerWrap}>
        <View style={styles.topWrap}>
          <TouchableHighlight onPress={() => onPressItem(item.accountId)}>
            <Text style={styles.fnameText}>{item.fname}</Text>
          </TouchableHighlight>
          <JBIcon
            name="call"
            size={32}
            color={colors.point}
            onPress={() => callSearchFirm(item.phoneNumber)}
          />
        </View>
        <Text style={styles.intrText} numberOfLines={1}>
          {item.introduction}
        </Text>
        <View style={styles.bottomWrap}>
          <Text style={styles.bottomText}>{`${item.equiListStr}(${
            item.modelYear
          }년식)`}</Text>
          <Text style={styles.bottomText}>{calDistance(item.distance)}</Text>
        </View>
      </View>
    </View>
  );
};

export default firmListItem;
