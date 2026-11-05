@extends('layouts.app')

@section('title', 'Plano de Contas')

@section('content')
<div id="plano-contas-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Plano de Contas</h1>
    <a href="{{ route('plano-contas.create') }}" class="btn btn-primary">Nova conta</a>
  </div>

  <div class="card">
    <h2>Contas cadastradas</h2>
    <table class="data" id="tabela-plano-contas">
      <thead>
        <tr>
          <th>Código</th>
          <th>Descrição</th>
          <th>Tipo</th>
          <th>Natureza</th>
          <th>Ativo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="plano-contas-vazio" style="display:none;">Nenhuma conta cadastrada.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/plano-contas-list.js') }}"></script>
@endpush