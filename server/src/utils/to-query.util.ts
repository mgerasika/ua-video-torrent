export type IQueryReturn<T> = [T | undefined, any];

export async function toQuery<T>(callback: () => Promise<T>): Promise<IQueryReturn<T>> {
    let data: T | undefined = undefined;
    let error;
    try {
        data = (await callback()) as T;
    } catch (ex) {
        error = ex || 'empty error';
    } finally {
    }

    return [data, error];
}
