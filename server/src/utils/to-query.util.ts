export type IQueryReturn<T> = [T, any] | [undefined, any] | [T];

export async function toQuery<T>(callback: () => Promise<T>): Promise<IQueryReturn<T>> {
    try {
        const data = (await callback()) as T;
        return [data, undefined];
    } catch (ex) {
        const error = (ex as Error) || 'empty error';
        return [undefined, error];
    }
}
