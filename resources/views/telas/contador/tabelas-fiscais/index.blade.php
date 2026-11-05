@extends('layouts.app')

@section('title', 'Tabelas Basais (Fiscais)')

@section('content')
<div id="tabelas-fiscais-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Tabelas basais (fiscais)</h1>
    <a href="{{ route('tabelas-fiscais.create') }}" class="btn btn-primary">Novo parâmetro</a>
  </div>

  <div class="card">
    <h2>Parâmetros fiscais</h2>
    <table class="data" id="tabela-parametros">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Descrição</th>
          <th>Alíquota</th>
          <th>Vigência</th>
          <th>Escopo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="parametros-vazio" style="display:none;">Nenhum parâmetro cadastrado.</p>
  </div>

  <div class="card" style="margin-top:16px;">
    <h2>Outras tabelas (somente leitura)</h2>
    <p class="muted">Tabelas universais — não adaptáveis por empresa.</p>
    <div class="form-actions" style="justify-content:flex-start;">
      <a href="{{ route('tabelas-fiscais.inss') }}" class="btn btn-secondary">Ver INSS</a>
      <a href="{{ route('tabelas-fiscais.irrf') }}" class="btn btn-secondary">Ver IRRF</a>
      <a href="{{ route('tabelas-fiscais.encargos') }}" class="btn btn-secondary">Ver Encargos</a>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/tabelas-fiscais-list.js') }}"></script>
@endpush