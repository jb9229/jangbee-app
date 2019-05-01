import React from 'react';
import {
  Alert, Linking, StyleSheet, View, ActivityIndicator, Text,
} from 'react-native';
import JBButton from './JBButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorWrap: {
    flexDirection: 'row',
  },
  webLinkWrap: {
    flex: 1,
  },
  webLinkButWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    opacity: 0.7,
    marginLeft: 8,
  },
});

export default class ListFooter extends React.PureComponent {
  static defaultProps = {
    hasMore: false,
    isLoading: false,
  };

  /**
   * 미등록 지역 웹 검색 링크
   */
  openLinkUrl = (url) => {
    if (url === null || url === '') {
      return;
    }

    Linking.openURL(url).catch(Alert.alert(`링크 열기에 문제가 있습니다 [${url}]`));
  };

  render() {
    const {
      hasMore, isLoading, selEquipment, selSido, selGungu,
    } = this.props;
    const title = hasMore ? '리스트 조회중...' : '끝!';

    return (
      <View style={styles.container}>
        <View style={styles.indicatorWrap}>
          <ActivityIndicator style={{ opacity: hasMore ? 1 : 0 }} animating={isLoading} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.webLinkWrap}>
          <Text>혹시 찾는 업체가 없습니까? 웹검색을 이용해 보세요.</Text>
          <View style={styles.webLinkButWrap}>
            <JBButton
              title="네이버 검색"
              size="small"
              underline
              onPress={() => this.openLinkUrl(
                `https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=${selEquipment}+${selSido}+${selGungu}`,
              )
              }
            />
            <JBButton
              title="다음 검색"
              size="small"
              underline
              onPress={() => this.openLinkUrl(
                `https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&q=${selEquipment}+${selSido}+${selGungu}`,
              )
              }
            />
          </View>
        </View>
      </View>
    );
  }
}
