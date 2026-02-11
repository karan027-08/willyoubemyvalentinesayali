# 💕 Valentine's Day Website

A beautiful, interactive, single-page Valentine's Day proposal website built with vanilla HTML, CSS, and JavaScript. Features a playful "Will You Be My Valentine?" interface with an evasive NO button, customizable messages, photo galleries, particle effects, and a polished dark romantic aesthetic.

## ✨ Features

- **Romantic Landing Page** - Cinematic entry animation with letter-reveal effect
- **Playful NO Button** - Evades clicks with spring animations and progressive teasing
- **Confetti Celebration** - Particle burst animation when YES is clicked
- **Photo Gallery** - Lightbox with navigation for cherished memories
- **Customization Modal** - Personalize names, messages, photos, and music
- **Background Music** - Optional audio with autoplay fallback
- **E-Card Download** - Generate and download a personalized Valentine's card
- **Theme Toggle** - Switch between dark and light modes
- **Fully Responsive** - Mobile-first design that works on all devices
- **Accessible** - WCAG 2.1 AA compliant with keyboard navigation
- **No Dependencies** - Pure vanilla JavaScript, no frameworks needed

## 🚀 Quick Start

1. **Download the files**
   - `index.html`
   - `style.css`
   - `script.js`

2. **Open `index.html` in your browser**
   - Double-click the file, or
   - Right-click → Open with → Your browser

3. **Customize your content** (see below)

## 🎨 Customization Guide

### Method 1: Using the Settings Modal (Easiest)

1. Open the website in your browser
2. Click the ⚙️ settings icon in the top-right corner
3. Fill in the personalization fields:
   - **Their Name** - Your Valentine's name
   - **Your Name** - Your name
   - **Special Place** - A meaningful location
   - **Special Date** - An important date
   - **Favorite Memory** - A cherished memory
4. Customize messages and theme tone
5. Add your own photos (click "Add Photo")
6. Upload background music (optional)
7. Click "Save Changes"

### Method 2: Editing the Code

Open `script.js` and find the `StateManager.config` object (around line 15):

```javascript
config: {
  personalization: {
    lover_name: 'My Valentine',  // ← Change this
    your_name: 'Me',             // ← Change this
    special_place: 'our favorite spot',
    date: '2024-02-14',
    memory: 'that perfect day'
  },
  // ... more settings
}
```

### Customizing Messages

**Landing Subtitle**
```javascript
messages: {
  subhead: 'Because every day with you feels like February 14th',  // ← Change this
```

**NO Button Teases**
```javascript
noButtonTeases: [
  'Are you sure? 🥺',
  'Think again... 💭',
  // Add more teasing messages here
],
```

**YES Success Messages**

Choose a tone (cute, dramatic, or poetic) and customize:

```javascript
yesMessages: {
  cute: [
    'You\'re my favorite notification 💕',
    // Add more cute messages
  ],
  dramatic: [
    'In a world of billions, my heart chose you 🌍',
    // Add more dramatic messages
  ],
  poetic: [
    'You are the reason I believe in serendipity ✨',
    // Add more poetic messages
  ]
}
```

### Adding Your Photos

**Option 1: Use the Settings Modal**
1. Click ⚙️ settings
2. Scroll to "Photos" section
3. Click "Add Photo" and select your image
4. Add a caption
5. Save changes

**Option 2: Edit the Code**

Replace the placeholder URLs in `script.js`:

```javascript
photos: [
  { 
    url: 'path/to/your/photo1.jpg',  // ← Your photo path
    caption: 'Our first date at {{special_place}}',
    alt: 'Romantic couple moment'
  },
  // Add more photos...
]
```

**Photo Tips:**
- Recommended size: 500-1000px width
- Supported formats: JPG, PNG, GIF, WebP
- Max file size: 5MB per photo
- Use 3-6 photos for best results

### Adding Background Music

**Option 1: Use the Settings Modal**
1. Click ⚙️ settings
2. Scroll to "Background Music"
3. Click "Choose File" and select your audio
4. Check "Enable background music"
5. Save changes

**Option 2: Add Audio File**

1. Place your audio file in the same folder as `index.html`
2. Edit `script.js`:

```javascript
audio: {
  url: 'your-music.mp3',  // ← Your audio file name
  enabled: true,
  volume: 0.5
}
```

**Audio Tips:**
- Supported formats: MP3, WAV, OGG
- Max file size: 10MB
- Recommended: Soft romantic instrumental music
- Keep volume moderate (0.3-0.5)

