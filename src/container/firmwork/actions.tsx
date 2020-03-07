import api from 'api/api';
import { noticeUserError } from 'src/container/request';
import produce from 'immer';

export enum ActionType {
  AddFriend = 'add-friend',
  DeleteFriend = 'delete-friend',
}

const reducer: Reducer = (state = initialState, action) =>
{
  return produce(state, (draft) =>
  {
    const { type, payload } = action;
    switch (type)
    {
      case ActionType.AddFriend: {
        if (!draft.friends.find((friend) => friend.id === payload.user.id))
        {
          const index = draft.friends.findIndex(
            (friend) =>
              (payload.user?.nickname || '').toLowerCase() <
              (friend?.nickname || '').toLowerCase()
          );
          draft.friends.splice(
            index === -1 ? draft.friends.length : index,
            0,
            payload.user
          );
        }
        break;
      }
      case ActionType.DeleteFriend: {
        const index = draft.friends.findIndex(
          (friend) => friend.id === payload.user.id
        );
        if (index !== -1)
        {
          draft.friends.splice(index, 1);
        }
        break;
      }
    }
  });
};
