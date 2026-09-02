import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { PlayerProvider } from './Contexts/PlayerContext';

const appName = import.meta.env.VITE_APP_NAME || 'SoundLore';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <PlayerProvider>
                <App {...props} />
            </PlayerProvider>
        );
    },
    progress: {
        color: '#818cf8',
    },
});