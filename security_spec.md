# Security Specification for Gokul Krisnan Portfolio

## 1. Data Invariants
- Only `krishnan989756@gmail.com` can create, update, or delete `projects`, `certificates`, and `siteSettings`.
- Any authenticated user can read `projects`, `certificates`, and `siteSettings`.
- Any user (authenticated or guest) can create a `guestbookMessage`, but they cannot update or delete it.
- Admin can read, update, and delete all guestbook messages.
- Guestbook messages must have a valid `userName`, `message`, and `timestamp`.

## 2. The "Dirty Dozen" Payloads
1. **Admin Spoofing**: A non-admin user trying to update `settings/global`.
2. **Schema Break**: Creating a project without a `title`.
3. **Identity Poisoning**: Trying to set `order` to a 1MB string.
4. **Guestbook Spam**: Creating a guestbook message with a 100KB message string.
5. **Orphaned Writes**: Creating a guestbook message with a fake userId that doesn't exist.
6. **Immutable Field Attack**: Trying to change `createdAt` on an existing project.
7. **Shadow Field injection**: Adding `isVerified: true` to a project document.
8. **Unauthorized Deletion**: Non-admin trying to delete a project.
9. **Query Scrape**: Trying to list guestbook messages without being the admin (if restricted).
10. **Timestamp Fraud**: Providing a client-side timestamp instead of `request.time`.
11. **Massive ID injection**: Using a 2KB string as a document ID.
12. **Status Shortcutting**: (N/A for this app, but let's say skipping an approval step if it existed).

## 3. Test Runner
A `firestore.rules.test.ts` will be implemented using the Firebase Emulator suite patterns (simulated here).
