@extends('layouts.app')

@section('title', 'Produtos')

@section('content')
<div id="produto-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Produtos</h1>
    <a href="{{ route('produtos.create') }}" class="btn btn-primary">Novo produto</a>
  </div>

  <div class="card">
    <h2>Produtos cadastrados</h2>
    <table class="data" id="tabela-produtos">
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Código interno</th>
          <th>NCM</th>
          <th>Unidade</th>
          <th>Ativo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="muted" id="produto-vazio" style="display:none;">Nenhum produto cadastrado.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/produtos-list.js') }}"></script>
@endpush