import { Scene } from './components/Scene';
import { Interface } from './components/Interface';

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: 'var(--color-bg)' }}>
      <Scene />
      <Interface />
    </div>
  );
}

export default App;
