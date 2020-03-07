
export interface SubscriptionReadyResponse {
  tid: string;
  next_redirect_app_url: string;
  next_redirect_mobile_url: string;
  next_redirect_pc_url: string;
  android_app_scheme: string;
  ios_app_scheme: string;
  created_at: string;
}

export enum AdType {
  MAIN_FIRST = 1,
  MAIN_SECONDE = 2,
  MAIN_THIRD = 3,
  SEARCH_EQUIPMENT_FIRST = 11,
  SEARCH_REGION_FIRST = 21,
}
