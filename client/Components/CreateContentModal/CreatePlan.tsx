import React, { useContext, useEffect, useState } from 'react';
import { RunModeContext, UserContext } from '../Context';
import { Plan, Post } from '../../types';
import { Button, Form } from 'react-bootstrap';
import CreateContentOptions from './CreateContentOptions';
import axios from 'axios';
import { DateTimePicker, DateTimePickerProps } from 'react-datetime-picker';
// DateTimePicker styling
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

interface CreatePlanProps {
  postToEdit: null | Post;
  parentPost: null | Post;
  lat: number;
  lng: number;
  submitContent: any;
  updateContent: any;
}

const CreatePlan: React.FC<CreatePlanProps> = ({
  postToEdit,
  parentPost,
  lat,
  lng,
  submitContent,
  updateContent
}) => {
  // PLAN-SPECIFIC STATE
  const [plan, setPlan] = useState<Plan>({
    id: null,
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    address: '',
    attendingCount: 0,
    inviteCount: 0,
    link: '',
    latitude: null,
    longitude: null,
    createdAt: '',
    updatedAt: '',
  });

  // for setting min and max parameters for creating plan
  const eventStartDateTime = process.env.EVENT_START_DATETIME;
  const eventEndDateTime = process.env.EVENT_END_DATETIME;

  // CONTENT STATE
  const [tags, setTags] = useState<string[]>([]);
  const [isPlanPrivate, setIsPlanPrivate] = useState<boolean>(false);
  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]); // just ids here

  // CONTEXT & INCOMING POTS
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const { user, votes, friends } = useContext(UserContext);
  const isEditMode =
    postToEdit && postToEdit.content.contentableType === 'plan' ? true : false;

  useEffect(() => {
    if (isEditMode) {
      setPlan({...postToEdit.contentable, startTime: new Date(postToEdit.contentable.startTime), endTime: new Date (postToEdit.contentable.endTime)});
      setIsPlanPrivate(
        postToEdit.content.placement === 'private' ? true : false
      );
    }
  }, []);

  // COMPONENT FUNCTIONALTY TODO: add map to component
  const handlePlanSubmit = async () => {
    try {
      submitContent('plan', {
        content: {
          latitude: lat,
          longitude: lng,
          userId: user.id,
          parentPost: parentPost,
          placement: isPlanPrivate ? 'private' : 'public',
        },
        plan: {
          // can't have id, createdAt, updatedAt for new plan
          title: plan.title,
          description: plan.description,
          startTime: plan.startTime,
          endTime: plan.endTime,
          address: plan.address,
          inviteCount: plan.inviteCount,
          attendingCount: plan.attendingCount,
          link: plan.link,
          latitude: plan.latitude,
          longitude: plan.longitude,
        },
        tags,
        friendsToShareWith,
      });
    } catch (e) {
      console.error('CLIENT ERROR: failed to create plan', e);
    }
  };

  // TODO:
  const handlePlanUpdate = async () => {
    console.log('handlePlanUpdate executed');
  };

  const handlePlanInput = async (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleAddressToCoordinates = async (e: any) => {
    const { value } = e.target;

    try {
      const coordinatesResponse = await axios.post(
        '/api/plan/getCoordinatesFromAddress',
        {
          address: plan.address,
        }
      );
      const [longitude, latitude] = coordinatesResponse.data;
      setPlan({
        ...plan,
        longitude,
        latitude,
      });
    } catch (e) {
      console.error('CLIENT ERROR: failed to get coordinates from address');
    }
  };

  console.log('plan', plan, 'isPlanPrivate', isPlanPrivate);
  return (
    <div>
      <Form className='w-100'>
        <Form.Group>
          {/* TITLE */}
          <Form.Control
            placeholder='Title'
            name='title'
            onChange={handlePlanInput}
            value={plan.title}
          />
          {/* DESCRIPTION */}
          <Form.Control
            placeholder='Description'
            name='description'
            onChange={handlePlanInput}
            value={plan.description}
          />
          {/* ADDRESS */}
          <Form.Control
            placeholder='Address'
            name='address'
            onChange={handlePlanInput}
            onBlur={handleAddressToCoordinates}
            value={plan.address}
          />
          {/* STARTTIME */}
          <DateTimePicker
            name='startTime'
            minDate={new Date(eventStartDateTime)}
            maxDate={new Date(eventEndDateTime)}
            value={plan.startTime}
            onChange={(value) => setPlan({...plan, startTime: value})}
          />
          {/* ENDTIME */}
          <DateTimePicker
            name='endTime'
            minDate={new Date(eventStartDateTime)}
            maxDate={new Date(eventEndDateTime)}
            value={plan.endTime}
            onChange={(value)=> setPlan({...plan, endTime: value})}
          />
          {/* LINK */}
          <Form.Control
            placeholder='Event Link (optional)'
            name='link'
            onChange={handlePlanInput}
            value={plan.link}
          />
          {/* PLACEMENT SWITCH */}
          <div className='d-flex flex-row align-items-center justify-content-center my-2'>
            <div className='d-flex justify-content-center align-items-center'>
              <p className='mb-0'>Public post</p>
              <Form.Switch
                id='comment-placement-switch'
                checked={isPlanPrivate}
                onChange={() => setIsPlanPrivate(!isPlanPrivate)}
              />
              <p className='mb-0'>Friends only</p>
            </div>
            {/* CREATE/EDIT COMMENT BUTTON */}
            {isEditMode ? (
              <Button
                variant='primary'
                onClick={handlePlanUpdate}
                disabled={isDemoMode || plan.description.length <= 0}
                className='mx-4'
              >
                Update
              </Button>
            ) : (
              <Button
                variant='primary'
                onClick={handlePlanSubmit}
                disabled={isDemoMode || plan.description.length <= 0}
                className='mx-4'
              >
                Post It
              </Button>
            )}
          </div>
          <CreateContentOptions
            postToEdit={postToEdit}
            isEditMode={isEditMode}
            setTags={setTags}
            setFriendsToShareWith={setFriendsToShareWith}
            friendsToShareWith={friendsToShareWith}
            tags={tags}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreatePlan;
