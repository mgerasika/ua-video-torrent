export const createLogs = () => {
    const _logs: string[] = [];
    return {
        push: (msg: any, ...rest: any[]) => {
            console.log(msg, ...rest);
            _logs.push(msg + (rest.length ? ' - ' + rest.join() : ''));
        },
        get: (): string[] => _logs,
    };
};
