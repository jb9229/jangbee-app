import { applyFirmWork } from 'src/container/firmwork/actions';
import { wait } from 'src/utils/TimeUtils';

test('two plus two is four', () =>
{
  const userId = 'user id';
  const work = { id: 'test' };
  const sid = '';
  const coupon = false;

  applyFirmWork(userId, work, sid, coupon);
  wait(3000);
});
