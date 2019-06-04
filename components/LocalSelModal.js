import React from 'react';
import {
  Alert,
  LayoutAnimation,
  ScrollView,
  Modal,
  StyleSheet,
  View,
  UIManager,
  Platform,
} from 'react-native';
import colors from '../constants/Colors';
import JBIcon from './molecules/JBIcon';
import JangbeeAdList from './JangbeeAdList';
import ExpandableItem from './organisms/ExpandableItem';
import JBButton from './molecules/JBButton';

const SIGUNGU_MAX_COUNT = 5;
const SIDO_MAX_COUNT = 3;

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
  topHeading: {
    paddingLeft: 10,
    fontSize: 20,
  },
});

export default class EquipementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listDataSource: ADD_CONTENT,
      selSidoArr: [],
      selSigunguArr: [],
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isVisibleModal } = nextProps;
    const { listDataSource } = this.state;

    if (isVisibleModal) {
      listDataSource.forEach((data) => {
        const localData = data;
        localData.isExpanded = false;
        localData.isChecked = false;
        data.subcategory.forEach((subData) => {
          const sigungu = subData;
          sigungu.isChecked = false;
        });
      });

      this.setState({ selSidoArr: [], selSigunguArr: [] });
    }
  }

  completeSelLocal = (item, gugun) => {
    const { completeSelLocal, closeModal } = this.props;

    completeSelLocal(item.category_name, gugun);
    closeModal();
  };

  /**
   * 지역선택 유효성검사 함수
   */
  validateSelLocal = (item) => {
    if (item.isChecked) {
      Alert.alert('시군구를 선택할 수 없습니다', '시도 전체선택을 해제 후, 시군구을 선택해 주세요.');
      return false;
    }

    return true;
  };

  cancel = () => {
    const { nextFocus, closeModal } = this.props;

    nextFocus();
    closeModal();
  };

  updateLayout = (index) => {
    const { listDataSource } = this.state;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    array[index].isExpanded = !array[index].isExpanded;
    array[index].willUpdate = true;

    this.setState(() => ({
      listDataSource: array,
    }));
  };

  updateCheck = (index) => {
    const { multiSelect } = this.props;
    const { listDataSource, selSidoArr } = this.state;

    if (!multiSelect) {
      this.completeSelLocal(listDataSource[index], undefined);
    }

    const array = [...listDataSource];
    const isChecked = !array[index].isChecked;

    if (isChecked && selSidoArr.length === SIDO_MAX_COUNT) {
      Alert.alert('시도를 선택할 수 없습니다', `최대 ${SIDO_MAX_COUNT}까지 선택 가능합니다.`);
      return;
    }

    array[index].isChecked = isChecked;
    array[index].willUpdate = true;

    const catName = array[index].category_name;
    let newSidoArr;
    if (isChecked) {
      newSidoArr = [...selSidoArr];
      newSidoArr.push(catName);
    } else {
      newSidoArr = selSidoArr.filter(returnableObjects => returnableObjects !== catName);
    }

    this.setState(() => ({
      listDataSource: array,
      selSidoArr: newSidoArr,
    }));
  };

  updateItemCheck = (catIndex, itemIndex) => {
    const { listDataSource, selSigunguArr } = this.state;

    const nextCheck = !listDataSource[catIndex].subcategory[itemIndex].isChecked;
    if (nextCheck && selSigunguArr.length === SIGUNGU_MAX_COUNT) {
      Alert.alert('시군구를 선택할 수 없습니다', `최대 ${SIGUNGU_MAX_COUNT}까지 선택 가능합니다.`);
      return;
    }

    const array = [...listDataSource];
    array[catIndex].subcategory[itemIndex].isChecked = nextCheck;
    array[catIndex].willUpdate = true;

    const sigunguName = `${array[catIndex].category_name} ${array[catIndex].subcategory[itemIndex].val}`;
    let newSigunguArr;
    if (nextCheck) {
      newSigunguArr = [...selSigunguArr];
      newSigunguArr.push(sigunguName);
    } else {
      newSigunguArr = selSigunguArr.filter((returnableObjects) => {
        return returnableObjects !== sigunguName;
      });
    }

    this.setState(() => ({
      listDataSource: array,
      selSigunguArr: newSigunguArr,
    }));
  };

  selectSubCate = (group, catIndex, itemIndex) => {
    const { multiSelect } = this.props;

    if (!this.validateSelLocal(group)) {
      return;
    }

    if (multiSelect) {
      this.updateItemCheck(catIndex, itemIndex);
    } else {
      this.completeSelLocal(group, group.subcategory[itemIndex].val);
    }
  };

  multiSelComplete = () => {
    const { selSidoArr, selSigunguArr } = this.state;
    const { multiSelComplte, closeModal } = this.props;

    if (selSidoArr.length === 0 && selSigunguArr === 0) {
      closeModal();
      return;
    }

    let sidoArrStr = '';
    let sigunguArrStr = '';
    selSidoArr.forEach((sido) => { sidoArrStr += `${sido},` });
    selSigunguArr.forEach((sigungu) => { sigunguArrStr += `${sigungu},` });

    multiSelComplte(sidoArrStr, sigunguArrStr);
    closeModal();
  }

  render() {
    const { isVisibleModal, closeModal, actionName } = this.props;
    const { listDataSource } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <View style={styles.cardWrap}>
            <View style={styles.card}>
              <JBIcon name="close" size={23} onPress={() => this.cancel()} />
              {!actionName && (<JangbeeAdList admob {...this.props} />)}
              <ScrollView>
                {listDataSource.map((group, key) => (
                  <ExpandableItem
                    key={group.category_name}
                    onClickFunction={() => this.updateLayout(key)}
                    onCatCheck={() => this.updateCheck(key)}
                    item={group}
                    completeSel={this.completeSelLocal}
                    selectSubCate={itemIndex => this.selectSubCate(group, key, itemIndex)}
                    isCatSelectable
                  />
                ))}
              </ScrollView>
            </View>
            {actionName && (<JBButton title={actionName} onPress={this.multiSelComplete} size="full" Secondary />)}
          </View>
        </Modal>
      </View>
    );
  }
}

