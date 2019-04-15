import React from 'react';
import {
  SectionList, Modal, StyleSheet, View,
} from 'react-native';
import EquiSelBox from './molecules/EquiSelBox';
import JBButton from './molecules/JBButton';
import colors from '../constants/Colors';
import JBIcon from './molecules/JBIcon';
import JangbeeAdList from './JangbeeAdList';
import EquiSelListHeader from './molecules/EquiSelListHeader';

const SELECTED_EQUIPMENT_SEVERATOR = ',';

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
  equiListWrap: {
    justifyContent: 'space-between',
    marginTop: 10,
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
      equiList: [
        { title: '카고크레인', data: ['5ton', '10ton'] },
        { title: '거미크레인', data: ['2ton', '3ton'] },
        { title: '굴착기(타이어)', data: ['02W', '06W', '08W'] },
        { title: '굴착기(트랙)', data: ['02LC', '04LC', '06LC'] },
        {
          title: '스카이(일반)',
          data: [
            '1ton',
            '1.2ton',
            '2ton',
            '2.5ton',
            '3.5ton(단축)',
            '3.5ton(장축)',
            '5ton(단축)',
            '5ton(장축)',
          ],
        },
        { title: '스카이(굴절)', data: ['28m', '45m'] },
        { title: '스카이(대형)', data: ['58m', '60m', '75m'] },
        {
          title: '지게차',
          data: [
            '2ton',
            '2.5ton',
            '3ton',
            '4.5ton',
            '5ton',
            '6ton',
            '7ton',
            '8ton',
            '11.5ton',
            '15ton',
            '18ton',
            '25ton',
          ],
        },
        { title: '사다리차', data: ['사다리차'] },
        { title: '하이랜더', data: ['하이랜더'] },
        { title: '고소작업렌탈', data: ['고소작업렌탈'] },
        { title: '펌프카', data: ['펌프카'] },
        { title: '도로포장장비', data: ['도로포장장비'] },
        { title: '로우더', data: ['로우더'] },
        { title: '항타천공오가', data: ['항타천공오가'] },
        { title: '불도저', data: ['불도저'] },
        { title: '진동로라/발전기', data: ['진동로라/발전기'] },
        { title: '덤프임대', data: ['덤프임대'] },
      ],
      equiSelMap: (new Map(): Map<string, boolean>),
      equiSelected: '',
    };
  }

  componentDidMount() {
    this.setInitSeledEqui();
  }

  componentWillReceiveProps(nextProps) {
    const { isVisibleEquiModal } = this.props;
    if (isVisibleEquiModal !== nextProps.isVisibleEquiModal) {
      this.setInitSeledEqui();
    }
  }

  /**
   * 초기 선택된장비 설정 함수
   */
  setInitSeledEqui = () => {
    const { selEquipmentStr } = this.props;

    const newEquiSelMap = (new Map(): Map<string, boolean>);

    // Validation
    if (selEquipmentStr !== '') {
      const seledEquiList = selEquipmentStr.split(SELECTED_EQUIPMENT_SEVERATOR);
      seledEquiList.forEach(seledEquipment => newEquiSelMap.set(seledEquipment, true));
    }

    this.setState({ equiSelMap: newEquiSelMap });
  };

  /**
   * 장비선택 이벤트 함수
   *
   * @param {string} eName 장비명
   * @returns null
   */
  onPressEquiItem = (eName) => {
    const { equiSelMap } = this.state;
    const { singleSelectMode } = this.props;

    let newEquiSelMap;

    if (singleSelectMode) {
      newEquiSelMap = new Map();
      this.setState({ equiSelected: eName });
    } else {
      newEquiSelMap = new Map(equiSelMap);
    }

    const isSelected = newEquiSelMap.get(eName);

    if (isSelected === undefined) {
      newEquiSelMap.set(eName, true);
    } else {
      newEquiSelMap.delete(eName);
    }

    this.setState({ equiSelMap: newEquiSelMap });
  };

  renderEuipListHeader = ({ section: { title } }) => <EquiSelListHeader title={title} />;

  /**
   * 장비리스트의 아이템 렌더 함수
   *
   * @param {Object} itemOjb 리스트의 아이템 객체
   */
  renderEquiListItem = ({ item, index, section }) => {
    const { equiSelMap } = this.state;

    const equipmentName = `${section.title}(${item})`;
    return (
      <EquiSelBox
        eSetionName={section.title}
        eName={item}
        onPressItem={this.onPressEquiItem}
        selected={equiSelMap.get(equipmentName) !== undefined}
      />
    );
  };

  completeSelEqui = () => {
    const { closeModal, completeSelEqui } = this.props;
    const { equiSelMap } = this.state;

    let seledEuipListStr = '';
    equiSelMap.forEach((key, selEquipment) => {
      seledEuipListStr += `,${selEquipment}`;
    });

    if (seledEuipListStr.length > 0) {
      seledEuipListStr = seledEuipListStr.substring(1);
    }

    completeSelEqui(seledEuipListStr);
    closeModal();
  };

  cancel = () => {
    const { nextFocus, closeModal } = this.props;

    if (nextFocus) {
      nextFocus();
    }
    closeModal();
  };

  render() {
    const { isVisibleEquiModal, advertisement } = this.props;
    const { equiList, equiSelMap, equiSelected } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleEquiModal}
          onRequestClose={() => {
            console.log('equipmentmodal close');
          }}
        >
          <View style={styles.cardWrap}>
            <View style={styles.card}>
              <JBIcon name="close" size={23} onPress={() => this.cancel()} />
              {advertisement ? <JangbeeAdList admob {...this.props} /> : null}
              <SectionList
                columnWrapperStyle={styles.equiListWrap}
                sections={equiList}
                extraData={equiSelMap}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderEquiListItem}
                renderSectionHeader={this.renderEuipListHeader}
              />
            </View>

            <View style={styles.commWrap}>
              <JBButton
                title="장비선택 완료"
                onPress={() => this.completeSelEqui()}
                size="full"
                Secondary
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
