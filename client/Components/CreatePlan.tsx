import React, { useContext, useState } from 'react';
import { RunModeContext, UserContext } from './Context';
import { Post } from '../types';
import { Form } from 'react-bootstrap';

interface CreatePlanProps {
  postToEdit: null | Post;
  parentPost: null | Post;
  lat: number;
  lng: number;
  toggleShowCreateContentModal: any;
}

const CreatePlan:React.FC<CreatePlanProps> = ({}) => {
  const [plan, setPlan] = useState('');
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const [isCommentPrivate, setIsCommentPrivate] = useState<boolean>(false);

  // just ids here
  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]);

  const isDemoMode = useContext(RunModeContext) === 'demo';
  const { user, votes, friends } = useContext(UserContext);
  const tabCategories = process.env.TAB_CATEGORIES.split(' ');

  return (
    <div>
      <Form>

      </Form>
    </div>
  )

}

export default CreatePlan;

