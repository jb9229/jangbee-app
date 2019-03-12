import React from 'react';
import {
  Alert, FlatList, StyleSheet, Text, View,
} from 'react-native';
import styled from 'styled-components/native';
import JBButton from '../components/molecules/JBButton';
import ImagePickInput from '../components/molecules/ImagePickInput';
import JBErrorMessage from '../components/organisms/JBErrorMessage';
import * as api from '../api/api';
import { getOpenBankAuthInfo } from '../auth/OBAuthTokenManager';
import ListSeparator from '../components/molecules/ListSeparator';
import colors from '../constants/Colors';

const TouchableHighlight = styled.TouchableHighlight`
  ${props => props.selected
    && `
    background-color: ${colors.point};
  `};
`;
const styles = StyleSheet.create({
  bookedAdTypeText: {
    textDecorationLine: 'line-through',
  },
  AdTypeText: {},
  accListItemTH: {},
  accListItemWrap: {
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
  },
  accItemSelTH: {
    backgroundColor: colors.point,
    color: 'white',
  },
});
export default class AdCreateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccEmpty: undefined,
      accList: [],
      bookedAdTypeList: [1, 2],
      payErrMessage: '',
      accListSelcted: [],
    };
  }

  componentDidMount() {
    this.setOpenBankAccountList();
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.navigation.state;

    if (params !== undefined && params.action === 'RELOAD') {
      this.setOpenBankAccountList();
    }
  }

  /**
   * 결제계좌 추가 함수
   */
  addOBAccount = () => {
    const { navigation } = this.props;

    navigation.navigate('OpenBankAuth', { type: 'ADD_ACCOUNT' });
  };

  adPayment = async () => {
    const { accListSelcted } = this.state;
    const openBankAuthInfo = await getOpenBankAuthInfo();

    api
      .transferWithdraw(openBankAuthInfo, accListSelcted[0], 200)
      .then(res => console.log(res))
      .catch((error) => {
        Alert.alert(
          '네트워크 문제발생, 다시 시도해 주세요.',
          `결제요청 실패 -> [${error.name}] ${error.message}`,
        );
      });
  };

  /**
   * 광고 결재할 계좌리스트 설정함수
   */
  setOpenBankAccountList = async () => {
    const openBankAuthInfo = await getOpenBankAuthInfo();

    if (openBankAuthInfo === undefined) {
      this.setState({ isAccEmpty: true });

      return;
    }

    api
      .getOBAccList(openBankAuthInfo, openBankAuthInfo.user_seq_no, 'N', 'A')
      .then((userInfo) => {
        if (userInfo.res_cnt !== '0') {
          this.setState({ accList: userInfo.res_list, isAccEmpty: false });
          return;
        }

        this.setState({ isAccEmpty: true });
      })
      .catch((error) => {
        Alert.alert(
          '네트워크 문제가 있습니다, 다시 시도해 주세요.',
          `계좌리스트 조회 실패 -> [${error.name}] ${error.message}`,
        );

        this.setState({ isAccEmpty: true });
      });
  };

  renderAdTypeList = (type, typeDescription) => {
    const { bookedAdTypeList } = this.state;
    if (bookedAdTypeList.includes(type)) {
      return <Text style={styles.bookedAdTypeText}>{typeDescription}</Text>;
    }

    return <Text style={styles.AdTypeText}>{typeDescription}</Text>;
  };

  onAccListItemPress = (idStr) => {
    const newAccListSelcted = [];

    newAccListSelcted.push(idStr); // toggle
    this.setState({ accListSelcted: newAccListSelcted });
  };

  /**
   * 오픈뱅크 계좌UI 렌더링 함수
   */
  renderAccListItem = ({ item }) => {
    const { accListSelcted } = this.state;

    return (
      <View>
        <TouchableHighlight
          onPress={() => this.onAccListItemPress(item.fintech_use_num)}
          selected={accListSelcted.includes(item.fintech_use_num)}
        >
          <View style={[styles.accListItemWrap]}>
            <Text>{item.account_alias}</Text>
            <Text>{item.bank_name}</Text>
            <Text>{item.account_holder_name}</Text>
            <Text>{item.fintech_use_num}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    const {
      isAccEmpty,
      accList,
      accListSelcted,
      adTitle,
      adSubTitle,
      adPhoto,
      payErrMessage,
    } = this.state;
    return (
      <View>
        <Text># 홍보방법 선택</Text>
        <View>
          {/* <Picker
          selectedValue={this.state.language}
          style={{height: 50, width: 100}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({language: itemValue})
          }>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker> */}
          {this.renderAdTypeList([0, 1], 'Main1(7만원, t:1)')}
          {this.renderAdTypeList([0, 2], 'Main2(6만원, t:1)')}
          {this.renderAdTypeList([0, 3], 'Main3(5만원, t:1)')}
          <Text style={styles.AdTypeText}>장비선택팝업창1(3만원)</Text>
          <Text style={styles.AdTypeText}>지역선택팝업창1(2만원)</Text>
        </View>
        <Text># 홍보정보 입력(광고 만들기)</Text>
        <View>
          <JBButton
            title="광고 타이틀"
            value={adTitle}
            onChangeText={text => this.setState({ adTitle: text })}
            placeholder="광고상단 문구를 입력하세요(최대 10자)"
          />
          <JBButton
            title="광고 슬로건"
            value={adTitle}
            onChangeText={text => this.setState({ adTitle: text })}
            placeholder="광고하단 문구를 입력하세요(최대 20자)"
          />
          <JBButton
            title="광고 슬로건"
            value={adSubTitle}
            onChangeText={text => this.setState({ adTitle: text })}
            placeholder="광고하단 문구를 입력하세요(최대 20자)"
          />
          <ImagePickInput
            itemTitle="광고배경 사진"
            imgUrl={adPhoto}
            aspect={[4, 3]}
            setImageUrl={url => this.setState({ adPhoto: url })}
          />
          <Text>홍보 장비 선택</Text>
          <Text>홍보 지역 선택</Text>
        </View>
        <View>
          <Text># 결제할 계좌를 선택해 주세요</Text>
          {isAccEmpty !== undefined && !isAccEmpty ? (
            <FlatList
              data={accList}
              extraData={accListSelcted}
              renderItem={this.renderAccListItem}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ListSeparator}
            />
          ) : (
            <View>
              <Text>등록된 광고가 없습니다, 장비 홍보를해 주세요.</Text>
            </View>
          )}
          <JBButton title="계좌등록/재인증" onPress={this.addOBAccount} size="small" />
        </View>
        <JBErrorMessage errorMSG={payErrMessage} />
        {isAccEmpty !== undefined && !isAccEmpty ? (
          <JBButton title="결제하기" onPress={this.adPayment} size="full" />
        ) : (
          <View>
            <Text>먼저, 자동이체 계좌등록또는 재인증해 주세요.</Text>
          </View>
        )}
      </View>
    );
  }
}
