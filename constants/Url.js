// const SERVER_URL = 'http://192.168.1.45/api/v1/';
const SERVER_URL = 'http://jangbee.ap-northeast-2.elasticbeanstalk.com/api/v1/';

module.exports = {
  IMAGE_STORAGE: `${SERVER_URL}common/image`,
  JBSERVER_EQUILIST: `${SERVER_URL}equipment/list`,
  JBSERVER_FIRM: `${SERVER_URL}firm`,
  JBSERVER_FIRMLOCAL: `${SERVER_URL}firm/local`,
  JBSERVER_AD: `${SERVER_URL}ad`,
  JBSERVER_FIRMNEAR: `${SERVER_URL}firm/near`,
  KAKAO_GEO_API: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',
};
