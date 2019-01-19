import React from 'react';
import renderer from 'react-test-renderer';
import FirmRegisterScreen from '..';

function setDefaultState(component) {
  component.setState({
    isVisibleEquiModal: false,
    isVisibleMapAddModal: false,
    fName: '세종누리카고 크레인',
    phoneNumber: '010-7654-7404',
    password: 'chabum!21',
    comfirmPassword: 'chabum!21',
    equiListStr: '카고크레인,트럭',
    address: '세종시 중구 영종도',
    addressDetail: '우창빌라203호',
    sidoAddr: '세종시',
    sigunguAddr: '중구 영종도',
    addrLongitude: '37.56',
    addrLatitude: '38.91',
    fIntroduction: '안녕하세요 중부권 최고의 장비기사 나채범입니다.',
    photo1: 'http://default-test.jpg',
    photo2: 'http://test.jpg',
    photo3: '',
    photo4: '',
    blog: '',
    homepage: '',
    sns: '',
    fNameValErrMessage: '',
    phoneNumberValErrMessage: '',
    passwordValErrMessage: '',
    comfirmPasswordValErrMessage: '',
    equiListStrValErrMessage: '',
    addressValErrMessage: '',
  });
}

describe('업체등록 유효성검사 함수 테스트', () => {
  it('isValidateSubmit()', async () => {
    const firmRegiScreen = renderer.create(<FirmRegisterScreen />).getInstance();

    setDefaultState(firmRegiScreen);

    // Case1: Validation Success
    let valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(true);

    // Case2: fName is empty
    firmRegiScreen.setState({ fName: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.fNameValErrMessage).toEqual('필수 항목 입니다, 빈칸을 채워 주세요');

    // Case2: fName is exceed character
    firmRegiScreen.setState({ fName: '12345678910123456' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.fNameValErrMessage).toEqual('최대문자: 15');

    firmRegiScreen.setState({ fName: '세종누리카고 크레인' });

    // Case2: cellPhone is empty
    firmRegiScreen.setState({ phoneNumber: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.phoneNumberValErrMessage).toEqual(
      '필수 항목 입니다, 빈칸을 채워 주세요',
    );

    // Case: cellPhone is unmatch format1
    firmRegiScreen.setState({ phoneNumber: '0102387647404' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.phoneNumberValErrMessage).toEqual('전화번호 형식이 아닙니다');

    firmRegiScreen.setState({ phoneNumber: '010-7654-7404' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(firmRegiScreen.state.phoneNumberValErrMessage).toEqual('');

    // Case: cellPhone is unmatch format1
    firmRegiScreen.setState({ phoneNumber: '010-2나8-6474' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.phoneNumberValErrMessage).toEqual('전화번호 형식이 아닙니다');

    firmRegiScreen.setState({ phoneNumber: '010-7654-7404' });

    // Case: passwoard is empty
    firmRegiScreen.setState({ password: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.passwordValErrMessage).toEqual(
      '필수 항목 입니다, 빈칸을 채워 주세요',
    );

    // Case: passwoard is min
    firmRegiScreen.setState({ password: '12345' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.passwordValErrMessage).toEqual('최소문자: 6');

    firmRegiScreen.setState({ password: '123456' });

    // Case: comfirmPassword is unmatch
    firmRegiScreen.setState({ comfirmPassword: '654321' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.comfirmPasswordValErrMessage).toEqual(
      '비밀번호가 일치하지 않습니다',
    );

    firmRegiScreen.setState({ comfirmPassword: '123456' });

    // Case: equiListStr is empty
    firmRegiScreen.setState({ equiListStr: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.equiListStrValErrMessage).toEqual(
      '필수 항목 입니다, 빈칸을 채워 주세요',
    );
    firmRegiScreen.setState({ equiListStr: '크레인,트럭' });

    // Case: equiListStr is empty
    firmRegiScreen.setState({ address: '' });
    valResult = firmRegiScreen.isValidateSubmit();
    expect(valResult).toEqual(false);
    expect(firmRegiScreen.state.addressValErrMessage).toEqual(
      '필수 항목 입니다, 빈칸을 채워 주세요',
    );
  });
});
