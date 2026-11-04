@extends('layouts.app')

@section('title', isset($centro) ? 'Editar Centro de Custo' : 'Novo Centro de Custo')

@section('content')
<div id="centro-custo-form-app" data-id="{{ $centro->id ?? '' }}">
  <h1>{{ isset($centro) ? 'Editar centro de custo' : 'Cadastrar centro de custo' }}</h1>

  <div class="card">
    <h2>Dados do centro de custo</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Nome *</label>
        <input type="text" id="centro-custo-nome" maxlength="200"
               value="{{ $centro->nome ?? '' }}">
      </div>
      <div class="form-row">
        <label>Responsável</label>
        <input type="text" id="centro-custo-responsavel" maxlength="200"
               value="{{ $centro->responsavel ?? '' }}">
      </div>
      <div class="form-row">
        <label>Ativo</label>
        <select id="centro-custo-ativo">
          <option value="1" {{ (isset($centro) && $centro->ativo) ? 'selected' : '' }}>Sim</option>
          <option value="0" {{ (isset($centro) && !$centro->ativo) ? 'selected' : '' }}>Não</option>
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('centros-custo.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="centro-custo-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/centros-custo-form.js') }}"></script>
@endpush