# Scroll Inverted

```js
type Props = {
  cdnPDFJS?: string,
  cdnWorkerPDFJS?: string,
  url?: string,
  width?: number | string,
  scale?: number,
  page?: number,
  pageSearch?: number,
  onLoaded?: (error?: any) => void,
  onStartLoad?: (error?: any) => void,
  keywords?: string[],
  colorHighlight?: string,
  isBorderHighlight?: boolean,
  styleWrap?: CSSProperties,
  debug?: boolean,
  allowHtml?: boolean,
};

import { PDFHighlight } from "@pdf-highlight/react-pdf-highlight";

function App() {
  return (
    <PDFHighlight
      onStartLoad={() => {
        console.log("start loading");
      }}
      onLoaded={() => {
        console.log("end loading");
      }}
      keywords={[
        `facilisis odio sed mi.\nCurabitur suscipit. Nullam vel nisi. Etiam semper ipsum ut lectus. Proin aliquam, erat eget\npharetra commodo, eros mi condimentum quam,`,
      ]}
      url="https://pdfobject.com/pdf/sample.pdf"
    />
  );
}

export default App;
```
