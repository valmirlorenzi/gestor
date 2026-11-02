@extends('layouts.app')

@section('title', 'Filiais')

@section('content')
<div id="filial-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Filiais</h1>
    <a href="{{ route('filial.create') }}" class="btn btn-primary">Nova filial</a>
  </div>

  <div class="card">
    <h2>Filiais cadastradas</h2>
    <table class="data" id="tabela-filiais">
      <thead>
        <tr>
          <th>CNPJ</th>
          <th>Razão social</th>
          <th>Nome fantasia</th>
          <th>Data início</th>
          <th>Ativo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="filial-vazio" style="display:none;">Nenhuma filial cadastrada para esta empresa.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/filial-list.js') }}"></script>
@endpush