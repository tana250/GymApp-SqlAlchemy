import './App.css'

import { useAuth } from './hooks/useAuth'

import LoginForm from './components/Auth/LoginForm'

import SociosPage from './pages/SociosPage'
import PlanesPage from './pages/PlanesPage'
import CuotasPage from './pages/CuotasPage'
import MetodosPagoPage from './pages/MetodosPagoPage'
import PagosPage from './pages/PagosPage'


function App() {
  const {
    usuario,
    checking,
    login,
    logout,
  } = useAuth()

  if (checking) {
    return <p>Cargando...</p>
  }

  if (!usuario) {
    return <LoginForm onLogin={login} />
  }

  return (
    <>
      <header>
        <p>Usuario: {usuario.username}</p>

        <button
          type="button"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </header>

      <SociosPage />
      <PlanesPage />
      <CuotasPage />
      <MetodosPagoPage />
      <PagosPage />
    </>
  )
}

export default App