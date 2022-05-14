import {NextPage} from 'next';
import {AppProps} from 'next/app';
import React, {ReactElement, ReactNode} from 'react';
import {Toaster} from 'react-hot-toast';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import {ThemeProvider} from 'styled-components';
import {GlobalStyle, MainTheme} from '../theme/theme';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App: React.FC<AppPropsWithLayout> = ({Component, pageProps}) => {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <ThemeProvider theme={MainTheme}>
      <GlobalStyle />
      <Toaster />
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
};

export default App;
