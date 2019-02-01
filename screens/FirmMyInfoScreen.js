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
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import * as api from '../api/api';
import FirmTextItem from '../components/FirmTextItem';
import FirmImageItem from '../components/FirmImageItem';
import fonts from '../constants/Fonts';
import CmException from '../common/CmException';
import { withLogin } from '../contexts/LoginProvider';
import FirmProfileModal from '../components/FirmProfileModal';

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
    textDecorationLine: 'underline',
  },
  frimTopItemWrap: {
    padding: 5,
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

class FirmMyInfoScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      firm: undefined,
      isVisibleProfileModal: false,
    };
  }

  componentDidMount() {
    this.setMyFirmInfo();
    this.props.navigationOptions = {header: null,}
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.navigation.state;

    if (params !== undefined && params.refresh !== undefined) {
      this.setMyFirmInfo();
    }
  }

  setMyFirmInfo = () => {
    const { user } = this.props;

    if (user.uid === null || user.uid === undefined) {
      Alert.alert('유효하지 않은 사용자 입니다');
      return;
    }

    api
      .getFirm(user.uid)
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

  /**
   * 프로파일 팝업창 열기 플래그 함수
   */
  setVisibleProfileModal = (visible) => {
    this.setState( {isVisibleProfileModal: visible} );
  }

  registerFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmRegister');
  };

  openLinkUrl = (url) => {
    if (url === null || url === '') {
      return;
    }

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  render() {
    const { firm, isVisibleProfileModal } = this.state;
    if (firm === undefined) {
      return (
        <View style={styles.container}>
          <View style={styles.regFirmWrap}>
            <Text style={styles.regFirmNotice}>
              등록된 업체정보가 없습니다, 업체정보를 등록해 주세요.
            </Text>
            <TouchableHighlight onPress={() => this.registerFirm()}>
              <Text style={styles.regFirmText}>업체정보 등록하러 가기</Text>
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
              <TouchableHighlight onPress={() => this.setVisibleProfileModal(true)}>
                <Image style={styles.thumbnail} source={{ uri: firm.thumbnail }} />
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
        <FirmProfileModal isVisibleModal={isVisibleProfileModal} setVisibleModal={this.setVisibleProfileModal} firm={firm} {...this.props} />
      </View>
    );
  }
}

export default withLogin(FirmMyInfoScreen);
