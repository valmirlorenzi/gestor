@extends('layouts.app')

@section('title', 'Importações')

@section('content')
<div id="importacoes-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Importações</h1>
  </div>

  <div class="card">
    <h2>Importar cadastros (CSV)</h2>
    <div class="form-row">
      <label>Recurso</label>
      <select id="cadastro-recurso">
        @foreach($recursosCadastro as $chave => $meta)
          <option value="{{ $chave }}">{{ $meta['rotulo'] }}</option>
        @endforeach
      </select>
    </div>
    <div class="form-row">
      <label>Modo</label>
      <select id="cadastro-modo">
        <option value="inserir">Inserir (falha se já existe)</option>
        <option value="atualizar">Atualizar (falha se não existe)</option>
        <option value="upsert">Inserir ou atualizar</option>
      </select>
    </div>
    <div class="form-row">
      <label>Arquivo CSV</label>
      <input type="file" id="cadastro-arquivo" accept=".csv,text/csv">
    </div>
    <div class="form-actions" style="margin-top:12px;">
      <button type="button" class="btn btn-secondary" id="cadastro-baixar-template">Baixar template</button>
      <button type="button" class="btn btn-primary" id="cadastro-pre-validar">Pré-validar</button>
      <button type="button" class="btn btn-primary" id="cadastro-confirmar" disabled>Confirmar</button>
    </div>
    <table class="data" id="cadastro-relatorio" style="margin-top:16px;">
      <thead>
        <tr><th>#</th><th>Status</th><th>Motivo</th><th>Avisos</th><th>ID</th></tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="cadastro-vazio">Nenhum relatório ainda.</p>
  </div>

  <div class="card">
    <h2>Importar documentos (XML)</h2>
    <div class="form-row">
      <label>Recurso</label>
      <select id="documento-recurso">
        @foreach($recursosDocumento as $chave => $meta)
          <option value="{{ $chave }}">{{ $meta['rotulo'] }}</option>
        @endforeach
      </select>
    </div>
    <div class="form-row">
      <label>Arquivo XML</label>
      <input type="file" id="documento-arquivo" accept=".xml,application/xml,text/xml">
    </div>
    <div class="form-actions" style="margin-top:12px;">
      <button type="button" class="btn btn-primary" id="documento-pre-validar">Pré-validar</button>
      <button type="button" class="btn btn-primary" id="documento-confirmar" disabled>Confirmar</button>
    </div>
    <table class="data" id="documento-relatorio" style="margin-top:16px;">
      <thead>
        <tr><th>#</th><th>Status</th><th>Motivo</th><th>Avisos</th><th>ID</th></tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="documento-vazio">Nenhum relatório ainda.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/importacoes.js') }}"></script>
@endpush