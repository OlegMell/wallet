export const isTouchDevice = () => {
    if ( "maxTouchPoints" in navigator ) {
        return navigator.maxTouchPoints > 0;
    }
    return false;
}