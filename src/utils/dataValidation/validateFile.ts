import {
    MAX_FILE_SIZE,
    SUPPORTED_FILE_FORMATS,
    SUPPORTED_FILE_FORMATS_STRING,
} from '../constants';

type FileValidation = { ok: false; message: string } | { ok: true };

export function validateFile(file: File): FileValidation {
    // 1. file exists
    if (!file) return { ok: false, message: 'Selected file is invalid.' };
    // 2. file size
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE)
        return {
            ok: false,
            message: `Maximum file size is ${MAX_FILE_SIZE} MB.`,
        };
    // 3. file format
    if (!SUPPORTED_FILE_FORMATS.includes(file.type))
        return {
            ok: false,
            message: `Supported file formats are: ${SUPPORTED_FILE_FORMATS_STRING}.`,
        };

    return { ok: true };
}
