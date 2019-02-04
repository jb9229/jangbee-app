import React from 'react';
import {
  Alert, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { ImagePicker } from 'expo';
import fonts from '../constants/Fonts';
import colors from '../constants/Colors';

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
  },
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3,
  },
  urlInput: {},
  urlText: {
    fontFamily: 'Hamchorong-batang',
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#7A7373',
  },
  placeholder: {
    color: 'gray',
    fontFamily: 'Hamchorong-batang',
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#7A7373',
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

  render() {
    const { itemTitle, imgUrl, itemWrapStyle } = this.props;
    const { isUploaded } = this.state;

    const urlTextStyle = imgUrl === '' ? styles.placeholder : styles.urlText;
    return (
      <View style={styles.itemWrap}>
        <Text style={styles.itemTitle}>{itemTitle}</Text>

        <TouchableOpacity onPress={() => this.pickImage()} style={styles.urlInput}>
          <Text style={urlTextStyle} ellipsizeMode="tail" numberOfLines={1}>
            {imgUrl === '' ? '사진을 선택해 주세요' : imgUrl}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
