import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';

import NavBar from '../../components/NavBar';
import Home from '../page';
import CV from '../cv/page';
import Projects from '../projects/page';
import Photos from '../photos/page';
import Contact from '../contact/page';

describe('Route headlines', () => {
  it('renders home headline', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /welcome to my personal website/i })
    ).toBeInTheDocument();
  });

  it('renders CV headline', () => {
    render(<CV />);
    expect(
      screen.getByRole('heading', { name: /curriculum vitae/i })
    ).toBeInTheDocument();
  });

  it('renders projects headline', () => {
    render(<Projects />);
    expect(
      screen.getByRole('heading', { name: /projects/i })
    ).toBeInTheDocument();
  });

  it('renders photos headline', () => {
    render(<Photos />);
    expect(
      screen.getByRole('heading', { name: /photography/i })
    ).toBeInTheDocument();
  });

  it('renders contact headline', () => {
    render(<Contact />);
    expect(
      screen.getByRole('heading', { name: /contact/i })
    ).toBeInTheDocument();
  });
});

describe('Navigation', () => {
  it('navigates between routes using the nav bar', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    await user.click(screen.getByText('CV'));
    expect(mockRouter).toMatchObject({ asPath: '/cv' });

    await user.click(screen.getByText('Projects'));
    expect(mockRouter).toMatchObject({ asPath: '/projects' });

    await user.click(screen.getByText('Photos'));
    expect(mockRouter).toMatchObject({ asPath: '/photos' });

    await user.click(screen.getByText('Contact'));
    expect(mockRouter).toMatchObject({ asPath: '/contact' });

    await user.click(screen.getByText('Home'));
    expect(mockRouter).toMatchObject({ asPath: '/' });
  });
});
