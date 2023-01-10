import { Slick } from "@slick-slider/slick";
import "./index.css";

const images = [
  {
    link: "jackpot",
    sectionUrl: `https://images.microcms-assets.io/assets/063d03271a3c42ae8f0719591f75c697/3f53d9a5368942bc9c312729e8132f18/This%20weeks's%20jackpot.webp`,
  },
  {
    link: "announcements",
    sectionUrl: `https://images.microcms-assets.io/assets/063d03271a3c42ae8f0719591f75c697/6147431870fa490aad836722c099d4ca/Announcements.webp`,
  },
];

function App() {
  return (
    <div style={{ width: "100%", height: "100%", margin: "auto" }}>
      <Slick
        keyExtractor={(image) => image.sectionUrl}
        urlExtractor={(image) => image.sectionUrl}
        images={images}
        aspectRatio="375 / 196"
        durationAnimation={500}
        onClick={(image) => {
          console.log("asdsa", image);
        }}
      />
    </div>
  );
}

export default App;
