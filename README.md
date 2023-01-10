# Scroll Inverted

```js
  type ScrollInvertedProps<T> = {
    classNameWrap?: string;
    className?: string;
    classNameContentContainer?: string;
    onScrollEnd?: () => void;
    onScroll?: (top: number) => void;
    initialScrollTop?: number;
    styleWrap?: CSSProperties;
    style?: CSSProperties;
    styleContentContainer?: CSSProperties;
    direction?: "rtl" | "ltr";
    onLayout?: (layout: { height: number; scrollHeight: number }) => void;
    onEndReachedThreshold?: number;
    onStartReachedThreshold?: number;
    onEndReached?: () => void;
    onStartReached?: () => void;
    data?: T[];
    renderItem: (
      {
        item,
        index,
      }: {
        item: T;
        index: number;
      },
      style: CSSProperties
    ) => JSX.Element | JSX.Element[] | ReactNode | null | undefined;
    keyExtractor?: (item: T, index: number) => string | number;
  };
```
