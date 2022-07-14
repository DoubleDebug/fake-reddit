import { SCREEN_WIDTH_THRESHOLD } from '../misc/constants';
import { useWindowWidth } from './useWindowWidth';

export function useIsMobile() {
  const windowWidth = useWindowWidth();
  return windowWidth <= SCREEN_WIDTH_THRESHOLD;
}
