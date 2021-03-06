// import * as Localization from 'expo-localization';

import * as React from 'react';

import I18n from 'i18n-js';
import { PickerItem } from 'src/types';
import en from 'utils/locales/en.json';
import ko from 'utils/locales/ko.json';

I18n.fallbacks = true;
I18n.translations = { en, ko };
// I18n.locale = Localization.locale;

const getString = (param: string, mapObj?: object): string =>
{
  if (mapObj)
  {
    I18n.t(param, mapObj);
  }
  return I18n.t(param);
};

export default getString;

export const LOCAL_CATEGORY = [
  '서울',
  '부산',
  '경기',
  '인천',
  '세종특별자치시',
  '대전',
  '광주',
  '대구',
  '울산',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주특별자치도'
];

export const LOCAL_CATEGORY_ALL = [
  '전국',
  '서울',
  '부산',
  '경기',
  '인천',
  '세종특별자치시',
  '대전',
  '광주',
  '대구',
  '울산',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주특별자치도'
];
export const LOCAL_ITEM = [];
LOCAL_ITEM['서울'] = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중량구'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['부산'] = [
  '강서구',
  '금정구',
  '기장구',
  '남구',
  '동구',
  '동래구',
  '부산진구',
  '북구',
  '사상구',
  '서구',
  '수영구',
  '연제구',
  '영도구',
  '중구',
  '해운대구'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['경기'] = [
  '가평군',
  '고양시',
  '과천시',
  '광명시',
  '광주시',
  '구리시',
  '군포시',
  '김포시',
  '남양주시',
  '동두천시',
  '부천시',
  '성남시',
  '수원시',
  '시흥시',
  '안산시',
  '안성시',
  '안양시',
  '양주시',
  '양평군',
  '여주시',
  '연천군',
  '오산시',
  '용인시',
  '의왕시',
  '의정부시',
  '이천시',
  '파주시',
  '평택시',
  '포천시',
  '하남시',
  '화성시'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['인천'] = [
  '강화군',
  '계양군',
  '남동구',
  '동구',
  '미추홀구',
  '부평구',
  '서구',
  '연수구',
  '옹진군',
  '중구'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['세종특별자치시'] = [
  '가람동',
  '고운동',
  '금남면',
  '나성동',
  '다정동',
  '대평동',
  '도담동',
  '반곡동',
  '보람동',
  '부강면',
  '새롬동',
  '소담동',
  '소정면',
  '아름동',
  '어진동',
  '연기면',
  '연동면',
  '연서면',
  '장군면',
  '전동면',
  '전의면',
  '조치원읍',
  '종촌동',
  '한솔동'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['대전'] = ['대덕구', '동구', '서구', '유성구', '중구'].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['광주'] = ['광산구', '남구', '동구', '북구', '서구'].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['대구'] = ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['울산'] = ['남구', '동구', '북구', '울주군', '중구'].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['강원'] = [
  '강릉시',
  '고성군',
  '동해시',
  '삼척시',
  '속초시',
  '양구군',
  '양양군',
  '영월군',
  '원주시',
  '인제군',
  '정선군',
  '철원군',
  '춘천시',
  '태백시',
  '평창군',
  '홍천군',
  '화천군',
  '횡성군'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['충북'] = [
  '괴산군',
  '단양군',
  '보은군',
  '영동군',
  '옥천군',
  '음성군',
  '제천군',
  '증평군',
  '진천군',
  '청주시',
  '충주시'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['충남'] = [
  '계룡시',
  '공주시',
  '금산군',
  '논산시',
  '당진시',
  '보령시',
  '부여군',
  '서산시',
  '서천군',
  '아산시',
  '예산군',
  '천안시',
  '청양군',
  '태안군',
  '홍성군'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['전북'] = [
  '고창군',
  '군산시',
  '김제시',
  '남원시',
  '무주군',
  '부안군',
  '순창군',
  '완주군',
  '익산시',
  '임실군',
  '장수군',
  '전주시',
  '정읍시',
  '진안군'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['전남'] = [
  '강진군',
  '고흥군',
  '곡성군',
  '광양시',
  '구례군',
  '나주시',
  '담양군',
  '목포시',
  '무안군',
  '보성군',
  '순천시',
  '신안군',
  '여수시',
  '영광군',
  '영암군',
  '완도군',
  '장성군',
  '장흥군',
  '진도군',
  '함평군',
  '해남군',
  '화순군'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['경북'] = [
  '경산시',
  '경주시',
  '고령군',
  '구미시',
  '군위군',
  '김천시',
  '문경시',
  '봉화군',
  '상주시',
  '성주군',
  '안동시',
  '영덕군',
  '영양군',
  '영주시',
  '영천시',
  '예천군',
  '울릉군',
  '울진군',
  '의성군',
  '청도군',
  '청송군',
  '칠곡군',
  '포항시'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['경남'] = [
  '거제시',
  '거창군',
  '고성군',
  '김해시',
  '남해군',
  '밀양시',
  '사천시',
  '산청군',
  '양산시',
  '의령군',
  '진주시',
  '창녕군',
  '창원시',
  '통영시',
  '하동군',
  '함안군',
  '함양군',
  '합천군'
].map(lin => new PickerItem(`${lin}`, lin, lin));
LOCAL_ITEM['제주특별자치도'] = ['서귀포시', '제주시'].map(lin => new PickerItem(`${lin}`, lin, lin));
