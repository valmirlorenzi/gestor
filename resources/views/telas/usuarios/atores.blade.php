@extends('layouts.app')

@section('title', 'Atores do Usuário')

@section('content')
<div id="usuario-atores-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Atores — {{ $usuario->nome }}</h1>
    <a href="{{ route('usuarios.index') }}" class="btn btn-secondary">Voltar</a>
  </div>

  <div class="card">
    <h2>Selecionar filial</h2>
    <form method="GET" action="{{ route('usuarios.atores', $usuario->id) }}" style="display:flex; gap:8px; flex-wrap:wrap;">
      <select name="id_filial" onchange="this.form.submit()">
        @foreach ($filiaisDisponiveis as $f)
          <option value="{{ $f->id }}" @selected($f->id === $idFilialSelecionada)>
            {{ $f->nome_fantasia ?? $f->razao_social }}
          </option>
        @endforeach
      </select>
    </form>
  </div>

  <div class="card" style="margin-top:16px;">
    <h2>Atores na filial selecionada</h2>

    @if ($errors->any())
      <div class="muted" style="color:#c00; margin-bottom:12px;">
        <ul style="margin:0; padding-left:18px;">
          @foreach ($errors->all() as $erro)
            <li>{{ $erro }}</li>
          @endforeach
        </ul>
      </div>
    @endif

    <form method="POST" action="{{ route('usuarios.atores.sync', $usuario->id) }}">
      @csrf
      <input type="hidden" name="id_filial" value="{{ $idFilialSelecionada }}">

      <div class="form-grid">
        @foreach ($atoresFuncionais as $ator)
          <label style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" name="id_atores[]" value="{{ $ator->id }}"
                   @checked(in_array($ator->id, $idsAtorSelecionados, true))>
            {{ $ator->nome }}
          </label>
        @endforeach
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" type="submit">Salvar atores</button>
      </div>
    </form>
  </div>
</div>
@endsection