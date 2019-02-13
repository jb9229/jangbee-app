import React from 'react';
import {
  FlatList, Linking, Modal, StyleSheet, Text, View, Alert,
} from 'react-native';
import EquiSelBox from './EquiSelBox';
import * as api from '../api/api';
import JBButton from './molecules/JBButton';
import colors from '../constants/Colors';
import JBIcon from './molecules/JBIcon';
import JangbeeAd from './organisms/JangbeeAd';
import * as converter from '../utils/Converter';

const styles = StyleSheet.create({
  container: {},
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight,
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBatang,
    padding: 15,
    paddingTop: 5,
    borderRadius: 5,
  },
  selLocalWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  equiListWrap: {
    justifyContent: 'space-between',
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default class EquipementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelectedSido: false,
      sido: '-',
      gugun: '-',
      sidoList: [],
      gugunList: [],
      gugunMap: null,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { selEquipment } = this.props;
    if (selEquipment !== nextProps.selEquipment) {
      this.setLocalData(nextProps.selEquipment);
    }
  }

  /**
   * 장비가 존재하는 sido/sigungu 리스트 설정
   */
  setLocalData = (sEquipment) => {
    api.getFirmLocalData(sEquipment)
      .then((localData) => {
        console.log(localData)
        if (localData.sidoList === null || localData.gunguData === null) {
          return;
        }

        this.setState({ sidoList: localData.sidoList, gugunMap: converter.objToStrMap(localData.gunguData) });
      })
      .catch((error) => {
        Alert.alert(
          `[${sEquipment}] 보유 지역 검색에 문제가 있습니다, 재 시도해 주세요`,
          `[${error.name}] ${error.message}`,
        );
      });
  }

  /**
   * 지역선택 이벤트 함수
   *
   * @param {string} eName 장비명
   * @returns null
   */
  onPressSido = (selLocal) => {
    const { isSelectedSido, gugunMap } = this.state;

    if (isSelectedSido) {
      this.setState({ gugun: selLocal, isSelectedSido: false });
    } else {
      this.setState({
        sido: selLocal,
        gugun: '-',
        isSelectedSido: true,
        gugunList: gugunMap.get(selLocal),
      });
    }
  };

  /**
   * Sido 리스트 설정 함수
   *
   * @returns null
   */
  setSidoList = () => {
    api
      .getEquipList()
      .then((newEquiList) => {
        this.setState({ sidoList: newEquiList });
      })
      .catch((error) => {
        Alert.alert(
          '장비명 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );

        return undefined;
      });
  };

  /**
   * 지역 아이템 렌더 함수
   *
   * @param {Object} itemObj 리스트의 아이템 객체
   * @param {string} selectedItem 선택된 아이템
   */
  renderListItem = (itemObj, selectedItem) => (
    <EquiSelBox
      eName={itemObj.item}
      onPressItem={this.onPressSido}
      selected={selectedItem === itemObj.item}
    />
  );

  cancel = () => {
    const { nextFocus, closeModal } = this.props;

    nextFocus();
    closeModal();
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
    const { isVisibleEquiModal, selEquipment } = this.props;
    const {
      gugun, gugunList, sidoList, sido, isSelectedSido,
    } = this.state;

    const listData = isSelectedSido ? gugunList : sidoList;
    const extraData = isSelectedSido ? gugun : sido;
    const selectedItem = isSelectedSido ? gugun : sido;
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleEquiModal}
          onRequestClose={() => {}}
        >
          <View style={styles.cardWrap}>
            <View style={styles.card}>
              <JBIcon name="ios-close" size={32} onPress={() => this.cancel()} />
              <JangbeeAd />
              <View style={styles.selLocalWrap}>
                <Text>{sido}</Text>
                <Text>{gugun}</Text>
              </View>
              <FlatList
                columnWrapperStyle={styles.equiListWrap}
                horizontal={false}
                numColumns={2}
                data={listData}
                extraData={extraData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={item => this.renderListItem(item, selectedItem)}
              />
              <View>
                <Text>찾고자하는 지역이 없습니까? 아직 미등록된 상태 입니다, 더욱 노력하겠습니다.</Text>
                <JBButton title={`네이버 ${selEquipment} 검색`} size="small" onPress={() => this.openLinkUrl(`https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=${selEquipment} 장비`)} />
                <JBButton title={`다음 ${selEquipment} 검색`} size="small" onPress={() => this.openLinkUrl(`https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&q=${selEquipment} 장비`)} />
              </View>
            </View>
            <View style={styles.commWrap}>
              <JBButton title="지역 선택완료" onPress={() => this.completeSelEqui()} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
