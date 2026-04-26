import React from 'react';
import useReveal from '../hooks/useReveal';

const Reveal = ({
  as: Tag = 'div',
  delay = 0,
  direction = 'up',
  className = '',
  children,
  threshold,
  ...rest
}) => {
  const [ref, revealed] = useReveal(threshold !== undefined ? { threshold } : undefined);

  return (
    <Tag
      ref={ref}
      data-reveal={direction}
      data-revealed={revealed ? 'true' : 'false'}
      style={{ transitionDelay: revealed ? `${delay}ms` : '0ms' }}
      className={`reveal ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
