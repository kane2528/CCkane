export const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem(key);
      if (savedValue !== null && savedValue !== "undefined") {
        try {
          setSelf(JSON.parse(savedValue));
        } catch (error) {
          console.error(
            "Error parsing localStorage value for key:",
            key,
            error
          );
        }
      }

      onSet((newValue, _, isReset) => {
        if (isReset) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(newValue));
        }
      });
    }
  };
