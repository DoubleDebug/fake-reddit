import styles from './ImageUploader.module.css';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react';
import { isFileImage } from '../../utils/getFileExtension';

export type FileInfo = { fileName: string; url: string; storagePath: string };

interface IDragAndDropProps {
    isUploading: boolean;
    isDropping: boolean;
    fileName: string;
    uploadedFile: FileInfo | null;
    showFileDialog: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
}

export const DragAndDrop: React.FC<IDragAndDropProps> = (props) => {
    const [previewIsLoaded, setPreviewIsLoaded] = useState<boolean>(false);
    const handleLoadedImage = useCallback((img: HTMLImageElement) => {
        if (img) img.onload = () => setPreviewIsLoaded(true);
    }, []);
    const handleLoadedVideo = useCallback(() => {
        setPreviewIsLoaded(true);
    }, []);

    if (props.isUploading) {
        return <StateFileIsUploaded fileName={props.fileName} />;
    }
    if (props.isDropping) {
        return <StateFileIsBeingDropped />;
    }
    if (props.uploadedFile) {
        return (
            <StateFileIsBeingUploaded
                handleLoadedImage={handleLoadedImage}
                handleLoadedVideo={handleLoadedVideo}
                previewIsLoaded={previewIsLoaded}
                uploadedFile={props.uploadedFile}
                isImage={isFileImage(props.uploadedFile.fileName)}
            />
        );
    }
    return <StateDefault showFileDialog={props.showFileDialog} />;
};

export const StateFileIsUploaded: React.FC<{ fileName: string }> = (props) => {
    return (
        <div className={styles.previewContainer}>
            <div className={styles.imagePreview}>
                <FontAwesomeIcon icon={faCircleNotch} spin={true} size="2x" />
            </div>
            <p>{props.fileName}</p>
        </div>
    );
};

export const StateFileIsBeingDropped: React.FC = () => {
    return <h2 className={styles.textDrop}>Drop here to upload</h2>;
};

export const StateFileIsBeingUploaded: React.FC<{
    handleLoadedImage: (img: HTMLImageElement) => void;
    handleLoadedVideo: () => void;
    previewIsLoaded: boolean;
    uploadedFile: FileInfo;
    isImage: boolean;
}> = (props) => {
    return (
        <div className={styles.previewContainer}>
            {props.isImage ? (
                <img
                    ref={props.handleLoadedImage}
                    className={`${styles.imagePreview} ${
                        props.previewIsLoaded ? styles.show : styles.hide
                    }`}
                    src={props.uploadedFile.url}
                    alt="Preview uploaded file"
                ></img>
            ) : (
                <video
                    ref={props.handleLoadedVideo}
                    className={`${styles.imagePreview} ${
                        props.previewIsLoaded ? styles.show : styles.hide
                    }`}
                    src={props.uploadedFile.url}
                ></video>
            )}
            {!props.previewIsLoaded && (
                <div className={styles.imagePreview}>
                    <FontAwesomeIcon
                        icon={faCircleNotch}
                        spin={true}
                        size="2x"
                    ></FontAwesomeIcon>
                </div>
            )}
            <p>{props.uploadedFile.fileName}</p>
        </div>
    );
};

export const StateDefault: React.FC<{
    showFileDialog: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
}> = (props) => {
    return (
        <div className="flex">
            <h2 className={styles.textDrag}>
                Drag and drop an image/video or{' '}
            </h2>
            <button
                onClick={(e) => props.showFileDialog(e)}
                className="btn"
                type="submit"
            >
                Upload
            </button>
        </div>
    );
};
