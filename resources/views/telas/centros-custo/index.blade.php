@extends('layouts.app')

@section('title', 'Centros de Custo')

@section('content')
<div id="centro-custo-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Centros de Custo</h1>
    <a href="{{ route('centros-custo.create') }}" class="btn btn-primary">Novo centro de custo</a>
  </div>

  <div class="card">
    <h2>Centros cadastrados</h2>
    <table class="data" id="tabela-centros-custo">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Responsável</th>
          <th>Ativo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="centro-custo-vazio" style="display:none;">Nenhum centro de custo cadastrado.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/centros-custo-list.js') }}"></script>
@endpush