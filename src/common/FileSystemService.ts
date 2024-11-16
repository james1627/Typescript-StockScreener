import * as fs from 'fs/promises';
import path from 'path';
import { IPath } from "./IPath";
import IFileSystemService from "./IFileSystemService";

class FileSystemService implements IFileSystemService {

  async resolve(filePath: string, root?: string): Promise<IPath> {
    const absolutePath = path.resolve(filePath, root ?? process.cwd()); // Get the absolute path

    const fileName = path.basename(absolutePath);
    const fileExtension = path.extname(absolutePath);
    const relativePath = path.relative(process.cwd(), absolutePath);

    const stats = await fs.stat(absolutePath);

    return {
        fileName,
        relativePath,
        absolutePath: absolutePath,
        isDirectory: stats.isDirectory(),
        extName: fileExtension
    }; // Adjust based on your `Path` implementation
  }

  async readFile(path: string): Promise<string> {
    try {
      return await fs.readFile(path, 'utf-8');
    } catch (error) {
      console.error(`Failed to read file at ${path}:`, error);
      throw error;
    }
  }

  async writeFile(filePath: string, data: string): Promise<IPath> {
    try {
      await fs.writeFile(filePath, data, 'utf-8');
    } catch (error) {
      console.error(`Failed to write to file at ${filePath}:`, error);
      throw error;
    }
    const location = await this.resolve(filePath);
    return location;
  }
}

export default FileSystemService;