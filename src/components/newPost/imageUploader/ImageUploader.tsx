import css from './ImageUploader.module.css';
import { useEffect, useRef, useState } from 'react';
import {
    SUPPORTED_FILE_FORMATS,
    SUPPORTED_IMAGE_FORMATS,
} from '../../../utils/misc/constants';
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
    uploadedFiles: FileInfo[];
};

interface IImageUploaderProps {
    handleContentUpdate: (uploadedFiles: FileInfo[]) => void;
    handleNewState: (state: ImageUploaderState) => void;
    state?: ImageUploaderState;
    noVideos?: boolean;
    noMultipleFiles?: boolean;
    differentStoragePath?: string;
}

export const ImageUploader: React.FC<IImageUploaderProps> = (props) => {
    const [isDropping, setIsDropping] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);

    // load previous state if possible
    useEffect(() => {
        if (props.state) {
            setIsDropping(props.state.isDropping);
            setIsUploading(props.state.isUploading);
            setUploadedFiles(props.state.uploadedFiles);
        }
        // eslint-disable-next-line
    }, []);

    // save state when switching tabs
    useEffect(() => {
        props.handleNewState({
            isDropping: isDropping,
            isUploading: isUploading,
            uploadedFiles: uploadedFiles,
        });
        // eslint-disable-next-line
    }, [isDropping, isUploading, uploadedFiles]);

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
                handleOnDropEvent(
                    e,
                    fileInputRef.current,
                    containerRef.current,
                    setIsUploading,
                    setIsDropping,
                    setUploadedFiles,
                    props.handleContentUpdate
                )
            }
        >
            <input
                type="file"
                ref={fileInputRef}
                accept={
                    props.noVideos
                        ? SUPPORTED_IMAGE_FORMATS.join(', ')
                        : SUPPORTED_FILE_FORMATS.join(', ')
                }
                multiple={!props.noMultipleFiles}
                id="fileInputElement"
                onChange={(e) => {
                    e.preventDefault();
                    handleOnChangeFileEvent(
                        fileInputRef.current,
                        setIsUploading,
                        setIsDropping,
                        setUploadedFiles,
                        props.handleContentUpdate,
                        props.noVideos,
                        props.noMultipleFiles,
                        props.differentStoragePath
                    );
                }}
            />
            <DragAndDrop
                isUploading={isUploading}
                isDropping={isDropping}
                showFileDialog={(e) => showFileDialog(e, fileInputRef.current)}
                uploadedFiles={uploadedFiles}
                noVideos={props.noVideos}
            />
        </div>
    );
};
