import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import ErrorText from 'src/components/molecules/Text/ErrorText';
import JBIcon from 'atoms/JBIcon';
import MiddleTitle from 'molecules/Text/MiddleTitle';
import fonts from 'constants/Fonts';

interface StyleProps {
  theme?: DefaultTheme;
  existUrl?: boolean;
  error?: boolean;
}
const UrlTextTO = styled.TouchableOpacity`
  padding-bottom: 5;
  border-bottom-width: 1;
  border-color: ${(props: StyleProps): string => props.error ? props.theme.ColorTextError : '#7A7373'};
`;
const UrlText = styled.Text`
  font-family: ${fonts.batang};
  font-size: 20;
  color: ${(props: StyleProps): string => props.existUrl ? 'black' : 'gray'};
`;
const styles = StyleSheet.create({
  itemWrap: {
    marginTop: 15,
    paddingTop: 10
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  urlInput: {},
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
  React.useEffect(() =>
  {
    setImageUrl(props.imgUrl);
    props.setImageUrl(props.imgUrl);
  }, [props.imgUrl]);

  const [imgUrl, setImageUrl] = React.useState(props.imgUrl);

  return (
    <View style={styles.itemWrap}>
      <View style={styles.titleWrap}>
        <MiddleTitle label={props.itemTitle} subLabel={props.subTitle}/>
        {imgUrl ? (
          <JBIcon name="close" size={32} onPress={(): void => { props.setImageUrl(''); setImageUrl('') }} />
        ) : null}
      </View>

      {!imgUrl ? (
        <UrlTextTO
          onPress={() => pickImage(props.aspect, setImageUrl, props.setImageUrl)}
          error={!!props.errorText}
        >
          <UrlText ellipsizeMode="tail" numberOfLines={1}>
            사진을 선택해 주세요
          </UrlText>
        </UrlTextTO>
      ) : (
        <View style={styles.imgWrap}>
          <Image style={styles.image} source={{ uri: imgUrl }} />
        </View>
      )}
      {!!props.errorText && <ErrorText text={props.errorText} />}
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
