import { Outlet, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Demo' },
  { to: '/antd', label: 'Ant Design', color: '#1677ff' },
  { to: '/mantine', label: 'Mantine', color: '#228be6' },
  { to: '/mui', label: 'Material UI', color: '#1976d2' },
  { to: '/custom', label: 'Custom', color: '#7c3aed' },
]

export default function App() {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>fjorm</h1>
        <nav className="app-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-link${isActive ? ' active' : ''}`
              }
              style={({ isActive }) =>
                isActive && item.color
                  ? ({ '--accent': item.color } as React.CSSProperties)
                  : undefined
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
