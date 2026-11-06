@extends('layouts.app')

@section('title', 'Regras de Classificação')

@section('content')
<div id="regra-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Regras de Classificação</h1>
    <a href="{{ route('regras-classificacao.create') }}" class="btn btn-primary">Nova regra</a>
  </div>

  <div class="card">
    <h2>Regras cadastradas</h2>
    <table class="data" id="tabela-regras">
      <thead>
        <tr>
          <th>Prioridade</th>
          <th>Descrição</th>
          <th>Origem</th>
          <th>Conta destino</th>
          <th>Ativo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="regras-vazio" style="display:none;">Nenhuma regra cadastrada.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/regras-classificacao-list.js') }}"></script>
@endpush