import css from './ImageUploader.module.css';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getImageURL } from '../../../utils/firebase/getImageURL';
import { displayNotif } from '../../../utils/misc/toast';
import { FileInfo } from './DragAndDrop';
import { validateFile } from '../../../utils/dataValidation/validateFile';
import { v4 as generateUUID } from 'uuid';
import { getFileExtension } from '../../../utils/misc/getFileExtension';
import { MAX_NUMBER_OF_FILES } from '../../../utils/misc/constants';
import React from 'react';

function uploadFile(
    file: File,
    setIsUploading: (s: boolean) => void,
    setIsDropping: (s: boolean) => void
) {
    setIsUploading(true);
    setIsDropping(false);

    const storage = getStorage();
    const newFileName = `${generateUUID()}.${getFileExtension(file.name)}`;
    const storageRef = ref(storage, 'content//' + newFileName);
    return uploadBytes(storageRef, file).then(async (snapshot) => {
        // load image preview
        const url = await getImageURL(snapshot.metadata.fullPath);
        const fileInfo = {
            oldFileName: file.name,
            newFileName: newFileName,
            url: url,
            storagePath: snapshot.metadata.fullPath,
        };

        // update ui
        setIsUploading(false);

        return fileInfo;
    });
}

export function showFileDialog(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileInputRef: HTMLInputElement | null
) {
    if (!fileInputRef) return;
    e.preventDefault();
    fileInputRef.click();
}

export function handleOnDragOverEvent(
    e: React.DragEvent<HTMLDivElement>,
    containerRef: HTMLDivElement | null,
    setIsDropping: (s: boolean) => void
) {
    if (!containerRef) return;
    e.preventDefault();
    setIsDropping(true);
    containerRef.classList.add(css.onDragOver);
}

export function handleOnDragLeaveEvent(
    containerRef: HTMLDivElement | null,
    setIsDropping: (s: boolean) => void
) {
    if (!containerRef) return;
    setIsDropping(false);
    containerRef.classList.remove(css.onDragOver);
}

export function handleOnDropEvent(
    e: React.DragEvent<HTMLDivElement>,
    fileInputRef: HTMLInputElement | null,
    containerRef: HTMLDivElement | null,
    setIsUploading: (s: boolean) => void,
    setIsDropping: (s: boolean) => void,
    setUploadedFiles: (f: FileInfo[]) => void,
    handleContentUpdate: (f: FileInfo[]) => void
) {
    e.preventDefault();
    if (!fileInputRef || !containerRef) return;
    handleOnDragLeaveEvent(containerRef, setIsDropping);

    fileInputRef.files = e.dataTransfer?.files || null;
    handleOnChangeFileEvent(
        fileInputRef,
        setIsUploading,
        setIsDropping,
        setUploadedFiles,
        handleContentUpdate
    );
}

export function handleOnChangeFileEvent(
    fileInputRef: HTMLInputElement | null,
    setIsUploading: (s: boolean) => void,
    setIsDropping: (s: boolean) => void,
    setUploadedFiles: (f: FileInfo[]) => void,
    handleContentUpdate: (f: FileInfo[]) => void
) {
    if (!fileInputRef || !fileInputRef.files) return;

    // file validation
    if (fileInputRef.files.length > MAX_NUMBER_OF_FILES) {
        fileInputRef.files = null;
        displayNotif(
            `Too many files selected. Maximum is ${MAX_NUMBER_OF_FILES}.`,
            'error'
        );
        return;
    }
    let i = 0;
    while (i < fileInputRef.files.length) {
        const validationResult = validateFile(fileInputRef.files[i]);
        if (!validationResult.success) {
            displayNotif(validationResult.message, 'error');
            break;
        }
        i++;
    }

    // upload files
    if (i === fileInputRef.files.length) {
        const tasks = [];
        for (let j = 0; j < fileInputRef.files.length; j++) {
            tasks.push(
                uploadFile(fileInputRef.files[j], setIsUploading, setIsDropping)
            );
        }
        Promise.all(tasks).then((uploadedFiles) => {
            setUploadedFiles(uploadedFiles);
            handleContentUpdate(uploadedFiles);
            displayNotif('Successfully uploaded file(s).', 'success');
        });
    } else {
        fileInputRef.files = null;
    }
}
