import * as api from 'api/api';

import { Alert, Picker, ScrollView } from 'react-native';

import JBPicker from 'molecules/JBPicker';
import { LineChart } from 'react-native-chart-kit';
import React from 'react';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const ChartWrap = styled.View`
  flex: 1;
  height: 305;
`;

const ChartTopWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 5;
  padding-right: 5;
`;

const ChartTitle = styled.Text`
  font-family: ${fonts.titleMiddle};
`;

const ChartLegendListWrap = styled.View`
  flex-direction: row;
  margin-bottom: 3;
  padding-left: 5;
  padding-right: 5;
`;

const ChartLegend = styled.View`
  padding: 5px;
  margin-right: 5;
  ${props =>
    props.color &&
    `
    background-color: ${props.color};
    border-color: ${props.color};
    border-radius: 30;
  `}
`;

const ChartLegendTitle = styled.Text``;

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2 // optional, default 3
};

const sidoEquiPickerItems = ['크레인', '카고크레인', '굴착기', '스카이'].map(
  lin => <Picker.Item key={lin} label={`${lin}`} value={lin} />
);

const CHART_COLORS = [
  '255, 102, 102,',
  '255, 178, 102,',
  '255, 255, 102,',
  '178, 255, 102,',
  '102, 255, 102,',
  '102, 255, 255,',
  '102, 178, 255,',
  '102, 102, 255,',
  '178, 102, 255,',
  '255, 102, 255,',
  '255, 102, 178,',
  '192, 192, 192,',
  '74, 16, 44,',
  '160,82,45,',
  '188,143,143,',
  '143,160,143,'
];

export default class FirmCntChart extends React.Component {
  _isMounted = false;

  constructor (props) {
    super(props);
    this.state = {
      firmCntChartModels: [],
      selectedChartEqui: '크레인'
    };
  }

  componentDidMount () {
    this._isMounted = true;
    this.setFirmCountChart('크레인');
  }

  componentWillUnmount () {
    this._isMounted = false;
  }

  changeChart = (equipment) => {
    this.setFirmCountChart(equipment);
    this.setState({ selectedChartEqui: equipment });
  };

  /**
   * 지역별 각장비모델 등록갯수 데이터요청 함수
   */
  setFirmCountChart = equipment => {
    if (!equipment) {
      return;
    }

    api
      .getFirmCountChart(equipment)
      .then(firmCNTData => {
        if (!this._isMounted) {
          return;
        }

        if (firmCNTData) {
          const modelList = [];

          const chartDataSets = firmCNTData.map((chartInfo, index) => {
            modelList.push(chartInfo.model);

            return {
              data: chartInfo.array,
              color: (opacity = 1) => `rgba(${CHART_COLORS[index]} ${opacity})`, // optional
              strokeWidth: 2 // optional
            };
          });

          const chartData = {
            labels: [
              '서울',
              '부산',
              '경기',
              '인천',
              '세종',
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
              '제주'
            ],
            datasets: chartDataSets
          };

          this.setState({
            firmCntChartData: chartData,
            firmCntChartModels: modelList
          });
        } else {
          Alert.alert(
            '유효하지 않은 차트데이터 입니다',
            `응답 내용: ${firmCNTData}`
          );
        }
      })
      .catch(error => {
        if (!this._isMounted) {
          return;
        }

        Alert.alert(
          '지역별 장비가입 현황 차트데이터 수신에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`
        );
      });
  };

  render () {
    const {
      firmCntChartData,
      selectedChartEqui,
      firmCntChartModels
    } = this.state;

    const chartFirmmodelList = firmCntChartModels.map((model, index) => (
      <ChartLegend color={`rgba(${CHART_COLORS[index]} 1.0)`} key={index}>
        <ChartLegendTitle>{model}</ChartLegendTitle>
      </ChartLegend>
    ));

    return (
      <ChartWrap>
        <ChartTopWrap>
          <ChartTitle>주요장비 지역가입 현황</ChartTitle>
          <JBPicker
            selectedValue={selectedChartEqui}
            items={sidoEquiPickerItems}
            onValueChange={equipment => this.changeChart(equipment)}
            size={137}
          />
        </ChartTopWrap>
        <ScrollView horizontal>
          <ChartLegendListWrap>{chartFirmmodelList}</ChartLegendListWrap>
        </ScrollView>
        {firmCntChartData && (
          <ScrollView horizontal>
            <LineChart
              data={firmCntChartData}
              width={900}
              height={220}
              chartConfig={chartConfig}
            />
          </ScrollView>
        )}
      </ChartWrap>
    );
  }
}
