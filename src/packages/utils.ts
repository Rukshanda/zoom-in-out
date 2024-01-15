export const clsx = (...args: any[]) => {
  let className = "";
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === "string" && args[i]?.trim()) {
      className += ` ${args[i]}`;
    }
  }
  return className.trim();
};
