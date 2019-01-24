import React from 'react';
import {
  Alert, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { ImagePicker } from 'expo';
import * as api from '../api/api';

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
  },
  itemTitle: {
    fontFamily: 'yang-rounded',
    color: '#4D4A4A',
    fontSize: 20,
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
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      this.handleImagePicked(result.uri);
    }
  };

  handleImagePicked = (imgUri) => {
    const { setImageUrl } = this.props;

    api
      .uploadImage(imgUri)
      .then((resImgUrl) => {
        setImageUrl(resImgUrl);

        this.setState({
          isUploaded: true,
        });
      })
      .catch((error) => {
        Alert.alert(
          '이미지 업로드에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );

        return undefined;
      });
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
