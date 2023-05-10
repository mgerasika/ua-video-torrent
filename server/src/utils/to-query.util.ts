export type IQueryReturn<T> = [T, undefined] | [undefined, string | Error] | [T];

export async function toQuery<T>(callback: () => Promise<T>): Promise<IQueryReturn<T>> {
    try {
        const data = (await callback()) as T;
        return [data];
    } catch (ex) {
        const error = (ex as Error) || 'empty error';
        return [undefined, error];
    }
}

export async function toQueryPromise<T>(
    callback: (resolve: (data: T) => void, reject: (error: string | Error) => void) => void,
): Promise<IQueryReturn<T>> {
    return await toQuery(() => {
        return new Promise((resolve, reject) => {
            return callback(resolve, reject);
        });
    });
}
