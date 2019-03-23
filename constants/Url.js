const SERVER_URL = 'http://192.168.1.205/api/v1/';
// const SERVER_URL = 'http://192.168.43.213/api/v1/';
// const SERVER_URL = 'http://jangbee.ap-northeast-2.elasticbeanstalk.com/api/v1/';
const OPENBANK_URL = 'https://testapi.open-platform.or.kr';

module.exports = {
  IMAGE_STORAGE: `${SERVER_URL}common/image`,
  JBSERVER_EQUILIST: `${SERVER_URL}equipment/list`,
  JBSERVER_FIRM: `${SERVER_URL}firm`,
  JBSERVER_FIRMLOCAL: `${SERVER_URL}firm/local`,
  JBSERVER_AD: `${SERVER_URL}ad`,
  JBSERVER_ADBOOKED: `${SERVER_URL}ad/booked`,
  JBSERVER_ADLIST: `${SERVER_URL}ads`,
  JBSERVER_ADTARGET_EQUIPMENT: `${SERVER_URL}ad/target/equipment`,
  JBSERVER_ADTARGET_LOCAL: `${SERVER_URL}ad/target/local`,
  JBSERVER_FIRMNEAR: `${SERVER_URL}firm/near`,
  KAKAO_GEO_API: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',
  OPENBANK_AUTHORIZE2: `${OPENBANK_URL}/oauth/2.0/authorize2`,
  OPENBANK_REAUTHORIZE2: `${OPENBANK_URL}/oauth/2.0/authorize_account2`,
  OPENBANK_TOKEN: `${OPENBANK_URL}/oauth/2.0/token`,
  OPENBANK_ACCOUNTLIST: `${OPENBANK_URL}/v1.0/account/list`,
  OPENBANK_USERINFO: `${OPENBANK_URL}/v1.0/user/me`,
};
