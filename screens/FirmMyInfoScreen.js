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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
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
    this.init();
  }

  init = () => {
    this.setMyFirmInfo();
  };

  setMyFirmInfo = () => {
    const accountId = 3;

    api
      .getFirm(accountId)
      .then((firm) => {
        this.setState({ firm });
      })
      .catch((error) => {
        Alert.alert(
          `내 업체정보 요청에 문제가 있습니다, 다시 시도해 주세요\n[${error.name}] ${
            error.message
          }`,
        );
      });
  };

  registerFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmRegister');
  };

  updateFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmUpdate');
  }

  openLinkUrl = (url) => {
    if (url === null || url === '') {
      return;
    }

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  render() {
    const { firm } = this.state;
    if (firm === undefined) {
      return (
        <View>
          <TouchableHighlight onPress={() => this.registerFirm()}>
            <Text>업체 등록</Text>
          </TouchableHighlight>
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
                  color={firm.blog !== null ? 'green' : 'gray'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.openLinkUrl(firm.homepage)}>
                <MaterialCommunityIcons
                  name="home-circle"
                  size={32}
                  color={firm.homepage !== null ? 'green' : 'gray'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.openLinkUrl(firm.sns)}>
                <AntDesign
                  name="facebook-square"
                  size={32}
                  color={firm.sns !== null ? 'green' : 'gray'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.topCommWrap}>
              <TouchableHighlight onPress={() => this.updateFirm()}>
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
      </View>
    );
  }
}
