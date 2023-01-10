# React Slick Slider

```js
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
};
```

# Example

```js
import { Slick } from "@slick-slider/slick";
import { useState } from "react";

const images = [
  {
    url: 'url1',
  },
  {
    url: 'url2',
  },
];

function App() {
  return (
    <div style={{ width: "100%", height: "100%", margin: "auto" }}>
      <Slick
        keyExtractor={(image) => image.url}
        urlExtractor={(image) => image.url}
        onClick={(image) => {
          console.log('image', image)
        }}
        images={images}
        aspectRatio="375 / 196"
        durationAnimation={500}
        durationAutoPlay={4000}
      />
    </div>
  );
}

export default App;

```
