import React, { useContext, useState } from 'react';
import { RunModeContext, UserContext } from '../Context';
import { Post } from '../../types';
import { Accordion, Button, Form } from 'react-bootstrap';
import ShareContent from '../ShareContent';

interface CreateContentOptionsProps {
  isEditMode: boolean; // if it's edit mode, then we'll populate tag and friend state
  postToEdit: null | Post; // needed for edit mode to parse tags
  setTags: any; // used to add tags to state in Create[ContentType].tsx
  setFriendsToShareWith: any; // used to add friends in Create[ContentType].tsx
  tags: string[]; // need to look at tags to see whether we remove or add a new tag to it
  friendsToShareWith: number[];
}

/*
TODO: 1) if we get a postToEdit, set state so the tags from the postToEdit show up as both checked boxes for tab categories and list of tags for non-tab categories.

2) if a user inputs a tab category in the text input, then check the box of corresponding tab category. Right now inputting a tag that is a tab category will just not get added.

3) In edit mode, figure out how to check the boxes of friends who have had the content shared with them. This may require another request to figure out which friends have had a piece of content shared with them, so this might not be an efficient feature; right now the 'Share with Friends' list only shows up when not in edit mode--since a fresh piece of content will not be shared with any friends before it's made.
*/
const CreateContentOptions: React.FC<CreateContentOptionsProps> = ({
  isEditMode,
  postToEdit,
  setTags,
  setFriendsToShareWith,
  tags,
  friendsToShareWith,
}) => {
  const isDemoMode = useContext(RunModeContext) === 'demo';

  const { user, votes, friends } = useContext(UserContext);
  const tabCategories = process.env.TAB_CATEGORIES.split(' ');

  const [tag, setTag] = useState<string>('');

  const handleCheckedTag = (e: any) => {
    const { value } = e.target;
    if (!tags.includes(value)) {
      setTags([...tags, value]);
    } else if (tags.includes(value)) {
      setTags(tags.filter((tag) => tag !== value));
    }
  };

  // add tag from input into tags. This is number 2 from above todos
  const addInputTag = () => {
    // check to see if input tag is already in tags or if its one from the tabCategories (had to adjust for capitalizations)
    if (
      !tags.includes(tag.toLowerCase()) &&
      !tabCategories
        .map((category) => {
          return category.toLowerCase();
        })
        .includes(tag.toLowerCase())
    ) {
      setTags([...tags, tag.toLowerCase()]);
      setTag('');
    } else {
      setTag(''); // might be nice to have a toast warning
    }
  };

  // remove tag from list of added tags
  const removeTag = (e: any) => {
    const { name } = e.target;
    setTags(tags.filter((tag) => tag !== name));
  };

  const toggleFriendToShareWith = (e: any) => {
    const { value } = e.target;

    if (!friendsToShareWith.includes(value)) {
      setFriendsToShareWith([...friendsToShareWith, value]);
    } else if (friendsToShareWith.includes(value)) {
      setFriendsToShareWith(
        friendsToShareWith.filter((friendId) => friendId !== value)
      );
    }
  };

  return (
    <Accordion>
      <Accordion.Item eventKey='0'>
        <Accordion.Header>
          {isEditMode ? 'Tag Options' : 'Tag and Share Options'}
        </Accordion.Header>
        <Accordion.Body>
          <h5>Add Tags</h5>
          {/* TAGS FROM CATEGORY TABS */}
          <div className='d-flex flex-wrap justify-content-around'>
            {tabCategories.map((category, index) => {
              return (
                <Form.Check
                  type='checkbox'
                  title={`${category}`}
                  label={`${category}`}
                  value={`${category.toLowerCase()}`}
                  key={`${index}-${category}`}
                  onChange={handleCheckedTag}
                />
              );
            })}
          </div>

          {/* TAG INPUT */}

          <div className='d-flex flex-row'>
            <Form.Control
              className='m-2'
              placeholder='Custom tag goes here'
              onChange={(e) => setTag(e.target.value)}
              value={tag}
              name='tag'
            />
            <Button
              className='w-25 my-auto'
              onClick={addInputTag}
              disabled={tag.length === 0}
            >
              Add
            </Button>
          </div>

          {/* LIST OF TAGS ADDED THRU INPUT */}
          {tags
            .filter((tag) => !tabCategories.includes(tag))
            .map((tag, index) => {
              return (
                <div
                  className='d-flex flex-row align-items-center'
                  key={`${tag}-${index}`}
                >
                  <p className='mb-0'>{tag}</p>
                  <Button
                    className='btn-sm'
                    variant='danger'
                    name={`${tag}`}
                    onClick={removeTag}
                  >
                    X
                  </Button>
                </div>
              );
            })}

          {/* SHARE WITH FRIENDS LIST */}
          {!isEditMode && (
            <>
              <h5>Share with your Friends</h5>
              <ShareContent toggleFriendToShareWith={toggleFriendToShareWith} />
            </>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CreateContentOptions;
