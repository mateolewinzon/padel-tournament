// app/unauthorized/page.tsx
export default function Unauthorized() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
          <p className="text-gray-700">No tienes permiso para acceder a esta página.</p>
          <a href="/login" className="text-blue-500 hover:underline mt-4 inline-block">
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    )
  }