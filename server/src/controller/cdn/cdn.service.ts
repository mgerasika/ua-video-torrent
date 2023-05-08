import * as path from 'path';
import fs from 'fs';

export const cdnService = {
    cdnFile: (file: string) => {
        const parentDir = findParentDirectoryByNameSync('server');
        const res = path.join(parentDir || '', 'cdn/dist/' + file);
        return res;
    },
};

function findParentDirectoryByNameSync(targetName: string, currentDir?: string): string | null {
    // If currentDir is not provided, use the current working directory
    if (!currentDir) {
        currentDir = process.cwd();
    }

    // Check if the target directory exists in the current directory
    const targetPath = path.join(currentDir, targetName);
    if (fs.existsSync(targetPath)) {
        return currentDir;
    }

    // Check if we've reached the root directory, which has no parent
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
        return null;
    }

    // Recursively call the function with the parent directory
    return findParentDirectoryByNameSync(targetName, parentDir);
}
