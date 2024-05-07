
// shared posts will have sharedContentDetails, normal posts won't have sCD
interface Post {
  content: Content;
  contentable: Contentable;
  user: User;
  tags: Tag[];
  sharedContentDetails?: SharedContentDetails;
}

interface Content {
  id: number;
  latitude: number | string; // should be a number but is coming back from db as a string for some reason
  longitude: number | string; // same as above
  upvotes: number;
  placement: 'public' | 'private' | 'ad' | 'system';
  contentableType: 'photo' | 'comment' | 'plan' | 'pin';
  contentableId: number;
  parentId: null | number;
  createdAt: string;
  updatedAt: string;
  userId: number
}

interface Contentable {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;

  // Pins & photos
  pinType?: string; // maybe grab different pin options from .env file?
  photoURL?: string;

  // Plans
  title?: string;
  address?: string;
  startTime: string;
  endTime: string;
  inviteCount: number;
  attendingCount: number;
  link: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | number; // TODO: currently this datum is a string but could/should change to numbers?
  latitude: number | string // same as Content interface
  longitude: number | string // same
  shareLoc: boolean
  createdAt: string;
  updatedAt: string;
}

interface Tag {
  id: number;
  tag: string;
  createdAt: string;
  updatedAt: string;
  content_tag: ContentTag;
}

interface ContentTag {
  id: number;
  createdAt: string;
  updatedAt: string;
  contentId: number;
  tagId: number;
}

interface SharedContentDetails {
  senders: Sender[];
}

interface Sender extends User {
  shareTimeStamp: ShareTimeStamp;
}

interface ShareTimeStamp {
  id: number;
  contentId: number;
  senderId: number;
  recipientId: number;
  createdAt: string;
  updatedAt: string;
}

export { Post };
