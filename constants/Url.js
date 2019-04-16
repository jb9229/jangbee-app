const SERVER_URL = 'http://192.168.1.108/api/v1/';
// const SERVER_URL = 'http://192.168.43.213/api/v1/';
// const SERVER_URL = 'http://jangbee.ap-northeast-2.elasticbeanstalk.com/api/v1/';
const OPENBANK_URL = 'https://testapi.open-platform.or.kr';

module.exports = {
  IMAGE_STORAGE: `${SERVER_URL}common/image`,
  JBSERVER_EQUILIST: `${SERVER_URL}equipment/list`,
  JBSERVER_FIRM: `${SERVER_URL}firm`,
  JBSERVER_FIRMLOCAL: `${SERVER_URL}firm/local`,
  JBSERVER_FIRMNEAR: `${SERVER_URL}firm/near`,
  JBSERVER_AD: `${SERVER_URL}ad`,
  JBSERVER_AD_UPDATE_FINTECHUSENUM: `${SERVER_URL}ad/fintechusenum`,
  JBSERVER_ADBOOKED: `${SERVER_URL}ad/booked`,
  JBSERVER_ADLIST: `${SERVER_URL}ads`,
  JBSERVER_ADTARGET_EQUIPMENT: `${SERVER_URL}ad/target/equipment`,
  JBSERVER_ADTARGET_LOCAL: `${SERVER_URL}ad/target/local`,
  JBSERVER_CLIENT_EVALU: `${SERVER_URL}client/evaluation`,
  JBSERVER_CLIENT_EVALU_ALL: `${SERVER_URL}client/evaluations`,
  JBSERVER_CLIENT_EVALULIKE: `${SERVER_URL}client/evaluation/like`,
  JBSERVER_CLIENT_EVALULIKE_EXIST: `${SERVER_URL}client/evaluation/like/exist`,
  JBSERVER_CLIENT_EVALU_TELEXIST: `${SERVER_URL}client/evaluation/exist/telnumber`,
  JBSERVER_WORK: `${SERVER_URL}work/`,
  JBSERVER_WORK_FIRM_WORKING: `${SERVER_URL}works/firm/working`,
  KAKAO_GEO_API: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',
  OPENBANK_AUTHORIZE2: `${OPENBANK_URL}/oauth/2.0/authorize2`,
  OPENBANK_REAUTHORIZE2: `${OPENBANK_URL}/oauth/2.0/authorize_account2`,
  OPENBANK_TOKEN: `${OPENBANK_URL}/oauth/2.0/token`,
  OPENBANK_ACCOUNTLIST: `${OPENBANK_URL}/v1.0/account/list`,
  OPENBANK_USERINFO: `${OPENBANK_URL}/v1.0/user/me`,
};

// 수신이 원활하지 않습니다.
// 장비 광고 먼저 등록하는 업체가 선점(서두르세요, 나중에 등록하고 싶어도 못함, 자리 한정)
