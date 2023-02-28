import { GlobalStyle } from './styles/global'
import {ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { defaultTheme } from './styles/theme/default'
import { Router } from './Router'
import { CylesContextProvider } from './contexts/CyclesContext'



export function App() {

  
  return(
  <ThemeProvider theme={defaultTheme}>
    <BrowserRouter>
      <CylesContextProvider>
        <Router/>
       </CylesContextProvider>
      <GlobalStyle/>
    </BrowserRouter>
  </ThemeProvider>
  )

}
