import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './styles.css'

const DemoPage = lazy(() => import('./pages/DemoPage'))
const AntdPage = lazy(() => import('./pages/AntdPage'))
const MantinePage = lazy(() => import('./pages/MantinePage'))
const MuiPage = lazy(() => import('./pages/MuiPage'))
const CustomPage = lazy(() => import('./pages/CustomPage'))

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
    <span style={{ color: '#9ca3af', fontSize: 14 }}>Loading...</span>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<App />}>
            <Route index element={<DemoPage />} />
            <Route path="antd" element={<AntdPage />} />
            <Route path="mantine" element={<MantinePage />} />
            <Route path="mui" element={<MuiPage />} />
            <Route path="custom" element={<CustomPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  </React.StrictMode>,
)
