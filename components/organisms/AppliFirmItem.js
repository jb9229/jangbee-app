import React from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';
import Styled from 'styled-components';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const Container = Styled.TouchableHighlight`
  flex-direction: row;
  justify-content: space-between;
  padding: 5 10;
  ${props => props.selected && `
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

const appliFirmListItem = (props) => {
  const { item, onPressItem, selected } = props.data;
  return (
    <Container selected={selected} onPress={() => onPressItem(item.accountId)}>
      <View>
        <Image style={styles.avatar} source={{ uri: item.thumbnail }} />
        <View style={styles.centerWrap}>
          <Text style={styles.fnameText}>{item.fname}</Text>
          <Text style={styles.intrText} numberOfLines={1}>
            {item.introduction}
          </Text>
          <View style={styles.bottomWrap}>
            <Text style={styles.bottomText}>{item.equiListStr}</Text>
            <Text style={styles.bottomText}>{calDistance(item.distance)}</Text>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default appliFirmListItem;
