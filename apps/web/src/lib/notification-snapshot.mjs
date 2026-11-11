import { chatQuery, listNotifications } from "./chat-domain.mjs";

export async function notificationSnapshot(db, actor, expectedUserId, cursor = null, includeItems = false) {
  // The client identity is only a consistency check, never an authorization source.
  if (!actor?.userId || actor.userId !== expectedUserId) return null;
  if (!includeItems) return { unreadCount: await db.notification.count({ where: { userId: actor.userId, read: false } }) };
  const query = chatQuery(new URLSearchParams(cursor ? { cursor } : {}));
  return listNotifications(db, actor, query);
}
