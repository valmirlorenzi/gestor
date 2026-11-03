@extends('layouts.app')

@section('title', 'Caixa de Saída')

@section('content')
<div class="tela-tarefas">
  <header class="tela-tarefas-header">
    <h1>📤 Caixa de Saída</h1>
    <p class="muted">Tarefas que você criou/enviou e ainda estão em andamento.</p>
  </header>

  @include('telas.tarefas._tabela')
</div>
@endsection