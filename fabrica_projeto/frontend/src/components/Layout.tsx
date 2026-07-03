import { Link, useLocation } from 'react-router-dom';
import type { PropsWithChildren } from 'react';

export function Layout({ children }: PropsWithChildren) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Polymarketing</h1>
          <p>AI Factory Full Stack</p>
        </div>

        <nav className="nav">
          <Link className={location.pathname === '/' ? 'active' : ''} to="/">
            Usuários
          </Link>
          <Link className={location.pathname === '/health' ? 'active' : ''} to="/health">
            Health
          </Link>
        </nav>
      </header>

      <main className="content">{children}</main>

      <footer className="footer">
        <p>AI Factory - Desenvolvido com React + Express + TypeScript</p>
      </footer>
    </div>
  );
}