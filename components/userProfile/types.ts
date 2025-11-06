import { UserData, PostData } from '../../screens/userProfileScreen/types';

export interface ProfileHeaderProps {
  userData: UserData;
  viewMode?: boolean;
  onEditPress?: () => void;
  onMessagePress?: () => void;
}

export interface ProfileBodyProps {
  userId: string;
  refreshing?: boolean;
  onRefresh?: () => void;
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

