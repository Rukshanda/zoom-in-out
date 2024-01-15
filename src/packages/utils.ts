export const clsx = (...args: any[]) => {
  let className = "";
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === "string" && args[i]?.trim()) {
      className += ` ${args[i]}`;
    }
  }
  return className.trim();
};

export const chunkArray = (array: any[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
};

export const diffArray = (a1?: any[], a2?: any[]): boolean => {
  return !!a1?.filter((element) => !a2?.includes(element))?.length;
};

export const getTimeZone = () => {
  var offset = new Date().getTimezoneOffset(),
    o = Math.abs(offset);
  return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2);
};
