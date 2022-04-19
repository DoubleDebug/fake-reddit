import css from './ImagePost.module.css';
import Carousel from 'react-material-ui-carousel';
import { useEffect, useState } from 'react';
import { getImageURL } from '../../../utils/firebase/getImageURL';
import Skeleton from 'react-loading-skeleton';
import { ImageItem } from './imageItem/ImageItem';
import { VideoItem } from './videoItem/VideoItem';
import { isFileImage, isFileVideo } from '../../../utils/misc/getFileExtension';

interface IImagePostProps {
    contentFiles: string[];
    linkTo?: string;
}

export const ImagePost: React.FC<IImagePostProps> = (props) => {
    const [files, setFiles] = useState(
        props.contentFiles.map((f) => ({
            path: f,
            url: '',
        }))
    );
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // get image urls
        const tasks = props.contentFiles.map((f) => getImageURL(f));
        Promise.all(tasks).then((results) => {
            const filesCopy = [...files];
            for (let i = 0; i < results.length; i++) {
                filesCopy[i].url = results[i];
            }
            setFiles(filesCopy);
        });
        // eslint-disable-next-line
    }, [props.contentFiles]);

    return (
        <>
            {isLoading && <Skeleton height={500} />}
            {files.length === 1 &&
                displayImage(
                    files[0],
                    0,
                    isLoading,
                    setIsLoading,
                    setIndex,
                    props.linkTo
                )}
            {files.length > 1 && (
                <Carousel
                    className={`${css.carousel} ${isLoading ? css.hidden : ''}`}
                    autoPlay={false}
                    cycleNavigation={false}
                    index={index}
                >
                    {files.map((f, ind) =>
                        displayImage(
                            f,
                            ind,
                            isLoading,
                            setIsLoading,
                            setIndex,
                            props.linkTo
                        )
                    )}
                </Carousel>
            )}
        </>
    );
};

function displayImage(
    file: {
        path: string;
        url: string;
    },
    index: number,
    isLoading: boolean,
    setIsLoading: (l: boolean) => void,
    setIndex: (i: number) => void,
    linkTo?: string
) {
    const isImage = isFileImage(file.path);
    const isVideo = isFileVideo(file.path);

    if (isImage)
        return (
            <ImageItem
                key={`carousel-${index}`}
                elementIndex={index}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setIndex={setIndex}
                url={file.url}
                linkTo={linkTo}
            />
        );

    if (isVideo)
        return (
            <VideoItem
                key={`carousel-${index}`}
                url={file.url}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setIndex={setIndex}
                linkTo={linkTo}
            />
        );

    return null;
}
