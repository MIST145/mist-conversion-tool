import { Link, useLocation } from 'react-router-dom';
import { Code2, Home, Layers, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FiveM Converter
            </span>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button
              variant={isActive('/patterns') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/patterns">
                <Layers className="h-4 w-4 mr-2" />
                Patterns
              </Link>
            </Button>
            
            <Button
              variant={isActive('/help') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/help">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
