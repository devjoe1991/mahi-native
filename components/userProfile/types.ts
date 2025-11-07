import { UserData, PostData } from '../../screens/userProfileScreen/types';

export interface ProfileHeaderProps {
  userData: UserData;
  viewMode?: boolean;
  isFollowing?: boolean;
  onEditPress?: () => void;
  onMessagePress?: () => void;
  onFollowPress?: () => void;
}

export interface ProfileBodyProps {
  userId: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  onMomentumScrollBegin?: (event: any) => void;
  onMomentumScrollEnd?: (event: any) => void;
}

export interface ProfileStatProps {
  text: string;
  subText: string;
  onPress?: () => void;
}

export interface PostProps {
  postData: PostData;
  onPress?: () => void;
}

export interface CollectionCardProps {
  title?: string;
  images?: string[];
  onPress?: () => void;
}

