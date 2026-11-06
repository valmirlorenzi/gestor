@extends('layouts.app')

@section('title', 'Validação de Cálculos')

@section('content')
<div id="validacao-list-app">
  <div class="page-header" style="margin-bottom:16px;">
    <h1>Validação de Cálculos</h1>
  </div>

  <div class="card">
    <h2>Razão de impostos — período aberto</h2>
    <table class="data" id="tabela-validacao">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Natureza</th>
          <th>Valor</th>
          <th>Validado</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="validacao-vazio" style="display:none;">Nenhum cálculo pendente de validação no período.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/validacao-list.js') }}"></script>
@endpush