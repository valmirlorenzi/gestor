@extends('layouts.app')

@section('title', isset($usuario) ? 'Editar Usuário' : 'Novo Usuário')

@section('content')
<div id="usuario-form-app" data-id="{{ $usuario->id ?? '' }}">
  <h1>{{ isset($usuario) ? 'Editar usuário' : 'Cadastrar usuário' }}</h1>

  <div class="card">
    <h2>Dados do usuário</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Nome *</label>
        <input type="text" id="usuario-nome" maxlength="200"
               value="{{ $usuario->nome ?? '' }}">
      </div>
      <div class="form-row">
        <label>E-mail *</label>
        <input type="email" id="usuario-email" maxlength="200"
               value="{{ $usuario->email ?? '' }}">
      </div>
      <div class="form-row">
        <label>Senha {{ isset($usuario) ? '(deixe em branco para manter)' : '*' }}</label>
        <input type="password" id="usuario-senha" minlength="8" maxlength="72">
      </div>
      <div class="form-row">
        <label>Ativo</label>
        <select id="usuario-ativo">
          <option value="1" {{ (isset($usuario) && $usuario->ativo) ? 'selected' : '' }}>Sim</option>
          <option value="0" {{ (isset($usuario) && !$usuario->ativo) ? 'selected' : '' }}>Não</option>
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('usuarios.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="usuario-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/usuarios-form.js') }}"></script>
@endpush