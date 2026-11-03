@extends('layouts.app')

@section('title', 'Tela Inicial')

@section('content')
<div class="tela-inicial">

  {{-- ========== SAUDAÇÃO ========== --}}
  <header class="ti-saudacao">
    <h1>👋 Olá, {{ $usuario?->nome ?? 'Usuário' }}</h1>
    <p class="muted">
      {{ now()->format('d/m/Y') }}
      @if ($periodo) · Período {{ $periodo }} @endif
      @if ($filial) · Filial: {{ $filial }} @endif
      @if ($ator) · Ator: {{ ucfirst(str_replace('_', ' ', $ator)) }} @endif
    </p>
  </header>

  {{-- ========== CONTEÚDO POR ATOR ========== --}}
  @php
    $partial = 'partials.tela-inicial.' . $variante;
  @endphp

  @if (view()->exists($partial))
    @include($partial)
  @else
    @include('partials.tela-inicial.universal')
  @endif

</div>
@endsection