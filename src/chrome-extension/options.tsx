import Options from '@/containers/Options/Options';
import { createRoot } from 'react-dom/client';

const main = () => {
  const div = document.createElement('div');
  const root = createRoot(div);

  document.body.prepend(div);

  root.render(<Options />);
};

setTimeout(main, 100);
