import * as yup from 'yup';

import { AdType } from '../components/templates/CreateAdLayout';
import getString from 'src/STRING';

export const ValidScheme = yup.object({
  adType: yup.string()
    .required(`[comment]${getString('VALIDATION_REQUIRED')}`)
    .min(2, `[comment]${getString('VALIDATION_STRING_EXCEED')}(2~1000 자)`)
    .max(1000, `[comment]${getString('VALIDATION_STRING_EXCEED')}(2~1000 자)`),
  forMonths: yup.number()
});

export class CreateAdDto
{
  adType: AdType | undefined;
  forMonths = 1;
  adTitle: string;
  adSubTitle: string;
  adPhotoUrl: string;
  adTelNumber: string;
  adSido: string;
  adGungu: string;
  adEquipment: string;
}

export class CreateAdDtoError
{
  type: string;
  title: string;
  subTitle: string;
  local: string;
  equipment: string;
  telNumber: string;
  photoUrl: string;
  forMonths: string;
}