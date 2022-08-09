export class FileUtil {
  static dataUriToFile(dataUri: string, fileName: string): File {
    // https://en.wikipedia.org/wiki/Data_URI_scheme
    // create a pattern to match the data uri
    let patt = /^data:([^\/]+\/[^;]+)?(;charset=([^;]+))?(;base64)?,/i,
      matches = dataUri.match(patt);
    if (matches == null) {
      throw new Error("data: uri did not match scheme");
    } else {
      let
        prefix = matches[0],
        contentType = matches[1],
        // let charset = matches[3]; -- not used.
        isBase64 = matches[4] != null,
        // remove the prefix
        encodedBytes = dataUri.slice(prefix.length),
        // decode the bytes
        decodedBytes = isBase64 ? atob(encodedBytes) : encodedBytes,
        // return the file object
        props = { type: "" };
      if (contentType) {
        props.type = contentType;
      }
      return new File([decodedBytes], fileName, props);
    }
  }

  static getDataUriFileType(dataUri: string): string {
    let contentType = ``;
    let patt = /^data:([^\/]+\/[^;]+)?(;charset=([^;]+))?(;base64)?,/i,
      matches = dataUri.match(patt);
    if (matches == null) {
      console.log("data: uri did not match scheme");
    } else {
      contentType = matches[1];
    }
    return contentType;
  }

  static isImageUri(dataUri: string): boolean {
    let isImageUri = false;
    // Typed :any so typescript doesn't complain about property 'includes' does not exist on type 'string'
    let contentType: any = FileUtil.getDataUriFileType(dataUri);
    if (contentType && contentType.includes("image")) {
      isImageUri = true;
    }
    return isImageUri;
  }
}
