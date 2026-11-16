javascript
export const THEMES = [
  { key: "classic", label: "Classic", dot: "#C9A44C", page: "#0B0B0C" },
  { key: "isoka", label: "Isoka", dot: "#FFD700", page: "#0A0908" },
  { key: "luxury", label: "Luxury", dot: "#1B4332", page: "#F3EFE6" },
  { key: "startup", label: "Startup", dot: "#4F46E5", page: "#F5F7FB" },
  { key: "warm", label: "Warm", dot: "#C2410C", page: "#F6EEE3" },
  { key: "dark", label: "Dark", dot: "#5B8DEF", page: "#0E0F12" },
];

export const getTheme = () => {
  try {
    const t = localStorage.getItem("theme");
    return THEMES.some(x => x.key === t) ? t : "isoka";
  } catch {
    return "isoka";
  }
};

export const setTheme = (key) => {
  localStorage.setItem("theme", key);
};

export const getThemeColors = (themeKey) => {
  const theme = THEMES.find(t => t.key === themeKey);
  return theme || THEMES[0];
};
```

**Save it.** ✅

---

## **Step 2: Create theme.css**

In `frontend/src/` folder, create file: `theme.css`

Copy this code:

```css
[data-theme="isoka"] {
  --bg: #0A0908;
  --panel: #17110A;
  --text: #FFF8E1;
  --muted: #C9B78A;
  --border: #C9A44C;
  --accent: #FFD700;
  --accent-text: #0A0908;
  --bubble-ai: #1D1608;
  --bubble-user: #FFD700;
  --bubble-user-text: #0A0908;
  --dot: #FFD700;
}

[data-theme="classic"] {
  --bg: #0B0B0C;
  --panel: #1a1a1c;
  --text: #E0E0E0;
  --muted: #999;
  --border: #C9A44C;
  --accent: #C9A44C;
  --accent-text: #0B0B0C;
  --bubble-ai: #2a2a2c;
  --bubble-user: #C9A44C;
  --bubble-user-text: #0B0B0C;
  --dot: #C9A44C;
}

[data-theme="luxury"] {
  --bg: #F3EFE6;
  --panel: #FFFFFF;
  --text: #1B4332;
  --muted: #666;
  --border: #1B4332;
  --accent: #1B4332;
  --accent-text: #F3EFE6;
  --bubble-ai: #F0F0F0;
  --bubble-user: #1B4332;
  --bubble-user-text: #FFFFFF;
  --dot: #1B4332;
}

[data-theme="startup"] {
  --bg: #F5F7FB;
  --panel: #FFFFFF;
  --text: #1F2937;
  --muted: #9CA3AF;
  --border: #E5E7EB;
  --accent: #4F46E5;
  --accent-text: #FFFFFF;
  --bubble-ai: #F3F4F6;
  --bubble-user: #4F46E5;
  --bubble-user-text: #FFFFFF;
  --dot: #4F46E5;
}

[data-theme="warm"] {
  --bg: #F6EEE3;
  --panel: #FFFFFF;
  --text: #5E3D2A;
  --muted: #8B6F47;
  --border: #C2410C;
  --accent: #C2410C;
  --accent-text: #FFFFFF;
  --bubble-ai: #F5F1EC;
  --bubble-user: #C2410C;
  --bubble-user-text: #FFFFFF;
  --dot: #C2410C;
}

[data-theme="dark"] {
  --bg: #0E


