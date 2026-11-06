@extends('layouts.app')

@section('title', 'Fechar Período')

@section('content')
<div id="fechar-periodo-app">
  <div class="page-header" style="margin-bottom:16px;">
    <h1>Fechar Período</h1>
  </div>

  <div class="card">
    <h2>Períodos abertos desta filial</h2>
    <table class="data" id="tabela-periodos">
      <thead>
        <tr>
          <th>Mês/Ano</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="periodos-vazio" style="display:none;">Nenhum período aberto.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/fechar-periodo.js') }}"></script>
@endpush