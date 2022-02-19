export function handleBackToTopEvent(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}
