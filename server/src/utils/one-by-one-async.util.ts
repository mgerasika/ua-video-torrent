export async function oneByOneAsync<T>(items: T[], fn: (item: T) => Promise<any>) {
    const fns = items.map((item) => {
        return () => fn(item);
    });

    return await fns.reduce((acc, curr: any) => {
        return acc.then(curr);
    }, Promise.resolve());
}
