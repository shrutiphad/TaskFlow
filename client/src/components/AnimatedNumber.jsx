import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function AnimatedNumber({ value }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const spanRef = useRef(null);

  useEffect(() => {
    const controls = animate(motionVal, value, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => rounded.on('change', (v) => {
    if (spanRef.current) spanRef.current.textContent = v;
  }), [rounded]);

  return <motion.span ref={spanRef} className="tabular">0</motion.span>;
}
