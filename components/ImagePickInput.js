import React from 'react';
import {
  Alert, Button, Text, View,
} from 'react-native';
import { ImagePicker } from 'expo';
import * as api from '../api/api';

export default class ImagePickInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUploaded: false,
    };
  }

  pickImage = async () => {
    console.log('Start pickImage~');
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(`result.cancelled: ${result.cancelled}`);

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
    return (
      <View style={itemWrapStyle}>
        <Button title={itemTitle} onPress={() => this.pickImage()} />

        <Text>{isUploaded ? imgUrl : null}</Text>
      </View>
    );
  }
}
