declare module "@pdf-highlight/react-pdf-highlight" {
  import { Component, CSSProperties } from "react";
  type Props = {
    url?: string;
    width?: number | string;
    scale?: number;
    page?: number;
    pageSearch?: number;
    onLoaded?: (error?: any) => void;
    onStartLoad?: (error?: any) => void;
    keywords?: string[];
    colorHighlight?: string;
    isBorderHighlight?: boolean;
    styleWrap?: CSSProperties;
    debug?: boolean;
    allowHtml?: boolean;
    extractLetterSpacing?: number;
    specialWordRemoves?: string[];
  };

  export class PDFHighlight extends Component<Props> {}
}
