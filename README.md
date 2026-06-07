# MobiTrack Firebase Shared Mode

This version uses Firebase Firestore so every user shares the same products, sales, purchases, branches, and users.

## Firebase Setup

1. Create a Firebase project.
2. Enable Cloud Firestore.
3. Open the Firebase project settings and copy your Web app `firebaseConfig`.
4. Paste the values into `FIREBASE_CONFIG` near the top of `index.html`.
5. Open `index.html` and sign in.

For quick testing, Firestore rules can be:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mobitrackStores/{storeId} {
      allow read, write: if true;
    }
  }
}
```

Those rules are open for convenience. For a real shop, add Firebase Authentication and stricter rules.

## Demo Logins

- `admin` / `admin123`
- `kochi` / `branch123`
- `thrissur` / `branch123`
- `kozhikode` / `branch123`
