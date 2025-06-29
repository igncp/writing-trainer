import GTButton from '../../common/Links/GoogleTranslateButton';
import { T_LinksBlock } from '../../types';

const LinksBlock: T_LinksBlock = ({ 文字 }) => (
  <GTButton language="ja" text={文字} />
);

export default LinksBlock;
