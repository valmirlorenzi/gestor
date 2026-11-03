@extends('layouts.app')

@section('title', 'Usuários')

@section('content')
<div id="usuario-list-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Usuários</h1>
    <a href="{{ route('usuarios.create') }}" class="btn btn-primary">Novo usuário</a>
  </div>

  <div class="card">
    <h2>Usuários cadastrados</h2>

    <form method="GET" action="{{ route('usuarios.index') }}" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
      <input type="text" name="q" value="{{ $busca ?? '' }}" placeholder="Buscar por nome ou e-mail…">
      <select name="ativo">
        <option value="">Todos</option>
        <option value="1" @selected($ativo === true)>Ativos</option>
        <option value="0" @selected($ativo === false)>Inativos</option>
      </select>
      <button type="submit" class="btn btn-secondary">Filtrar</button>
    </form>

    <table class="data" id="tabela-usuarios">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        @forelse ($usuarios as $u)
          <tr>
            <td>{{ $u->nome }}</td>
            <td>{{ $u->email }}</td>
            <td>{{ $u->ativo ? 'Ativo' : 'Inativo' }}</td>
            <td>
              <a href="{{ route('usuarios.edit', $u->id) }}" class="btn btn-secondary">Editar</a>
              <a href="{{ route('usuarios.atores', $u->id) }}" class="btn btn-secondary">Atores</a>
            </td>
          </tr>
        @empty
          <tr><td colspan="4" class="muted">Nenhum usuário cadastrado.</td></tr>
        @endforelse
      </tbody>
    </table>

    <div class="paginacao">{{ $usuarios->links() }}</div>
  </div>
</div>
@endsection