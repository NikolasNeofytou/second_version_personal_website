import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import mockRouter from 'next-router-mock';

afterEach(() => {
  cleanup();
  mockRouter.setCurrentUrl('/');
});

vi.mock('next/image', () => ({
  default: (props: any) => {
    const { src, alt, ...rest } = props;
    return React.createElement('img', { src, alt, ...rest });
  },
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => {
    return React.createElement(
      'a',
      {
        href,
        onClick: (e: any) => {
          e.preventDefault();
          mockRouter.push(href);
        },
        ...rest,
      },
      children
    );
  },
}));
