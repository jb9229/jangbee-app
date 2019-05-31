import React from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import firebase from 'firebase';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import JBErrorMessage from '../components/organisms/JBErrorMessage';
import { withLogin } from '../contexts/LoginProvider';
import JBButton from '../components/molecules/JBButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  thanksWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  thanksRegiText: {
    fontSize: 15,
    fontFamily: fonts.batang,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: fonts.titleTop,
  },
  accoutTypeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  accountTypeTO: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  accountTypeText: {
    fontSize: 20,
    fontFamily: fonts.batang,
  },
  accountTypeSubText: {
    fontSize: 15,
    fontFamily: fonts.batang,
  },
  selectedAccType: {
    backgroundColor: colors.point,
  },
  commWrap: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  commTH: {
    backgroundColor: colors.pointDark,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
  },
  commText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.button,
    color: 'white',
  },
});

const USER_CLIENT = 1;
const USER_FIRM = 2;
class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userType: undefined,
      errorMessage: null,
    };
  }

  /**
   * Firebase user DB에 사용자 추가정보 저장
   */
  onSignUp = () => {
    const {
      user, completeAuth, setUser, setUserType,
    } = this.props;
    const { userType } = this.state;
    if (userType === undefined) {
      this.setState({ errorMessage: '사용자님의 업무를 선택해 주세요.' });
      return;
    }

    firebase
      .database()
      .ref(`users/${user.uid}`)
      .update(
        {
          userType,
        },
        (error) => {
          if (error) {
            Alert.alert(
              '저장 실패',
              '사용자타입 FB DB에 저장에 문제가 있습니다, 다시 시도해 주세요.',
            );
          }
        },
      )
      .then(() => {
        setUser(user);
        setUserType(userType);

        if (userType === 1) {
          completeAuth(true);
        } else if (userType === 2) {
          completeAuth(false);
        } else {
          Alert.alert(`[${userType}] 유효하지 않은 사용자 입니다`);
          completeAuth(true);
        }
      });
  };

  onChangeUserType = (userType) => {
    this.setState({ userType });
  };

  render() {
    const { userType, errorMessage } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.thanksWrap}>
          <Text style={styles.thanksRegiText}>장비 콜 가입을 축하 합니다,</Text>
          <Text style={styles.thanksRegiText}>...</Text>
          <Text style={styles.thanksRegiText}>
            건설장비 사용에도 서비스개선 및 향상이 필요합니다.
          </Text>
          <Text style={styles.thanksRegiText}>
            일잘하는 장비 쉽게찾기, 수금문제... 장비 콜이 시작합니다.
          </Text>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.titleText}>어떤 서비스를 이용하시겠습니까?</Text>
        </View>
        <View style={styles.accoutTypeWrap}>
          <TouchableOpacity
            style={[styles.accountTypeTO, userType === USER_CLIENT ? styles.selectedAccType : null]}
            onPress={() => this.onChangeUserType(USER_CLIENT)}
          >
            <Text style={[styles.accountTypeText]}>장비 찾기</Text>
            <Text style={[styles.accountTypeSubText]}>(장비사용 고객)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.accountTypeTO, userType === USER_FIRM ? styles.selectedAccType : null]}
            onPress={() => this.onChangeUserType(USER_FIRM)}
          >
            <Text style={[styles.accountTypeText]}>내 장비등록 </Text>
            <Text style={[styles.accountTypeSubText]}>(장비업체)</Text>
          </TouchableOpacity>
        </View>
        <JBErrorMessage errorMSG={errorMessage} />
        <JBButton title="등록하기" onPress={() => this.onSignUp()} align="center" Secondary />
      </View>
    );
  }
}

export default withLogin(SignUpScreen);
