declare module "@slick-slider/slick" {
  import { CSSProperties, Component } from "react";
  type SlickProps<T> = {
    images: T[];
    onClick?: (image: T) => void;
    urlExtractor: (image: T) => string;
    keyExtractor?: (image: T) => string;
    styleImg?: CSSProperties;
    aspectRatio?: string;
    durationAnimation?: number;
    durationAutoPlay?: number;
    dotStyle?: CSSProperties;
    loop?: boolean;
    dotColorActive?: string;
    dotColorInActive?: string;
  };
  export class Slick<T> extends Component<SlickProps<T>> {}
}
