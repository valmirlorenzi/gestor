@extends('layouts.app')

@section('title', 'Configurações Fiscais')

@section('content')
<div id="config-fiscais-app">
  <h1>Configurações fiscais</h1>

  <div class="card">
    <h2>Regime e setor</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Regime fiscal *</label>
        <select id="config-fiscal-regime">
          @foreach (['Simples','Presumido','Real'] as $r)
            <option value="{{ $r }}" {{ $model->regime_fiscal === $r ? 'selected' : '' }}>{{ $r }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Setor *</label>
        <select id="config-fiscal-setor">
          @foreach (['Comercio','Servicos','Misto'] as $s)
            <option value="{{ $s }}" {{ $model->setor === $s ? 'selected' : '' }}>{{ $s }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Método de custo *</label>
        <select id="config-fiscal-metodo-custo">
          @foreach (['XML','Medio','Manual'] as $m)
            <option value="{{ $m }}" {{ $model->metodo_custo === $m ? 'selected' : '' }}>{{ $m }}</option>
          @endforeach
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <button class="btn btn-primary" id="config-fiscal-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/config-fiscais.js') }}"></script>
@endpush