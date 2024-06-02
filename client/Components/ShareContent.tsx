import React, { useContext } from 'react';
import { UserContext } from './Context';
import { Form } from 'react-bootstrap';

/* SHARE CONTENT MODAL SITS WITHIN A PARENT COMPONENT
1) ShareModal: friendsToShareWith stored in ShareModal
2) CreateContentOptions: friendsToShareWith stored in each Create[Content].tsx file
*/
interface ShareContentProps {
  toggleFriendToShareWith: any;
}

const ShareContent: React.FC<ShareContentProps> = ({
  toggleFriendToShareWith,
}) => {
  const { user, votes, friends } = useContext(UserContext);

  


  return (
    <Form>
      <div className='d-flex flex-wrap gap-2'>
        {friends.length > 0 &&
          friends.map((friend, index) => {
            return (
              <Form.Check
                type='checkbox'
                title={`${friend.firstName} ${friend.lastName}`}
                label={`${friend.firstName} ${friend.lastName}`}
                value={`${friend.id}`}
                key={`${index}-${friend.firstName}`}
                onClick={toggleFriendToShareWith}
              />
            );
          })}
      </div>
    </Form>
  );
};

export default ShareContent;
