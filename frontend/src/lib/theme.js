const GUEST_THEME_KEY = "hireloop-theme";

export const userThemeKey = (userId) => `hireloop-theme:${userId}`;

export const getStoredTheme = (userId = null) => {
  if (userId) {
    const saved = localStorage.getItem(userThemeKey(userId));
    if (saved === "light" || saved === "dark") return saved;
  }

  const guest = localStorage.getItem(GUEST_THEME_KEY);
  if (guest === "light" || guest === "dark") return guest;

  return "light";
};

export const saveTheme = (theme, userId = null) => {
  localStorage.setItem(GUEST_THEME_KEY, theme);
  if (userId) {
    localStorage.setItem(userThemeKey(userId), theme);
  }
};

export const applyThemeClass = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const readInitialTheme = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user?._id) {
        return getStoredTheme(user._id);
      }
    }
  } catch {
    // ignore parse errors
  }
  return getStoredTheme();
};
