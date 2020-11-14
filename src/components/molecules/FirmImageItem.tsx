import { Image, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import fonts from 'constants/Fonts';

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
    marginBottom: 15,
    minHeight: 200
  },
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: '#4D4A4A',
    fontSize: 18
  },
  responsiveImgWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  responsiveImage: {
    aspectRatio: 4 / 3,
    width: '100%',
    height: 500,
    maxWidth: 800,
    maxHeight: 600,
    resizeMode: 'contain'
  }
});

interface Props {
  title: string;
  value: string;
}
const FirmImageItem: React.FC<Props> = ({ title, value }) =>
{
  return (
    <View style={styles.itemWrap}>
      <Text style={styles.itemTitle}>{`${title}: `}</Text>
      {value !== null && value !== '' ? (
        <View style={styles.responsiveImgWrap}>
          <Image style={styles.responsiveImage} source={{ uri: value }} />
        </View>
      ) : null}
    </View>
  );
};

export default FirmImageItem;
