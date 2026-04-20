import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

export const createRoot = ViteReactSSG(
  {
    routes,
  },
  ({ isClient }) => {
    if (isClient) {
      // Initialize Mermaid only on client
      import('mermaid').then(m => {
        m.default.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#e879f9',
            primaryTextColor: '#f1f5f9',
            primaryBorderColor: '#1e293b',
            lineColor: '#64748b',
            secondaryColor: '#0f172a',
            tertiaryColor: '#020617',
            background: '#020617',
            mainBkg: '#0f172a',
            secondBkg: '#1e293b',
            textColor: '#cbd5e1',
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
        });
      });
    }
  }
)