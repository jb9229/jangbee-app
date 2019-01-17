import React from 'react';
import {
  Button, ImagePicker, Text, View,
} from 'react-native';
import * as api from '../api/api';

export default class ImagePickInput extends React.Component {
  _pickImage = async (location) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.handleImagePicked(location, result.uri);
    }
  };

  handleImagePicked = (location, imgUri) => {
    api
      .uploadImage(imgUri)
      .then((resImgUrl) => {
        this.setState({
          isLoadEntrPhoto: resImgUrl,
        });
      })
      .catch((error) => {});
  };

  render() {
    const { itemIitle, imgLoaded, imgUrl } = this.props;
    return (
      <View>
        <Button onPress={() => this._pickImage()}>
          <Text>{itemIitle}</Text>
        </Button>

        {imgLoaded ? <Text>{imgUrl}</Text> : null}
      </View>
    );
  }
}
