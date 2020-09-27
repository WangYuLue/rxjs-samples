import { fromEvent } from 'rxjs';
import { tap, map, switchMap, takeUntil } from 'rxjs/operators';

function getTranslate(element) {
  const style = getComputedStyle(element)
  const regExp = /matrix\((\d+,\s){4}(\d+),\s(\d+)/i
  const result = style.transform.match(regExp)
  if (result) {
    return {
      x: parseInt(result[2], 10),
      y: parseInt(result[3], 10)
    }
  } else {
    return {
      x: 0,
      y: 0
    }
  }
}

function setTranslate(element, pos) {
  element.style.transform = `translate(${pos.x}px, ${pos.y}px)`
}

const init = () => {
  const box = document.getElementById('box');
  if (box) {
    const mouseDown$ = fromEvent(box, 'mousedown');
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');

    mouseDown$.pipe(
      map(event => {
        return {
          pos: getTranslate(box),
          event
        }
      }),
      switchMap(state => {
        const initialPos = state.pos
        const e = state.event
        const { clientX, clientY } = e as MouseEvent;
        return mouseMove$.pipe(
          map(moveEvent => ({
            x: (moveEvent as MouseEvent).clientX - clientX + initialPos.x,
            y: (moveEvent as MouseEvent).clientY - clientY + initialPos.y,
          })),
          takeUntil(mouseUp$)
        )
      })
    ).subscribe((pos) => {
      setTranslate(box, pos)
    })
  }
}

init();