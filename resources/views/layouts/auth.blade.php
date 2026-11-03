<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Gestor Gerencial — @yield('title', 'Entrar')</title>
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/imagens/favicon.png') }}">
  <link rel="stylesheet" href="{{ asset('assets/css/geral.css') }}">
  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f6f8;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .login-container { width: 100%; max-width: 420px; padding: 24px; }
    .login-card {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
    .login-card h1 { margin: 0 0 24px; font-size: 24px; }
    .login-card label { display: block; margin: 12px 0 4px; font-weight: 500; }
    .login-card input[type="email"],
    .login-card input[type="password"] {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
    }
    .login-card .btn-primario {
      width: 100%;
      margin-top: 20px;
      padding: 12px;
      border: none;
      border-radius: 6px;
      background: #2563eb;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
    }
    .login-card .btn-primario:hover { background: #1d4ed8; }
    .alert-erro {
      background: #fee2e2;
      color: #991b1b;
      padding: 10px 12px;
      border-radius: 6px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  @yield('content')
</body>
</html>