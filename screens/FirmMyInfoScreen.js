import React from 'react';
import {
  Alert,
  Linking,
  Image,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import firebase from 'firebase';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import * as api from '../api/api';
import FirmTextItem from '../components/FirmTextItem';
import FirmImageItem from '../components/FirmImageItem';
import fonts from '../constants/Fonts';
import CmException from '../common/CmException';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  regFirmWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regFirmNotice: {
    marginBottom: 20,
  },
  regFirmText: {
    fontSize: 24,
    fontFamily: fonts.point2,
  },
  topMenuWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  frimTopItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firmLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCommWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  fnameText: {
    fontSize: 45,
    fontFamily: fonts.titleTop,
  },
});

export default class FirmMyInfoScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      firm: undefined,
    };
  }

  componentDidMount() {
    this.setMyFirmInfo();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.refresh === true) {
      this.setMyFirmInfo();
    }
  }

  setMyFirmInfo = () => {
    const { navigation } = this.props;
    const userid = navigation.getParam('uid', null);

    console.log(userid);
    if (userid === null || userid === undefined) {
      Alert.alert('유효하지 않은 사용자 입니다'); return;
    }

    api
      .getFirm(uid)
      .then((res) => {
        if (res.ok) {
          if (res.status === 204) {
            return undefined;
          }
          return res.json();
        }

        throw new CmException(res.status, `${res.url}`);
      })
      .then((firm) => {
        this.setState({ firm });
      })
      .catch((error) => {
        Alert.alert(
          `업체정보 요청에 문제가 있습니다, 다시 시도해 주세요 -> [${error.name}] ${error.message}`,
        );
      });
  };

  registerFirm = () => {
    const { navigation } = this.props;
    const { user } = navigation.getParam('userInfo');

    navigation.navigate('FirmRegister', { accountId: user.uid });
  };

  updateFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmUpdate');
  };

  openLinkUrl = (url) => {
    if (url === null || url === '') {
      return;
    }

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      Alert.alert('로그아웃에 문제가 있습니다, 재시도해 주세요.');
    }
  };

  render() {
    const { firm } = this.state;
    if (firm === undefined) {
      return (
        <View style={styles.container}>
          <View style={styles.regFirmWrap}>
            <Text style={styles.regFirmNotice}>
              등록된 업체정보가 없습니다, 업체정보를 등록해 주세요.
            </Text>
            <TouchableHighlight onPress={() => this.registerFirm()}>
              <Text style={styles.regFirmText}>업체등록하러 가기</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.onSignOut()}>
              <Text>로그아웃</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleWrap}>
          <Text style={styles.fnameText}>{firm.fname}</Text>
        </View>

        <ScrollView>
          <View style={styles.frimTopItemWrap}>
            <View style={styles.firmLinkWrap}>
              <TouchableOpacity onPress={() => this.openLinkUrl(firm.blog)}>
                <MaterialCommunityIcons
                  name="blogger"
                  size={32}
                  color={firm.blog !== '' ? 'green' : 'gray'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.openLinkUrl(firm.homepage)}>
                <MaterialCommunityIcons
                  name="home-circle"
                  size={32}
                  color={firm.homepage !== '' ? 'green' : 'gray'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.openLinkUrl(firm.sns)}>
                <AntDesign
                  name="facebook-square"
                  size={32}
                  color={firm.sns !== '' ? 'green' : 'gray'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.topCommWrap}>
              <TouchableHighlight onPress={() => this.updateFirm()}>
                <Image style={styles.thumbnail} source={{ uri: firm.thumbnail }} />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.onSignOut()}>
                <Text>로그아웃</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View>
            <FirmTextItem title="보유장비" value={firm.equiListStr} />
            <FirmTextItem title="주소" value={`${firm.address}\n${firm.addressDetail}`} />
            <FirmTextItem title="업체소개" value={firm.introduction} />
            <FirmImageItem title="작업사진1" value={firm.photo1} />
            <FirmImageItem title="작업사진2" value={firm.photo2} />
            <FirmImageItem title="작업사진3" value={firm.photo3} />
          </View>
        </ScrollView>
      </View>
    );
  }
}
