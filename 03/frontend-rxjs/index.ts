import { fromEvent } from 'rxjs';
import { tap, map, switchMap, takeUntil } from 'rxjs/operators';

function getTranslate(dom: HTMLElement): { top: number, left: number } {
  const { top, left } = dom.getBoundingClientRect()
  return { top, left }
}

function setTranslate(element: HTMLElement, pos: { top: number, left: number }) {
  const { top, left } = pos;
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
}

const init = () => {
  const box = document.getElementById('box');

  if (box) {
    const mouseDown$ = fromEvent(box, 'mousedown');
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');

    mouseDown$.pipe(
      map(event => {
        const { clientX, clientY } = event as MouseEvent
        return {
          boxPositon: getTranslate(box),
          mousePosition: {
            top: clientY,
            left: clientX
          }
        }
      }),
      switchMap(position => {
        const { boxPositon, mousePosition } = position
        return mouseMove$.pipe(
          map(event => {
            const { clientX, clientY } = event as MouseEvent
            return {
              left: clientX - mousePosition.left + boxPositon.left,
              top: clientY - mousePosition.top + boxPositon.top
            }
          }),
          takeUntil(mouseUp$)
        )
      })
    ).subscribe((pos) => {
      setTranslate(box, pos)
    })
  }
}

init();