import Popup from '@/containers/Popup/Popup';
import { createRoot } from 'react-dom/client';

const main = () => {
  const div = document.createElement('div');
  const root = createRoot(div);

  document.body.prepend(div);

  root.render(<Popup />);
};

setTimeout(main, 100);
