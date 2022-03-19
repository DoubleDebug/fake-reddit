import { User } from 'firebase/auth';
import { FileInfo } from '../../components/newPost/imageUploader/DragAndDrop';
import { PostModel } from '../../models/post';
import { deleteFile } from '../../utils/firebase/deleteFile';
import { isFileImage, isFileVideo } from '../../utils/misc/getFileExtension';
import { displayNotif } from '../../utils/misc/toast';
import { ISubreddit } from '../../models/subreddit';

// TODO
export function handleCancelledSubmission(
    contentFiles: string[],
    postStage: 'default' | 'being-submitted' | 'submitted',
    user: User | null | undefined
) {
    if (!contentFiles) return;
    if (contentFiles.length === 0) return;
    if (postStage !== 'default') return;

    // If a post submission is cancelled, delete uploaded file
    contentFiles.forEach((file) => {
        deleteFile(user, file).then((res) => {
            if (!res.success) displayNotif(res.message, 'error');
        });
    });
}

export function getSelectedSubredditName(
    subredditInput: any
): string | undefined {
    if (!subredditInput.current) return undefined;
    return subredditInput.current.getValue()[0].value;
}

export function getSelectedSubreddit(
    subreddits: ISubreddit[] | undefined,
    subredditInput: any
) {
    const selected = getSelectedSubredditName(subredditInput);
    return subreddits?.filter((s) => s.id === selected)[0];
}

export function getFlairsFromSubreddit(
    subreddits: ISubreddit[] | undefined,
    subredditInput: any
) {
    return getSelectedSubreddit(subreddits, subredditInput)?.flairs?.map(
        (f) => ({
            value: f,
            label: `#${f}`,
        })
    );
}

export function submitNewPost(
    e: React.MouseEvent,
    user: User | null | undefined,
    postData: PostModel,
    setPostStage: (s: 'default' | 'being-submitted' | 'submitted') => void,
    subreddit: string
) {
    e.preventDefault();
    if (!user) return;

    // loading animation
    setPostStage('being-submitted');

    // submit post
    const onInvalidData = () => setPostStage('default');
    const onSuccess = () => setPostStage('submitted');
    const onFail = () => setPostStage('default');

    postData.submit(user, subreddit, onInvalidData, onSuccess, onFail);
}

export function handleTabChange(
    tabNumber: string,
    setTabIndex: (t: string) => void
) {
    setTabIndex(tabNumber);
}

export function getFileMarkup(fileInfo: FileInfo) {
    if (isFileImage(fileInfo.fileName)) return `<img src=${fileInfo.url}/>`;

    if (isFileVideo(fileInfo.fileName))
        return `<video src=${fileInfo.url} controls loop></video>`;

    return '';
}

export function handleFlairClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    setPostData: (p: PostModel) => void,
    postData: PostModel
) {
    e.preventDefault();
    if (e.currentTarget.type === 'submit') e.currentTarget.type = 'button';
    else e.currentTarget.type = 'submit';

    const newFlair = e.currentTarget
        .textContent!.replace('#', '')
        .toLowerCase();
    const flairs = postData.flairs || [];
    if (flairs.includes(newFlair)) flairs.splice(flairs.indexOf(newFlair), 1);
    else flairs.push(newFlair);

    setPostData(
        new PostModel({
            ...postData,
            flairs: flairs,
        })
    );
}

export function handleCustomFlairClick(
    newFlair: string | undefined,
    customFlairs: string[],
    setPostData: (p: PostModel) => void,
    postData: PostModel
) {
    const flairs = postData.flairs!.filter((f) => !customFlairs.includes(f));
    if (newFlair) flairs.push(newFlair);

    setPostData(
        new PostModel({
            ...postData,
            flairs: flairs,
        })
    );
}
