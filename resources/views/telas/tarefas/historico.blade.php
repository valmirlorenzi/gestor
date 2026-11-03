@extends('layouts.app')

@section('title', 'Histórico')

@section('content')
<div class="tela-tarefas">
  <header class="tela-tarefas-header">
    <h1>🕘 Histórico</h1>
    <p class="muted">Tarefas concluídas (últimas 50).</p>
  </header>

  @include('telas.tarefas._tabela')
</div>
@endsection