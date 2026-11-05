@extends('layouts.app')

@section('title', isset($model) ? 'Editar parâmetro fiscal' : 'Novo parâmetro fiscal')

@section('content')
<div id="parametro-form-app" data-id="{{ $model->id ?? '' }}">
  <h1>{{ isset($model) ? 'Editar parâmetro fiscal' : 'Cadastrar parâmetro fiscal' }}</h1>

  <div class="card">
    <h2>Dados do parâmetro</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Tipo de imposto *</label>
        <input type="text" id="parametro-tipo" maxlength="20"
               value="{{ $model->tipo_imposto ?? '' }}">
      </div>
      <div class="form-row">
        <label>Descrição *</label>
        <input type="text" id="parametro-descricao" maxlength="100"
               value="{{ $model->descricao ?? '' }}">
      </div>
      <div class="form-row">
        <label>Alíquota (%) *</label>
        <input type="number" step="0.0001" min="0" max="100" id="parametro-aliquota"
               value="{{ $model->aliquota ?? '' }}">
      </div>
      <div class="form-row">
        <label>Base de cálculo</label>
        <input type="text" id="parametro-base" maxlength="50"
               value="{{ $model->base_calculo ?? '' }}">
      </div>
      <div class="form-row">
        <label>Início da vigência *</label>
        <input type="date" id="parametro-inicio"
               value="{{ isset($model) && $model->data_inicio_validade ? $model->data_inicio_validade->format('Y-m-d') : '' }}">
      </div>
      <div class="form-row">
        <label>Fim da vigência</label>
        <input type="date" id="parametro-fim"
               value="{{ isset($model) && $model->data_fim_validade ? $model->data_fim_validade->format('Y-m-d') : '' }}">
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('tabelas-fiscais.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="parametro-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/tabelas-fiscais-form.js') }}"></script>
@endpush