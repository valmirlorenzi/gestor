@extends('layouts.app')

@section('title', 'Ativos')

@section('content')
<div id="ativo-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Ativos</h1>
    <a href="{{ route('ativos.create') }}" class="btn btn-primary">Novo ativo</a>
  </div>

  <div class="card">
    <h2>Ativos cadastrados</h2>
    <table class="data" id="tabela-ativos">
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Aquisição</th>
          <th>Valor original</th>
          <th>Centro de custo</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="ativo-vazio" style="display:none;">Nenhum ativo cadastrado.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/ativos-list.js') }}"></script>
@endpush