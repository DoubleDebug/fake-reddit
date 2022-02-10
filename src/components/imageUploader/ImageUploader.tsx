import { useLayoutEffect, useRef, useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import styles from './ImageUploader.module.css';
import { SUPPORTED_FILE_FORMATS } from '../../utils/constants';
import { displayNotif } from '../../utils/toast';
import { validateFile } from '../../utils/dataValidation/validateFile';
import { DragAndDrop, FileInfo } from './DragAndDrop';
import { getImageURL } from '../../utils/firebase/getImageURL';

interface IImageUploaderProps {
    handleFileStoragePath: (fileStoragePath: FileInfo) => void;
}

export const ImageUploader: React.FC<IImageUploaderProps> = (props) => {
    const [isDropping, setIsDropping] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const containerRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<null | HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<FileInfo | null>(null);

    // ACTIONS
    const uploadFile = (file: File) => {
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
            props.handleFileStoragePath(fileInfo);
            setIsUploading(false);
            setUploadedFile(fileInfo);

            displayNotif('Successfully uploaded image/video.', 'success');
        });
    };
    const showFileDialog = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (!fileInputRef.current) return;
        e.preventDefault();
        fileInputRef.current.click();
    };

    // Register drag events
    useLayoutEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.ondragover = (e) => {
            if (!containerRef.current) return;
            e.preventDefault();
            setIsDropping(true);
            containerRef.current.classList.add(styles.onDragOver);
        };
        containerRef.current.ondragleave = () => {
            if (!containerRef.current) return;
            setIsDropping(false);
            containerRef.current.classList.remove(styles.onDragOver);
        };
        containerRef.current.ondrop = (e) => {
            if (!fileInputRef.current || !fileInputRef.current.onchange) return;
            e.preventDefault();
            containerRef!.current!.ondragleave!(new DragEvent(''));

            fileInputRef.current.files = e.dataTransfer?.files || null;
            fileInputRef.current.onchange(new Event(''));
        };

        if (!fileInputRef.current) return;
        fileInputRef.current.onchange = () => {
            if (!fileInputRef.current || !fileInputRef.current.files) return;
            const file = fileInputRef.current.files[0];
            const fileStatus = validateFile(file);
            if (fileStatus.ok) {
                uploadFile(file);
            } else {
                displayNotif(fileStatus.message, 'error');
            }
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <input
                type="file"
                ref={fileInputRef}
                accept={SUPPORTED_FILE_FORMATS.join(', ')}
                id="fileInputElement"
            />
            <DragAndDrop
                isUploading={isUploading}
                isDropping={isDropping}
                fileName={
                    (fileInputRef.current?.files &&
                        fileInputRef.current?.files[0] &&
                        fileInputRef.current?.files[0].name) ||
                    ''
                }
                showFileDialog={showFileDialog}
                uploadedFile={uploadedFile}
            />
        </div>
    );
};
