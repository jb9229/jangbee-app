import React from 'react';
import {
  Image, StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Styled from 'styled-components';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';
import JBButton from '../molecules/JBButton';

const Container = Styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 10px;
  ${props => props.selected
    && `
    background-color: ${colors.point}
  `}
`;

const styles = StyleSheet.create({
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

const appliFirmListItem = ({
  item, selected, onPressItem, selectFirm,
}) => (
  <TouchableHighlight onPress={() => selectFirm(item.accountId)}>
    <Container selected={selected}>
      <Image style={styles.avatar} source={{ uri: item.thumbnail }} />
      <View style={styles.centerWrap}>
        <TouchableHighlight onPress={() => onPressItem(item.accountId)}>
          <Text style={styles.fnameText}>{item.fname}</Text>
        </TouchableHighlight>
        <Text style={styles.intrText} numberOfLines={1}>
          {item.introduction}
        </Text>
        <View style={styles.bottomWrap}>
          <Text style={styles.bottomText}>{`${item.equiListStr}(${item.modelYear}년식)`}</Text>
          {item.distance && <Text style={styles.bottomText}>{calDistance(item.distance)}</Text>}
        </View>
      </View>
    </Container>
  </TouchableHighlight>
);

export default appliFirmListItem;
