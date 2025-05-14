'use client'
import { ThemeProvider, createTheme } from "@mui/material"

const theme = createTheme({
  palette: {
    mode: "dark"
  }
})

const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
export default ThemeProviderWrapper