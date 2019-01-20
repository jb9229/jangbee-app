import React from 'react';
import renderer from 'react-test-renderer';
import FirmRegisterScreen from '..';

function setDefaultState(component) {
  component.setState({
    isVisibleEquiModal: false,
    isVisibleMapAddModal: false,
    fname: '세종누리카고 크레인',
    // phoneNumber: '010-7654-7404',
    // password: 'chabum!21',
    // comfirmPassword: 'chabum!21',
    equiListStr: '카고크레인,트럭',
    address: '세종시 중구 영종도',
    addressDetail: '우창빌라203호',
    sidoAddr: '세종시',
    sigunguAddr: '중구 영종도',
    addrLongitude: '37.56',
    addrLatitude: '38.91',
    fIntroduction: '안녕하세요 중부권 최고의 장비기사 나채범입니다.',
    thumbnail:
      'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-499435767786/asset/img/jangbee_photo_%2B1547852979838.jpg',
    photo1:
      'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-499435767786/asset/img/jangbee_photo_%2B1547852979838.jpg',
    photo2: '',
    photo3: '',
    blog: '',
    homepage: '',
    sns: '',
    fnameValErrMessage: '',
    phoneNumberValErrMessage: '',
    passwordValErrMessage: '',
    comfirmPasswordValErrMessage: '',
    equiListStrValErrMessage: '',
    addressValErrMessage: '',
    thumbnailValErrMessage: '',
    photo1ValErrMessage: '',
  });
}

