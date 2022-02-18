import {
    MAX_FILE_SIZE,
    SUPPORTED_FILE_FORMATS,
    SUPPORTED_FILE_FORMATS_STRING,
} from '../misc/constants';

export function validateFile(file: File): ResponseStatus {
    // 1. file exists
    if (!file) return { success: false, message: 'Selected file is invalid.' };
    // 2. file size
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE)
        return {
            success: false,
            message: `Maximum file size is ${MAX_FILE_SIZE} MB.`,
        };
    // 3. file format
    if (!SUPPORTED_FILE_FORMATS.includes(file.type))
        return {
            success: false,
            message: `Supported file formats are: ${SUPPORTED_FILE_FORMATS_STRING}.`,
        };

    return { success: true };
}
