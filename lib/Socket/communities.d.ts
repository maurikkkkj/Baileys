/// <reference types="node" />
import { proto } from '../../WAProto'
import { GroupMetadata, ParticipantAction, SocketConfig, NewsletterFetchedUpdate, NewsletterMetadata, NewsletterReactionMode, NewsletterViewRole, SocketConfig, WAMediaUpload } from '../Types'
import { BinaryNode } from '../WABinary'

export interface CommunityMetadata extends GroupMetadata {
    isCommunity: boolean
    isCommunityAnnounce?: boolean
    linkedParent?: string
    joinApprovalMode?: boolean
}

export interface LinkedGroup {
    id?: string
    subject: string
    creation?: number
    owner?: string
    size?: number
}

export interface CommunityLinkedGroups {
    communityJid: string
    isCommunity: boolean
    linkedGroups: LinkedGroup[]
}

export declare const makeCommunitiesSocket: (config: SocketConfig) => {
    communityMetadata: (jid: string) => Promise<CommunityMetadata>
    communityCreate: (subject: string, body?: string) => Promise<GroupMetadata | null>
    communityCreateGroup: (subject: string, participants: string[], parentCommunityJid: string) => Promise<GroupMetadata | null>
    communityLeave: (id: string) => Promise<void>
    communityUpdateSubject: (jid: string, subject: string) => Promise<void>
    communityLinkGroup: (groupJid: string, parentCommunityJid: string) => Promise<void>
    communityUnlinkGroup: (groupJid: string, parentCommunityJid: string) => Promise<void>
    communityFetchLinkedGroups: (jid: string) => Promise<CommunityLinkedGroups>
    communityRequestParticipantsList: (jid: string) => Promise<{ [key: string]: string }[]>
    communityRequestParticipantsUpdate: (jid: string, participants: string[], action: 'approve' | 'reject') => Promise<{ status: string, jid: string }[]>
    communityParticipantsUpdate: (jid: string, participants: string[], action: ParticipantAction) => Promise<{ status: string, jid: string, content: BinaryNode }[]>
    communityUpdateDescription: (jid: string, description?: string) => Promise<void>
    communityInviteCode: (jid: string) => Promise<string | undefined>
    communityRevokeInvite: (jid: string) => Promise<string | undefined>
    communityAcceptInvite: (code: string) => Promise<string | undefined>
    /**
     * revoke a v4 invite for someone
     * @param communityJid community jid
     * @param invitedJid jid of person you invited
     * @returns true if successful
     */
    communityRevokeInviteV4: (communityJid: string, invitedJid: string) => Promise<boolean>
    /**
     * accept a CommunityInviteMessage
     * @param key the key of the invite message, or optionally only provide the jid of the person who sent the invite
     * @param inviteMessage the message to accept
     */
    communityAcceptInviteV4: (key: string | proto.IMessageKey, inviteMessage: proto.Message.IGroupInviteMessage) => Promise<string>
    communityGetInviteInfo: (code: string) => Promise<CommunityMetadata>
    communityToggleEphemeral: (jid: string, ephemeralExpiration?: number) => Promise<void>
    communitySettingUpdate: (jid: string, setting: 'locked' | 'announcement' | 'not_announcement' | 'unlocked') => Promise<void>
    communityMemberAddMode: (jid: string, mode: 'admin_add' | 'all_member_add') => Promise<void>
    communityJoinApprovalMode: (jid: string, mode: 'on' | 'off') => Promise<void>
    communityFetchAllParticipating: () => Promise<{ [_: string]: CommunityMetadata }>
    processingMutex: {
        mutex<T>(code: () => T | Promise<T>): Promise<T>
    }
    subscribeNewsletterUpdates: (jid: string) => Promise<{
        duration: string;
    }>;
    newsletterReactionMode: (jid: string, mode: NewsletterReactionMode) => Promise<void>;
    newsletterUpdateDescription: (jid: string, description?: string) => Promise<void>;
    newsletterUpdateName: (jid: string, name: string) => Promise<void>;
    newsletterUpdatePicture: (jid: string, content: WAMediaUpload) => Promise<void>;
    newsletterRemovePicture: (jid: string) => Promise<void>;
    newsletterUnfollow: (jid: string) => Promise<void>;
    newsletterFollow: (jid: string) => Promise<void>;
    newsletterUnmute: (jid: string) => Promise<void>;
    newsletterMute: (jid: string) => Promise<void>;
    newsletterAction: (jid: string, type: 'follow' | 'unfollow' | 'mute' | 'unmute') => Promise<void>;
    newsletterCreate: (name: string, description: string, reaction_codes: string) => Promise<NewsletterMetadata>;
    newsletterMetadata: (type: 'invite' | 'jid', key: string, role?: NewsletterViewRole) => Promise<NewsletterMetadata>;
    newsletterAdminCount: (jid: string) => Promise<number>;
    /**user is Lid, not Jid */
    newsletterChangeOwner: (jid: string, user: string) => Promise<void>;
    /**user is Lid, not Jid */
    newsletterDemote: (jid: string, user: string) => Promise<void>;
    newsletterDelete: (jid: string) => Promise<void>;
    /**if code wasn't passed, the reaction will be removed (if is reacted) */
    newsletterReactMessage: (jid: string, serverId: string, code?: string) => Promise<void>;
    newsletterFetchMessages: (type: 'invite' | 'jid', key: string, count: number, after?: number) => Promise<NewsletterFetchedUpdate[]>;
    newsletterFetchUpdates: (jid: string, count: number, after?: number, since?: number) => Promise<NewsletterFetchedUpdate[]>;
    groupMetadata: (jid: string) => Promise<import("../Types").GroupMetadata>;
    groupCreate: (subject: string, participants: string[]) => Promise<import("../Types").GroupMetadata>;
    groupLeave: (id: string) => Promise<void>;
    groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
    groupRequestParticipantsList: (jid: string) => Promise<{
        [key: string]: string;
    }[]>;
    groupRequestParticipantsUpdate: (jid: string, participants: string[], action: "reject" | "approve") => Promise<{
        status: string;
        jid: string;
    }[]>;
    groupParticipantsUpdate: (jid: string, participants: string[], action: import("../Types").ParticipantAction) => Promise<{
        status: string;
        jid: string;
        content: BinaryNode;
    }[]>;
    groupUpdateDescription: (jid: string, description?: string | undefined) => Promise<void>;
    groupInviteCode: (jid: string) => Promise<string | undefined>;
    groupRevokeInvite: (jid: string) => Promise<string | undefined>;
    groupAcceptInvite: (code: string) => Promise<string | undefined>;
    groupAcceptInviteV4: (key: string | import("../Types").WAProto.IMessageKey, inviteMessage: import("../Types").WAProto.Message.IGroupInviteMessage) => Promise<string>;
    groupGetInviteInfo: (code: string) => Promise<import("../Types").GroupMetadata>;
    groupToggleEphemeral: (jid: string, ephemeralExpiration: number) => Promise<void>;
    groupSettingUpdate: (jid: string, setting: "announcement" | "locked" | "not_announcement" | "unlocked") => Promise<void>;
    groupMemberAddMode: (jid: string, mode: "all_member_add" | "admin_add") => Promise<void>;
    groupJoinApprovalMode: (jid: string, mode: "on" | "off") => Promise<void>;
    groupFetchAllParticipating: () => Promise<{
        [_: string]: import("../Types").GroupMetadata;
    }>;
    fetchPrivacySettings: (force?: boolean) => Promise<{ [_: string]: string }>
    upsertMessage: (msg: proto.IWebMessageInfo, type: import('../Types').MessageUpsertType) => Promise<void>
    appPatch: (patchCreate: import('../Types').WAPatchCreate) => Promise<void>
    sendPresenceUpdate: (type: import('../Types').WAPresence, toJid?: string) => Promise<void>
    presenceSubscribe: (toJid: string, tcToken?: Buffer) => Promise<void>
    profilePictureUrl: (jid: string, type?: 'image' | 'preview', timeoutMs?: number) => Promise<string | undefined>
    onWhatsApp: (...jids: string[]) => Promise<{ jid: string, exists: unknown, lid: unknown }[] | undefined>
    fetchBlocklist: () => Promise<string[]>
    fetchStatus: (jid: string) => Promise<{ status: string | undefined, setAt: Date } | undefined>
    updateProfilePicture: (jid: string, content: import('../Types').WAMediaUpload) => Promise<void>
    removeProfilePicture: (jid: string) => Promise<void>
    updateProfileStatus: (status: string) => Promise<void>
    updateProfileName: (name: string) => Promise<void>
    updateBlockStatus: (jid: string, action: 'block' | 'unblock') => Promise<void>
    updateLastSeenPrivacy: (value: import('../Types').WAPrivacyValue) => Promise<void>
    updateOnlinePrivacy: (value: import('../Types').WAPrivacyOnlineValue) => Promise<void>
    updateProfilePicturePrivacy: (value: import('../Types').WAPrivacyValue) => Promise<void>
    updateStatusPrivacy: (value: import('../Types').WAPrivacyValue) => Promise<void>
    updateReadReceiptsPrivacy: (value: import('../Types').WAReadReceiptsValue) => Promise<void>
    updateGroupsAddPrivacy: (value: import('../Types').WAPrivacyValue) => Promise<void>
    updateDefaultDisappearingMode: (duration: number) => Promise<void>
    getBusinessProfile: (jid: string) => Promise<void | import('../Types').WABusinessProfile>
    resyncAppState: (collections: readonly ('critical_block' | 'critical_unblock_low' | 'regular_high' | 'regular_low' | 'regular')[], isInitialSync: boolean) => Promise<void>
    chatModify: (mod: import('../Types').ChatModification, jid: string) => Promise<void>
    cleanDirtyBits: (type: 'account_sync' | 'groups', fromTimestamp?: string | number) => Promise<void>
    addChatLabel: (jid: string, labelId: string) => Promise<void>
    removeChatLabel: (jid: string, labelId: string) => Promise<void>
    addMessageLabel: (jid: string, messageId: string, labelId: string) => Promise<void>
    removeMessageLabel: (jid: string, messageId: string, labelId: string) => Promise<void>
    star: (jid: string, messages: { id: string, fromMe?: boolean }[], star: boolean) => Promise<void>
    type: 'md'
    ws: any
    ev: import('../Types').BaileysEventEmitter & {
        process(handler: (events: Partial<import('../Types').BaileysEventMap>) => void | Promise<void>): () => void
        buffer(): void
        createBufferedFunction<A extends any[], T>(work: (...args: A) => Promise<T>): (...args: A) => Promise<T>
        flush(force?: boolean): boolean
        isBuffering(): boolean
    }
    authState: {
        creds: import('../Types').AuthenticationCreds
        keys: import('../Types').SignalKeyStoreWithTransaction
    }
    signalRepository: import('../Types').SignalRepository
    user: import('../Types').Contact | undefined
    generateMessageTag: () => string
    query: (node: BinaryNode, timeoutMs?: number) => Promise<BinaryNode>
    waitForMessage: <T>(msgId: string, timeoutMs?: number) => Promise<T>
    waitForSocketOpen: () => Promise<void>
    sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>
    sendNode: (frame: BinaryNode) => Promise<void>
    logout: (msg?: string) => Promise<void>
    end: (error: Error | undefined) => void
    onUnexpectedError: (err: Error | import('@hapi/boom').Boom, msg: string) => void
    uploadPreKeys: (count?: number) => Promise<void>
    uploadPreKeysToServerIfRequired: () => Promise<void>
    requestPairingCode: (phoneNumber: string) => Promise<string>
    waitForConnectionUpdate: (check: (u: Partial<import('../Types').ConnectionState>) => boolean | undefined, timeoutMs?: number) => Promise<void>
    sendWAMBuffer: (wamBuffer: Buffer) => Promise<BinaryNode>
}

export declare const extractCommunityMetadata: (result: BinaryNode) => CommunityMetadata