// app/register/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    //   e.preventDefault()
    //   setError("")

    //   if (!name || !email || !password) {
    //     setError("Por favor, completa todos los campos.")
    //     return
    //   }

    //   if (password.length < 6) {
    //     setError("La contraseña debe tener al menos 6 caracteres.")
    //     return
    //   }

    //   try {
    //     // Register user
    //     const { data: authData, error: authError } = await supabase.auth.signUp({
    //       email,
    //       password,
    //       options: { data: { name } },
    //     })

    //     if (authError) throw authError

    //     const userId = authData.user?.id
    //     if (!userId) throw new Error("No user ID returned")

    //     // Insert profile with default role
    //     const { error: profileError } = await supabase
    //       .from("profiles")
    //       .insert({ user_id: userId, name: name, role: "user" })

    //     if (profileError) throw profileError

    //     router.push("/login")
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : "Error al registrarse")
    //   }
  }

  // JSX remains the same
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registrarse</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}