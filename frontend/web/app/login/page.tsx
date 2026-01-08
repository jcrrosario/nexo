'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [tenant, setTenant] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login inválido');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);

      alert('Login realizado com sucesso');
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 via-blue-100 to-white">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {/* Logo / Título */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-900">
            NEXO
          </h1>
          <p className="text-sm text-blue-700 mt-1">
            Acesse sua conta
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Tenant */}
          <div>
            <input
              type="text"
              placeholder="Número da entidade"
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Usuário (email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Senha */}
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Links */}
          <div className="flex justify-between text-sm text-blue-600">
            <button type="button" className="hover:underline">
              Trocar senha
            </button>
            <button type="button" className="hover:underline">
              Esqueceu a senha?
            </button>
          </div>

          {/* Erro */}
          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Acessar'}
          </button>
        </form>

        {/* Rodapé */}
        <div className="text-center text-xs text-blue-500 mt-6">
          Serenyo
        </div>
      </div>
    </div>
  );
}
