# Splash Screen Setup Guide

## Overview
The splash screen displays while your app is loading, providing a professional first impression matching your web app's design.

## Image Requirements

### Specifications
- **File name**: `splash.png`
- **Location**: `/apps/mobile/assets/splash.png`
- **Dimensions**: 1284 x 2778 pixels (iPhone 14 Pro Max size)
- **Format**: PNG with transparency support
- **Background**: White (#ffffff)

### Design Guidelines

The splash screen should feature:

1. **Background**: Pure white (#ffffff)
2. **Logo**: OneTool logo centered (use `/apps/web/public/OneTool.png` as reference)
3. **Text Content** (centered below logo):
   - **Main headline**: "OneTool"
   - **Tagline**: "Simplify your growing business"
   
### Layout Structure

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│          [OneTool Logo]         │ ← Center vertically
│                                 │
│           OneTool               │ ← Font: Outfit Bold, 32pt
│                                 │
│    Simplify your growing        │ ← Font: Outfit Regular, 16pt
│          business               │    Color: #6b7280 (muted)
│                                 │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

## Creating the Splash Screen

### Option 1: Using Figma/Sketch/Adobe XD
1. Create a new artboard: 1284 x 2778 pixels
2. Set background to white (#ffffff)
3. Import the OneTool logo from `/apps/web/public/OneTool.png`
4. Center the logo vertically and horizontally
5. Add text below:
   - "OneTool" (Outfit Bold, 32pt, #1f2937)
   - "Simplify your growing business" (Outfit Regular, 16pt, #6b7280)
6. Export as PNG @ 1x

### Option 2: Using Canva (Free)
1. Create custom size: 1284 x 2778 pixels
2. Set background to white
3. Upload and center the OneTool logo
4. Add text elements with the specified content
5. Download as PNG

### Option 3: Using an Online Tool
Use [Expo Splash Screen Generator](https://buildship.dev/splash-screen-generator) or similar tools

## Installing Dependencies

After creating the splash screen image, install the required packages:

```bash
cd apps/mobile
pnpm install
```

This will install:
- `expo-splash-screen`: Manages splash screen display
- `expo-font`: Handles custom font loading  
- `@expo/google-fonts/outfit`: Outfit font family (matching web app)

## How It Works

1. **App Launch**: The splash screen displays immediately
2. **Font Loading**: App loads the Outfit font family (same as web)
3. **Authentication Check**: Clerk verifies user session
4. **Transition**: Once ready, the splash screen fades out and routes to:
   - Sign-in page (if not authenticated)
   - Home tab (if authenticated)

## Configuration

The splash screen is configured in `app.json`:

\`\`\`json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
\`\`\`

## Testing

To test your splash screen:

1. Run the app: `pnpm dev`
2. Reload the app (shake device → "Reload" or press `r` in terminal)
3. The splash screen should display for 1-2 seconds while fonts load

## Tips

- Keep the design simple and clean
- Ensure logo is high-resolution (use 2x or 3x assets)
- Match colors exactly to web app for brand consistency
- Test on both light and dark device backgrounds
- The splash screen auto-hides once fonts are loaded

## Colors Reference (from Web App)

- **Background**: `#ffffff` (pure white)
- **Primary Text**: `#1f2937` (gray-900)
- **Muted Text**: `#6b7280` (gray-500)
- **Primary Brand**: `rgb(0, 166, 244)` (blue)

## Need Help?

If you need assistance creating the splash screen image, you can:
1. Use the existing web assets as reference
2. Extract the logo from `/apps/web/public/OneTool.png`
3. Match the typography with Outfit font (installed via Google Fonts)

