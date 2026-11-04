@extends('layouts.app')

@section('title', isset($model) ? 'Editar serviço' : 'Novo serviço')

@section('content')
<div id="servico-form-app" data-id="{{ $model->id ?? '' }}">
  <h1>{{ isset($model) ? 'Editar serviço' : 'Cadastrar serviço' }}</h1>

  <div class="card">
    <h2>Dados do serviço</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Descrição *</label>
        <input type="text" id="servico-descricao" maxlength="300"
               value="{{ $model->descricao ?? '' }}">
      </div>
      <div class="form-row">
        <label>Código interno</label>
        <input type="text" id="servico-codigo-interno" maxlength="50"
               value="{{ $model->codigo_interno ?? '' }}">
      </div>
      <div class="form-row">
        <label>LC 116</label>
        <select id="servico-id-lc116">
          <option value="">—</option>
          @foreach ($lc116 as $item)
            <option value="{{ $item->id }}"
              {{ (isset($model) && $model->servico && $model->servico->id_servico_lc116 === $item->id) ? 'selected' : '' }}>
              {{ $item->codigo }} — {{ $item->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Ativo</label>
        <select id="servico-ativo">
          <option value="1" {{ (! isset($model) || $model->ativo) ? 'selected' : '' }}>Sim</option>
          <option value="0" {{ (isset($model) && !$model->ativo) ? 'selected' : '' }}>Não</option>
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('servicos.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="servico-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/servicos-form.js') }}"></script>
@endpush