@extends('layouts.app')

@section('title', 'Serviços')

@section('content')
<div id="servico-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Serviços</h1>
    <a href="{{ route('servicos.create') }}" class="btn btn-primary">Novo serviço</a>
  </div>

  <div class="card">
    <h2>Serviços cadastrados</h2>
    <table class="data" id="tabela-servicos">
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Código interno</th>
          <th>LC 116</th>
          <th>Ativo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="servico-vazio" style="display:none;">Nenhum serviço cadastrado.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/servicos-list.js') }}"></script>
@endpush