@extends('layouts.app')

@section('title', $usuario ? 'Editar Usuário' : 'Novo Usuário')

@section('content')
<div id="usuario-form-app">
  <h1>{{ $usuario ? 'Editar usuário' : 'Cadastrar usuário' }}</h1>

  <div class="card">
    <h2>Dados do usuário</h2>

    @if ($errors->any())
      <div class="muted" style="color:#c00; margin-bottom:12px;">
        <ul style="margin:0; padding-left:18px;">
          @foreach ($errors->all() as $erro)
            <li>{{ $erro }}</li>
          @endforeach
        </ul>
      </div>
    @endif

    <form method="POST"
          action="{{ $usuario ? route('usuarios.update', $usuario->id) : route('usuarios.store') }}">
      @csrf
      @if ($usuario)
        @method('PUT')
      @endif

      <div class="form-grid">
        <div class="form-row">
          <label>Nome *</label>
          <input type="text" name="nome" maxlength="200"
                 value="{{ old('nome', $usuario->nome ?? '') }}">
        </div>
        <div class="form-row">
          <label>E-mail *</label>
          <input type="email" name="email" maxlength="200"
                 value="{{ old('email', $usuario->email ?? '') }}">
        </div>
        <div class="form-row">
          <label>Senha {{ $usuario ? '(deixe em branco para manter)' : '*' }}</label>
          <input type="password" name="senha" minlength="8" maxlength="72">
        </div>
        <div class="form-row">
          <label>Ativo</label>
          <select name="ativo">
            <option value="1" @selected(old('ativo', $usuario->ativo ?? true) == true)>Sim</option>
            <option value="0" @selected(old('ativo', $usuario->ativo ?? true) == false)>Não</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <a href="{{ route('usuarios.index') }}" class="btn btn-secondary">Cancelar</a>
        <button class="btn btn-primary" type="submit">Salvar</button>
      </div>
    </form>
  </div>
</div>
@endsection