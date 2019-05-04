import React from 'react';
import {
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
import JBErroMessage from './organisms/JBErrorMessage';
import ExpandableItem from './organisms/ExpandableItem';

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
      validationMessage: '',
      listDataSource: ADD_CONTENT,
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
      });
    }
  }

  completeSelLocal = (sido, gugun) => {
    const { completeSelLocal, closeModal } = this.props;

    if (!this.validateSelLocal(sido, gugun)) {
      return;
    }

    completeSelLocal(sido, gugun);
    closeModal();
  };

  /**
   * 지역선택 유효성검사 함수
   */
  validateSelLocal = (sido, gugun) => {
    this.setState({ validationMessage: '' });

    if (sido === '-' || gugun === '-') {
      this.setState({ validationMessage: '검색할 지역을 선택해 주세요' });
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
    this.setState(() => ({
      listDataSource: array,
    }));
  };

  render() {
    const { isVisibleModal, selEquipment, closeModal } = this.props;
    const { listDataSource, validationMessage } = this.state;

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
              <JangbeeAdList admob {...this.props} />
              <JBErroMessage errorMSG={validationMessage} />
              <ScrollView>
                {listDataSource.map((item, key) => (
                  <ExpandableItem
                    key={item.category_name}
                    onClickFunction={() => this.updateLayout(key)}
                    item={item}
                    completeSel={this.completeSelLocal}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const ADD_CONTENT = [
  {
    isExpanded: false,
    category_name: '서울',
    subcategory: [
      { id: 1, val: '강남구' },
      { id: 2, val: '강동구' },
      { id: 3, val: '강북구' },
      { id: 4, val: '강서구' },
      { id: 5, val: '관악구' },
      { id: 6, val: '광진구' },
      { id: 7, val: '구로구' },
      { id: 8, val: '금천구' },
      { id: 9, val: '노원구' },
      { id: 10, val: '도봉구' },
      { id: 11, val: '동대문구' },
      { id: 12, val: '동작구' },
      { id: 13, val: '마포구' },
      { id: 14, val: '서대문구' },
      { id: 15, val: '서초구' },
      { id: 16, val: '성동구' },
      { id: 17, val: '성북구' },
      { id: 18, val: '송파구' },
      { id: 19, val: '양천구' },
      { id: 20, val: '영등포구' },
      { id: 21, val: '용산구' },
      { id: 22, val: '은평구' },
      { id: 23, val: '종로구' },
      { id: 24, val: '중구' },
      { id: 25, val: '중랑구' },
    ],
  },
  {
    isExpanded: false,
    category_name: '부산',
    subcategory: [
      { id: 40, val: '강서구' },
      { id: 41, val: '금정구' },
      { id: 42, val: '기장구' },
      { id: 43, val: '남구' },
      { id: 44, val: '동구' },
      { id: 45, val: '동래구' },
      { id: 46, val: '부산진구' },
      { id: 47, val: '북구' },
      { id: 48, val: '사상구' },
      { id: 49, val: '서구' },
      { id: 50, val: '수영구' },
      { id: 51, val: '연제구' },
      { id: 52, val: '영도구' },
      { id: 53, val: '중구' },
      { id: 54, val: '해운대구' },
    ],
  },
  {
    isExpanded: false,
    category_name: '경기',
    subcategory: [
      { id: 60, val: '가평군' },
      { id: 61, val: '고양시 덕양구' },
      { id: 62, val: '고양시 일산 동구' },
      { id: 63, val: '고양시 일산 서구' },
      { id: 64, val: '과천시' },
      { id: 65, val: '광명시' },
      { id: 66, val: '광주구' },
      { id: 67, val: '구리시' },
      { id: 68, val: '군포시' },
      { id: 69, val: '김포시' },
      { id: 70, val: '남양주시' },
      { id: 71, val: '동두천시' },
      { id: 72, val: '부천시' },
      { id: 73, val: '성남시 분당구' },
      { id: 74, val: '성남시 수정구' },
      { id: 75, val: '성남시 중원구' },
      { id: 76, val: '수원시 권선구' },
      { id: 77, val: '수원시 영통구' },
      { id: 78, val: '수원시 장안구' },
      { id: 79, val: '수원시 팔달구' },
      { id: 80, val: '시흥시' },
      { id: 81, val: '안산시 단원구' },
      { id: 82, val: '안산시 상록구' },
      { id: 83, val: '안성시' },
      { id: 84, val: '안양시 동안구' },
      { id: 85, val: '안양시 만안구' },
      { id: 86, val: '양주시' },
      { id: 87, val: '양평군' },
      { id: 88, val: '여주시' },
      { id: 89, val: '연천군' },
      { id: 90, val: '오산시' },
      { id: 91, val: '용인시 기흥구' },
      { id: 92, val: '용인시 수지구' },
      { id: 93, val: '용인시 처인구' },
      { id: 94, val: '의왕시' },
      { id: 95, val: '의정부시' },
      { id: 96, val: '이천시' },
      { id: 96, val: '파주시' },
      { id: 96, val: '평택시' },
      { id: 96, val: '포천시' },
      { id: 100, val: '하남시' },
      { id: 101, val: '화성시' },
    ],
  },
  {
    isExpanded: false,
    category_name: '인천',
    subcategory: [
      { id: 110, val: '강화군' },
      { id: 111, val: '계양군' },
      { id: 112, val: '남동구' },
      { id: 113, val: '동구' },
      { id: 114, val: '미추홀구' },
      { id: 115, val: '부평구' },
      { id: 116, val: '서구' },
      { id: 117, val: '연수구' },
      { id: 118, val: '옹진군' },
      { id: 119, val: '중구' },
    ],
  },
  {
    isExpanded: false,
    category_name: '강원',
    subcategory: [
      { id: 120, val: '강릉시' },
      { id: 121, val: '고성군' },
      { id: 122, val: '동해시' },
      { id: 123, val: '삼척시' },
      { id: 124, val: '속초시' },
      { id: 125, val: '양구군' },
      { id: 126, val: '양양군' },
      { id: 127, val: '영월군' },
      { id: 128, val: '원주시' },
      { id: 129, val: '인제군' },
      { id: 130, val: '정선군' },
      { id: 131, val: '철원군' },
      { id: 132, val: '춘천시' },
      { id: 133, val: '태백시' },
      { id: 134, val: '평창군' },
      { id: 135, val: '홍천군' },
      { id: 136, val: '화천군' },
      { id: 137, val: '횡성군' },
    ],
  },
  {
    isExpanded: false,
    category_name: '대전',
    subcategory: [
      { id: 140, val: '대덕구' },
      { id: 141, val: '동구' },
      { id: 142, val: '서구' },
      { id: 143, val: '유성구' },
      { id: 144, val: '중구' },
    ],
  },
  {
    isExpanded: false,
    category_name: '세종특별자치시',
    subcategory: [
      { id: 30, val: '가람동' },
      { id: 31, val: '고운동' },
      { id: 32, val: '금남면' },
      { id: 33, val: '나성동' },
      { id: 34, val: '다정동' },
      { id: 34, val: '대평동' },
      { id: 34, val: '도담동' },
      { id: 34, val: '반곡동' },
      { id: 34, val: '보람동' },
      { id: 34, val: '부강면' },
      { id: 300, val: '새롬동' },
      { id: 301, val: '소담동' },
      { id: 302, val: '소정면' },
      { id: 303, val: '아름동' },
      { id: 304, val: '어진동' },
      { id: 305, val: '연기면' },
      { id: 306, val: '연동면' },
      { id: 307, val: '연서면' },
      { id: 308, val: '장군면' },
      { id: 309, val: '전동면' },
      { id: 310, val: '전의면' },
      { id: 311, val: '조치원읍' },
      { id: 312, val: '종촌동' },
      { id: 313, val: '한솔동' },
    ],
  },
  {
    isExpanded: false,
    category_name: '충북',
    subcategory: [
      { id: 150, val: '괴산군' },
      { id: 151, val: '단양군' },
      { id: 152, val: '보은군' },
      { id: 153, val: '영동군' },
      { id: 154, val: '옥천군' },
      { id: 155, val: '음성군' },
      { id: 156, val: '제천군' },
      { id: 157, val: '증평군' },
      { id: 158, val: '진천군' },
      { id: 159, val: '청주시 상당구' },
      { id: 160, val: '청주시 서원구' },
      { id: 161, val: '청주시 청원구' },
      { id: 162, val: '청주시 흥덕구' },
      { id: 163, val: '충주시' },
    ],
  },
  {
    isExpanded: false,
    category_name: '충남',
    subcategory: [
      { id: 170, val: '계룡시' },
      { id: 171, val: '공주시' },
      { id: 172, val: '금산군' },
      { id: 173, val: '논산시' },
      { id: 174, val: '당진시' },
      { id: 175, val: '보령시' },
      { id: 176, val: '부여군' },
      { id: 177, val: '서산시' },
      { id: 178, val: '서천군' },
      { id: 179, val: '아산시' },
      { id: 180, val: '예산군' },
      { id: 181, val: '천안시 동남구' },
      { id: 182, val: '천안시 서북구' },
      { id: 183, val: '청양군' },
      { id: 184, val: '태안군' },
      { id: 185, val: '홍성군' },
    ],
  },
  {
    isExpanded: false,
    category_name: '광주',
    subcategory: [
      { id: 130, val: '광산구' },
      { id: 131, val: '남구' },
      { id: 132, val: '동구' },
      { id: 133, val: '북구' },
      { id: 134, val: '서구' },
    ],
  },
  {
    isExpanded: false,
    category_name: '전북',
    subcategory: [
      { id: 140, val: '고창군' },
      { id: 141, val: '군산시' },
      { id: 142, val: '김제시' },
      { id: 143, val: '남원시' },
      { id: 144, val: '무주군' },
      { id: 145, val: '부안군' },
      { id: 146, val: '순창군' },
      { id: 147, val: '완주군' },
      { id: 148, val: '익산시' },
      { id: 149, val: '임실군' },
      { id: 150, val: '장수군' },
      { id: 151, val: '전주시 덕진구' },
      { id: 152, val: '전주시 완산구' },
      { id: 153, val: '정읍시' },
      { id: 154, val: '진안군' },
    ],
  },
  {
    isExpanded: false,
    category_name: '전남',
    subcategory: [
      { id: 150, val: '강진군' },
      { id: 151, val: '고흥군' },
      { id: 152, val: '곡성군' },
      { id: 153, val: '광양시' },
      { id: 154, val: '구례군' },
      { id: 155, val: '나주시' },
      { id: 156, val: '담양군' },
      { id: 157, val: '목포시' },
      { id: 158, val: '무안군' },
      { id: 159, val: '보성군' },
      { id: 160, val: '순천시' },
      { id: 161, val: '신안군' },
      { id: 162, val: '여수시' },
      { id: 163, val: '영광군' },
      { id: 164, val: '영암군' },
      { id: 165, val: '완도군' },
      { id: 166, val: '장성군' },
      { id: 167, val: '장흥군' },
      { id: 168, val: '진도군' },
      { id: 169, val: '함평군' },
      { id: 170, val: '해남군' },
      { id: 171, val: '화순군' },
    ],
  },
  {
    isExpanded: false,
    category_name: '대구',
    subcategory: [
      { id: 160, val: '남구' },
      { id: 161, val: '달서구' },
      { id: 162, val: '달성군' },
      { id: 163, val: '동구' },
      { id: 164, val: '북구' },
      { id: 165, val: '서구' },
      { id: 166, val: '수성구' },
      { id: 167, val: '중구' },
    ],
  },
  {
    isExpanded: false,
    category_name: '경북',
    subcategory: [
      { id: 170, val: '경산시' },
      { id: 171, val: '경주시' },
      { id: 172, val: '고령군' },
      { id: 173, val: '구미시' },
      { id: 174, val: '군위군' },
      { id: 175, val: '김천시' },
      { id: 176, val: '문경시' },
      { id: 177, val: '봉화군' },
      { id: 178, val: '상주시' },
      { id: 179, val: '성주군' },
      { id: 180, val: '안동시' },
      { id: 181, val: '영덕군' },
      { id: 182, val: '영양군' },
      { id: 183, val: '영주시' },
      { id: 184, val: '영천시' },
      { id: 185, val: '예천군' },
      { id: 186, val: '울릉군' },
      { id: 187, val: '울진군' },
      { id: 188, val: '의성군' },
      { id: 189, val: '청도군' },
      { id: 190, val: '청송군' },
      { id: 191, val: '칠곡군' },
      { id: 192, val: '포항시 남구' },
      { id: 193, val: '포항시 북구' },
    ],
  },
  {
    isExpanded: false,
    category_name: '경남',
    subcategory: [
      { id: 180, val: '거제시' },
      { id: 181, val: '거창군' },
      { id: 181, val: '고성군' },
      { id: 181, val: '김해시' },
      { id: 181, val: '남해군' },
      { id: 181, val: '밀양시' },
      { id: 181, val: '사천시' },
      { id: 181, val: '산청군' },
      { id: 181, val: '양산시' },
      { id: 181, val: '의령군' },
      { id: 190, val: '진주시' },
      { id: 191, val: '창녕군' },
      { id: 192, val: '창원시 마산합포구' },
      { id: 193, val: '창원시 마산회원구' },
      { id: 194, val: '창원시 성산구' },
      { id: 195, val: '창원시 의창구' },
      { id: 196, val: '창원시 진해구' },
      { id: 197, val: '통영시' },
      { id: 198, val: '하동군' },
      { id: 199, val: '함안군' },
      { id: 200, val: '함양군' },
      { id: 200, val: '합천군' },
    ],
  },
  {
    isExpanded: false,
    category_name: '제주특별자치도',
    subcategory: [{ id: 190, val: '서귀포시' }, { id: 191, val: '제주시' }],
  },
];
