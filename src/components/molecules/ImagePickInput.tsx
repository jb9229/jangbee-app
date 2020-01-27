import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import JBIcon from 'atoms/JBIcon';
import MiddleTitle from 'molecules/Text/MiddleTitle';
import fonts from 'constants/Fonts';

const styles = StyleSheet.create({
  itemWrap: {
    marginTop: 15
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  urlInput: {},
  urlText: {
    fontFamily: fonts.batang,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#7A7373'
  },
  placeholder: {
    color: 'gray',
    fontFamily: fonts.batang,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#7A7373'
  },
  imgWrap: {
    flexDirection: 'row'
  },
  image: {
    aspectRatio: 4 / 3,
    width: '100%',
    height: '100%',
    maxWidth: 800,
    maxHeight: 600,
    resizeMode: 'contain'
  }
});

interface Props {
  itemTitle: string;
  subTitle?: string;
  imgUrl: string;
  errorText?: string;
  aspect?: [number, number];
  itemWrapStyle?: ViewStyle;
  setImageUrl: (url: string) => void;
}
const ImagePickInput: React.FC<Props> = (props) =>
{
  const [imgUrl, setImageUrl] = React.useState(props.imgUrl);
  const urlTextStyle = imgUrl ? styles.urlText : styles.placeholder;
  return (
    <View style={styles.itemWrap}>
      <View style={styles.titleWrap}>
        <MiddleTitle label={props.itemTitle} subLabel={props.subTitle}/>
        {imgUrl ? (
          <JBIcon name="close" size={32} onPress={(): void => { props.setImageUrl(''); setImageUrl('') }} />
        ) : null}
      </View>

      {!imgUrl ? (
        <TouchableOpacity
          onPress={() => pickImage(props.aspect, setImageUrl, props.setImageUrl)}
          style={styles.urlInput}
        >
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
};

const pickImage = async (aspect: [number, number], setLocalImageUrl: (url: string) => void, setImageUrl: (url: string) => void) =>
{
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: aspect || undefined
  });

  if (!result.cancelled)
  {
    setImageUrl(result.uri);
    setLocalImageUrl(result.uri);
  }
};

export default ImagePickInput;
