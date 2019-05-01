import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Rating } from 'react-native-elements';
import JBTextItem from '../molecules/JBTextItem';
import ListSeparator from '../molecules/ListSeparator';
import FirmImageItem from '../FirmImageItem';
import Card from '../molecules/CardUI';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';
import FirmEvaluListItem from './FirmEvaluListItem';

const styles = StyleSheet.create({
  frimTopItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  topLeftWrap: {},
  firmLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    marginBottom: 10,
  },
  topCommWrap: {
    alignItems: 'center',
    marginRight: 25,
  },
  ratingWrap: {
    marginTop: 5,
    alignItems: 'center',
  },
  rating: {
    backgroundColor: colors.point2,
  },
  ratingCntText: {
    fontSize: 12,
  },
  titleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'rgba(250, 250, 250, 0.3)',
    elevation: 3,
    borderRadius: 5,
  },
  fnameText: {
    fontSize: 30,
    fontFamily: fonts.titleTop,
    color: colors.point2,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
});

/**
 * 업체 블로그/홈페이지/SNS링크 열기
 */
function openLinkUrl(url) {
  if (url === null || url === '') {
    return;
  }

  Linking.openURL(url).catch(Alert.alert(`링크 열기에 문제가 있습니다 [${url}]`));
}

export default function FirmInfoItem({ firm, evaluList }) {
  return (
    <View>
      <Card>
        <View style={styles.frimTopItemWrap}>
          <View style={styles.topLeftWrap}>
            <View style={styles.firmLinkWrap}>
              <TouchableOpacity onPress={() => openLinkUrl(firm.blog)}>
                <MaterialCommunityIcons
                  name="blogger"
                  size={32}
                  color={firm.blog !== '' ? colors.pointDark : 'gray'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLinkUrl(firm.homepage)}>
                <MaterialCommunityIcons
                  name="home-circle"
                  size={32}
                  color={firm.homepage !== '' ? colors.pointDark : 'gray'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLinkUrl(firm.sns)}>
                <AntDesign
                  name="facebook-square"
                  size={32}
                  color={firm.sns !== '' ? colors.pointDark : 'gray'}
                />
              </TouchableOpacity>
            </View>
            <JBTextItem
              title="보유장비"
              value={`${firm.equiListStr}(${firm.modelYear}년식)`}
              revColor
            />
          </View>
          <View style={styles.topCommWrap}>
            <Image style={styles.thumbnail} source={{ uri: firm.thumbnail }} />
            {firm.rating ? (
              <View style={styles.ratingWrap}>
                <Rating type="custom" imageSize={15} readonly startingValue={firm.rating} />
                <Text style={styles.ratingCntText}>
(
                  {firm.ratingCnt}
)
                </Text>
              </View>
            ) : (
              <Text style={styles.noneRatingText}>후기없음</Text>
            )}
          </View>
        </View>

        <JBTextItem title="주소" value={`${firm.address}\n${firm.addressDetail}`} revColor />
        <JBTextItem title="업체소개" value={firm.introduction} revColor />
      </Card>
      <Card Primary>
        <FirmImageItem title="작업사진1" value={firm.photo1} />
        <FirmImageItem title="작업사진2" value={firm.photo2} />
        <FirmImageItem title="작업사진3" value={firm.photo3} />
      </Card>
      {evaluList && (
        <Card>
          <FlatList
            data={evaluList}
            renderItem={item => <FirmEvaluListItem item={item.item} />}
            ListEmptyComponent={() => <Text>후기없음</Text>}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ListSeparator}
          />
        </Card>
      )}
    </View>
  );
}
