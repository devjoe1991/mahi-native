import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Share,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '../../store/navigation-context';
import { GlobalHeader } from '../../components/globals/GlobalHeader';
import { BottomTabBar, TabType } from '../../components/bottomTabBar';
import { useBottomSheet } from '../../components/globals/globalBottomSheet';
import * as Contacts from 'expo-contacts';
import { useAuth } from '../../store/auth-context';
import { getAllUsers, findUsersByContacts, followUser, isFollowing } from '../../data/user';
import { UserData } from '../userProfileScreen/types';

interface LeaderboardItem {
  user: UserData;
  rank: number;
  streak: number;
}

interface ContactMatch {
  user: UserData;
  matchedEmails: string[];
  matchedPhones: string[];
}

interface ContactInvite {
  id: string;
  name: string;
  emails: string[];
  phoneNumbers: string[];
}

interface ContactCardMeta {
  icon: string;
  text: string;
}

interface ContactCardItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  badgeText?: string;
  isLoading?: boolean;
  meta?: ContactCardMeta[];
  action?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    tone?: 'primary' | 'secondary';
  };
  isFollowing?: boolean;
}

const INVITE_LINK = 'https://mahi.fit/invite';

export const NearbyScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { navigate } = useNavigation();
  const { openSheet } = useBottomSheet();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('nearby');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [contactsStatus, setContactsStatus] = useState<Contacts.PermissionStatus>(
    Contacts.PermissionStatus.UNDETERMINED
  );
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactMatches, setContactMatches] = useState<ContactMatch[]>([]);
  const [contactInvites, setContactInvites] = useState<ContactInvite[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [followLoadingMap, setFollowLoadingMap] = useState<Record<string, boolean>>({});

  const handleTabPress = (tab: TabType) => {
    if (tab === 'home') {
      navigate('HomeScreen');
    } else if (tab === 'messages') {
      navigate('MessagesScreen');
    } else {
      setActiveTab(tab);
    }
  };

  const handleSearchPress = () => {
    openSheet('SEARCH');
  };

  const handleNotificationsPress = () => {
    navigate('NotificationsScreen');
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

const normalizeEmailValue = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }
  return value.trim().toLowerCase();
};

const normalizePhoneValue = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) {
    return null;
  }

  return digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
};

const buildContactName = (contact: Contacts.Contact): string => {
  if (contact.name && contact.name.trim().length > 0) {
    return contact.name.trim();
  }

  const composedName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return composedName.length > 0 ? composedName : 'Unnamed Contact';
};

