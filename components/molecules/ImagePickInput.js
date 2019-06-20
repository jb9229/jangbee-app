import React from 'react';
import {
  Alert, Image, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { ImagePicker } from 'expo';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';
import colors from '../../constants/Colors';
import JBIcon from './JBIcon';

const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  color: ${colors.title};
  font-size: 15;
  margin-bottom: 3;
  ${props => props.fill
    && `
    color: ${colors.point2};
  `}
`;

const TitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SubTitle = styled.Text`
  font-family: ${fonts.title};
  color: ${colors.titleDark};
  font-size: 12;
`;

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  pickImage = async () => {
    const { aspect, setImageUrl } = this.props;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: aspect || undefined,
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
    const { itemTitle, subTitle, imgUrl, itemWrapStyle } = this.props;

    const urlTextStyle = imgUrl ? styles.urlText : styles.placeholder;
    return (
      <View style={styles.itemWrap}>
        <View style={styles.titleWrap}>
          <TitleWrap>
            {itemTitle && <Title fill={!!imgUrl}>{itemTitle}</Title>}
            {subTitle && <SubTitle>{subTitle}</SubTitle>}
          </TitleWrap>
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
