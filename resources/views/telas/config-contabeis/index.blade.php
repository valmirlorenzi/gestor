@extends('layouts.app')

@section('title', 'Configurações Contábeis')

@section('content')
<div id="config-contabeis-list-app">
  <div class="page-header" style="margin-bottom:16px;">
    <h1>Configurações contábeis</h1>
  </div>

  <div class="card">
    <h2>Mapeamento referencial ECD/ECF</h2>
    <p class="muted">Contas analíticas do plano de contas interno mapeadas para o referencial da Receita Federal.</p>
    <table class="data" id="tabela-config-contabeis">
      <thead>
        <tr>
          <th>Conta interna</th>
          <th>Descrição</th>
          <th>Conta referencial</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="config-contabeis-vazio" style="display:none;">Nenhuma conta analítica cadastrada.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/config-contabeis-list.js') }}"></script>
@endpush