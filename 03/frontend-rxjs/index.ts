import { fromEvent } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

interface IPosition {
  top: number;
  left: number;
}

function getDomPosition(dom: HTMLElement): IPosition {
  const { top, left } = dom.getBoundingClientRect()
  return { top, left }
}

function setDomPosition(element: HTMLElement, pos: IPosition) {
  const { top, left } = pos;
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
}

const init = () => {
  const $box = document.getElementById('box');

  if ($box) {
    const mouseDown$ = fromEvent($box, 'mousedown');
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');

    mouseDown$.pipe(
      map(event => {
        const { clientX, clientY } = event as MouseEvent
        return {
          boxPositon: getDomPosition($box),
          mouseStartPosition: {
            top: clientY,
            left: clientX
          }
        }
      }),
      switchMap(position => {
        const { boxPositon, mouseStartPosition } = position
        return mouseMove$.pipe(
          map(event => {
            const { clientX, clientY } = event as MouseEvent
            return {
              left: clientX - mouseStartPosition.left + boxPositon.left,
              top: clientY - mouseStartPosition.top + boxPositon.top
            }
          }),
          takeUntil(mouseUp$)
        )
      })
    ).subscribe((pos) => {
      setDomPosition($box, pos)
    })
  }
}

init();