import React from 'react';

const motion = new Proxy(
  {},
  {
    get: (_target, prop: string) => {
      return React.forwardRef((props: any, ref: any) => {
        const { initial, animate, exit, transition, whileHover, whileTap, layout, layoutId, ...rest } = props;
        return React.createElement(prop, { ...rest, ref });
      });
    },
  }
);

const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export { motion, AnimatePresence };
