import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
        torrent: {
            id: (id?: string) => IUrlItem;
        };
        imdb: {
            id: (id?: string) => IUrlItem;
            search: IUrlItem;
        };
        groupMovie: {
            id: (id?: string) => IUrlItem;
        };
        movie: {
            search: IUrlItem;

            id: (id?: string) => IUrlItem;
        };
        rezkaMovie: {
            searchRezkaWithoutStream: IUrlItem;

            id: (id?: string) => IUrlItem;
        };
        stream: {
            id: (id?: string) => IUrlItem;
        };
        tools: {
            setup: IUrlItem;
        };
        cypress: {
            streams: IUrlItem;
            imdb: IUrlItem;
        };
        parser: {
            hurtomAll: IUrlItem;
            hurtomDetails: IUrlItem;
            rezkaAll: IUrlItem;
            rezkaDetails: IUrlItem;
        };
        s3: {
            id: (id?: string) => {
                hasFile: IUrlItem;
            };
            upload: IUrlItem;
        };
        cdn: {
            id: (id?: string) => {
                hasFile: IUrlItem;
            };
            upload: IUrlItem;
        };
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        torrent: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        cypress: {
            streams: EMPTY_URL_ITEM,
            imdb: EMPTY_URL_ITEM,
        },
        imdb: {
            id: (id?: string) => EMPTY_URL_ITEM,
            search: EMPTY_URL_ITEM,
        },
        movie: {
            search: EMPTY_URL_ITEM,

            id: (id?: string) => EMPTY_URL_ITEM,
        },
        rezkaMovie: {
            searchRezkaWithoutStream: EMPTY_URL_ITEM,
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        stream: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        groupMovie: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        tools: {
            setup: EMPTY_URL_ITEM,
        },
        parser: {
            hurtomAll: EMPTY_URL_ITEM,
            hurtomDetails: EMPTY_URL_ITEM,
            rezkaAll: EMPTY_URL_ITEM,
            rezkaDetails: EMPTY_URL_ITEM,
        },
        s3: {
            id: (id?: string) => ({
                hasFile: EMPTY_URL_ITEM,
            }),
            upload: EMPTY_URL_ITEM,
        },
        cdn: {
            id: (id?: string) => ({
                hasFile: EMPTY_URL_ITEM,
            }),
            upload: EMPTY_URL_ITEM,
        },
    },
});
