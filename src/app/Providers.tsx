'use client';
import { ReactNode } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import StoreProvider from './StoreProvider';
import ThemeProviderWrapper from './ThemeProviderWrapper';
import Prefetch from './lib/features/auth/Prefetch';
import PersistLogin from './lib/features/auth/PersistLogin';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Prefetch>
      <StoreProvider>
        <ThemeProviderWrapper>

          <Header />

          <Container component={Paper} sx={{ minHeight: '100vh', padding: '1rem 0 1rem 0'}}>
            <PersistLogin>
              {children}
            </PersistLogin>
          </Container>

          <Footer />

        </ThemeProviderWrapper>
      </StoreProvider>
    </Prefetch>
  )
}

export default Providers;

async function wait(n: number) {
  return new Promise(res => setTimeout(res, n))
}
