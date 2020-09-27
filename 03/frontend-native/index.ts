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
  const box = document.getElementById('box');

  if (box) {
    let isMoving = false;
    let boxPosition: IPosition;
    let mouseStartPosition: IPosition;
    let mouseEndPosition: IPosition;

    const onMouseDown = event => {
      isMoving = true;
      const { clientX, clientY } = event as MouseEvent;
      mouseStartPosition = { left: clientX, top: clientY };
      boxPosition = getDomPosition(box);
    }
    const onMouseMove = event => {
      if (isMoving) {
        const { clientX, clientY } = event as MouseEvent;
        mouseEndPosition = { left: clientX, top: clientY };
        setDomPosition(box, {
          left: mouseEndPosition.left - mouseStartPosition.left + boxPosition.left,
          top: mouseEndPosition.top - mouseStartPosition.top + boxPosition.top
        })
      }
    }
    const onMouseUp = () => {
      if (isMoving) {
        isMoving = false;
      }
    }

    box.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}

init();

export { }