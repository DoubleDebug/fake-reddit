import css from './ImageUploader.module.css';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react';
import { isFileImage } from '../../../utils/misc/getFileExtension';

export type FileInfo = {
    oldFileName: string;
    newFileName: string;
    url: string;
    storagePath: string;
};

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
                isImage={isFileImage(props.uploadedFile.oldFileName)}
            />
        );
    }
    return <StateDefault showFileDialog={props.showFileDialog} />;
};

const StateFileIsUploaded: React.FC<{ fileName: string }> = (props) => {
    return (
        <div className={css.previewContainer}>
            <div className={css.imagePreview}>
                <FontAwesomeIcon icon={faCircleNotch} spin={true} size="2x" />
            </div>
            <p>{props.fileName}</p>
        </div>
    );
};

const StateFileIsBeingDropped: React.FC = () => {
    return <h2 className={css.textDrop}>Drop here to upload</h2>;
};

const StateFileIsBeingUploaded: React.FC<{
    handleLoadedImage: (img: HTMLImageElement) => void;
    handleLoadedVideo: () => void;
    previewIsLoaded: boolean;
    uploadedFile: FileInfo;
    isImage: boolean;
}> = (props) => {
    return (
        <div className={css.previewContainer}>
            {props.isImage ? (
                <img
                    ref={props.handleLoadedImage}
                    className={`${css.imagePreview} ${
                        props.previewIsLoaded ? css.show : css.hide
                    }`}
                    src={props.uploadedFile.url}
                    alt="Preview uploaded file"
                ></img>
            ) : (
                <video
                    ref={props.handleLoadedVideo}
                    className={`${css.imagePreview} ${
                        props.previewIsLoaded ? css.show : css.hide
                    }`}
                    src={props.uploadedFile.url}
                ></video>
            )}
            {!props.previewIsLoaded && (
                <div className={css.imagePreview}>
                    <FontAwesomeIcon
                        icon={faCircleNotch}
                        spin={true}
                        size="2x"
                    ></FontAwesomeIcon>
                </div>
            )}
            <p>{props.uploadedFile.oldFileName}</p>
        </div>
    );
};

const StateDefault: React.FC<{
    showFileDialog: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
}> = (props) => {
    return (
        <div className="flex">
            <h2 className={css.textDrag}>Drag and drop an image/video or </h2>
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
