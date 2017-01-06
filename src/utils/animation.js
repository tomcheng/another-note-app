const getCurrentTime = () => new Date().getTime();

/*eslint-disable */
export const easeInOutCubic = x => {
  if ((x /= 1 / 2) < 1) { return 1 / 2 * x * x * x; }
  return 1 / 2 * ((x -= 2) * x * x + 2);
};
/*eslint-enable */

export const animate = ({ start, end, duration, easing = easeInOutCubic, onUpdate, onComplete }) => {
  const startTime = getCurrentTime();
  let timePassed;

  const animationLoop = () => {
    timePassed = getCurrentTime() - startTime;

    if (timePassed >= duration) {
      onUpdate(end);
      if (onComplete) { onComplete(); }
      return;
    }

    onUpdate((end - start) * easing(timePassed / duration) + start);

    window.requestAnimationFrame(animationLoop);
  };

  animationLoop();
};
