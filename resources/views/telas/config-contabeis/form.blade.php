@extends('layouts.app')

@section('title', 'Editar conta referencial')

@section('content')
<div id="config-contabil-form-app" data-id="{{ $model->id }}">
  <h1>Editar conta referencial</h1>

  <div class="card">
    <h2>{{ $model->codigo }} — {{ $model->descricao }}</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Conta referencial (ECD/ECF)</label>
        <input type="text" id="config-contabil-conta" maxlength="20"
               value="{{ $model->conta_referencial ?? '' }}">
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('config-contabeis.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="config-contabil-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/config-contabeis-form.js') }}"></script>
@endpush