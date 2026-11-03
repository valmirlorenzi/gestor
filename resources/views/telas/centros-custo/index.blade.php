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

    <form method="GET" action="{{ route('centros-custo.index') }}" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
      <input type="text" name="q" value="{{ $busca ?? '' }}" placeholder="Buscar por nome…">
      <select name="ativo">
        <option value="">Todos</option>
        <option value="1" @selected($ativo === true)>Ativos</option>
        <option value="0" @selected($ativo === false)>Inativos</option>
      </select>
      <button type="submit" class="btn btn-secondary">Filtrar</button>
    </form>

    <table class="data" id="tabela-centros-custo">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Responsável</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        @forelse ($centros as $c)
          <tr>
            <td>{{ $c->nome }}</td>
            <td>{{ $c->responsavel ?: '—' }}</td>
            <td>{{ $c->ativo ? 'Ativo' : 'Inativo' }}</td>
            <td>
              <a href="{{ route('centros-custo.edit', $c->id) }}" class="btn btn-secondary">Editar</a>
            </td>
          </tr>
        @empty
          <tr><td colspan="4" class="muted">Nenhum centro de custo cadastrado.</td></tr>
        @endforelse
      </tbody>
    </table>

    <div class="paginacao">{{ $centros->links() }}</div>
  </div>
</div>
@endsection