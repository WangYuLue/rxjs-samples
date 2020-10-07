import { fromEvent, zip, interval, from } from 'rxjs';
import { filter, map, mergeMap, switchMap, takeUntil, tap, startWith } from 'rxjs/operators';

interface IPosition {
  top: number;
  left: number;
}

function getDomPosition(dom: HTMLElement): IPosition {
  const { top, left } = dom.getBoundingClientRect()
  return { top, left }
}

// function setDomPosition(element: HTMLElement, pos: IPosition) {
//   const { top, left } = pos;
//   element.style.top = `${top}px`;
//   element.style.left = `${left}px`;
// }

// 这边使用 translate 来避免频繁重排，要不然会非常卡顿
function setDomPosition(element: HTMLElement, pos: IPosition) {
  const { top, left } = pos;
  element.style.transform = `translate(${left}px, ${top}px)`
}

const init = () => {
  const $box = document.getElementById('head');

  if ($box) {
    const mouseDown$ = fromEvent($box, 'mousedown');
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');

    const follows = Array.from(document.getElementsByClassName('box'));

    const delayBoxes$ = zip(
      interval(100).pipe(startWith(0)),
      from(follows)
    ).pipe(
      map(([num, box]) => box),
      filter((box): box is HTMLElement => !!box)
    )

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
      }),
      mergeMap(position => {
        return delayBoxes$.pipe(
          tap(box => setDomPosition(box, position))
        )
      })
    ).subscribe()
  }
}

init();