describe('업체등록 유효성검사 함수 테스트', () => {
  it('isValidateSubmit()', async () => {
    const firmRegiScreen = renderer.create(<FirmRegisterScreen />).getInstance();

    setDefaultState(firmRegiScreen);

    // Case2: fname is empty
    firmRegiScreen.setState({ fname: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.fnameValErrMessage).toEqual('필수 항목 입니다, 빈칸을 채워 주세요');

    // Case2: fname is exceed character
    firmRegiScreen.setState({ fname: '12345678910123456' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.fnameValErrMessage).toEqual('최대문자: 15');

    firmRegiScreen.setState({ fname: '세종누리카고 크레인' });

    // // Case2: cellPhone is empty
    // firmRegiScreen.setState({ phoneNumber: '' });
    // valResult = firmRegiScreen.isValidateSubmit();
    // expect(valResult).toEqual(false);
    // expect(firmRegiScreen.state.phoneNumberValErrMessage).toEqual(
    //   '필수 항목 입니다, 빈칸을 채워 주세요',
    // );

    // // Case: cellPhone is unmatch format1
    // firmRegiScreen.setState({ phoneNumber: '0102387647404' });
    // valResult = firmRegiScreen.isValidateSubmit();
    // expect(valResult).toEqual(false);
    // expect(firmRegiScreen.state.phoneNumberValErrMessage).toEqual('전화번호 형식이 아닙니다');

    // firmRegiScreen.setState({ phoneNumber: '010-7654-7404' });
    // valResult = firmRegiScreen.isValidateSubmit();
    // expect(firmRegiScreen.state.phoneNumberValErrMessage).toEqual('');

    // // Case: cellPhone is unmatch format1
    // firmRegiScreen.setState({ phoneNumber: '010-2나8-6474' });
    // valResult = firmRegiScreen.isValidateSubmit();
    // expect(valResult).toEqual(false);
    // expect(firmRegiScreen.state.phoneNumberValErrMessage).toEqual('전화번호 형식이 아닙니다');

    // firmRegiScreen.setState({ phoneNumber: '010-7654-7404' });

    // // Case: passwoard is empty
    // firmRegiScreen.setState({ password: '' });
    // valResult = firmRegiScreen.isValidateSubmit();
    // expect(valResult).toEqual(false);
    // expect(firmRegiScreen.state.passwordValErrMessage).toEqual(
    //   '필수 항목 입니다, 빈칸을 채워 주세요',
    // );

    // // Case: passwoard is min
    // firmRegiScreen.setState({ password: '12345' });
    // valResult = firmRegiScreen.isValidateSubmit();
    // expect(valResult).toEqual(false);
    // expect(firmRegiScreen.state.passwordValErrMessage).toEqual('최소문자: 6');

    // firmRegiScreen.setState({ password: '123456' });

    // // Case: comfirmPassword is unmatch
    // firmRegiScreen.setState({ comfirmPassword: '654321' });
    // valResult = firmRegiScreen.isValidateSubmit();
    // expect(valResult).toEqual(false);
    // expect(firmRegiScreen.state.comfirmPasswordValErrMessage).toEqual(
    //   '비밀번호가 일치하지 않습니다',
    // );

    // firmRegiScreen.setState({ comfirmPassword: '123456' });

    // Case: equiListStr is empty
    firmRegiScreen.setState({ equiListStr: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.equiListStrValErrMessage).toEqual(
      '필수 항목 입니다, 빈칸을 채워 주세요',
    );
    firmRegiScreen.setState({ equiListStr: '크레인,트럭' });

    // Case: address is empty
    firmRegiScreen.setState({ address: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.addressValErrMessage).toEqual(
      '필수 항목 입니다, 빈칸을 채워 주세요',
    );
    firmRegiScreen.setState({ address: '세종시 중구 영종도' });

    // Case: addressDetail is empty
    firmRegiScreen.setState({
      addressDetail: '12345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.addressValErrMessage).toEqual('[상세주소] 최대문자: 45');
    firmRegiScreen.setState({ addressDetail: '505동 305호' });

    // Case: sidoAddr is empty
    firmRegiScreen.setState({ sidoAddr: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.addressValErrMessage).toEqual(
      '[시도] 필수 항목 입니다, 빈칸을 채워 주세요',
    );
    firmRegiScreen.setState({ sidoAddr: '세종시' });

    // Case: sigunguAddr is empty
    firmRegiScreen.setState({ sigunguAddr: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.addressValErrMessage).toEqual(
      '[시군] 필수 항목 입니다, 빈칸을 채워 주세요',
    );
    firmRegiScreen.setState({ sigunguAddr: '중구 영종도' });

    // Case: addrLongitude is empty
    firmRegiScreen.setState({ addrLongitude: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.addressValErrMessage).toEqual(
      '[경도] 필수 항목 입니다, 빈칸을 채워 주세요',
    );
    firmRegiScreen.setState({ addrLongitude: 37.45 });

    // Case: addrLatitude is empty
    firmRegiScreen.setState({ addrLatitude: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.addressValErrMessage).toEqual(
      '[위도] 필수 항목 입니다, 빈칸을 채워 주세요',
    );
    firmRegiScreen.setState({ addrLatitude: 137.45 });

    // Case: thumbnail is empty
    firmRegiScreen.setState({ thumbnail: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.thumbnailValErrMessage).toEqual(
      '필수 항목 입니다, 빈칸을 채워 주세요',
    );

    firmRegiScreen.setState({
      introduction:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.introductionValErrMessage).toEqual('최대문자: 1000');
    firmRegiScreen.setState({
      introduction: '',
    });

    firmRegiScreen.setState({
      thumbnail:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.thumbnailValErrMessage).toEqual('최대문자: 250');
    firmRegiScreen.setState({
      thumbnail:
        'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-499435767786/asset/img/jangbee_photo_%2B1547852979838.jpg',
    });

    // Case: photo1 is empty
    firmRegiScreen.setState({ photo1: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.photo1ValErrMessage).toEqual(
      '필수 항목 입니다, 빈칸을 채워 주세요',
    );

    firmRegiScreen.setState({
      photo1:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.photo1ValErrMessage).toEqual('최대문자: 250');
    firmRegiScreen.setState({
      photo1:
        'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-499435767786/asset/img/jangbee_photo_%2B1547852979838.jpg',
    });

    // Case: photo2 is empty
    firmRegiScreen.setState({
      photo2:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.photo2ValErrMessage).toEqual('최대문자: 250');
    firmRegiScreen.setState({ photo2: '' });

    // Case: photo3 is empty
    firmRegiScreen.setState({
      photo3:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.photo3ValErrMessage).toEqual('최대문자: 250');
    firmRegiScreen.setState({ photo3: '' });

    // Case: blog is empty
    firmRegiScreen.setState({
      blog:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.blogValErrMessage).toEqual('최대문자: 250');
    firmRegiScreen.setState({ blog: '' });

    // Case: homepage is empty
    firmRegiScreen.setState({
      homepage:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.homepageValErrMessage).toEqual('최대문자: 250');
    firmRegiScreen.setState({ homepage: '' });

    // Case: sns is empty
    firmRegiScreen.setState({
      sns:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.snsValErrMessage).toEqual('최대문자: 250');
    firmRegiScreen.setState({ sns: '' });

    // Case1: Validation Success
    let valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(true);
  });
});
