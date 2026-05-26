// my-pwa\hooks\useClickOutside.ts
import { useEffect, RefObject } from 'react';

export function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Если клик был внутри элемента, ничего не делаем
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      // Иначе вызываем функцию закрытия
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}