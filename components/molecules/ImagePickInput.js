import React from 'react';
import {
  Image, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { ImagePicker } from 'expo';
import fonts from '../../constants/Fonts';
import colors from '../../constants/Colors';
import JBIcon from './JBIcon';

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3,
  },
  urlInput: {},
  urlText: {
    fontFamily: fonts.batang,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#7A7373',
  },
  placeholder: {
    color: 'gray',
    fontFamily: fonts.batang,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#7A7373',
  },
  imgWrap: {
    flexDirection: 'row',
  },
  image: {
    aspectRatio: 4 / 3,
    width: '100%',
    height: '100%',
    maxWidth: 800,
    maxHeight: 600,
    resizeMode: 'contain',
  },
});

export default class ImagePickInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUploaded: false,
    };
  }

  pickImage = async () => {
    const { aspect, setImageUrl } = this.props;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: aspect !== null ? aspect : null,
    });

    if (!result.cancelled) {
      setImageUrl(result.uri);
    }
  };

  removeImg = () => {
    const { setImageUrl } = this.props;
    setImageUrl('');
  };

  render() {
    const { itemTitle, imgUrl, itemWrapStyle } = this.props;
    const { isUploaded } = this.state;

    const urlTextStyle = imgUrl ? styles.urlText : styles.placeholder;
    return (
      <View style={styles.itemWrap}>
        <View style={styles.titleWrap}>
          <Text style={styles.itemTitle}>{itemTitle}</Text>
          {imgUrl ? <JBIcon name="close" size={32} onPress={() => this.removeImg()} /> : null}
        </View>

        {!imgUrl ? (
          <TouchableOpacity onPress={() => this.pickImage()} style={styles.urlInput}>
            <Text style={urlTextStyle} ellipsizeMode="tail" numberOfLines={1}>
              사진을 선택해 주세요
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imgWrap}>
            <Image style={styles.image} source={{ uri: imgUrl }} />
          </View>
        )}
      </View>
    );
  }
}
