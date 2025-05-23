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
    <StoreProvider>
      <ThemeProviderWrapper>


        <PersistLogin>
          <Prefetch>
            <p>Hello. We have updated to the version 1.1.1.1.1.1.1.7.1.2</p>
            <Header />
            <Container component={Paper} sx={{ minHeight: '100vh', padding: '1rem 0 1rem 0' }}>
              {children}
            </Container>
            <Footer />
          </Prefetch>
        </PersistLogin>


      </ThemeProviderWrapper>
    </StoreProvider>
  )
}

export default Providers;

export async function wait(n: number) {
  return new Promise(res => setTimeout(res, n))
}
