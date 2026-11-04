@extends('layouts.app')

@section('title', isset($model) ? 'Editar ativo' : 'Novo ativo')

@section('content')
<div id="ativo-form-app" data-id="{{ $model->id ?? '' }}">
  <h1>{{ isset($model) ? 'Editar ativo' : 'Cadastrar ativo' }}</h1>

  <div class="card">
    <h2>Dados do ativo</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Descrição *</label>
        <input type="text" id="ativo-descricao" maxlength="200"
               value="{{ $model->descricao ?? '' }}">
      </div>
      <div class="form-row">
        <label>Data de aquisição *</label>
        <input type="date" id="ativo-data-aquisicao"
               value="{{ isset($model) && $model->data_aquisicao ? $model->data_aquisicao->format('Y-m-d') : '' }}">
      </div>
      <div class="form-row">
        <label>Valor original *</label>
        <input type="number" step="0.01" min="0" id="ativo-valor-original"
               value="{{ $model->valor_original ?? '' }}">
      </div>
      <div class="form-row">
        <label>Valor residual</label>
        <input type="number" step="0.01" min="0" id="ativo-valor-residual"
               value="{{ $model->valor_residual ?? '' }}">
      </div>
      <div class="form-row">
        <label>Vida útil (meses) *</label>
        <input type="number" min="1" id="ativo-vida-util"
               value="{{ $model->vida_util_meses ?? '' }}">
      </div>
      <div class="form-row">
        <label>Método de depreciação</label>
        <input type="text" id="ativo-metodo" maxlength="20"
               value="{{ $model->metodo_depreciacao ?? 'Linear' }}">
      </div>
      <div class="form-row">
        <label>Mês inicial de depreciação * (AAAA-MM)</label>
        <input type="text" id="ativo-mes-inicial" maxlength="7" placeholder="2026-01"
               value="{{ $model->mes_inicial_depreciacao ?? '' }}">
      </div>
      <div class="form-row">
        <label>Centro de custo</label>
        <select id="ativo-id-centro-custo">
          <option value="">—</option>
          @foreach ($centrosCusto as $cc)
            <option value="{{ $cc->id }}"
              {{ (isset($model) && $model->id_centro_custo === $cc->id) ? 'selected' : '' }}>
              {{ $cc->nome }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Destino *</label>
        <input type="text" id="ativo-destino" maxlength="10"
               value="{{ $model->destino ?? '' }}">
      </div>
      <div class="form-row">
        <label>Status</label>
        <input type="text" id="ativo-status" maxlength="20"
               value="{{ $model->status ?? 'Em uso' }}">
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('ativos.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="ativo-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/ativos-form.js') }}"></script>
@endpush