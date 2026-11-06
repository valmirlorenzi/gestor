@extends('layouts.app')

@section('title', 'Tabelas Basais — Vendas')

@section('content')
<div id="tabelas-vendas-app">
  <div class="page-header" style="margin-bottom:16px;">
    <h1>Tabelas Basais — Vendas</h1>
  </div>

  <div class="card">
    <h2>Tabelas</h2>

    <div class="tabs" role="tablist">
      <button type="button" class="tab active" data-tab="tipos">Tipos de cliente</button>
      <button type="button" class="tab" data-tab="prazos">Prazos padrão</button>
    </div>

    <div id="tab-tipos" class="tab-content">
      <table class="data" id="tabela-tipos-cliente">
        <thead>
          <tr><th>Descrição</th><th>Ativo</th><th>Ações</th></tr>
        </thead>
        <tbody></tbody>
      </table>
      <p class="muted" id="tipos-vazio" style="display:none;">Nenhum tipo cadastrado.</p>
      <button type="button" class="btn btn-primary" id="novo-tipo" style="margin-top:12px;">Novo tipo</button>
    </div>

    <div id="tab-prazos" class="tab-content" style="display:none;">
      <table class="data" id="tabela-prazos-venda">
        <thead>
          <tr><th>Descrição</th><th>Dias</th><th>Parcelas</th><th>Ativo</th><th>Ações</th></tr>
        </thead>
        <tbody></tbody>
      </table>
      <p class="muted" id="prazos-vazio" style="display:none;">Nenhum prazo cadastrado.</p>
      <button type="button" class="btn btn-primary" id="novo-prazo" style="margin-top:12px;">Novo prazo</button>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/tabelas-basais-vendas.js') }}"></script>
@endpush