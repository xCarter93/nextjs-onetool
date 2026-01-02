# Environment Variables Setup for Mobile App

## Good News! 🎉

You already have a `.env.local` file with your Convex and Clerk variables. However, Expo needs the environment variables to be named with the `EXPO_PUBLIC_` prefix to be accessible in your app.

## How Expo Environment Variables Work

Expo automatically loads environment variables from `.env.local`, but they must:

1. Start with `EXPO_PUBLIC_` to be available in your JavaScript code
2. Be present when you start the dev server

## Quick Fix

Your `.env.local` file should have variables like this:

```bash
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Convex Backend
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

## If Your Variables Are Named Differently

If your `.env.local` currently has variables like:

```bash
CLERK_PUBLISHABLE_KEY=...
CONVEX_URL=...
```

You need to rename them to:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=...
EXPO_PUBLIC_CONVEX_URL=...
```

The `EXPO_PUBLIC_` prefix is required for Expo to make them available in your app code.

## After Updating

1. **Stop your dev server** (Ctrl+C in the terminal)
2. **Clear the cache and restart:**
   ```bash
   cd apps/mobile
   pnpm dev
   # or
   npm run dev
   ```

## Verify It's Working

After restarting, your app should:

- ✅ Successfully authenticate with Clerk
- ✅ Load your 9 clients from Convex
- ✅ Display all your data properly

## Troubleshooting

### Still not loading data?

1. **Check the terminal output** when starting the dev server - it should show no errors about missing environment variables

2. **Verify the variables are correct:**
   - Open your web app's `.env.local` file
   - Copy the same Convex URL and Clerk key
   - Make sure they have the `EXPO_PUBLIC_` prefix in the mobile `.env.local`

3. **Clear everything and restart:**
   ```bash
   cd apps/mobile
   rm -rf .expo node_modules
   pnpm install
   pnpm dev
   ```

### Environment variables not being read?

The issue might be that `.env.local` is in `.gitignore` (which is correct for security), but make sure:

- The file exists: `ls -la apps/mobile/.env.local`
- It has the right permissions: `chmod 600 apps/mobile/.env.local`

## Alternative: Use .env Instead

If you prefer, you can also use a plain `.env` file instead of `.env.local`:

```bash
cd apps/mobile
mv .env.local .env
```

Both work the same way with Expo, but `.env.local` is typically preferred to keep it separate from committed configuration.

## Security Note

Both `.env` and `.env.local` are in your `.gitignore`, which is correct. Never commit these files to version control as they contain sensitive API keys.
