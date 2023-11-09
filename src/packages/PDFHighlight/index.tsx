import { Component, CSSProperties } from "react";

type Contents = {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
};

type Props = {
  cdnPDFJS?: string;
  cdnWorkerPDFJS?: string;
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
};

type ValueFindObject = {
  objects: Contents[];
  begin: number;
  endBegin: number;
  end: number;
};

const __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const DEFAULT_CDN_PDFJS =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.189/pdf.min.mjs";

const DEFAULT_CDN_WORKER =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.189/pdf.worker.mjs";

class PDFHighlight extends Component<Props> {
  private remove?: () => void;
  private pdf?: any;
  private refCanvasWrap?: HTMLDivElement | null;
  private removeResize?: () => void;
  private timeoutRender?: NodeJS.Timeout;

  componentDidMount(): void {
    const { onStartLoad } = this.props;
    onStartLoad?.();
    this.appendScript();
    window.addEventListener("resize", this.loadResize);
    this.removeResize = () => {
      window.removeEventListener("resize", this.loadResize);
    };
  }

  isObjectEqual = (obj1: any, obj2: any) => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== typeof obj2) return false;
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) {
      return false;
    }
    let isEqual = true;
    for (let key of obj1Keys) {
      if (obj1[key] !== obj2[key]) {
        isEqual = false;
        break;
      }
    }
    return isEqual;
  };

  isEqualKeyword = (keywords?: string[], keywords2?: string[]) => {
    if (keywords === keywords2) return true;
    if (keywords?.length !== keywords2?.length) return false;
    if (keywords2?.some((e) => !keywords?.includes(e))) return false;
    return true;
  };

  shouldComponentUpdate(nProps: Props): boolean {
    const {
      cdnPDFJS,
      cdnWorkerPDFJS,
      width,
      keywords,
      onStartLoad,
      styleWrap,
      debug,
      url,
    } = this.props;
    const keys: (keyof Props)[] = [
      "scale",
      "page",
      "pageSearch",
      "isBorderHighlight",
      "colorHighlight",
    ];
    if (
      cdnPDFJS !== nProps.cdnPDFJS ||
      cdnWorkerPDFJS !== nProps.cdnWorkerPDFJS
    ) {
      if (debug && __DEV__) {
        console.info("Reload CDN");
      }
      this.remove?.();
      this.appendScript(nProps);
    } else if (url !== nProps.url) {
      if (debug && __DEV__) {
        console.info(
          "Reload key change => ",
          keys.find((key) => this.props[key] !== nProps[key])
        );
      }
      onStartLoad?.();
      this.loadPDf(nProps).then(() => this.renderPage(nProps));
    } else if (
      !this.isEqualKeyword(nProps.keywords, keywords) ||
      !this.isObjectEqual(styleWrap, nProps.styleWrap) ||
      keys.some((key) => this.props[key] !== nProps[key])
    ) {
      if (debug && __DEV__) {
        console.info(
          "Reload keyword or style => ",
          "keyword ? ",
          this.isEqualKeyword(nProps.keywords, keywords),
          ", styleWrap ? ",
          this.isObjectEqual(styleWrap, nProps.styleWrap)
        );
      }
      onStartLoad?.();
      this.renderPage(nProps);
    }
    return width !== nProps.width;
  }

  componentWillUnmount(): void {
    this.remove?.();
    this.removeResize?.();
  }

  private appendScript = async (props = this.props) => {
    let head = document.querySelector("head");
    const { cdnPDFJS } = props;
    const cdn = cdnPDFJS || DEFAULT_CDN_PDFJS;
    if (!head) {
      head = document.createElement("head");
      document.querySelector("html")?.appendChild(head);
    }
    if (!head) return;
    if (document.querySelector(`script[src="${cdn}"]`)) {
      return this.pdfLoaded();
    }
    const script = document.createElement("script");
    script.src = cdn;
    script.type = "module";
    head.appendChild(script);
    script.onload = this.pdfLoaded;
    this.remove = () => head?.removeChild(script);
  };

  private pdfLoaded = async () => {
    try {
      this.initPdf();
      await this.loadPDf();
      this.renderPage();
    } catch {}
  };

  private loadResize = () => {
    if (this.timeoutRender) clearTimeout(this.timeoutRender);
    this.timeoutRender = setTimeout(async () => {
      const { debug } = this.props;
      if (debug && __DEV__) {
        console.info("Resize PDF");
      }
      const { onStartLoad } = this.props;
      onStartLoad?.();
      this.renderPage();
    }, 100);
  };

  private initPdf = () => {
    const { pdfjsLib } = window.globalThis as any;
    const { cdnWorkerPDFJS } = this.props;
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      cdnWorkerPDFJS || DEFAULT_CDN_WORKER;
  };

  private loadPDf = async (props = this.props) => {
    const { url } = props;
    if (!url) return;
    return new Promise((res, rej) => {
      const { pdfjsLib } = window.globalThis as any;
      const loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then((pdf: any) => this.setPdf(pdf, res)).catch(rej);
    });
  };

  private setPdf = (pdf: any, callback: (pdf: any) => void) => {
    if (this.pdf) this.pdf.destroy();
    this.pdf = pdf;
    callback(pdf);
  };

  private renderPage = async (props = this.props) => {
    if (!this.pdf) return;
    if (this.refCanvasWrap) this.refCanvasWrap.innerHTML = "";
    const { onLoaded, page } = props;
    try {
      if (page) {
        const pagePdf = await this.pdf.getPage(page);
        this.renderPdf(pagePdf, props, page);
      } else {
        const totalPages = this.pdf.numPages;
        for (let i = 1; i <= totalPages; i++) {
          const pagePdf = await this.pdf.getPage(i);
          await this.renderPdf(pagePdf, props, i);
        }
      }
      onLoaded?.();
    } catch {
      onLoaded?.();
    }
  };

  private renderPdf = async (
    pagePdf: any,
    props = this.props,
    page: number
  ) => {
    if (!this.refCanvasWrap) return;
    const { width } = this.refCanvasWrap.getBoundingClientRect();
    const { keywords = [], scale = 1, pageSearch, allowHtml } = props;

    const div = document.createElement("div");
    div.id = `wrap-canvas-page-${page}`;
    div.style.position = "relative";

    const id = `canvas-page-${page}`;
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.id = id;

    div.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let viewport = pagePdf.getViewport({ scale: 1 });
    const size = viewport;
    let newScale = Math.ceil(width / viewport.width);
    if (newScale < scale) {
      newScale = scale;
    }
    if (document.querySelector(`#${id}`)) {
      const promiseAll = keywords.map(async (keyword, index) => {
        if (keyword.length > 2000) {
          console.warn(
            "Keywords are too big: " + keyword.length + " characters"
          );
        }
        return this.hightlightText(
          pagePdf,
          keyword,
          (document.querySelector(`#${id}`) as HTMLCanvasElement).getContext(
            "2d"
          ) as CanvasRenderingContext2D,
          {
            ...size,
            scale: newScale,
          },
          props
        );
      });
      await Promise.all(promiseAll);
    }
    this.refCanvasWrap.appendChild(div);
    viewport = pagePdf.getViewport({ scale: newScale });
    if (allowHtml) {
      this.appendTextToCanvas(pagePdf, div, newScale, viewport.width / width);
    }
    canvas.style.width = `${width}px`;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderTask = await pagePdf.render({ canvasContext: ctx, viewport });
    if (pageSearch && pageSearch !== page) return;
    await renderTask.promise;
    const promiseAll = keywords.map(async (keyword, index) => {
      if (keyword.length > 2000) {
        console.warn("Keywords are too big: " + keyword.length + " characters");
      }
      return this.hightlightText(
        pagePdf,
        keyword,
        ctx,
        {
          ...size,
          scale: newScale,
        },
        props
      );
    });
    return Promise.all(promiseAll);
  };

  private appendTextToCanvas = async (
    pagePdf: any,
    parent: HTMLDivElement,
    scale: number,
    scaleReal: number
  ) => {
    const { items, styles } = await pagePdf.getTextContent();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const style = styles[item.fontName];
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.color = "transparent";
      div.style.fontFamily = style.fontFamily;
      div.style.fontSize = `${(item.transform[3] * scale) / scaleReal}px`;
      div.style.letterSpacing = `${0.3}px`;
      div.style.minWidth = `${(item.width * scale) / scaleReal}px`;
      div.style.left = `${(item.transform[4] * scale) / scaleReal}px`;
      div.style.bottom = `${(item.transform[5] * scale) / scaleReal}px`;
      div.innerHTML = item.str;
      parent.appendChild(div);
    }
  };

  private makeSpacing = (
    width: number,
    str: string,
    scale: number,
    ctx: any,
    spacing: number
  ): number => {
    const { extractLetterSpacing = 0.1 } = this.props;
    ctx.save();
    ctx.letterSpacing = `${spacing * scale}px`;
    const { width: w } = ctx.measureText(str);
    ctx.restore();
    if (
      Math.floor(w / scale) - 3 * scale <= Math.floor(width) &&
      Math.floor(w / scale) + 3 * scale >= Math.floor(width)
    ) {
      return spacing;
    }
    if (Math.floor(w / scale) > Math.floor(width)) {
      return this.makeSpacing(
        width,
        str,
        scale,
        ctx,
        spacing - extractLetterSpacing
      );
    }
    return this.makeSpacing(
      width,
      str,
      scale,
      ctx,
      spacing + extractLetterSpacing
    );
  };

  private hightlightText = async (
    pagePdf: any,
    keyword: string,
    ctx: CanvasRenderingContext2D,
    viewport: { width: number; height: number; scale: number },
    props = this.props
  ) => {
    if (!keyword) return;
    const { items, styles } = await pagePdf.getTextContent();
    const findObject = this.findObjects(items, keyword);
    const { objects, begin: indexBegin, end } = findObject;
    if (indexBegin < 0) return;
    if (!objects.length) return;

    const { colorHighlight = "yellow", isBorderHighlight } = props;

    let indexSub = indexBegin;
    objects.forEach((object, index) => {
      const str = object.str;
      const style = styles[object.fontName];
      ctx.save();
      ctx.beginPath();
      ctx.font = `${object.transform[3] * viewport.scale}px ${
        style.fontFamily
      }`;
      const spacing: number = this.makeSpacing(
        object.width,
        str,
        viewport.scale,
        ctx,
        0
      ) as number;
      (ctx as any).letterSpacing = `${spacing}px`;
      let w1 = 0;
      let w2 = 0;
      if (!index) {
        w1 = ctx.measureText(str.substring(0, indexSub)).width;
        w2 = ctx.measureText(
          str.substring(indexSub + keyword.length, str.length)
        ).width;
      } else if (index === objects.length - 1) {
        const textEnd = str.slice(end, str.length);
        w2 = ctx.measureText(textEnd).width;
      }
      const w = (object.width - (w1 + w2) / viewport.scale) * viewport.scale;
      const x = Math.floor(object.transform[4] + w1 / viewport.scale);
      if (isBorderHighlight) {
        ctx.strokeStyle = colorHighlight;
        ctx.lineWidth = 1;
      } else {
        ctx.fillStyle = colorHighlight;
        ctx.globalAlpha = 0.2;
      }
      const y =
        viewport.height -
        object.transform[5] -
        object.height +
        style.ascent -
        style.descent;

      if (!isBorderHighlight) {
        ctx.fillRect(
          x * viewport.scale - viewport.scale / 2,
          y * viewport.scale,
          w,
          object.height * viewport.scale
        );
      } else {
        ctx.strokeRect(
          x * viewport.scale - viewport.scale / 2,
          y * viewport.scale,
          w,
          object.height * viewport.scale
        );
      }
      ctx.closePath();
      ctx.restore();
      indexSub += str.length;
    });
    return;
  };

  private parseKeyword = (word: string) => {
    return word.replace(/ |\n/g, " ").trim();
  };

  private checkEndsWith = (
    keyword: string,
    string: string,
    i: number,
    iLast: number
  ): number => {
    if (i >= keyword.length) {
      if (string.includes(keyword)) return i;
      return iLast;
    }
    const key = keyword.substring(0, i).trim();
    if (!key || string.endsWith(key.trim())) {
      return this.checkEndsWith(keyword, string, i + 1, i);
    }
    return this.checkEndsWith(keyword, string, i + 1, iLast);
  };

  private checkStartsWith = (
    keyword: string,
    string: string,
    i: number,
    iLast: number
  ): number => {
    if (i >= keyword.length) {
      if (string.includes(keyword)) return i;
      return iLast;
    }
    const key = keyword.substring(0, i).trim();
    if (
      !key ||
      string.replaceAll(" ", "").startsWith(key.replaceAll(" ", ""))
    ) {
      return this.checkStartsWith(keyword, string, i + 1, i);
    }
    return this.checkStartsWith(keyword, string, i + 1, iLast);
  };

  private getIndexOfLast = (string: string, search: string) => {
    var largestIndex = -1;
    var currentIndex = string.indexOf(search);
    while (currentIndex !== -1) {
      largestIndex = currentIndex;
      currentIndex = string.indexOf(search, currentIndex + 1);
    }
    return largestIndex;
  };

  private findObjects = (
    contents: Contents[],
    keyword: string
  ): ValueFindObject => {
    const object = contents.find((e) => e.str.includes(keyword));
    if (object) {
      const begin = this.getIndexOfLast(object.str, keyword);
      return {
        objects: [object],
        begin,
        end: keyword.length,
        endBegin: keyword.length,
      };
    }
    let stringSearch = this.parseKeyword(keyword).substring(0, 5000);
    let values: ValueFindObject = {
      objects: [],
      begin: -1,
      end: -1,
      endBegin: -1,
    };
    for (let i = 0; i < contents.length; i++) {
      const str = this.parseKeyword(contents[i].str);
      if (!str.trim()) continue;
      if (!values.objects.length) {
        const index = this.checkEndsWith(stringSearch, str, 0, -1);
        if (index > 0) {
          values.objects.push(contents[i]);
          values.endBegin = index;
          const stringSearchLast = stringSearch.substring(0, index).trim();
          const indexOfLast = this.getIndexOfLast(str, stringSearchLast);
          values.begin = indexOfLast;
          stringSearch = stringSearch.substring(index, stringSearch.length);
        }
        continue;
      }
      if (!stringSearch.trim()) break;
      const indexStart = this.checkStartsWith(stringSearch, str, 0, 0);
      if (indexStart <= 0) {
        values.objects = [];
        values.begin = -1;
        values.end = -1;
        values.endBegin = -1;
        stringSearch = this.parseKeyword(keyword);
        continue;
      }
      values.end = indexStart;
      values.objects.push(contents[i]);
      stringSearch = stringSearch.substring(indexStart, stringSearch.length);
      if (!stringSearch) {
        break;
      }
    }
    return values;
  };

  render() {
    const { width = "100%", styleWrap } = this.props;
    return (
      <div
        ref={(ref) => (this.refCanvasWrap = ref)}
        style={{
          width,
          minHeight: "100%",
          overflow: "auto",
          ...(styleWrap || {}),
        }}
      />
    );
  }
}

export default PDFHighlight;
