@extends('layouts.app')

@section('title', $centro ? 'Editar Centro de Custo' : 'Novo Centro de Custo')

@section('content')
<div id="centro-custo-form-app">
  <h1>{{ $centro ? 'Editar centro de custo' : 'Cadastrar centro de custo' }}</h1>

  <div class="card">
    <h2>Dados do centro de custo</h2>

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
          action="{{ $centro ? route('centros-custo.update', $centro->id) : route('centros-custo.store') }}">
      @csrf
      @if ($centro)
        @method('PUT')
      @endif

      <div class="form-grid">
        <div class="form-row">
          <label>Nome *</label>
          <input type="text" name="nome" maxlength="200"
                 value="{{ old('nome', $centro->nome ?? '') }}">
        </div>
        <div class="form-row">
          <label>Responsável</label>
          <input type="text" name="responsavel" maxlength="200"
                 value="{{ old('responsavel', $centro->responsavel ?? '') }}">
        </div>
        <div class="form-row">
          <label>Ativo</label>
          <select name="ativo">
            <option value="1" @selected(old('ativo', $centro->ativo ?? true) == true)>Sim</option>
            <option value="0" @selected(old('ativo', $centro->ativo ?? true) == false)>Não</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <a href="{{ route('centros-custo.index') }}" class="btn btn-secondary">Cancelar</a>
        <button class="btn btn-primary" type="submit">Salvar</button>
      </div>
    </form>
  </div>
</div>
@endsection