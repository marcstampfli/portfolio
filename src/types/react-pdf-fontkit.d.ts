declare module "@react-pdf/fontkit" {
  interface FontKit {
    create(): FontKit;
    open(path: string, postscriptName?: string): FontKit;
    version: string;
  }

  const fontkit: FontKit;
  export default fontkit;
}
