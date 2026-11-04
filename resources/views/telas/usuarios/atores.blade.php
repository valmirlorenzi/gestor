@extends('layouts.app')

@section('title', 'Atores do Usuário')

@section('content')
<div id="usuario-atores-app"
     data-id="{{ $usuario->id }}"
     data-filiais='@json($filiaisDisponiveis)'
     data-atores='@json($atoresFuncionais)'>
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Atores — {{ $usuario->nome }}</h1>
    <a href="{{ route('usuarios.index') }}" class="btn btn-secondary">Voltar</a>
  </div>

  <div class="card">
    <h2>Selecionar filial</h2>
    <div class="form-row">
      <select id="atores-filial"></select>
    </div>
  </div>

  <div class="card" id="atores-lista-card">
    <h2>Atores na filial</h2>
    <div id="atores-checkboxes" class="form-grid"></div>
    <div class="form-actions">
      <button class="btn btn-primary" type="button" id="atores-salvar">Salvar atores</button>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/usuarios-atores.js') }}"></script>
@endpush