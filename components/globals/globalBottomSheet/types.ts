export type SheetType = 'NONE' | 'COMMENTS' | 'SETTINGS' | 'PROFILE_EDIT' | 'STREAK_UPDATE' | 'SEARCH';

export type CommentsSheetProps = {
  postId: string;
  initialComments?: Array<{
    id: string;
    author: string;
    text: string;
    liked?: boolean;
  }>;
  onSubmitComment?: (text: string) => void;
  onToggleLike?: (commentId: string, liked: boolean) => void;
};

export type SettingsSheetProps = Record<string, never>;

export type ProfileEditSheetProps = {
  userId?: string;
};

export type StreakUpdateSheetProps = {
  userId?: string;
  onSaved?: () => void;
  initialImage?: string; // Pre-loaded image URI (from camera)
};

export type SearchSheetProps = Record<string, never>;

export type SheetPropsMap = {
  NONE: Record<string, never>;
  COMMENTS: CommentsSheetProps;
  SETTINGS: SettingsSheetProps;
  PROFILE_EDIT: ProfileEditSheetProps;
  STREAK_UPDATE: StreakUpdateSheetProps;
  SEARCH: SearchSheetProps;
};

export type OpenSheet = <T extends SheetType>(type: T, props?: SheetPropsMap[T]) => void;
