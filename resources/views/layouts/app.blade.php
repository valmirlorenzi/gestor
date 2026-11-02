<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Gestor Gerencial — @yield('title', 'Wireframe')</title>
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/imagens/favicon.png') }}">
  @include('partials.styles')
</head>
<body class="theme-modern">

  @include('partials.topbar')

  <div class="app">
    @include('partials.sidebar')

    <main class="content" id="content">
      @yield('content')
    </main>
  </div>

  @include('partials.scripts')
  @stack('scripts') 

</body>
</html>