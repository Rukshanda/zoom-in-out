export function addPrototypeHTMLElement(callback?: () => void) {
  HTMLElement.prototype.addClass = function (className: string) {
    if (!this.className.includes(className)) {
      this.className += ` ${className}`;
    }
  };
  HTMLElement.prototype.removeClass = function (className: string) {
    if (this.className.includes(className)) {
      this.className = this.className
        .replace(className, "")
        .replace(/ {2}/g, " ")
        .trim();
    }
  };
  HTMLElement.prototype.toggleClass = function (className: string) {
    if (this.className.includes(className)) {
      this.className = this.className.replace(className, "").trim();
    } else this.className += ` ${className}`;
  };
  HTMLElement.prototype.addCss = function (property: string, value: string) {
    this.style.setProperty(property, value);
  };
  callback?.();
}