## 🌐 Hosting Your Website

### GitHub Pages (Free)

1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository (e.g., "valentine-proposal")
3. Upload your files (`index.html`, `style.css`, `script.js`, photos, audio)
4. Go to Settings → Pages
5. Select "main" branch and click Save
6. Your site will be live at `https://yourusername.github.io/valentine-proposal`

### Netlify (Free)

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your site is live instantly!
4. Get a custom URL like `your-valentine.netlify.app`

### Vercel (Free)

1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository or upload files
3. Deploy with one click
4. Get a URL like `valentine.vercel.app`

### Custom Domain (Optional)

After hosting on any platform above:
1. Purchase a domain (e.g., `willyoubemyvalentine.com`)
2. Follow your hosting provider's instructions to connect it
3. Usually involves updating DNS settings

## 🎯 Using Placeholders

The website supports dynamic placeholders that get replaced with your personalized values:

- `{{lover_name}}` - Their name
- `{{your_name}}` - Your name
- `{{special_place}}` - Your special place
- `{{date}}` - Your special date
- `{{memory}}` - Your favorite memory

**Example:**
```
"Remember {{memory}} at {{special_place}}? That's when I knew {{lover_name}} was the one."
```

Becomes:
```
"Remember that perfect day at the beach? That's when I knew Sarah was the one."
```

## 🎨 Theme Customization

### Changing Colors

Edit CSS variables in `style.css`:

```css
:root {
  --color-primary: #ff2d55;      /* Main pink-red */
  --color-secondary: #e63946;    /* Deep red */
  --color-dark: #1f1b2e;         /* Dark purple */
  --color-accent: #ffd700;       /* Gold accent */
}
```

### Changing Fonts

Replace the Google Fonts import in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

Then update CSS variables:

```css
--font-heading: 'Your Heading Font', serif;
--font-body: 'Your Body Font', sans-serif;
```

## 🔧 Troubleshooting

### Photos Not Loading
- Check file paths are correct
- Ensure photos are in the same folder or use full URLs
- Verify image formats (JPG, PNG, GIF, WebP)

### Audio Not Playing
- Some browsers block autoplay - user must interact first
- Check audio file format (MP3, WAV, OGG)
- Ensure file size is under 10MB

### Settings Not Saving
- Check browser allows localStorage
- Try a different browser
- Clear browser cache and reload

### NO Button Not Moving
- Ensure JavaScript is enabled
- Check browser console for errors (F12)
- Try a modern browser (Chrome, Firefox, Safari, Edge)

### Animations Not Smooth
- Close other browser tabs
- Check if "Reduce Motion" is enabled in OS settings
- Try a device with better performance

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

## ♿ Accessibility

This website is built with accessibility in mind:

- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- High contrast mode support
- Focus indicators on all interactive elements
- Respects "prefers-reduced-motion" setting

**Keyboard Shortcuts:**
- `Tab` - Navigate between elements
- `Enter/Space` - Activate buttons
- `Esc` - Close modals/lightbox
- `Arrow Keys` - Navigate photos in lightbox

## 📄 File Structure

```
valentine-website/
├── index.html          # Main HTML structure
├── style.css           # All styles and animations
├── script.js           # All JavaScript functionality
├── README.md           # This file
└── assets/             # (Optional) Your photos and audio
    ├── photos/
    │   ├── photo1.jpg
    │   └── photo2.jpg
    └── music.mp3
```

## 💡 Tips for the Perfect Proposal

1. **Test Everything** - Open the site and click through all features
2. **Personalize Deeply** - Use specific memories and inside jokes
3. **Choose Photos Carefully** - Pick meaningful moments together
4. **Select the Right Music** - Choose a song that's special to both of you
5. **Set the Mood** - Share the link at the right moment
6. **Have a Backup** - Save the link and test on their device type
7. **Be Present** - Be there when they open it (if possible)

## 🎉 After They Say YES

The website includes:
- Confetti celebration animation
- Personalized success messages
- Photo gallery of your memories
- Downloadable e-card to commemorate the moment

## 📝 License

This project is free to use for personal purposes. Feel free to customize and share!

## 💖 Credits

Built with love using:
- Vanilla JavaScript (no frameworks!)
- Google Fonts (Playfair Display & Inter)
- Unsplash (placeholder photos)
- Pure CSS animations

---

**Made with ❤️ for your special someone**

*Remember: The best Valentine's Day gift is your genuine love and effort. This website is just a creative way to express it!*
