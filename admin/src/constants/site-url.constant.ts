import { createUrls, EMPTY_URL_ITEM, IUrlItem } from "react-create-url";

interface ISiteUrl {
  index: {
    id: (id?: string) => IUrlItem;
  };
}

export const SITE_URL = createUrls<ISiteUrl>({
  index: {
    id: (id?: string) => EMPTY_URL_ITEM,
  },
});
