@extends('layouts.app')

@section('title', isset($model) ? 'Editar conta' : 'Nova conta')

@section('content')
<div id="plano-conta-form-app" data-id="{{ $model->id ?? '' }}">
  <h1>{{ isset($model) ? 'Editar conta' : 'Cadastrar conta' }}</h1>

  <div class="card">
    <h2>Dados da conta</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Código *</label>
        <input type="text" id="plano-codigo" maxlength="20"
               value="{{ $model->codigo ?? '' }}">
      </div>
      <div class="form-row">
        <label>Descrição *</label>
        <input type="text" id="plano-descricao" maxlength="200"
               value="{{ $model->descricao ?? '' }}">
      </div>
      <div class="form-row">
        <label>Tipo *</label>
        <select id="plano-tipo">
          @foreach (['Ativo','Passivo','Custo','Despesa','Receita','Resultado Financeiro'] as $t)
            <option value="{{ $t }}" {{ (isset($model) && $model->tipo === $t) ? 'selected' : '' }}>{{ $t }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Subtipo</label>
        <input type="text" id="plano-subtipo" maxlength="30"
               value="{{ $model->subtipo ?? '' }}">
      </div>
      <div class="form-row">
        <label>Natureza *</label>
        <select id="plano-natureza">
          <option value="Sintetica" {{ (isset($model) && $model->natureza === 'Sintetica') ? 'selected' : '' }}>Sintética</option>
          <option value="Analitica" {{ (isset($model) && $model->natureza === 'Analitica') ? 'selected' : '' }}>Analítica</option>
        </select>
      </div>
      <div class="form-row">
        <label>Aceita lançamento</label>
        <select id="plano-aceita">
          <option value="1" {{ (! isset($model) || $model->aceita_lancamento) ? 'selected' : '' }}>Sim</option>
          <option value="0" {{ (isset($model) && !$model->aceita_lancamento) ? 'selected' : '' }}>Não</option>
        </select>
      </div>
      <div class="form-row">
        <label>Conta pai</label>
        <select id="plano-id-conta-pai">
          <option value="">—</option>
          @foreach ($pais as $pai)
            <option value="{{ $pai->id }}"
              {{ (isset($model) && $model->id_conta_pai === $pai->id) ? 'selected' : '' }}>
              {{ $pai->codigo }} — {{ $pai->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Conta referencial (ECD/ECF)</label>
        <input type="text" id="plano-conta-referencial" maxlength="20"
               value="{{ $model->conta_referencial ?? '' }}">
      </div>
      <div class="form-row">
        <label>Ativo</label>
        <select id="plano-ativo">
          <option value="1" {{ (! isset($model) || $model->ativo) ? 'selected' : '' }}>Sim</option>
          <option value="0" {{ (isset($model) && !$model->ativo) ? 'selected' : '' }}>Não</option>
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('plano-contas.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="plano-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/plano-contas-form.js') }}"></script>
@endpush