const formatFitnessGoal = (goal?: string | null): string | null => {
  if (!goal) {
    return null;
  }
  const formatted = goal
    .replace(/_/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  return `Goal: ${formatted}`;
};

const resolveMilestoneLevel = (user: UserData): number => {
  if (typeof user.milestone_level === 'number') {
    return user.milestone_level;
  }
  const streakDays = user.streak_days || 0;
  return Math.floor(streakDays / 7);
};

  const loadContactSuggestions = useCallback(async () => {
    try {
      setLoadingContacts(true);

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });

      if (!data || data.length === 0) {
        setContactMatches([]);
        setContactInvites([]);
        return;
      }

      const contactSummaries = data
        .map<ContactInvite | null>((contact) => {
          const emails =
            contact.emails
              ?.map((item) => item.email)
              .filter((email): email is string => Boolean(email && email.trim().length > 0)) ?? [];
          const phoneNumbers =
            contact.phoneNumbers
              ?.map((item) => item.number)
              .filter((number): number is string => Boolean(number && number.trim().length > 0)) ?? [];

          if (emails.length === 0 && phoneNumbers.length === 0) {
            return null;
          }

          return {
            id: contact.id,
            name: buildContactName(contact),
            emails,
            phoneNumbers,
          };
        })
        .filter((value): value is ContactInvite => value !== null);

      if (contactSummaries.length === 0) {
        setContactMatches([]);
        setContactInvites([]);
        return;
      }

      const allEmails = contactSummaries.flatMap((contact) => contact.emails);
      const allPhones = contactSummaries.flatMap((contact) => contact.phoneNumbers);

      const matchedUsers = await findUsersByContacts(allEmails, allPhones);

      const matchMap = new Map<string, ContactMatch>();
      const unmatchedContacts: ContactInvite[] = [];

      contactSummaries.forEach((contact) => {
        const normalizedContactEmails = contact.emails
          .map(normalizeEmailValue)
          .filter((value): value is string => Boolean(value));
        const normalizedContactPhones = contact.phoneNumbers
          .map(normalizePhoneValue)
          .filter((value): value is string => Boolean(value));

        const matchedUser = matchedUsers.find((user) => {
          if (userData?._id && user._id === userData._id) {
            return false;
          }

          const userEmail = normalizeEmailValue(user.email);
          const userPhone = normalizePhoneValue(user.phone);

          const emailHit = userEmail ? normalizedContactEmails.includes(userEmail) : false;
          const phoneHit = userPhone ? normalizedContactPhones.includes(userPhone) : false;

          return emailHit || phoneHit;
        });

        if (matchedUser) {
          if (!matchMap.has(matchedUser._id)) {
            const matchedEmails = contact.emails.filter(
              (email) => normalizeEmailValue(email) === normalizeEmailValue(matchedUser.email)
            );
            const matchedPhones = contact.phoneNumbers.filter(
              (phone) => normalizePhoneValue(phone) === normalizePhoneValue(matchedUser.phone)
            );
            matchMap.set(matchedUser._id, {
              user: matchedUser,
              matchedEmails,
              matchedPhones,
            });
          }
        } else {
          unmatchedContacts.push(contact);
        }
      });

      const matchList = Array.from(matchMap.values()).sort((a, b) =>
        (a.user.fullName || a.user.username).localeCompare(b.user.fullName || b.user.username)
      );

      setContactMatches(matchList);
      setContactInvites(unmatchedContacts.slice(0, 10));

      if (userData?._id) {
        const followStates = await Promise.all(
          matchList.map(async ({ user }) => ({
            id: user._id,
            following: await isFollowing(userData._id, user._id),
          }))
        );

        setFollowingMap(
          followStates.reduce<Record<string, boolean>>((acc, { id, following }) => {
            acc[id] = following;
            return acc;
          }, {})
        );
      } else {
        setFollowingMap({});
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setContactMatches([]);
      setContactInvites([]);
    } finally {
      setLoadingContacts(false);
    }
  }, [userData?._id]);

  const handleRequestContacts = useCallback(async () => {
    try {
      const response = await Contacts.requestPermissionsAsync();
      setContactsStatus(response.status);

      if (response.status === Contacts.PermissionStatus.GRANTED) {
        await loadContactSuggestions();
      } else {
        Alert.alert(
          'Contacts Permission Needed',
          'Contacts access helps you find friends already on Mahi. You can enable it anytime from settings.'
        );
      }
    } catch (error) {
      console.error('Contacts permission request failed:', error);
      Alert.alert(
        'Contacts Permission',
        'We could not update your contacts permission. Please try again.'
      );
    }
  }, [loadContactSuggestions]);

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings().catch((error) => {
      console.error('Failed to open settings:', error);
      Alert.alert(
        'Open Settings',
        'Please open your device settings manually to update contacts permissions.'
      );
    });
  }, []);

  const handleFollowContactUser = useCallback(
    async (targetUserId: string) => {
      if (!userData?._id) {
        Alert.alert('Sign In Required', 'Please sign in to follow other Mahi members.');
        return;
      }

      setFollowLoadingMap((prev) => ({ ...prev, [targetUserId]: true }));

      try {
        const success = await followUser(userData._id, targetUserId);
        if (success) {
          setFollowingMap((prev) => ({ ...prev, [targetUserId]: true }));
        } else {
          Alert.alert('Already Following', 'You are already following this athlete.');
        }
      } catch (error) {
        console.error('Failed to follow user:', error);
        Alert.alert(
          'Follow Failed',
          'We could not follow this user right now. Please try again shortly.'
        );
      } finally {
        setFollowLoadingMap((prev) => ({ ...prev, [targetUserId]: false }));
      }
    },
    [userData?._id]
  );

  const shareInviteMessage = (contactName?: string) => {
    const greeting = contactName ? `Hey ${contactName.split(' ')[0]}, ` : '';
    return `${greeting}join me on Mahi! Here's your invite link so we can follow each other's progress: ${INVITE_LINK}`;
  };

  const handleInviteContact = useCallback(async (contact: ContactInvite) => {
    try {
      await Share.share({
        message: shareInviteMessage(contact.name),
      });
    } catch (error) {
      console.error('Failed to share invite:', error);
      Alert.alert('Invite Failed', 'We could not open your share options. Please try again.');
    }
  }, []);

  const handleShareAppLink = useCallback(async () => {
    try {
      await Share.share({
        message: `Join me on Mahi! Here's the invite link: ${INVITE_LINK}`,
      });
    } catch (error) {
      console.error('Failed to share Mahi invite link:', error);
      Alert.alert('Share Failed', 'We could not open your share options. Please try again.');
    }
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        const users = await getAllUsers();
        const sorted = users
          .filter((user: UserData) => (user.streak_days || 0) > 0)
          .sort((a: UserData, b: UserData) => (b.streak_days || 0) - (a.streak_days || 0))
          .slice(0, 10)
          .map((user: UserData, index: number) => ({
            user,
            rank: index + 1,
            streak: user.streak_days || 0,
          }));
        setLeaderboard(sorted);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const checkContactsPermission = async () => {
      try {
        const { status } = await Contacts.getPermissionsAsync();
        setContactsStatus(status);

        if (status === Contacts.PermissionStatus.GRANTED) {
          await loadContactSuggestions();
        }
      } catch (error) {
        console.error('Failed to check contacts permission:', error);
      }
    };

    checkContactsPermission();
  }, [loadContactSuggestions]);

  const contactCards = useMemo<ContactCardItem[]>(() => {
    if (contactsStatus !== Contacts.PermissionStatus.GRANTED) {
      const isDenied = contactsStatus === Contacts.PermissionStatus.DENIED;
      return [
        {
          id: 'contacts-permission',
          title: 'Connect Your Contacts',
          description: isDenied
            ? 'Enable contacts in settings to see friends already on Mahi.'
            : 'Allow contacts access to find friends already on Mahi and invite others.',
          icon: 'people-circle',
          color: colors.brand.blue,
          action: {
            label: isDenied ? 'Open Settings' : 'Allow Contacts',
            onPress: isDenied ? handleOpenSettings : handleRequestContacts,
          },
        },
      ];
    }

    if (loadingContacts) {
      return [
        {
          id: 'contacts-loading',
          title: 'Checking contacts…',
          description: 'We’re searching your contacts for athletes already on Mahi.',
          icon: 'time',
          color: colors.brand.purple,
          isLoading: true,
        },
      ];
    }

    const cards: ContactCardItem[] = [];

    if (contactMatches.length === 0) {
      const previewGoal = formatFitnessGoal('endurance');
      const previewMeta: ContactCardMeta[] = [
        { icon: 'flame', text: '45' },
        { icon: 'trophy', text: '6' },
      ];

      cards.push({
        id: 'preview-follow-card',
        title: 'Alex Runner',
        description: previewGoal || 'Already on Mahi',
        icon: 'people-circle',
        color: colors.brand.purple,
        badgeText: 'On Mahi',
        meta: previewMeta,
        action: undefined,
        isFollowing: true,
      });
    }

    contactMatches.forEach((match) => {
      const milestoneLevel = resolveMilestoneLevel(match.user);

      const formattedGoal = formatFitnessGoal(match.user.fitness_goal);

      const meta: ContactCardMeta[] = [
        {
          icon: 'flame',
          text: String(match.user.streak_days || 0),
        },
      ];

      if (milestoneLevel > 0) {
        meta.push({
          icon: 'trophy',
          text: String(milestoneLevel),
        });
      }

      cards.push({
        id: `match-${match.user._id}`,
        title: match.user.fullName || match.user.username,
        description: formattedGoal || 'Already on Mahi',
        icon: 'people-circle',
        color: colors.brand.purple,
        badgeText: 'On Mahi',
        meta,
        action: followingMap[match.user._id]
          ? undefined
          : {
              label: 'Follow',
              onPress: () => handleFollowContactUser(match.user._id),
              loading: Boolean(followLoadingMap[match.user._id]),
              tone: 'primary',
            },
        isFollowing: Boolean(followingMap[match.user._id]),
      });
    });

    contactInvites.forEach((contact) => {
      const description = 'Do your Mahi';

      cards.push({
        id: `invite-${contact.id}`,
        title: contact.name,
        description,
        icon: 'share-social',
        color: colors.brand.orange,
        action: {
          label: 'Invite',
          onPress: () => handleInviteContact(contact),
          tone: 'secondary',
        },
      });
    });

    if (cards.length === 0) {
      cards.push({
        id: 'contacts-empty',
        title: 'Invite your friends',
        description: 'Share your invite link to bring your crew onto Mahi.',
        icon: 'send',
        color: colors.brand.orange,
        action: {
          label: 'Share Invite Link',
          onPress: handleShareAppLink,
          tone: 'secondary',
        },
      });
    }

    return cards;
  }, [
    colors.brand.blue,
    colors.brand.green,
    colors.brand.orange,
    colors.brand.purple,
    contactInvites,
    contactMatches,
    contactsStatus,
    followLoadingMap,
    followingMap,
    handleFollowContactUser,
    handleInviteContact,
    handleOpenSettings,
    handleRequestContacts,
    handleShareAppLink,
    loadingContacts,
  ]);

  const features = [
    {
      icon: 'people',
      title: 'Find Nearby Users',
      description: 'Connect with fitness enthusiasts in your area',
      color: colors.brand.blue,
    },
    {
      icon: 'people-circle',
      title: 'Join Local Groups',
      description: 'Discover workout groups and communities nearby',
      color: colors.brand.purple,
    },
    {
      icon: 'location',
      title: 'Location-Based Feeds',
      description: 'See what people in your area are up to',
      color: colors.brand.cyan,
    },
    {
      icon: 'calendar',
      title: 'Group Challenges',
      description: 'Participate in local fitness challenges',
      color: colors.brand.orange,
    },
    {
      icon: 'walk',
      title: 'Meetup Events',
      description: 'Join group workouts and meetups',
      color: colors.brand.green,
    },
    {
      icon: 'trophy',
      title: 'Local Leaderboards',
      description: 'Compete with people in your neighborhood',
      color: colors.brand.yellow,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      flex: 1,
      paddingBottom: 100,
    },
    heroSection: {
      padding: spacing.lg,
      alignItems: 'center',
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    heroIcon: {
      marginBottom: spacing.md,
    },
    heroTitle: {
      fontSize: typography.h1.fontSize - 4,
      fontWeight: typography.h1.fontWeight as any,
      fontFamily: typography.h1.fontFamily,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
      letterSpacing: 0.5,
      lineHeight: (typography.h1.fontSize - 4) * 1.2,
    },
    heroSubtitle: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      marginBottom: 0,
      letterSpacing: 0.2,
      lineHeight: (typography.body.fontSize - 2) * 1.5,
      paddingHorizontal: spacing.md,
    },
    contactsSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      marginBottom: spacing.md,
    },
    contactsCarouselContent: {
      paddingRight: spacing.lg,
    },
    contactCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 16,
      padding: spacing.md,
      marginRight: spacing.md,
      width: Dimensions.get('window').width - (spacing.lg * 2) - spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    contactHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    contactIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    contactTitleContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    contactTitle: {
      fontSize: typography.h3.fontSize - 4,
      fontWeight: typography.h3.fontWeight as any,
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      letterSpacing: 0.15,
    },
    contactBadge: {
      backgroundColor: colors.brand.purple,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: 12,
      marginLeft: spacing.sm,
    },
    contactBadgeText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '700',
      color: colors.background.primary,
      letterSpacing: 0.15,
    },
    contactDescription: {
      fontSize: typography.body.fontSize - 3,
      fontFamily: typography.body.fontFamily,
      fontWeight: '400',
      color: colors.text.muted,
      letterSpacing: 0.15,
      lineHeight: (typography.body.fontSize - 3) * 1.3,
      flex: 1,
      marginRight: spacing.sm,
    },
    goalButtonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
    },
    contactMeta: {
      marginTop: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    followButton: {
      backgroundColor: colors.primary[500],
      paddingVertical: 10,
      paddingHorizontal: spacing.lg,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 110,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    followButtonText: {
      color: colors.background.primary,
      fontSize: typography.body.fontSize - 1,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    statsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.xs,
    },
    streakBadge: {
      backgroundColor: colors.brand.orange,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 2,
    },
    trophyBadge: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 2,
    },
    statsBadgeText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      color: colors.background.primary,
      marginLeft: 3,
      letterSpacing: 0.1,
    },
    streakText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      color: colors.background.primary,
      marginLeft: 3,
      letterSpacing: 0.1,
    },
    trophyText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      color: colors.background.primary,
      marginLeft: 3,
      letterSpacing: 0.1,
    },
    trophyEmoji: {
      fontSize: 10,
    },
    comingSoonBadge: {
      backgroundColor: colors.brand.blue,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 12,
      marginTop: spacing.sm,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    comingSoonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      fontWeight: '700',
      color: colors.background.primary,
      letterSpacing: 0.3,
    },
    featuresSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.h2.fontSize - 3,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.md,
      letterSpacing: 0.5,
      lineHeight: (typography.h2.fontSize - 3) * 1.2,
    },
    carouselContent: {
      paddingRight: spacing.lg,
    },
    featureCardCarousel: {
      backgroundColor: colors.background.primary500,
      borderRadius: 16,
      padding: spacing.md,
      marginRight: spacing.md,
      width: Dimensions.get('window').width * 0.75,
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      overflow: 'hidden',
      justifyContent: 'flex-start',
    },
    featureIconContainerCarousel: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    featureContentCarousel: {
      flex: 1,
    },
    featureTitleCarousel: {
      fontSize: typography.h3.fontSize - 4,
      fontWeight: typography.h3.fontWeight as any,
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.15,
      lineHeight: (typography.h3.fontSize - 4) * 1.2,
    },
    featureDescriptionCarousel: {
      fontSize: typography.body.fontSize - 3,
      fontFamily: typography.body.fontFamily,
      fontWeight: '400',
      color: colors.text.muted,
      letterSpacing: 0.15,
      lineHeight: (typography.body.fontSize - 3) * 1.3,
    },
    leaderboardSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      marginBottom: spacing.md,
    },
    leaderboardCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 16,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    leaderboardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    leaderboardItemLast: {
      borderBottomWidth: 0,
    },
    rankBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      backgroundColor: colors.background.primary,
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    rankBadgeTop: {
      backgroundColor: colors.brand.yellow,
    },
    rankText: {
      fontSize: typography.h3.fontSize,
      fontWeight: '600',
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
    },
    rankTextTop: {
      color: colors.background.primary,
    },
    leaderboardUserInfo: {
      flex: 1,
    },
    leaderboardUsername: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      letterSpacing: 0.15,
      lineHeight: typography.body.fontSize * 1.3,
    },
    leaderboardStreak: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    leaderboardStreakText: {
      fontSize: 12,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      marginLeft: spacing.xs,
      letterSpacing: 0.15,
      lineHeight: 12 * 1.3,
    },
  });

  return (
    <View style={styles.container}>
      <GlobalHeader
        onSearchPress={handleSearchPress}
        onNotificationsPress={handleNotificationsPress}
        onMenuPress={handleMenuPress}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="location"
              size={80}
              color={colors.brand.cyan}
            />
          </View>
          <Text style={styles.heroTitle}>Connect Nearby</Text>
          <Text style={styles.heroSubtitle}>
            Find fitness enthusiasts, join local groups, and discover workout communities in your area
          </Text>
        </View>

        {/* Contacts Carousel */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Find Friends</Text>
          <FlatList
            data={contactCards}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contactsCarouselContent}
            renderItem={({ item }) => (
              <View style={styles.contactCard}>
                <View style={styles.contactHeader}>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: `${item.color}20` },
                    ]}
                  >
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <View style={styles.contactTitleContainer}>
                    <Text style={styles.contactTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {item.badgeText && (
                      <View style={styles.contactBadge}>
                        <Text style={styles.contactBadgeText}>{item.badgeText}</Text>
                      </View>
                    )}
                    {/* Move meta badges inline with name and badge */}
                    {item.meta?.length ? (
                      <>
                        {item.meta.map((metaItem, index) => (
                          <View
                            key={`${item.id}-meta-${index}`}
                            style={[
                              styles.statsBadge,
                              metaItem.icon === 'flame' ? styles.streakBadge : styles.trophyBadge,
                            ]}
                          >
                            {metaItem.icon === 'flame' ? (
                              <Ionicons
                                name="flame"
                                size={12}
                                color={colors.background.primary}
                              />
                            ) : (
                              <Text style={styles.trophyEmoji}>🏆</Text>
                            )}
                            <Text
                              style={[
                                styles.statsBadgeText,
                                metaItem.icon === 'flame' ? styles.streakText : styles.trophyText,
                              ]}
                            >
                              {metaItem.text}
                            </Text>
                          </View>
                        ))}
                      </>
                    ) : null}
                  </View>
                </View>
                <View style={styles.goalButtonRow}>
                  <Text style={styles.contactDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                  {item.isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.brand.purple}
                    />
                  ) : item.action ? (
                    <Pressable
                      style={[
                        styles.followButton,
                        item.action.loading && { opacity: 0.6 },
                      ]}
                      onPress={item.action.onPress}
                      disabled={item.action.loading}
                    >
                      {item.action.loading ? (
                        <ActivityIndicator size="small" color={colors.background.primary} />
                      ) : (
                        <Text style={styles.followButtonText}>{item.action.label}</Text>
                      )}
                    </Pressable>
                  ) : item.isFollowing ? (
                    <View style={styles.followButton}>
                      <Text style={styles.followButtonText}>Following</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            )}
          />
        </View>

        {/* Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Top Streaks</Text>
          {loadingLeaderboard ? (
            <View style={styles.leaderboardCard}>
              <ActivityIndicator size="large" color={colors.brand.blue} style={{ padding: spacing.xl }} />
            </View>
          ) : leaderboard.length > 0 ? (
            <View style={styles.leaderboardCard}>
              {leaderboard.map((item, index) => (
                <Pressable
                  key={item.user._id}
                  style={[
                    styles.leaderboardItem,
                    index === leaderboard.length - 1 && styles.leaderboardItemLast,
                  ]}
                  onPress={() => navigate('UserProfileScreen', { userId: item.user._id, viewMode: true })}
                >
                  <View
                    style={[
                      styles.rankBadge,
                      item.rank <= 3 && styles.rankBadgeTop,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankText,
                        item.rank <= 3 && styles.rankTextTop,
                      ]}
                    >
                      {item.rank}
                    </Text>
                  </View>
                  <View style={styles.leaderboardUserInfo}>
                    <Text style={styles.leaderboardUsername}>
                      {item.user.fullName || item.user.username}
                    </Text>
                    <View style={styles.leaderboardStreak}>
                      <Ionicons name="flame" size={14} color={colors.brand.orange} />
                      <Text style={styles.leaderboardStreakText}>
                        {item.streak} day streak
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {/* Coming Soon Features Section - Horizontal Carousel */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <FlatList
            data={features}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `feature-${index}`}
            contentContainerStyle={styles.carouselContent}
            renderItem={({ item }) => (
              <Pressable style={styles.featureCardCarousel}>
                <View
                  style={[
                    styles.featureIconContainerCarousel,
                    { backgroundColor: item.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                <View style={styles.featureContentCarousel}>
                  <Text style={styles.featureTitleCarousel}>{item.title}</Text>
                  <Text style={styles.featureDescriptionCarousel} numberOfLines={3}>
                    {item.description}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

