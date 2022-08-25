/* eslint-disable @typescript-eslint/naming-convention */
import { Constants as NgxCoreConstants } from '@mawhea/ngx-core';

export class Constants extends NgxCoreConstants {

  public static SESSION: any = {
    ...NgxCoreConstants.SESSION
  };

  public static ADD_IMAGE_PLACEHOLDER_URI = 'assets/images/add-image-camera-photo.png';

}
