@extends('layouts.app')

@section('title', 'Caixa de Entrada')

@section('content')
<div class="tela-tarefas">
  <header class="tela-tarefas-header">
    <h1>📥 Caixa de Entrada</h1>
    <p class="muted">Tarefas pendentes e em andamento para o seu ator.</p>
  </header>

  @include('telas.tarefas._tabela')
</div>
@endsection