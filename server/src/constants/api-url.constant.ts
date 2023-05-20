import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
        torrent: {
            id: (id?: string) => IUrlItem;
        };
        user: {
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
        rezka_movie: {
            id: (id?: string) => IUrlItem;
        };
        stream: {
            id: (id?: string) => IUrlItem;
        };
        tools: {
            setup: IUrlItem;
        };
        cypress: {
            href: (id?: string) => {
                streams: IUrlItem;
                imdb: IUrlItem;
            };
        };
        parser: {
            getHurtomAll: {
                id: (id?: string) => IUrlItem;
            };
            getRezkaAll: {
                id: (id?: string) => IUrlItem;
            };
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
        torrent: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        cypress: {
            href: (id?: string) => ({
                streams: EMPTY_URL_ITEM,
                imdb: EMPTY_URL_ITEM,
            }),
        },
        user: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        imdb: {
            id: (id?: string) => EMPTY_URL_ITEM,
            search: EMPTY_URL_ITEM,
        },
        movie: {
            search: EMPTY_URL_ITEM,

            id: (id?: string) => EMPTY_URL_ITEM,
        },
        rezka_movie: {
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
            getHurtomAll: {
                id: (id?: string) => EMPTY_URL_ITEM,
            },
            getRezkaAll: {
                id: (id?: string) => EMPTY_URL_ITEM,
            },
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
