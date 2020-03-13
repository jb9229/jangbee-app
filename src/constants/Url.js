// const SERVER_URL = 'http://10.1.0.121/api/v1/';
// const SERVER_URL = 'http://192.168.0.4/api/v1/';
const SERVER_URL =
  'http://jangbeecall.ap-northeast-2.elasticbeanstalk.com/api/v1/';
const OPENBANK_URL = 'https://testapi.open-platform.or.kr';

module.exports = {
  IMAGE_STORAGE: `${SERVER_URL}common/image`,
  JBSERVER_ACCOUNT: `${SERVER_URL}account`,
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
  JBSERVER_CLIENT_EVALU_COUNT: `${SERVER_URL}client/evaluation/count`,
  JBSERVER_CLIENT_EVALU_ALL: `${SERVER_URL}client/evaluations`,
  JBSERVER_CLIENT_EVALULIKE: `${SERVER_URL}client/evaluation/like`,
  JBSERVER_CLIENT_EVALULIKE_EXIST: `${SERVER_URL}client/evaluation/like/exist`,
  JBSERVER_CLIENT_EVALU_TELEXIST: `${SERVER_URL}client/evaluation/exist/telnumber`,
  JBSERVER_FIRM_EVALU: `${SERVER_URL}firm/evaluation`,
  JBSERVER_WORK: `${SERVER_URL}work/`,
  JBSERVER_WORK_FIRM_OPEN: `${SERVER_URL}works/firm/open`,
  JBSERVER_WORK_FIRM_MATCHED: `${SERVER_URL}works/firm/matched`,
  JBSERVER_WORK_CLIENT_OPEN: `${SERVER_URL}works/client/open`,
  JBSERVER_WORK_CLIENT_MATCHED: `${SERVER_URL}works/client/matched`,
  JBSERVER_WORK_CLIENT_SELECT: `${SERVER_URL}works/client/select`,
  JBSERVER_WORK_CLIENT_CANCELSEL: `${SERVER_URL}works/client/select/cancel`,
  JBSERVER_WORK_FIRM_APPLY: `${SERVER_URL}works/firm/apply`,
  JBSERVER_WORK_FIRM_ACCEPT: `${SERVER_URL}works/firm/accept`,
  JBSERVER_WORK_FIRM_ABANDON: `${SERVER_URL}works/firm/abandon`,
  JBSERVER_WORK_APPLICANTS: `${SERVER_URL}works/applicants`,
  JBSERVER_PAYMENT_APPROVAL: 'http://192.168.0.7:8080/api/v1/payment/approval',
  JBSERVER_FIRMWORK_FIRM_APPLY: `${SERVER_URL}firm_works/firm/apply`,
  JBSERVER_COUPON: `${SERVER_URL}coupon`,
  JBSERVER_CASHBACK: `${SERVER_URL}cashback`,
  JBSERVER_STAT: `${SERVER_URL}stat`,
  KAKAO_GEO_API: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',
  KAKAO_PAYMENT_API: 'https://kapi.kakao.com/v1/payment/ready',
  KAKAO_PAYMENT_APPROVALURL: 'https://jb9229.github.io/kakao-payment-callback/approval',
  KAKAO_PAYMENT_FAILURL: 'https://jb9229.github.io/kakao-payment-callback/fail',
  KAKAO_PAYMENT_CANCELURL: 'https://jb9229.github.io/kakao-payment-callback/cancel',
  OPENBANK_AUTHORIZE2: `${OPENBANK_URL}/oauth/2.0/authorize2`,
  OPENBANK_REAUTHORIZE2: `${OPENBANK_URL}/oauth/2.0/authorize_account2`,
  OPENBANK_TOKEN: `${OPENBANK_URL}/oauth/2.0/token`,
  OPENBANK_ACCOUNTLIST: `${OPENBANK_URL}/v1.0/account/list`,
  OPENBANK_BALANCE: `${OPENBANK_URL}/v1.0/account/balance`,
  OPENBANK_USERINFO: `${OPENBANK_URL}/v1.0/user/me`,
  OPENBANK_WITHDRAW: `${OPENBANK_URL}/v1.0/transfer/withdraw`,
  OPENBANK_DEPOSIT: `${OPENBANK_URL}/v1.0/transfer/deposit`,
  TERM_SERVICE: 'https://jangbee-inpe21.firebaseapp.com/serviceTerms.html',
  TERM_SECURITY: 'https://jangbee-inpe21.firebaseapp.com/privacy.html'
};

// 수신이 원활하지 않습니다.
// 장비 광고 먼저 등록하는 업체가 선점(서두르세요, 나중에 등록하고 싶어도 못함, 자리 한정)
