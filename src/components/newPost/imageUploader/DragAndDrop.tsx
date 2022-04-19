import css from './ImageUploader.module.css';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react';
import {
    getFileExtension,
    isFileImage,
} from '../../../utils/misc/getFileExtension';
import { shortenString } from '../../../utils/misc/shortenString';

export type FileInfo = {
    oldFileName: string;
    newFileName: string;
    url: string;
    storagePath: string;
};

interface IDragAndDropProps {
    isUploading: boolean;
    isDropping: boolean;
    uploadedFiles: FileInfo[];
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
        return <StateFileIsBeingUploaded />;
    }
    if (props.isDropping) {
        return <StateFileIsBeingDropped />;
    }
    if (props.uploadedFiles.length > 0) {
        return (
            <StateFileIsUploaded
                handleLoadedImage={handleLoadedImage}
                handleLoadedVideo={handleLoadedVideo}
                previewIsLoaded={previewIsLoaded}
                uploadedFiles={props.uploadedFiles}
            />
        );
    }
    return <StateDefault showFileDialog={props.showFileDialog} />;
};

const StateFileIsBeingUploaded: React.FC = () => (
    <div className={css.previewContainer}>
        <div className={css.imagePreview}>
            <FontAwesomeIcon icon={faCircleNotch} spin={true} size="2x" />
        </div>
        <p>Uploading file(s)...</p>
    </div>
);

const StateFileIsBeingDropped: React.FC = () => {
    return <h2 className={css.textDrop}>Drop here to upload</h2>;
};

const StateFileIsUploaded: React.FC<{
    handleLoadedImage: (img: HTMLImageElement) => void;
    handleLoadedVideo: () => void;
    previewIsLoaded: boolean;
    uploadedFiles: FileInfo[];
}> = (props) => {
    return (
        <div className={css.mainContainer}>
            {props.uploadedFiles.map((file, index) => {
                const isImage = isFileImage(file.oldFileName);
                const name = file.oldFileName.substring(
                    0,
                    file.oldFileName.length - 4
                );
                const extension = getFileExtension(file.oldFileName);
                return (
                    <div
                        key={`image-preview-${index}`}
                        className={css.previewContainer}
                    >
                        {isImage ? (
                            <img
                                ref={props.handleLoadedImage}
                                className={`${css.imagePreview} ${
                                    props.previewIsLoaded ? css.show : css.hide
                                }`}
                                src={file.url}
                                alt="Preview uploaded file"
                            ></img>
                        ) : (
                            <video
                                ref={props.handleLoadedVideo}
                                className={`${css.imagePreview} ${
                                    props.previewIsLoaded ? css.show : css.hide
                                }`}
                                src={file.url}
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
                        <div className="flex">
                            {`${shortenString(name, 30)}`}
                            <p className={css.extension}>{`.${extension}`}</p>
                        </div>
                    </div>
                );
            })}
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
            <button onClick={(e) => props.showFileDialog(e)} type="submit">
                Upload
            </button>
        </div>
    );
};
