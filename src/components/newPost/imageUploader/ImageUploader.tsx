import css from './ImageUploader.module.css';
import { useEffect, useRef, useState } from 'react';
import { SUPPORTED_FILE_FORMATS } from '../../../utils/misc/constants';
import { DragAndDrop, FileInfo } from './DragAndDrop';
import {
    handleOnChangeFileEvent,
    handleOnDragLeaveEvent,
    handleOnDragOverEvent,
    handleOnDropEvent,
    showFileDialog,
} from './ImageUploaderActions';

export type ImageUploaderState = {
    isDropping: boolean;
    isUploading: boolean;
    uploadedFile: FileInfo | null;
};

interface IImageUploaderProps {
    handleContentUpdate: (fileStoragePath: FileInfo) => void;
    handleNewState: (state: ImageUploaderState) => void;
    state?: ImageUploaderState;
}

export const ImageUploader: React.FC<IImageUploaderProps> = (props) => {
    const [isDropping, setIsDropping] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const containerRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<null | HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<FileInfo | null>(null);

    // load previous state if possible
    useEffect(() => {
        if (props.state) {
            setIsDropping(props.state.isDropping);
            setIsUploading(props.state.isUploading);
            setUploadedFile(props.state.uploadedFile);
        }
        // eslint-disable-next-line
    }, []);

    // save state when switching tabs
    useEffect(() => {
        props.handleNewState({
            isDropping: isDropping,
            isUploading: isUploading,
            uploadedFile: uploadedFile,
        });
        // eslint-disable-next-line
    }, [isDropping, isUploading, uploadedFile]);

    return (
        <div
            className={css.container}
            ref={containerRef}
            onDragOver={(e) =>
                handleOnDragOverEvent(e, containerRef.current, setIsDropping)
            }
            onDragLeave={() =>
                handleOnDragLeaveEvent(containerRef.current, setIsDropping)
            }
            onDrop={(e) =>
                handleOnDropEvent(e, fileInputRef.current, containerRef.current)
            }
        >
            <input
                type="file"
                ref={fileInputRef}
                accept={SUPPORTED_FILE_FORMATS.join(', ')}
                id="fileInputElement"
                onChange={() =>
                    handleOnChangeFileEvent(
                        fileInputRef.current,
                        setIsUploading,
                        setIsDropping,
                        setUploadedFile,
                        props.handleContentUpdate
                    )
                }
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
                showFileDialog={(e) => showFileDialog(e, fileInputRef.current)}
                uploadedFile={uploadedFile}
            />
        </div>
    );
};
