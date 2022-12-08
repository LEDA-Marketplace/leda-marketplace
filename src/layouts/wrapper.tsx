import { ToastContainer } from 'react-toastify';
import Footer from '@layout/footer';
import Header from '@layout/header';
import ScrollToTop from '@ui/scroll-to-top';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { selectAuthState } from '../features/auth/store/auth.slice';
import useAppDispatch from '../store/hooks/useAppDispatch';
import { findLikedItemsByAccount } from '../features/account/store/account.actions';
import useAppSelector from '../store/hooks/useAppSelector';
import { setIsNetworkAdviceOpen } from '../store/ui/ui.slice';
import { resetSelectedCollectionStats } from '../features/collections/store/collections.slice';
import useSticky from '../hooks/use-sticky';

type Props = {
  children: React.ReactNode;
};

const Wrapper = ({ children }: Props) => {
  const sticky = useSticky();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, address } = useAppSelector(selectAuthState);

  useEffect(() => {
    if (isAuthenticated) dispatch(findLikedItemsByAccount(address));
    dispatch(resetSelectedCollectionStats());
    dispatch(setIsNetworkAdviceOpen(true));
  }, [dispatch, isAuthenticated, address]);

  return (
    <>
      <Header />
      <main id="main-content" style={{ paddingTop: sticky ? '15rem' : '' }}>
        {children}
      </main>
      <ScrollToTop />
      <ToastContainer
        theme={theme}
        pauseOnHover={false}
        newestOnTop
        position="top-right"
        autoClose={5000}
      />
      <Footer />
    </>
  );
};

export default Wrapper;
