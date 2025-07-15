'use client';
import { ReactNode } from 'react'
import Header from './components/Header'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import StoreProvider from './StoreProvider';
import ThemeProviderWrapper from './ThemeProviderWrapper';
import Prefetch from './lib/features/auth/Prefetch';
import CheckAuth from './lib/features/auth/CheckAuth';
import Popup from './components/Popup';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeProviderWrapper>
        <CheckAuth>
          <Prefetch>
            <Header />
            <Container component={Paper} sx={{ minHeight: '100vh', padding: '1rem' }}>
              <Popup>
                {children}
              </Popup>
            </Container>
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
