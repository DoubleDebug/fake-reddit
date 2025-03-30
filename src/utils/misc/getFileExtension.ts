import { IMAGE_FILE_FORMATS, VIDEO_FILE_FORMATS } from './constants';

/**
 * @returns the file's extension (example: "mp4")
 * or an empty string if the fileName is invalid
 */
export function getFileExtension(fileName: string): string {
  if (fileName === '' || fileName.indexOf('.') === -1) return '';

  let index = fileName.length - 1;
  while (index >= 0 && fileName[index] !== '.') {
    index--;
  }
  return fileName.slice(index + 1, fileName.length);
}

/**
 * @returns whether the file is an image or not
 */
export function isFileImage(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  return IMAGE_FILE_FORMATS.includes(extension);
}

/**
 * @returns whether the file is a video or not
 */
export function isFileVideo(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  return VIDEO_FILE_FORMATS.includes(extension);
}
