import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';

describe('Layout', () => {
  it('should render the layout with header and footer', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    // Header
    expect(screen.getByText('NexusAuto')).toBeInTheDocument();
    
    // Navigation links
    expect(screen.getByRole('link', { name: /usuários/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /veículos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /health/i })).toBeInTheDocument();

    // Content
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/Desenvolvido com React/i)).toBeInTheDocument();
  });
});
