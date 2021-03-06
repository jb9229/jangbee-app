import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import CloseButton from '../molecules/CloseButton';
import { Modal } from 'react-native';
import RNApkInstallerN from 'react-native-apk-installer-n';
import RNFS from 'react-native-fs';
import SolidButton from '../atoms/button/SolidButton';
import { alarmSettingModalStat } from 'src/container/firmHarmCase/store';
import styled from 'styled-components/native';
import { updateUserProfile } from 'src/utils/FirebaseUtils';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Head = styled.View`
  width: 80%;
  background-color: white;
`;
const Contents = styled.View`
  width: 80%;
  background-color: white;
  padding: 20px;
  border-radius: 4px;
`;
const Notice = styled.Text`
  margin-top: 20px;
`;
const Progress = styled.Text``;
const InstallButton = styled(SolidButton)``;

const AlarmSettingModal: React.FC = () => {
  const { userProfile } = useLoginContext();
  const [alarmSettingData, setAlarmSettingData] = useRecoilState(
    alarmSettingModalStat
  );
  const [downloadPercent, setDownloadPercent] = useState<number | undefined>();
  const installAction = () => {
    const filePath = RNFS.DocumentDirectoryPath + '/jangbeecallScane.apk';
    const download = RNFS.downloadFile({
      fromUrl:
        'https://github.com/jb9229/jangbeecall-scan/raw/master/android/app/release/app-release.apk',
      toFile: filePath,
      progress: res => {
        setDownloadPercent(
          Math.floor((res.bytesWritten / res.contentLength) * 100)
        );
      },
      progressDivider: 1,
    });

    download.promise
      .then(result => {
        if (result.statusCode == 200) {
          RNApkInstallerN.install(filePath)
            .then((str: string) => {
              console.log(`RNApkInstallerN.install success: ${str}`);
            })
            .catch(error => alert(`invalid app install: ${error?.message}`));

          userProfile &&
            updateUserProfile({
              ...userProfile,
              scanAppVersion: alarmSettingData.newVersion,
            });

          setAlarmSettingData({ visible: false });
        }
      })
      .catch(error => console.log('error:', error));
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={alarmSettingData.visible}
      onRequestClose={() => setAlarmSettingData({ visible: false })}
    >
      <Container>
        <Head>
          <CloseButton
            onClose={() => setAlarmSettingData({ visible: false })}
          />
        </Head>
        <Contents>
          <Notice>
            걸려오는 전화번호로 장비대금 수금 피해사례가 있는지 간편하게
            알려줍니다
          </Notice>
          {!!downloadPercent && (
            <Progress>{`Downloading...(${downloadPercent}%)`}</Progress>
          )}
          {alarmSettingData.newVersion && (
            <Notice>
              {`[버전 업그레이드 필요]\n 현 버전:${userProfile?.scanAppVersion} -> 신규 버전:${alarmSettingData.newVersion}`}
            </Notice>
          )}
          <InstallButton
            rootStyle={{ marginTop: 20 }}
            text={`${
              alarmSettingData.newVersion ? '버전 업그레이드' : '앱 설치'
            }`}
            onPress={() => installAction()}
          />
        </Contents>
      </Container>
    </Modal>
  );
};

export default AlarmSettingModal;
