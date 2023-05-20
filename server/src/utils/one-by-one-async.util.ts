export async function oneByOneAsync<T>(items: T[], fn: (item: T) => Promise<void>, settings?: { timeout: number }) {
    const fns = items.map((item) => {
        return () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    fn(item).then(resolve).catch(reject);
                }, settings?.timeout );
            });
        };
    });

    return await fns.reduce((acc, fn: any) => {
        return acc.then(fn);
    }, Promise.resolve());
}
