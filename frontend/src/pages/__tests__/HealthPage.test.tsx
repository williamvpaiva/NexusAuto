import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HealthPage } from '../HealthPage';
import * as api from '../../lib/api';

vi.mock('../../lib/api', () => ({
  getHealth: vi.fn(),
}));

describe('HealthPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should match the initial snapshot (loading state)', () => {
    vi.mocked(api.getHealth).mockReturnValue(new Promise(() => {})); // Never resolves
    
    render(<HealthPage />);
    expect(screen.getByText('Consultando backend...')).toBeInTheDocument();
  });

  it('should display health data when loaded', async () => {
    const mockData = {
      status: 'ok' as const,
      service: 'NexusAuto API',
      version: '1.0.0',
      environment: 'test',
      uptime: 12345,
      timestamp: new Date('2026-07-06T15:26:00Z').toISOString()
    };
    
    vi.mocked(api.getHealth).mockResolvedValue(mockData);
    
    render(<HealthPage />);
    
    await waitFor(() => {
      expect(screen.queryByText('Consultando backend...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('NexusAuto API')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should display error message on failure', async () => {
    vi.mocked(api.getHealth).mockRejectedValue(new Error('Network error'));
    
    render(<HealthPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
