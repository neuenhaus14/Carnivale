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

// Covers all different content types (pin, plan, comment, photo) coming in from server
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
  startTime?: string | Date;
  endTime?: string | Date;
  inviteCount?: number;
  attendingCount?: number;
  link?: string;

  // Plan or Pin
  latitude?: number | string; // should be a number but is coming back from db as a string for some reason
  longitude?: number | string; // same as above
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | number; // TODO: currently this datum is a string but could/should change to numbers?
  latitude: number | string; // same as Content interface
  longitude: number | string; // same
  shareLoc: boolean;
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

interface FriendRequest {
  id: number;
  status: 'pending' | 'approved' | 'denied' | 'blocked';
  createdAt: string;
  updatedAt: string;
  requesterId: number;
  recipientId: number;
  requester: User;
  recipient: User;
}

// Specific content types - type Contentable above covers all content types coming in from server, but content types below are used for creating/editing content in Create[ContentType].tsx component
interface Pin {
  id: number | null; // will not have id when creating
  pinType: string;
  photoUrl?: string; // only available after post is created (ie, this is not added by the user)
  description: string;
  latitude: number | string; // should be a number but is coming back from db as a string for some reason
  longitude: number | string; // same as above
  createdAt: string;
  updatedAt: string;
}

interface Plan {
  id: number | null; // will not have id when creating
  title: string;
  description: string;
  address: string;
  startTime: string | Date;
  endTime: string | Date;
  inviteCount: number;
  attendingCount: number;
  link: string;
  latitude: number | string;
  longitude: number | string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number | null; // will not have id when creating
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Photo {
  id: number | null; // will not have id when creating
  description: string;
  photoURL?: string; // may not have one (gets returned from Cloudinary after posting)
  createdAt: string;
  updatedAt: string;
}

export { Post, FriendRequest, User, Comment, Photo, Pin, Plan };
