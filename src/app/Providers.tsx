'use client';
import { ReactNode } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import StoreProvider from './StoreProvider';
import ThemeProviderWrapper from './ThemeProviderWrapper';
import Prefetch from './lib/features/auth/Prefetch';
import CheckAuth from './lib/features/auth/CheckAuth';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeProviderWrapper>

        <CheckAuth>
          <Prefetch>
            <p>Hello. We have updated to the version 1.1.1.1.1.1.1.7.1.4</p>
            <Header />
            <Container component={Paper} sx={{ minHeight: '100vh', padding: '1rem 0 1rem 0' }}>
              {children}
            </Container>
            <Footer />
          </Prefetch>
        </CheckAuth>

      </ThemeProviderWrapper>
    </StoreProvider>
  )
}

export default Providers;

export async function wait(n: number) {
  return new Promise(res => setTimeout(res, n))
}
