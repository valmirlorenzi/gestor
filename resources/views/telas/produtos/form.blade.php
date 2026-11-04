@extends('layouts.app')

@section('title', isset($model) ? 'Editar produto' : 'Novo produto')

@section('content')
<div id="produto-form-app" data-id="{{ $model->id ?? '' }}">
  <h1>{{ isset($model) ? 'Editar produto' : 'Cadastrar produto' }}</h1>

  <div class="card">
    <h2>Dados do produto</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Descrição *</label>
        <input type="text" id="produto-descricao" maxlength="300"
               value="{{ $model->descricao ?? '' }}">
      </div>
      <div class="form-row">
        <label>Código interno</label>
        <input type="text" id="produto-codigo-interno" maxlength="50"
               value="{{ $model->codigo_interno ?? '' }}">
      </div>
      <div class="form-row">
        <label>NCM</label>
        <select id="produto-id-ncm">
          <option value="">—</option>
          @foreach ($ncms as $ncm)
            <option value="{{ $ncm->id }}"
              {{ (isset($model) && $model->produto && $model->produto->id_ncm === $ncm->id) ? 'selected' : '' }}>
              {{ $ncm->codigo }} — {{ $ncm->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Unidade</label>
        <input type="text" id="produto-unidade" maxlength="10"
               value="{{ (isset($model) && $model->produto) ? $model->produto->unidade : '' }}">
      </div>
      <div class="form-row">
        <label>Ativo</label>
        <select id="produto-ativo">
          <option value="1" {{ (! isset($model) || $model->ativo) ? 'selected' : '' }}>Sim</option>
          <option value="0" {{ (isset($model) && !$model->ativo) ? 'selected' : '' }}>Não</option>
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('produtos.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="produto-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/produtos-form.js') }}"></script>
@endpush