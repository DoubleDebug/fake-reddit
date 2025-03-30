export function onImageLoad(
  setIsLoading: (l: boolean) => void,
  setIndex: (i: number) => void,
) {
  setIsLoading(false);
  setIndex(1);
  setTimeout(() => {
    setIndex(0); // reset to 0 in order to re-mount carousel
  }, 0);
}
