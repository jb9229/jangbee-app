import { User } from 'firebase';

export class ApplyWorkCallback
{
  constructor (callback: (user: User, useCoupon: boolean) => void, user: User)
  {
    this.action = callback;
    this.user = user;
  }

  user: User;
  action: (user: User, useCoupon: boolean) => void;

  requestCallback = (): void =>
  {
    this.action(this.user, true);
  }
};
