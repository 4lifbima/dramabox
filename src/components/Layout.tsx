import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="app-container">
            {/* Blob Background */}
            <div className="blob-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <Header />
            <main className="main-content">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
