import styles from './ImageUploader.module.css';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getImageURL } from '../../../utils/firebase/getImageURL';
import { displayNotif } from '../../../utils/misc/toast';
import { FileInfo } from './DragAndDrop';
import { validateFile } from '../../../utils/dataValidation/validateFile';

export function uploadFile(
    file: File,
    setIsUploading: (s: boolean) => void,
    setIsDropping: (s: boolean) => void,
    setUploadedFile: (f: FileInfo) => void,
    handleFileStoragePath: (f: FileInfo) => void,
    handleNewState: (s: {
        isUploading: boolean;
        isDropping: boolean;
        uploadedFile: FileInfo;
    }) => void
) {
    setIsUploading(true);
    setIsDropping(false);

    const storage = getStorage();
    const storageRef = ref(storage, 'content//' + file.name);
    uploadBytes(storageRef, file).then(async (snapshot) => {
        // load image preview
        const url = await getImageURL(snapshot.metadata.fullPath);
        const fileInfo = {
            fileName: file.name,
            url: url,
            storagePath: snapshot.metadata.fullPath,
        };

        // update ui
        setIsUploading(false);
        setUploadedFile(fileInfo);
        handleFileStoragePath(fileInfo);
        handleNewState({
            isUploading: false,
            isDropping: false,
            uploadedFile: fileInfo,
        });

        displayNotif('Successfully uploaded image/video.', 'success');
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

export function handleOnDragoverEvent(
    e: DragEvent,
    containerRef: HTMLDivElement | null,
    setIsDropping: (s: boolean) => void
) {
    if (!containerRef) return;
    e.preventDefault();
    setIsDropping(true);
    containerRef.classList.add(styles.onDragOver);
}

export function handleOnDragLeaveEvent(
    containerRef: HTMLDivElement | null,
    setIsDropping: (s: boolean) => void
) {
    if (!containerRef) return;
    setIsDropping(false);
    containerRef.classList.remove(styles.onDragOver);
}

export function handleOnDropEvent(
    e: DragEvent,
    fileInputRef: HTMLInputElement | null,
    containerRef: HTMLDivElement | null
) {
    if (!fileInputRef || !fileInputRef.onchange) return;
    e.preventDefault();
    containerRef!.ondragleave!(new DragEvent(''));

    fileInputRef.files = e.dataTransfer?.files || null;
    fileInputRef.onchange(new Event(''));
}

export function handleOnChangeFileEvent(
    fileInputRef: HTMLInputElement | null,
    setIsUploading: (s: boolean) => void,
    setIsDropping: (s: boolean) => void,
    setUploadedFile: (f: FileInfo) => void,
    handleFileStoragePath: (f: FileInfo) => void,
    handleNewState: (s: {
        isUploading: boolean;
        isDropping: boolean;
        uploadedFile: FileInfo;
    }) => void
) {
    if (!fileInputRef || !fileInputRef.files) return;
    const file = fileInputRef.files[0];
    const fileStatus = validateFile(file);
    if (fileStatus.success) {
        uploadFile(
            file,
            setIsUploading,
            setIsDropping,
            setUploadedFile,
            handleFileStoragePath,
            handleNewState
        );
    } else {
        displayNotif(fileStatus.message, 'error');
    }
}
