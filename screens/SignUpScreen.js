import React from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View,
} from 'react-native';
import firebase from 'firebase';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import FirmCreaErrMSG from '../components/FirmCreaErrMSG';
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
  },
  accountTypeText: {
    fontSize: 20,
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
  onSignUp = async () => {
    const { userType } = this.state;
    if (userType === undefined) {
      this.setState({ errorMessage: '사용자님의 업무를 선택해 주세요.' });
      return;
    }
    const { user } = this.props;

    await firebase
      .database()
      .ref(`users/${user.uid}`)
      .set({
        userType,
      });

    this.completeSignUp(user.uid);
  };

  completeSignUp = (uid) => {
    const { navigation, setUserType } = this.props;

    firebase
      .database()
      .ref(`users/${uid}/userType`)
      .once('value', (data) => {
        if (data.val() === null) {
          navigation.navigate('SignUp');
          return;
        }

        const userType = data.val();

        setUserType(userType);
        if (userType === 1) {
          navigation.navigate('ClientMain');
        } else if (userType === 2) {
          navigation.navigate('FirmMain');
        } else {
          Alert.alert('유효하지 않은 사용자 입니다.');
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
          <Text style={styles.thanksRegiText}>장비콜 가입을 축하 합니다,</Text>
          <Text style={styles.thanksRegiText}>모두가 윈윈하는 커뮤니티장을 만들어 갑니다.</Text>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.titleText}>어떤 업무를 보고 계십니까?</Text>
        </View>
        <View style={styles.accoutTypeWrap}>
          <TouchableOpacity
            style={[styles.accountTypeTO, userType === USER_CLIENT ? styles.selectedAccType : null]}
            onPress={() => this.onChangeUserType(USER_CLIENT)}
          >
            <Text style={[styles.accountTypeText]}>장비고객</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.accountTypeTO, userType === USER_FIRM ? styles.selectedAccType : null]}
            onPress={() => this.onChangeUserType(USER_FIRM)}
          >
            <Text style={[styles.accountTypeText]}>장비업체 </Text>
          </TouchableOpacity>
        </View>
        <FirmCreaErrMSG errorMSG={errorMessage} />
        <JBButton title="저장" onPress={() => this.onSignUp()} />
      </View>
    );
  }
}

export default withLogin(SignUpScreen);
