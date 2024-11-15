import { IPath } from "./IPath";

export default interface IFileSystemService {
    /**
     * Reads the contents of a file asynchronously.
     * @param filePath - The file path.
     * @param root - root path (optional)
     * @returns The contents of the file as a string.
     */
    readFile(filePath: string, root?: string): Promise<string>;

    /**
     * Resolves the file path to an absolute `Path` object.
     * @param filePath - The file path.
     * @returns A `Path` object.
     */
    resolve(filePath: string): Promise<IPath>;

    /**
     * Writes data to a file asynchronously.
     * @param filePath - The file path.
     * @param data - The data to write.
     * @returns the path
     */
    writeFile(filePath: string, data: string): Promise<IPath>;
};