const ADD_CONTENT = [
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '서울',
    subcategory: [
      { isChecked: false, val: '강남구' },
      { isChecked: false, val: '강동구' },
      { isChecked: false, val: '강북구' },
      { isChecked: false, val: '강서구' },
      { isChecked: false, val: '관악구' },
      { isChecked: false, val: '광진구' },
      { isChecked: false, val: '구로구' },
      { isChecked: false, val: '금천구' },
      { isChecked: false, val: '노원구' },
      { isChecked: false, val: '도봉구' },
      { isChecked: false, val: '동대문구' },
      { isChecked: false, val: '동작구' },
      { isChecked: false, val: '마포구' },
      { isChecked: false, val: '서대문구' },
      { isChecked: false, val: '서초구' },
      { isChecked: false, val: '성동구' },
      { isChecked: false, val: '성북구' },
      { isChecked: false, val: '송파구' },
      { isChecked: false, val: '양천구' },
      { isChecked: false, val: '영등포구' },
      { isChecked: false, val: '용산구' },
      { isChecked: false, val: '은평구' },
      { isChecked: false, val: '종로구' },
      { isChecked: false, val: '중구' },
      { isChecked: false, val: '중랑구' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '부산',
    subcategory: [
      { isChecked: false, val: '강서구' },
      { isChecked: false, val: '금정구' },
      { isChecked: false, val: '기장구' },
      { isChecked: false, val: '남구' },
      { isChecked: false, val: '동구' },
      { isChecked: false, val: '동래구' },
      { isChecked: false, val: '부산진구' },
      { isChecked: false, val: '북구' },
      { isChecked: false, val: '사상구' },
      { isChecked: false, val: '서구' },
      { isChecked: false, val: '수영구' },
      { isChecked: false, val: '연제구' },
      { isChecked: false, val: '영도구' },
      { isChecked: false, val: '중구' },
      { isChecked: false, val: '해운대구' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '인천',
    subcategory: [
      { isChecked: false, val: '강화군' },
      { isChecked: false, val: '계양군' },
      { isChecked: false, val: '남동구' },
      { isChecked: false, val: '동구' },
      { isChecked: false, val: '미추홀구' },
      { isChecked: false, val: '부평구' },
      { isChecked: false, val: '서구' },
      { isChecked: false, val: '연수구' },
      { isChecked: false, val: '옹진군' },
      { isChecked: false, val: '중구' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '강원',
    subcategory: [
      { isChecked: false, val: '강릉시' },
      { isChecked: false, val: '고성군' },
      { isChecked: false, val: '동해시' },
      { isChecked: false, val: '삼척시' },
      { isChecked: false, val: '속초시' },
      { isChecked: false, val: '양구군' },
      { isChecked: false, val: '양양군' },
      { isChecked: false, val: '영월군' },
      { isChecked: false, val: '원주시' },
      { isChecked: false, val: '인제군' },
      { isChecked: false, val: '정선군' },
      { isChecked: false, val: '철원군' },
      { isChecked: false, val: '춘천시' },
      { isChecked: false, val: '태백시' },
      { isChecked: false, val: '평창군' },
      { isChecked: false, val: '홍천군' },
      { isChecked: false, val: '화천군' },
      { isChecked: false, val: '횡성군' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '대전',
    subcategory: [
      { isChecked: false, val: '대덕구' },
      { isChecked: false, val: '동구' },
      { isChecked: false, val: '서구' },
      { isChecked: false, val: '유성구' },
      { isChecked: false, val: '중구' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '세종특별자치시',
    subcategory: [
      { isChecked: false, val: '가람동' },
      { isChecked: false, val: '고운동' },
      { isChecked: false, val: '금남면' },
      { isChecked: false, val: '나성동' },
      { isChecked: false, val: '다정동' },
      { isChecked: false, val: '대평동' },
      { isChecked: false, val: '도담동' },
      { isChecked: false, val: '반곡동' },
      { isChecked: false, val: '보람동' },
      { isChecked: false, val: '부강면' },
      { isChecked: false, val: '새롬동' },
      { isChecked: false, val: '소담동' },
      { isChecked: false, val: '소정면' },
      { isChecked: false, val: '아름동' },
      { isChecked: false, val: '어진동' },
      { isChecked: false, val: '연기면' },
      { isChecked: false, val: '연동면' },
      { isChecked: false, val: '연서면' },
      { isChecked: false, val: '장군면' },
      { isChecked: false, val: '전동면' },
      { isChecked: false, val: '전의면' },
      { isChecked: false, val: '조치원읍' },
      { isChecked: false, val: '종촌동' },
      { isChecked: false, val: '한솔동' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '충북',
    subcategory: [
      { isChecked: false, val: '괴산군' },
      { isChecked: false, val: '단양군' },
      { isChecked: false, val: '보은군' },
      { isChecked: false, val: '영동군' },
      { isChecked: false, val: '옥천군' },
      { isChecked: false, val: '음성군' },
      { isChecked: false, val: '제천군' },
      { isChecked: false, val: '증평군' },
      { isChecked: false, val: '진천군' },
      { isChecked: false, val: '청주시' },
      { isChecked: false, val: '충주시' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '충남',
    subcategory: [
      { isChecked: false, val: '계룡시' },
      { isChecked: false, val: '공주시' },
      { isChecked: false, val: '금산군' },
      { isChecked: false, val: '논산시' },
      { isChecked: false, val: '당진시' },
      { isChecked: false, val: '보령시' },
      { isChecked: false, val: '부여군' },
      { isChecked: false, val: '서산시' },
      { isChecked: false, val: '서천군' },
      { isChecked: false, val: '아산시' },
      { isChecked: false, val: '예산군' },
      { isChecked: false, val: '천안시' },
      { isChecked: false, val: '청양군' },
      { isChecked: false, val: '태안군' },
      { isChecked: false, val: '홍성군' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '광주',
    subcategory: [
      { isChecked: false, val: '광산구' },
      { isChecked: false, val: '남구' },
      { isChecked: false, val: '동구' },
      { isChecked: false, val: '북구' },
      { isChecked: false, val: '서구' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '전북',
    subcategory: [
      { isChecked: false, val: '고창군' },
      { isChecked: false, val: '군산시' },
      { isChecked: false, val: '김제시' },
      { isChecked: false, val: '남원시' },
      { isChecked: false, val: '무주군' },
      { isChecked: false, val: '부안군' },
      { isChecked: false, val: '순창군' },
      { isChecked: false, val: '완주군' },
      { isChecked: false, val: '익산시' },
      { isChecked: false, val: '임실군' },
      { isChecked: false, val: '장수군' },
      { isChecked: false, val: '전주시' },
      { isChecked: false, val: '정읍시' },
      { isChecked: false, val: '진안군' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '전남',
    subcategory: [
      { isChecked: false, val: '강진군' },
      { isChecked: false, val: '고흥군' },
      { isChecked: false, val: '곡성군' },
      { isChecked: false, val: '광양시' },
      { isChecked: false, val: '구례군' },
      { isChecked: false, val: '나주시' },
      { isChecked: false, val: '담양군' },
      { isChecked: false, val: '목포시' },
      { isChecked: false, val: '무안군' },
      { isChecked: false, val: '보성군' },
      { isChecked: false, val: '순천시' },
      { isChecked: false, val: '신안군' },
      { isChecked: false, val: '여수시' },
      { isChecked: false, val: '영광군' },
      { isChecked: false, val: '영암군' },
      { isChecked: false, val: '완도군' },
      { isChecked: false, val: '장성군' },
      { isChecked: false, val: '장흥군' },
      { isChecked: false, val: '진도군' },
      { isChecked: false, val: '함평군' },
      { isChecked: false, val: '해남군' },
      { isChecked: false, val: '화순군' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '대구',
    subcategory: [
      { isChecked: false, val: '남구' },
      { isChecked: false, val: '달서구' },
      { isChecked: false, val: '달성군' },
      { isChecked: false, val: '동구' },
      { isChecked: false, val: '북구' },
      { isChecked: false, val: '서구' },
      { isChecked: false, val: '수성구' },
      { isChecked: false, val: '중구' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '경북',
    subcategory: [
      { isChecked: false, val: '경산시' },
      { isChecked: false, val: '경주시' },
      { isChecked: false, val: '고령군' },
      { isChecked: false, val: '구미시' },
      { isChecked: false, val: '군위군' },
      { isChecked: false, val: '김천시' },
      { isChecked: false, val: '문경시' },
      { isChecked: false, val: '봉화군' },
      { isChecked: false, val: '상주시' },
      { isChecked: false, val: '성주군' },
      { isChecked: false, val: '안동시' },
      { isChecked: false, val: '영덕군' },
      { isChecked: false, val: '영양군' },
      { isChecked: false, val: '영주시' },
      { isChecked: false, val: '영천시' },
      { isChecked: false, val: '예천군' },
      { isChecked: false, val: '울릉군' },
      { isChecked: false, val: '울진군' },
      { isChecked: false, val: '의성군' },
      { isChecked: false, val: '청도군' },
      { isChecked: false, val: '청송군' },
      { isChecked: false, val: '칠곡군' },
      { isChecked: false, val: '포항시' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '경남',
    subcategory: [
      { isChecked: false, val: '거제시' },
      { isChecked: false, val: '거창군' },
      { isChecked: false, val: '고성군' },
      { isChecked: false, val: '김해시' },
      { isChecked: false, val: '남해군' },
      { isChecked: false, val: '밀양시' },
      { isChecked: false, val: '사천시' },
      { isChecked: false, val: '산청군' },
      { isChecked: false, val: '양산시' },
      { isChecked: false, val: '의령군' },
      { isChecked: false, val: '진주시' },
      { isChecked: false, val: '창녕군' },
      { isChecked: false, val: '창원시' },
      { isChecked: false, val: '통영시' },
      { isChecked: false, val: '하동군' },
      { isChecked: false, val: '함안군' },
      { isChecked: false, val: '함양군' },
      { isChecked: false, val: '합천군' },
    ],
  },
  {
    isExpanded: false,
    willUpdate: false,
    isChecked: false,
    category_name: '제주특별자치도',
    subcategory: [{ isChecked: false, val: '서귀포시' }, { isChecked: false, val: '제주시' }],
  },
];
