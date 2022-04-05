import css from './ImageUploader.module.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SUPPORTED_FILE_FORMATS } from '../../../utils/misc/constants';
import { DragAndDrop, FileInfo } from './DragAndDrop';
import {
    handleOnChangeFileEvent,
    handleOnDragLeaveEvent,
    handleOnDragoverEvent,
    handleOnDropEvent,
    showFileDialog,
} from './ImageUploaderActions';

export type ImageUploaderState = {
    isDropping: boolean;
    isUploading: boolean;
    uploadedFile: FileInfo | null;
};

interface IImageUploaderProps {
    handleFileStoragePath: (fileStoragePath: FileInfo) => void;
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
        return () => {
            props.handleNewState({
                isDropping: isDropping,
                isUploading: isUploading,
                uploadedFile: uploadedFile,
            });
        };
        // eslint-disable-next-line
    }, [isDropping, isUploading, uploadedFile]);

    // Register drag events
    useLayoutEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.ondragover = (e) =>
            handleOnDragoverEvent(e, containerRef.current, setIsDropping);
        containerRef.current.ondragleave = () =>
            handleOnDragLeaveEvent(containerRef.current, setIsDropping);
        containerRef.current.ondrop = (e) =>
            handleOnDropEvent(e, fileInputRef.current, containerRef.current);

        if (!fileInputRef.current) return;

        fileInputRef.current.onchange = () =>
            handleOnChangeFileEvent(
                fileInputRef.current,
                setIsUploading,
                setIsDropping,
                setUploadedFile,
                props.handleFileStoragePath,
                props.handleNewState
            );
        // eslint-disable-next-line
    }, []);

    return (
        <div className={css.container} ref={containerRef}>
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
                showFileDialog={(e) => showFileDialog(e, fileInputRef.current)}
                uploadedFile={uploadedFile}
            />
        </div>
    );
};
