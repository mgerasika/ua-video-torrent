import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
        user: {
            id: (id?: string) => IUrlItem;
        };
        imdb: {
            id: (id?: string) => IUrlItem;
        };
        movie: {
            search: IUrlItem;
            groupSearch: {
                id: (id?: string) => IUrlItem;
            };
            id: (id?: string) => IUrlItem;
        };
        tools: {
            getHurtomAll: IUrlItem;
            searchImdbInfo: IUrlItem;
            setup: IUrlItem;
        };
        s3: {
            get: {
                id: (id?: string) => {
                    hasFile: IUrlItem;
                };
            };
            upload: IUrlItem;
        };
        cdn: {
            get: {
                file_name: (id?: string) => {
                    hasFile: IUrlItem;
                };
            };
            upload: IUrlItem;
        };
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        user: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        imdb: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        movie: {
            search: EMPTY_URL_ITEM,
            groupSearch: {
                id: (id?: string) => EMPTY_URL_ITEM,
            },
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        tools: {
            getHurtomAll: EMPTY_URL_ITEM,
            setup: EMPTY_URL_ITEM,
            searchImdbInfo: EMPTY_URL_ITEM,
        },
        s3: {
            get: {
                id: (id?: string) => ({
                    hasFile: EMPTY_URL_ITEM,
                }),
            },
            upload: EMPTY_URL_ITEM,
        },
        cdn: {
            get: {
                file_name: (id?: string) => ({
                    hasFile: EMPTY_URL_ITEM,
                }),
            },
            upload: EMPTY_URL_ITEM,
        },
    },
});
