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
    let isMoving = false;
    let boxPosition: IPosition;
    let mouseStartPosition: IPosition;
    let mouseEndPosition: IPosition;

    const follows = Array.from(document.getElementsByClassName('box'));

    const delayMove = (doms: HTMLElement[], timeout: number) => {
      const cpBoxPosition = boxPosition;
      const cpMouseStartPosition = mouseStartPosition;
      const cpMouseEndPosition = mouseEndPosition;
      const _setDomPosition = (dom) => {
        setDomPosition(dom, {
          left: cpMouseEndPosition.left - cpMouseStartPosition.left + cpBoxPosition.left,
          top: cpMouseEndPosition.top - cpMouseStartPosition.top + cpBoxPosition.top
        })
      }
      _setDomPosition(doms[0])
      for (let x = 1; x < doms.length; x++) {
        setTimeout(() => {
          _setDomPosition(doms[x])
        }, timeout * x)
      }
    }

    const onMouseDown = event => {
      isMoving = true;
      const { clientX, clientY } = event as MouseEvent;
      mouseStartPosition = { left: clientX, top: clientY };
      boxPosition = getDomPosition($box);
    }
    const onMouseMove = event => {
      if (isMoving) {
        const { clientX, clientY } = event as MouseEvent;
        mouseEndPosition = { left: clientX, top: clientY };
        delayMove(follows as HTMLElement[], 100)
      }
    }
    const onMouseUp = () => {
      if (isMoving) {
        isMoving = false;
      }
    }

    $box.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}

init();

export { }